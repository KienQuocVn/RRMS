/**
 * Home Group Layout - Stack navigator cho Home tab
 * Header ẩn vì HomeScreen tự quản lý header riêng.
 */

import React from 'react';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
