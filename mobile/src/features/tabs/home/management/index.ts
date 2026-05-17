import type { TabOwnedScreen } from '../../types';

export { default as AddBuildingScreen } from '@/app/(management)/(buildings)/add-building/add-building';
export { default as EditBuildingScreen } from '@/app/(management)/(buildings)/edit-building/edit-building';
export { default as BrokerManagementScreen } from '@/app/(management)/(buildings)/broker-management';
export { default as RoomsListScreen } from '@/app/(management)/(occupancy)/rooms-list';
export { default as ContractsListScreen } from '@/app/(finance)/(contracts)/contracts-list';
export { default as InvoicesListScreen } from '@/app/(finance)/(billing)/invoices-list';
export { default as TenantsListScreen } from '@/app/(management)/(occupancy)/tenants-list';
export { default as AssetsListScreen } from '@/app/(management)/(occupancy)/assets-list';
export { default as VehiclesListScreen } from '@/app/(management)/(occupancy)/vehicles-list';

export const homeManagementScreens: TabOwnedScreen[] = [
  {
    id: 'add-building',
    tab: 'home',
    section: 'management',
    label: 'Them toa nha',
    route: '/add-building',
    source: 'app/(management)/(buildings)/add-building.tsx',
  },
  {
    id: 'edit-building',
    tab: 'home',
    section: 'management',
    label: 'Sua toa nha',
    route: '/edit-building',
    source: 'app/(management)/(buildings)/edit-building.tsx',
  },
  {
    id: 'broker-management',
    tab: 'home',
    section: 'management',
    label: 'Quan ly moi gioi',
    route: '/broker-management',
    source: 'app/(management)/(buildings)/broker-management.tsx',
  },
  {
    id: 'rooms-list',
    tab: 'home',
    section: 'management',
    label: 'Quan ly phong',
    route: '/rooms-list',
    source: 'app/(management)/(occupancy)/rooms-list.tsx',
  },
  {
    id: 'contracts-list',
    tab: 'home',
    section: 'management',
    label: 'Quan ly hop dong',
    route: '/contracts-list',
    source: 'app/(finance)/(contracts)/contracts-list.tsx',
  },
  {
    id: 'invoices-list',
    tab: 'home',
    section: 'management',
    label: 'Quan ly hoa don',
    route: '/invoices-list',
    source: 'app/(finance)/(billing)/invoices-list.tsx',
  },
  {
    id: 'tenants-list',
    tab: 'home',
    section: 'management',
    label: 'Quan ly khach thue',
    route: '/tenants-list',
    source: 'app/(management)/(occupancy)/tenants-list.tsx',
  },
  {
    id: 'assets-list',
    tab: 'home',
    section: 'management',
    label: 'Quan ly tai san',
    route: '/assets-list',
    source: 'app/(management)/(occupancy)/assets-list.tsx',
  },
  {
    id: 'vehicles-list',
    tab: 'home',
    section: 'management',
    label: 'Danh sach xe',
    route: '/vehicles-list',
    source: 'app/(management)/(occupancy)/vehicles-list.tsx',
  },
];
