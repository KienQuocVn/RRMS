/**
 * Rooms Group Layout - Stack navigator cho Rooms tab
 */

import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Phòng trọ' }}
      />
      <Stack.Screen
        name="add"
        options={{ title: 'Thêm phòng' }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: 'Chi tiết phòng' }}
      />
    </Stack>
  );
}
