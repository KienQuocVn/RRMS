import { safeAsyncStorage } from '@/services/storage/safe-async-storage';

export interface AddressOption {
  code: string;
  name: string;
  parentCode?: string;
  latitude?: number;
  longitude?: number;
}

interface EsgooResponse {
  error: number;
  error_text: string;
  data: EsgooItem[];
}

interface EsgooItem {
  id: string;
  name?: string;
  name_en?: string;
  full_name: string;
  full_name_en?: string;
  latitude?: string;
  longitude?: string;
}

interface CachedPayload<T> {
  expiresAt: number;
  data: T;
}

const ESGOO_API_BASE = 'https://esgoo.net/api-tinhthanh-new';
const ADDRESS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const STORAGE_PREFIX = 'rrms.address-cache';

const memoryCache = new Map<string, unknown>();
const inflightRequests = new Map<string, Promise<unknown>>();

const DEFAULT_CENTER = {
  latitude: 16.047079,
  longitude: 108.20623,
};

const PROVINCE_CENTER_MAP: Record<string, { latitude: number; longitude: number }> = {
  '01': { latitude: 21.028511, longitude: 105.804817 },
  '31': { latitude: 20.844911, longitude: 106.688087 },
  '46': { latitude: 16.463713, longitude: 107.590866 },
  '48': { latitude: 16.054407, longitude: 108.202164 },
  '79': { latitude: 10.77689, longitude: 106.700806 },
  '92': { latitude: 10.034185, longitude: 105.72255 },
};

function getStorageKey(key: string) {
  return `${STORAGE_PREFIX}.${key}`;
}

function sortOptions(options: AddressOption[]) {
  return [...options].sort((left, right) =>
    left.name.localeCompare(right.name, 'vi', { sensitivity: 'base' }),
  );
}

function mapEsgooProvinceToOption(item: EsgooItem): AddressOption {
  return {
    code: item.id,
    name: item.full_name,
    ...PROVINCE_CENTER_MAP[item.id],
  };
}

function mapEsgooCommuneToOption(item: EsgooItem, provinceCode: string): AddressOption {
  return {
    code: item.id,
    name: item.full_name,
    parentCode: provinceCode,
  };
}

async function fetchEsgoo<T>(path: string): Promise<T> {
  const response = await fetch(`${ESGOO_API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Address API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function readCache<T>(key: string, allowExpired: boolean): Promise<T | null> {
  const raw = await safeAsyncStorage.getItem(getStorageKey(key));

  if (!raw) {
    return null;
  }

  try {
    const payload = JSON.parse(raw) as CachedPayload<T>;

    if (
      !allowExpired &&
      typeof payload.expiresAt === 'number' &&
      payload.expiresAt < Date.now()
    ) {
      return null;
    }

    return payload.data ?? null;
  } catch {
    return null;
  }
}

async function writeCache<T>(key: string, data: T) {
  const payload: CachedPayload<T> = {
    expiresAt: Date.now() + ADDRESS_CACHE_TTL_MS,
    data,
  };

  await safeAsyncStorage.setItem(getStorageKey(key), JSON.stringify(payload));
}

async function loadCachedResource<T>(key: string, loader: () => Promise<T>): Promise<T> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  const activeRequest = inflightRequests.get(key);

  if (activeRequest) {
    return activeRequest as Promise<T>;
  }

  const request = (async () => {
    const cached = await readCache<T>(key, false);

    if (cached) {
      memoryCache.set(key, cached);
      return cached;
    }

    try {
      const freshData = await loader();
      memoryCache.set(key, freshData);
      await writeCache(key, freshData);
      return freshData;
    } catch (error) {
      const staleData = await readCache<T>(key, true);

      if (staleData) {
        memoryCache.set(key, staleData);
        return staleData;
      }

      throw error;
    }
  })().finally(() => {
    inflightRequests.delete(key);
  });

  inflightRequests.set(key, request);
  return request;
}

export async function getProvinces() {
  return loadCachedResource('provinces', async () => {
    const response = await fetchEsgoo<EsgooResponse>('/1/0.htm');
    
    if (response.error !== 0) return [];

    return sortOptions((response.data ?? []).map(mapEsgooProvinceToOption));
  });
}

export async function getDistricts(_provinceCode: string) {
  return [];
}

export async function getCommunes(provinceCode: string) {
  if (!provinceCode) {
    return [];
  }

  return loadCachedResource(`communes.${provinceCode}`, async () => {
    const response = await fetchEsgoo<EsgooResponse>(`/2/${provinceCode}.htm`);
    
    if (response.error !== 0) return [];

    return sortOptions(
      (response.data ?? []).map((item) => mapEsgooCommuneToOption(item, provinceCode)),
    );
  });
}

export async function getWards(provinceCode: string) {
  return getCommunes(provinceCode);
}

export async function getAddressCenter(params: {
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
}) {
  if (params.provinceCode && PROVINCE_CENTER_MAP[params.provinceCode]) {
    return PROVINCE_CENTER_MAP[params.provinceCode];
  }

  return DEFAULT_CENTER;
}
