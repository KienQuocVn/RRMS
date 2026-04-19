/**
 * Root Layout - Entry point của app
 * Quản lý navigation giữa Auth và Main (Tabs).
 * TODO: Thêm logic kiểm tra authentication state
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="rooms-list" />
        <Stack.Screen name="invoices-list" />
        <Stack.Screen name="services-settings" />
        <Stack.Screen name="contracts-list" />
        <Stack.Screen name="tenants-list" />
        <Stack.Screen name="assets-list" />
        <Stack.Screen name="vehicles-list" />
        <Stack.Screen name="tenant-app-settings" />
        <Stack.Screen name="invoice-settings" />
        <Stack.Screen name="motel-settings" />
        <Stack.Screen name="broker-management" />
        <Stack.Screen name="bank-account" />
        <Stack.Screen name="finance-summary" />
        <Stack.Screen name="service-summary" />
        <Stack.Screen name="zalo-history" />
        <Stack.Screen name="transfer-history" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
