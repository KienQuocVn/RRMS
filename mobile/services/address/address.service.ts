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
const OPEN_API_BASE = 'https://provinces.open-api.vn/api';
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
  try {
    const response = await fetch(`${ESGOO_API_BASE}${path}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const json = (await response.json()) as T;
      if (json && (json as unknown as { error?: number }).error === 0) {
        return json;
      }
    }
  } catch {
    // Esgoo down or blocked by Imunify360
  }

  // Fallback to provinces.open-api.vn
  try {
    if (path.startsWith('/1/0.htm')) {
      const res = await fetch(`${OPEN_API_BASE}/p/`);
      if (res.ok) {
        const list = (await res.json()) as Array<{ code: number; name: string }>;
        return {
          error: 0,
          error_text: 'Thành công',
          data: list.map((p) => ({
            id: String(p.code).padStart(2, '0'),
            full_name: p.name,
          })),
        } as unknown as T;
      }
    } else if (path.startsWith('/2/')) {
      const provinceCode = path.replace('/2/', '').replace('.htm', '');
      const code = parseInt(provinceCode, 10);
      if (code === 79 || code === 2) {
        const hcmWards: string[] = [
          'Phường An Hội Tây', 'Phường An Hội Đông', 'Phường An Khánh', 'Phường An Lạc',
          'Xã An Long', 'Phường An Nhơn', 'Xã An Nhơn Tây', 'Phường An Phú', 'Phường An Phú Đông',
          'Xã An Thới Đông', 'Phường An Đông', 'Phường Bà Rịa', 'Xã Bà Điểm', 'Xã Bắc Tân Uyên',
          'Phường Bàn Cờ', 'Xã Bàu Bàng', 'Xã Bàu Lâm', 'Phường Bảy Hiền', 'Phường Bến Cát',
          'Phường Bến Nghé', 'Phường Bến Thành', 'Phường Bình An', 'Phường Bình Chiểu',
          'Phường Bình Chánh', 'Phường Bình Hòa', 'Phường Bình Hưng', 'Phường Bình Hưng Hòa',
          'Phường Bình Khánh', 'Phường Bình Thạnh', 'Phường Bình Thọ', 'Phường Cần Giờ',
          'Phường Cát Lái', 'Phường Cầu Kho', 'Phường Cầu Ông Lãnh', 'Phường Củ Chi',
          'Phường Đa Kao', 'Phường Dĩ An', 'Phường Gia Định', 'Phường Gò Vấp', 'Phường Hạnh Thông',
          'Phường Hiệp Bình', 'Phường Hiệp Phước', 'Phường Hiệp Thành', 'Phường Hóc Môn',
          'Phường Lái Thiêu', 'Phường Linh Chiểu', 'Phường Linh Trung', 'Phường Linh Xuân',
          'Phường Long Bình', 'Phường Long Phước', 'Phường Long Thành', 'Phường Nhà Bè',
          'Phường Phú Cường', 'Phường Phú Định', 'Phường Phú Nhuận', 'Phường Phước Long',
          'Phường Tam Bình', 'Phường Tân Bình', 'Phường Tân Định', 'Phường Tân Phú',
          'Phường Tân Tạo', 'Phường Tân Thuận', 'Phường Thắng Nhất', 'Phường Thạnh Mỹ Lợi',
          'Phường Thủ Dầu Một', 'Phường Thủ Đức', 'Phường Thuận An', 'Phường Vũng Tàu'
        ];
        return {
          error: 0,
          error_text: 'Thành công',
          data: hcmWards.map((name, i) => ({
            id: String(i + 1).padStart(5, '0'),
            full_name: name,
          })),
        } as unknown as T;
      }
      const res = await fetch(`${OPEN_API_BASE}/p/${code}?depth=3`);
      if (res.ok) {
        const pData = (await res.json()) as {
          districts: Array<{ name: string; wards: Array<{ code: number; name: string }> }>;
        };
        const wards: EsgooItem[] = [];
        const seen = new Set<string>();
        (pData.districts || []).forEach((d) => {
          (d.wards || []).forEach((w) => {
            if (!seen.has(w.name)) {
              seen.add(w.name);
              wards.push({
                id: String(w.code).padStart(5, '0'),
                full_name: w.name,
              });
            }
          });
        });
        return {
          error: 0,
          error_text: 'Thành công',
          data: wards,
        } as unknown as T;
      }
    }
  } catch {
    // Both failed
  }

  return { error: 0, error_text: 'Thành công', data: [] } as unknown as T;
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
