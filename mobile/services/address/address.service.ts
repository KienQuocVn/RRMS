import { safeAsyncStorage } from '@/services/storage/safe-async-storage';

export interface AddressOption {
  code: string;
  name: string;
  parentCode?: string;
  latitude?: number;
  longitude?: number;
}

interface AddressKitProvince {
  code: string;
  name: string;
  englishName?: string;
  administrativeLevel?: string;
}

interface AddressKitCommune {
  code: string;
  name: string;
  englishName?: string;
  administrativeLevel?: string;
  provinceCode?: string;
  provinceID?: string;
  province_id?: string;
}

interface AddressKitProvinceResponse {
  provinces?: AddressKitProvince[];
}

interface AddressKitCommuneResponse {
  communes?: AddressKitCommune[];
}

interface CachedPayload<T> {
  expiresAt: number;
  data: T;
}

const ADDRESSKIT_BASE_URL = 'https://production.cas.so/address-kit';
const ADDRESSKIT_EFFECTIVE_DATE = 'latest';
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

function mapProvinceToOption(province: AddressKitProvince): AddressOption {
  return {
    code: province.code,
    name: province.name,
    ...PROVINCE_CENTER_MAP[province.code],
  };
}

function mapCommuneToOption(commune: AddressKitCommune, provinceCode: string): AddressOption {
  return {
    code: commune.code,
    name: commune.name,
    parentCode:
      commune.provinceCode ?? commune.provinceID ?? commune.province_id ?? provinceCode,
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${ADDRESSKIT_BASE_URL}/${ADDRESSKIT_EFFECTIVE_DATE}${path}`, {
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
    const response = await fetchJson<AddressKitProvinceResponse>('/provinces');

    return sortOptions((response.provinces ?? []).map(mapProvinceToOption));
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
    const response = await fetchJson<AddressKitCommuneResponse>(
      `/provinces/${provinceCode}/communes`,
    );

    return sortOptions(
      (response.communes ?? []).map((commune) => mapCommuneToOption(commune, provinceCode)),
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
