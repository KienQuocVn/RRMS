import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { authStorage } from '../storage/auth.storage';
import { safeAsyncStorage } from '../storage/safe-async-storage';

const DEFAULT_API_PORT = Number(process.env.EXPO_PUBLIC_API_PORT?.trim() || '7000');
const API_PROBE_PATH = process.env.EXPO_PUBLIC_API_PING_PATH?.trim() || '/authen/error';
const API_BASE_URL_STORAGE_KEY = 'rrms_last_successful_api_url';
const API_PROBE_TIMEOUT_MS = 3500;
const API_BASE_URL_RECOVERY_LIMIT = 1;

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
    .map((value) => value.trim())
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

async function fetchWithTimeout(url: string, timeoutMs: number) {
  return Promise.race([
    fetch(url, {
      method: 'GET',
      headers: {
        'bypass-tunnel-reminder': 'true',
      },
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

async function isApiBaseUrlReachable(baseUrl: string) {
  const response = await fetchWithTimeout(getProbeUrl(baseUrl), API_PROBE_TIMEOUT_MS);
  return response.status < 500 || response.status === 401 || response.status === 403;
}

function prioritizeCandidates(storedBaseUrl: string | null) {
  const nextCandidates = buildApiBaseUrlCandidates();

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

export function getApiBaseUrlCandidates() {
  return [...API_BASE_URL_CANDIDATES];
}

export async function resolveReachableApiBaseUrl(forceRefresh = false) {
  if (!forceRefresh && hasResolvedReachableApiBaseUrl) {
    return API_BASE_URL;
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

    console.warn(
      '[API] Could not verify any API candidate. Falling back to:',
      fallbackBaseUrl
    );

    return fallbackBaseUrl;
  })();

  try {
    return await apiBaseUrlResolutionPromise;
  } finally {
    apiBaseUrlResolutionPromise = null;
  }
}

if (!configuredApiUrl?.trim()) {
  console.warn(
    '[API] EXPO_PUBLIC_API_URL is missing. Auto-discovery will probe these candidates:',
    API_BASE_URL_CANDIDATES
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
    }

    return Promise.reject(error);
  }
);
