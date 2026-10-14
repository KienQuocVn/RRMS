import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { authStorage } from '../storage/auth.storage';
import { safeAsyncStorage } from '../storage/safe-async-storage';

const DEFAULT_API_PORT = Number(process.env.EXPO_PUBLIC_API_PORT?.trim() || '7000');
const API_PROBE_PATH = process.env.EXPO_PUBLIC_API_PING_PATH?.trim() || '/actuator/health';
const API_BASE_URL_STORAGE_KEY = 'rrms_last_successful_api_url';
const API_PROBE_TIMEOUT_MS = 8000;
const API_BASE_URL_RECOVERY_LIMIT = 1;

export type ApiConnectionIssue = {
  message: string;
  candidates: string[];
  activeBaseUrl: string;
};

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

function normalizeBaseUrl(url: string) {
  return url.trim().replace(/\/+$/, '');
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

function buildBaseUrlFromHost(host: string) {
  return `http://${host}:${DEFAULT_API_PORT}`;
}

function addCandidate(
  candidates: string[],
  candidate: string | null | undefined,
) {
  if (!candidate?.trim()) {
    return;
  }

  const normalizedCandidate = normalizeBaseUrl(candidate);

  if (!candidates.includes(normalizedCandidate)) {
    candidates.push(normalizedCandidate);
  }
}

function getConfiguredApiCandidates() {
  return (process.env.EXPO_PUBLIC_API_URL_CANDIDATES || '')
    .split(',')
    .map((value: string) => value.trim())
    .filter(Boolean);
}

function buildApiBaseUrlCandidates() {
  const candidates: string[] = [];
  const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  const expoHost = getExpoHost();

  addCandidate(candidates, configuredApiUrl);

  for (const configuredCandidate of getConfiguredApiCandidates()) {
    addCandidate(candidates, configuredCandidate);
  }

  if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
    addCandidate(candidates, buildBaseUrlFromHost(expoHost));
  }

  if (Platform.OS === 'android') {
    addCandidate(candidates, buildBaseUrlFromHost('10.0.2.2'));
  }

  addCandidate(candidates, buildBaseUrlFromHost('localhost'));
  addCandidate(candidates, buildBaseUrlFromHost('127.0.0.1'));

  return candidates;
}

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;
const expoHost = getExpoHost();
const isTunnelWithoutApiUrl =
  !configuredApiUrl?.trim() && expoHost !== null && !isPrivateIpv4Host(expoHost);

export let API_BASE_URL_CANDIDATES = buildApiBaseUrlCandidates();
export let API_BASE_URL =
  API_BASE_URL_CANDIDATES[0] ?? buildBaseUrlFromHost('localhost');

function parseUrlHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function buildApiBaseUrlDiagnostics(baseUrl: string) {
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

function setActiveApiBaseUrl(baseUrl: string) {
  API_BASE_URL = normalizeBaseUrl(baseUrl);
  API_BASE_URL_DIAGNOSTICS = buildApiBaseUrlDiagnostics(API_BASE_URL);
}

function getProbeUrl(baseUrl: string) {
  return new URL(API_PROBE_PATH, `${normalizeBaseUrl(baseUrl)}/`).toString();
}

function isTunnelUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    // Tunnel nếu không phải LAN IP và không phải localhost
    return (
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1' &&
      !isPrivateIpv4Host(hostname)
    );
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  // Chỉ gửi custom header khi là tunnel (ngrok, loca.lt, ...)
  // để tránh CORS preflight OPTIONS khi probe LAN/localhost trên browser
  const headers: Record<string, string> = {};
  if (isTunnelUrl(url)) {
    headers['bypass-tunnel-reminder'] = 'true';
  }

  return Promise.race([
    fetch(url, {
      method: 'GET',
      headers,
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

async function isApiBaseUrlReachable(baseUrl: string) {
  try {
    const response = await fetchWithTimeout(getProbeUrl(baseUrl), API_PROBE_TIMEOUT_MS);
    return response.status < 500 || response.status === 401 || response.status === 403;
  } catch {
    try {
      const fallbackUrl = new URL('/', `${normalizeBaseUrl(baseUrl)}/`).toString();
      const response = await fetchWithTimeout(fallbackUrl, 3000);
      return response.status < 500 || response.status === 401 || response.status === 403;
    } catch {
      return false;
    }
  }
}

function prioritizeCandidates(storedBaseUrl: string | null) {
  let nextCandidates = buildApiBaseUrlCandidates();

  if (Platform.OS === 'web') {
    const isWebLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isWebLocalhost) {
      const localApi = `http://localhost:${DEFAULT_API_PORT}`;
      return [
        localApi,
        ...nextCandidates.filter((c) => c !== localApi)
      ];
    }
  }

  if (configuredApiUrl?.trim()) {
    return nextCandidates;
  }

  if (!storedBaseUrl) {
    return nextCandidates;
  }

  const normalizedStoredBaseUrl = normalizeBaseUrl(storedBaseUrl);
  return [
    normalizedStoredBaseUrl,
    ...nextCandidates.filter((candidate) => candidate !== normalizedStoredBaseUrl),
  ];
}

let hasResolvedReachableApiBaseUrl = false;
let apiBaseUrlResolutionPromise: Promise<string> | null = null;

export let API_BASE_URL_DIAGNOSTICS = buildApiBaseUrlDiagnostics(API_BASE_URL);
export let API_CONNECTION_ISSUE: ApiConnectionIssue | null = null;

export function getApiBaseUrlCandidates() {
  return [...API_BASE_URL_CANDIDATES];
}

export async function resolveReachableApiBaseUrl(forceRefresh = false) {
  if (!forceRefresh && hasResolvedReachableApiBaseUrl) {
    return API_BASE_URL;
  }

  // Khi forceRefresh=true, hủy promise đang chạy để probe lại từ đầu
  if (forceRefresh) {
    apiBaseUrlResolutionPromise = null;
    hasResolvedReachableApiBaseUrl = false;
  }

  if (apiBaseUrlResolutionPromise) {
    return apiBaseUrlResolutionPromise;
  }

  apiBaseUrlResolutionPromise = (async () => {
    const storedBaseUrl = await safeAsyncStorage.getItem(API_BASE_URL_STORAGE_KEY);
    API_BASE_URL_CANDIDATES = prioritizeCandidates(storedBaseUrl);

    for (const candidate of API_BASE_URL_CANDIDATES) {
      try {
        const reachable = await isApiBaseUrlReachable(candidate);

        if (!reachable) {
          continue;
        }

        setActiveApiBaseUrl(candidate);
        hasResolvedReachableApiBaseUrl = true;
        API_CONNECTION_ISSUE = null;
        await safeAsyncStorage.setItem(API_BASE_URL_STORAGE_KEY, candidate);
        return candidate;
      } catch (error) {
        console.warn(`[API] Probe failed for ${candidate}:`, error);
      }
    }

    const fallbackBaseUrl =
      API_BASE_URL_CANDIDATES[0] ?? buildBaseUrlFromHost('localhost');
    setActiveApiBaseUrl(fallbackBaseUrl);
    hasResolvedReachableApiBaseUrl = false;

    const errorMessage =
      `Khong ket noi duoc backend.\n` +
      `Da thu: ${API_BASE_URL_CANDIDATES.join(', ')}\n\n` +
      `Kiem tra:\n` +
      `1. Backend co dang chay tren cong ${DEFAULT_API_PORT}?\n` +
      `2. Dien thoai co cung mang Wi-Fi voi may tinh?\n` +
      `3. EXPO_PUBLIC_API_URL trong mobile/.env co dung IP LAN cua may tinh?\n` +
      `4. Windows Firewall co cho phep inbound port ${DEFAULT_API_PORT}?`;

    API_CONNECTION_ISSUE = {
      message: errorMessage,
      candidates: [...API_BASE_URL_CANDIDATES],
      activeBaseUrl: fallbackBaseUrl,
    };

    console.warn('[API] Could not verify any API candidate. Falling back to:', fallbackBaseUrl);
    console.warn('[API] Connection error detail:', errorMessage);

    connectionErrorListeners.forEach((listener) => {
      try {
        listener(errorMessage);
      } catch (e) {
        console.warn('[API] Error in connection error listener:', e);
      }
    });

    const connectionError = new Error(errorMessage) as Error & {
      code?: string;
      candidates?: string[];
      activeBaseUrl?: string;
      isApiConnectionError?: boolean;
    };
    connectionError.code = 'RRMS_API_UNREACHABLE';
    connectionError.candidates = [...API_BASE_URL_CANDIDATES];
    connectionError.activeBaseUrl = fallbackBaseUrl;
    connectionError.isApiConnectionError = true;
    throw connectionError;
  })();

  try {
    return await apiBaseUrlResolutionPromise;
  } finally {
    apiBaseUrlResolutionPromise = null;
  }
}

export const connectionErrorListeners = new Set<(message: string) => void>();

export function registerConnectionErrorListener(listener: (message: string) => void) {
  connectionErrorListeners.add(listener);
  return () => {
    connectionErrorListeners.delete(listener);
  };
}

export function getApiConnectionIssue() {
  return API_CONNECTION_ISSUE;
}

export let isApiReachable = false;

export const unauthorizedListeners = new Set<() => void>();

export function registerUnauthorizedListener(listener: () => void) {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

export const apiClient = axios.create({
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

function getBaseUrlRecoveryCount(config: any) {
  return Number(config?.__rrmsBaseUrlRecoveryCount ?? 0);
}

function isRecoverableConnectivityError(error: any) {
  const status = error?.response?.status;
  const code = error?.code;

  return (
    code === 'ECONNABORTED' ||
    code === 'ERR_NETWORK' ||
    (!status && !!error?.config) ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

function shouldRecoverApiBaseUrl(error: any) {
  const config = error?.config as any;

  if (!config || getBaseUrlRecoveryCount(config) >= API_BASE_URL_RECOVERY_LIMIT) {
    return false;
  }

  return isRecoverableConnectivityError(error);
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

export function buildApiErrorMessage(error: any) {
  const connectionIssue = error?.isApiConnectionError
    ? {
        message: error.message,
        candidates: error.candidates,
        activeBaseUrl: error.activeBaseUrl,
      }
    : API_CONNECTION_ISSUE;
  const status = error?.response?.status;
  const method = error?.config?.method?.toUpperCase();
  const requestPath = error?.config?.url;
  const baseUrl = error?.config?.baseURL || connectionIssue?.activeBaseUrl || API_BASE_URL;
  const timeoutError = error?.code === 'ECONNABORTED';
  const networkError =
    error?.message === 'Network Error' ||
    error?.code === 'ERR_NETWORK' ||
    error?.code === 'RRMS_API_UNREACHABLE' ||
    (!error?.response && (!!error?.config || error?.isApiConnectionError));

  if (connectionIssue || timeoutError || networkError) {
    const triedUrls = connectionIssue?.candidates?.length
      ? connectionIssue.candidates.join(', ')
      : baseUrl;
    const reason = timeoutError
      ? 'Request qua thoi gian cho.'
      : 'Mobile khong cham duoc backend.';

    return (
      `${reason}\n\n` +
      `API dang goi: ${method ? `${method} ` : ''}${baseUrl}${requestPath || ''}\n` +
      `Da thu base URL: ${triedUrls}\n\n` +
      `Can kiem tra:\n` +
      `1. Backend dang chay port ${DEFAULT_API_PORT}.\n` +
      `2. IP trong mobile/.env la IP LAN cua may tinh, khong dung localhost khi test bang dien thoai that.\n` +
      `3. Dien thoai va may tinh cung Wi-Fi.\n` +
      `4. Firewall cho phep port ${DEFAULT_API_PORT}.`
    );
  }

  if (status === 401) {
    return 'So dien thoai hoac mat khau khong dung, hoac phien dang nhap da het han.';
  }

  if (status === 403) {
    return 'Tai khoan khong co quyen truy cap API nay.';
  }

  if (status === 404) {
    return `Khong tim thay API: ${method ? `${method} ` : ''}${baseUrl}${requestPath || ''}`;
  }

  if (status >= 500) {
    return `Backend tra loi loi ${status}. Kiem tra log server cho API: ${method ? `${method} ` : ''}${requestPath || ''}`;
  }

  return error?.response?.data?.message || error?.message || 'Da xay ra loi khi goi API.';
}

async function retryWithRecoveredBaseUrl(error: any) {
  const config = error.config as any;
  const previousBaseUrl = normalizeBaseUrl(config.baseURL || API_BASE_URL);
  const nextRecoveryCount = getBaseUrlRecoveryCount(config) + 1;

  config.__rrmsBaseUrlRecoveryCount = nextRecoveryCount;

  const recoveredBaseUrl = await resolveReachableApiBaseUrl(true);
  config.baseURL = recoveredBaseUrl;

  if (recoveredBaseUrl !== previousBaseUrl) {
    console.warn(
      `[API] Switching baseURL from ${previousBaseUrl} to ${recoveredBaseUrl} before retrying ${
        config.url || 'request'
      }.`
    );
  }

  return apiClient.request(config);
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
    const isAbsoluteRequestUrl = /^https?:\/\//i.test(config.url || '');

    if (!isAbsoluteRequestUrl) {
      config.baseURL = await resolveReachableApiBaseUrl();
    }

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
    if (shouldRecoverApiBaseUrl(error)) {
      return retryWithRecoveredBaseUrl(error);
    }

    if (shouldRetryRequest(error)) {
      return retryRequest(error);
    }

    if (error.response?.status === 401) {
      await authStorage.clearAll();
      unauthorizedListeners.forEach((listener) => {
        try {
          listener();
        } catch (e) {
          console.warn('[API] Error in unauthorized listener:', e);
        }
      });
    }

    return Promise.reject(error);
  }
);
