/**
 * Root Layout - Entry point của app
 * Quản lý navigation giữa Auth và Main (Tabs).
 * TODO: Thêm logic kiểm tra authentication state
 */

import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useRouter, useSegments, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  
  const token = useAuth((state) => state.token);
  const isHydrated = useAuth((state) => state.isHydrated);

  // ── Auth Guard Logic ──
  useEffect(() => {
    // Chờ cho đến khi dữ liệu từ storage được nạp vào store
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      // Nếu chưa có token và không ở trong nhóm auth -> Đẩy ra Login
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      // Nếu đã có token và vẫn ở trong nhóm auth -> Vào Home
      router.replace('/(tabs)/(home)');
    }
  }, [token, segments, isHydrated]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        {/* Các screen khác */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
