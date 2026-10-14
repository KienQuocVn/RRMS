import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  registerConnectionErrorListener,
  API_BASE_URL,
  getApiConnectionIssue,
  resolveReachableApiBaseUrl,
} from '@/services/api/client';

/**
 * Hook kiểm tra kết nối tới backend API.
 *
 * Trả về:
 * - `isConnected`: true nếu đã kết nối được backend
 * - `isChecking`: true trong khi đang probe
 * - `connectionError`: thông báo lỗi nếu không kết nối được
 * - `currentApiUrl`: URL backend đang được dùng
 * - `retry`: hàm thử kết nối lại
 *
 * Cách dùng:
 * ```tsx
 * const { isConnected, isChecking, connectionError, retry } = useApiConnection();
 * if (!isConnected && !isChecking) {
 *   return <ApiConnectionError message={connectionError} onRetry={retry} />;
 * }
 * ```
 */
export function useApiConnection(options?: { showAlert?: boolean }) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentApiUrl, setCurrentApiUrl] = useState<string>(API_BASE_URL);

  const check = async () => {
    setIsChecking(true);
    setConnectionError(null);

    try {
      const resolvedUrl = await resolveReachableApiBaseUrl(true);
      setCurrentApiUrl(resolvedUrl);
      setIsConnected(true);
    } catch (error: any) {
      const message =
        error?.message ||
        getApiConnectionIssue()?.message ||
        'Khong the ket noi backend API.';
      setConnectionError(message);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Probe ngay khi mount
    check();

    // Lắng nghe lỗi kết nối từ client
    const unsubscribe = registerConnectionErrorListener((message) => {
      setIsConnected(false);
      setConnectionError(message);

      if (options?.showAlert) {
        Alert.alert(
          '⚠️ Không kết nối được server',
          message,
          [{ text: 'Thử lại', onPress: check }],
          { cancelable: false }
        );
      }
    });

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConnected,
    isChecking,
    connectionError,
    currentApiUrl,
    retry: check,
  };
}
