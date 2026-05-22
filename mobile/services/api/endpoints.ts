/**
 * API Endpoints Configuration
 * Cấu trúc endpoints dựa trên Backend API Documentation
 */

export const API_ENDPOINTS = {
  // 🔐 Authentication
  AUTH: {
    LOGIN: '/authen/login',
    REGISTER: '/authen/register',
    LOGOUT: '/authen/logout',
    INTROSPECT: '/authen/introspect',
    REFRESH_TOKEN: '/authen/refreshToken',
    CHECK_EMAIL: '/authen/checkMail',
    FORGOT_PASSWORD: '/authen/forgetpassword',
    CHANGE_PASSWORD: '/authen/acceptChangePassword',
    REGISTER_REQUEST_OTP: '/authen/authenticationRegister',
    REGISTER_VERIFY_OTP: '/authen/acceptAuthenticationRegister',
  },

  // 👤 Accounts
  ACCOUNTS: {
    GET_ALL: '/api-accounts/get-all-account',
    GET_BY_USERNAME: (username: string) => `/api-accounts/${username}`,
    CREATE: '/api-accounts/createAccount',
    UPDATE: (username: string) => `/api-accounts/updateAccount/${username}`,
  },

  // 🛡️ Roles & Permissions
  ROLES: {
    GET_ALL: '/roles/getAllRole',
  },
  PERMISSIONS: {
    GET_ALL: '/permissions/getAllPermission',
  },

  // 🏠 Motels
  MOTELS: {
    BASE: '/api/v1/motels',
    GET_BY_ID: (id: string) => `/api/v1/motels/${id}`,
    GET_BY_ACCOUNT: (username: string) => `/api/v1/motels/account/${username}`,
    CREATE: '/api/v1/motels',
  },

  MOTEL_SERVICES: {
    BASE: '/api/v1/motel-services',
    BY_ID: (id: string) => `/api/v1/motel-services/${id}`,
  },

  // 🛏️ Rooms
  ROOMS: {
    BASE: '/api/v1/rooms',
    GET_BY_MOTEL: (motelId: string) => `/api/v1/rooms/motel/${motelId}`,
  },

  // 🛠️ Services & Devices
  SERVICES: {
    GET_BY_ROOM: (roomId: string) => `/api/v1/room-services/room/${roomId}`,
  },
  DEVICES: {
    GET_BY_ROOM: (roomId: string) => `/api/v1/room-devices/${roomId}`,
  },

  // 📜 Contracts
  CONTRACTS: {
    BASE: '/contracts',
    GET_BY_MOTEL: (motelId: string) => `/contracts/motel/${motelId}`,
    UPDATE_STATUS: '/contracts/update-status',
  },

  // 👥 Tenants
  TENANTS: {
    INSERT: (roomId: string) => `/tenant/insert/${roomId}`,
    GET_BY_ROOM: (roomId: string) => `/tenant/roomId/${roomId}`,
  },

  // 📋 Contract Templates
  TEMPLATES: {
    BASE: '/contract-templates',
  },

  // 💰 Invoices & Payments
  INVOICES: {
    CREATE: '/invoices/create',
    COLLECT: (invoiceId: string) => `/invoices/${invoiceId}/collect-payment`,
  },
  PAYMENTS: {
    VNPAY: '/payment/create_payment',
    PAYPAL: '/payment/payment-paypal',
  },
  TRANSACTIONS: {
    RECEIPTS: '/transactions/receipts',
    EXPENSES: '/transactions/expenses',
  },

  // 📢 Bulletin Board & Search
  BULLETIN: {
    BASE: '/api/v1/bulletin-boards',
  },
  SEARCH: {
    ADDRESS: '/api/v1/search/by-address',
  },

  // 📊 Statistics & Reports
  STATS: {
    ACCOUNTS: '/statistics/total-accounts',
    TENANTS: '/statistics/total-tenants',
    MOTELS: '/statistics/total-motels',
  },
  REPORTS: {
    TOTAL_ROOMS: '/report/total-rooms',
  },

  // 📅 Miscellaneous
  METER: {
    READINGS: '/api/meter-readings',
  },
  RESERVE: {
    BASE: '/room-reservations',
  },
  SUPPORT: {
    CREATE: '/support/create',
  },
};
