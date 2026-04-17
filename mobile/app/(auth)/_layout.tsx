/**
 * Auth Group Layout
 * Stack navigator cho các màn hình xác thực: Login, Register, ForgotPassword.
 * Header ẩn mặc định - mỗi screen tự quản lý header riêng.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
