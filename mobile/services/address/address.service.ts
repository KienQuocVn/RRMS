export interface AddressOption {
  code: string;
  name: string;
  parentCode?: string;
  latitude?: number;
  longitude?: number;
}

type WardRecord = AddressOption;

interface DistrictRecord extends AddressOption {
  wards: WardRecord[];
}

interface ProvinceRecord extends AddressOption {
  districts: DistrictRecord[];
}

const VIETNAM_ADDRESS_TREE: ProvinceRecord[] = [
  {
    code: '79',
    name: 'Thành phố Hồ Chí Minh',
    latitude: 10.7769,
    longitude: 106.7009,
    districts: [
      {
        code: '760',
        name: 'Quận 1',
        parentCode: '79',
        latitude: 10.7756,
        longitude: 106.7004,
        wards: [
          {
            code: '26734',
            name: 'Phường Bến Nghé',
            parentCode: '760',
            latitude: 10.7797,
            longitude: 106.7046,
          },
          {
            code: '26737',
            name: 'Phường Bến Thành',
            parentCode: '760',
            latitude: 10.7723,
            longitude: 106.6984,
          },
          {
            code: '26740',
            name: 'Phường Đa Kao',
            parentCode: '760',
            latitude: 10.7871,
            longitude: 106.6978,
          },
        ],
      },
      {
        code: '778',
        name: 'Quận 7',
        parentCode: '79',
        latitude: 10.7342,
        longitude: 106.7218,
        wards: [
          {
            code: '27496',
            name: 'Phường Tân Phú',
            parentCode: '778',
            latitude: 10.7308,
            longitude: 106.7302,
          },
          {
            code: '27499',
            name: 'Phường Tân Hưng',
            parentCode: '778',
            latitude: 10.7424,
            longitude: 106.7069,
          },
          {
            code: '27511',
            name: 'Phường Phú Mỹ',
            parentCode: '778',
            latitude: 10.7282,
            longitude: 106.7431,
          },
        ],
      },
      {
        code: '769',
        name: 'Thành phố Thủ Đức',
        parentCode: '79',
        latitude: 10.8404,
        longitude: 106.8105,
        wards: [
          {
            code: '27166',
            name: 'Phường An Khánh',
            parentCode: '769',
            latitude: 10.7867,
            longitude: 106.7449,
          },
          {
            code: '27169',
            name: 'Phường Thảo Điền',
            parentCode: '769',
            latitude: 10.8036,
            longitude: 106.7467,
          },
          {
            code: '27175',
            name: 'Phường Linh Đông',
            parentCode: '769',
            latitude: 10.8498,
            longitude: 106.7726,
          },
        ],
      },
    ],
  },
  {
    code: '01',
    name: 'Thành phố Hà Nội',
    latitude: 21.0285,
    longitude: 105.8542,
    districts: [
      {
        code: '001',
        name: 'Quận Ba Đình',
        parentCode: '01',
        latitude: 21.0367,
        longitude: 105.8148,
        wards: [
          {
            code: '00001',
            name: 'Phường Kim Mã',
            parentCode: '001',
            latitude: 21.0339,
            longitude: 105.8232,
          },
          {
            code: '00004',
            name: 'Phường Liễu Giai',
            parentCode: '001',
            latitude: 21.0392,
            longitude: 105.8141,
          },
          {
            code: '00007',
            name: 'Phường Điện Biên',
            parentCode: '001',
            latitude: 21.0321,
            longitude: 105.8394,
          },
        ],
      },
      {
        code: '005',
        name: 'Quận Cầu Giấy',
        parentCode: '01',
        latitude: 21.0362,
        longitude: 105.7906,
        wards: [
          {
            code: '00169',
            name: 'Phường Dịch Vọng',
            parentCode: '005',
            latitude: 21.0391,
            longitude: 105.7864,
          },
          {
            code: '00175',
            name: 'Phường Quan Hoa',
            parentCode: '005',
            latitude: 21.0431,
            longitude: 105.7996,
          },
          {
            code: '00181',
            name: 'Phường Yên Hòa',
            parentCode: '005',
            latitude: 21.0158,
            longitude: 105.7935,
          },
        ],
      },
      {
        code: '268',
        name: 'Quận Hà Đông',
        parentCode: '01',
        latitude: 20.9548,
        longitude: 105.7564,
        wards: [
          {
            code: '10117',
            name: 'Phường Mộ Lao',
            parentCode: '268',
            latitude: 20.9833,
            longitude: 105.7851,
          },
          {
            code: '10123',
            name: 'Phường Phú La',
            parentCode: '268',
            latitude: 20.9611,
            longitude: 105.7735,
          },
          {
            code: '10129',
            name: 'Phường Nguyễn Trãi',
            parentCode: '268',
            latitude: 20.9528,
            longitude: 105.7607,
          },
        ],
      },
    ],
  },
  {
    code: '48',
    name: 'Thành phố Đà Nẵng',
    latitude: 16.0544,
    longitude: 108.2022,
    districts: [
      {
        code: '490',
        name: 'Quận Hải Châu',
        parentCode: '48',
        latitude: 16.0471,
        longitude: 108.2197,
        wards: [
          {
            code: '20194',
            name: 'Phường Hải Châu I',
            parentCode: '490',
            latitude: 16.0682,
            longitude: 108.2218,
          },
          {
            code: '20212',
            name: 'Phường Bình Thuận',
            parentCode: '490',
            latitude: 16.0476,
            longitude: 108.2228,
          },
          {
            code: '20224',
            name: 'Phường Hòa Thuận Tây',
            parentCode: '490',
            latitude: 16.0352,
            longitude: 108.2065,
          },
        ],
      },
      {
        code: '492',
        name: 'Quận Sơn Trà',
        parentCode: '48',
        latitude: 16.0939,
        longitude: 108.2518,
        wards: [
          {
            code: '20266',
            name: 'Phường An Hải Bắc',
            parentCode: '492',
            latitude: 16.0792,
            longitude: 108.2339,
          },
          {
            code: '20278',
            name: 'Phường Phước Mỹ',
            parentCode: '492',
            latitude: 16.0668,
            longitude: 108.2451,
          },
          {
            code: '20281',
            name: 'Phường Nại Hiên Đông',
            parentCode: '492',
            latitude: 16.0819,
            longitude: 108.2443,
          },
        ],
      },
      {
        code: '494',
        name: 'Quận Ngũ Hành Sơn',
        parentCode: '48',
        latitude: 16.0046,
        longitude: 108.257,
        wards: [
          {
            code: '20311',
            name: 'Phường Mỹ An',
            parentCode: '494',
            latitude: 16.0394,
            longitude: 108.2448,
          },
          {
            code: '20314',
            name: 'Phường Khuê Mỹ',
            parentCode: '494',
            latitude: 16.0222,
            longitude: 108.2505,
          },
          {
            code: '20320',
            name: 'Phường Hòa Hải',
            parentCode: '494',
            latitude: 15.9987,
            longitude: 108.2671,
          },
        ],
      },
    ],
  },
];

function delay<T>(value: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), 120);
  });
}

export async function getProvinces() {
  return delay(
    VIETNAM_ADDRESS_TREE.map(({ code, name, latitude, longitude }) => ({
      code,
      name,
      latitude,
      longitude,
    })),
  );
}

export async function getDistricts(provinceCode: string) {
  const province = VIETNAM_ADDRESS_TREE.find((item) => item.code === provinceCode);

  return delay(
    (province?.districts ?? []).map(({ code, name, parentCode, latitude, longitude }) => ({
      code,
      name,
      parentCode,
      latitude,
      longitude,
    })),
  );
}

export async function getWards(districtCode: string) {
  const district = VIETNAM_ADDRESS_TREE.flatMap((province) => province.districts).find(
    (item) => item.code === districtCode,
  );

  return delay(
    (district?.wards ?? []).map(({ code, name, parentCode, latitude, longitude }) => ({
      code,
      name,
      parentCode,
      latitude,
      longitude,
    })),
  );
}

export async function getAddressCenter(params: {
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
}) {
  const ward = VIETNAM_ADDRESS_TREE.flatMap((province) => province.districts)
    .flatMap((district) => district.wards)
    .find((item) => item.code === params.wardCode);

  if (ward?.latitude && ward?.longitude) {
    return delay({ latitude: ward.latitude, longitude: ward.longitude });
  }

  const district = VIETNAM_ADDRESS_TREE.flatMap((province) => province.districts).find(
    (item) => item.code === params.districtCode,
  );

  if (district?.latitude && district?.longitude) {
    return delay({ latitude: district.latitude, longitude: district.longitude });
  }

  const province = VIETNAM_ADDRESS_TREE.find((item) => item.code === params.provinceCode);

  return delay({
    latitude: province?.latitude ?? 10.7769,
    longitude: province?.longitude ?? 106.7009,
  });
}
