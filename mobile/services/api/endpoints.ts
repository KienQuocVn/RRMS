export const API_ENDPOINTS = {
  // Buildings
  GET_BUILDINGS: '/api/v1/buildings',
  GET_BUILDING_BY_ID: (id: string) => `/api/v1/buildings/${id}`,
  CREATE_BUILDING: '/api/v1/buildings',
  UPDATE_BUILDING: (id: string) => `/api/v1/buildings/${id}`,
  DELETE_BUILDING: (id: string) => `/api/v1/buildings/${id}`,

  // Rooms
  GET_ROOMS: '/api/v1/rooms',
  
  // Deposits
  GET_DEPOSITS: '/api/v1/deposits',
  CREATE_DEPOSIT: '/api/v1/deposits',

  // Users / Auth
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
};
