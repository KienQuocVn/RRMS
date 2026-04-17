import axios from 'axios';
import { Platform } from 'react-native';

// Use standard local IP for Android emulator or localhost for iOS simulator
// Adjust this according to your actual Java Backend IP
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for request (e.g. inject token)
apiClient.interceptors.request.use(
  async (config) => {
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for response (e.g. handle 401 unauthorized globally)
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // if (error.response?.status === 401) {
    //   // Handle unauthorized
    // }
    return Promise.reject(error);
  }
);
