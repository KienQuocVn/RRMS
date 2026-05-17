import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { authStorage } from '../storage/auth.storage';

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri || typeof hostUri !== 'string') {
    return null;
  }

  return hostUri.split(':')[0] || null;
}

function isPrivateIpv4Host(host: string | null) {
  if (!host) {
    return false;
  }

  const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Pattern.test(host)) {
    return false;
  }

  return (
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    host === '127.0.0.1'
  );
}

function resolveBaseUrl() {
  const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl;
  }

  const expoHost = getExpoHost();

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:7000';
  }

  if (isPrivateIpv4Host(expoHost)) {
    return `http://${expoHost}:7000`;
  }

  return 'http://localhost:7000';
}

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;
const expoHost = getExpoHost();
const isTunnelWithoutApiUrl =
  !configuredApiUrl?.trim() && expoHost !== null && !isPrivateIpv4Host(expoHost);

export const API_BASE_URL = resolveBaseUrl();

function parseUrlHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function getApiBaseUrlDiagnostics(baseUrl: string) {
  const hostname = parseUrlHostname(baseUrl);
  const isLoopbackHost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isPrivateIpv4 = isPrivateIpv4Host(hostname);

  return {
    baseUrl,
    hostname,
    isLoopbackHost,
    isPrivateIpv4,
    isLanOnlyHost: isLoopbackHost || isPrivateIpv4,
  };
}

export const API_BASE_URL_DIAGNOSTICS = getApiBaseUrlDiagnostics(API_BASE_URL);

if (!configuredApiUrl?.trim()) {
  console.warn(
    '[API] EXPO_PUBLIC_API_URL is missing. Resolved fallback baseURL in use:',
    API_BASE_URL
  );
}

if (isTunnelWithoutApiUrl) {
  console.warn(
    '[API] Expo tunnel/public host detected. Configure EXPO_PUBLIC_API_URL to a reachable backend URL (LAN IP, ngrok, cloudflared, etc.).'
  );
}

if (API_BASE_URL_DIAGNOSTICS.isLoopbackHost) {
  console.warn(
    '[API] API baseURL points to localhost. Real devices cannot reach localhost on your PC; use a LAN IP or public tunnel URL instead.'
  );
}

if (
  configuredApiUrl?.trim() &&
  API_BASE_URL_DIAGNOSTICS.isPrivateIpv4 &&
  expoHost &&
  !isPrivateIpv4Host(expoHost)
) {
  console.warn(
    '[API] Expo is using a tunnel/public host, but EXPO_PUBLIC_API_URL still points to a private LAN IP. Devices on 4G or outside your Wi-Fi will time out. Use npm run start:tunnel to expose backend port 7000 as a public URL.'
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryCount(config: any) {
  return Number(config?.__rrmsRetryCount ?? 0);
}

function shouldRetryRequest(error: any) {
  const config = error?.config as any;
  const status = error?.response?.status;
  const code = error?.code;
  const retryCount = getRetryCount(config);
  const isRetryableRequest = config?.rrmsRetryable === true;
  const timedOut = code === 'ECONNABORTED';
  const networkDropped = code === 'ERR_NETWORK' || (!status && !!config);
  const transientStatus =
    typeof status === 'number' && (status === 502 || status === 503 || status === 504);

  if (!config || !isRetryableRequest) {
    return false;
  }

  if (retryCount >= 2) {
    return false;
  }

  return timedOut || networkDropped || transientStatus;
}

async function retryRequest(error: any) {
  const config = error.config as any;
  const nextRetryCount = getRetryCount(config) + 1;
  const retryLabel = config.rrmsRetryLabel || config.url || 'request';
  const delayMs = 700 * nextRetryCount;

  config.__rrmsRetryCount = nextRetryCount;

  console.warn(
    `[API] Retrying ${retryLabel} (${nextRetryCount}/2) after ${
      error?.response?.status ?? error?.code ?? 'network error'
    }`
  );

  await sleep(delayMs);

  return apiClient.request(config);
}

apiClient.interceptors.request.use(
  async (config) => {
    const isAuthUrl = config.url?.includes('/authen/');

    if (!isAuthUrl) {
      const token = await authStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (shouldRetryRequest(error)) {
      return retryRequest(error);
    }

    if (error.response?.status === 401) {
      await authStorage.clearAll();
    }

    return Promise.reject(error);
  }
);
