/**
 * Rooms List Screen - Danh sach phong tro (placeholder)
 * TODO: Fetch rooms list tu API, hien thi FlatList
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { RefreshableScreenView } from '@/components/ui/refreshable-screen-view';

export default function RoomsListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Danh sách phòng' }} />
      <RefreshableScreenView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>🏢 Phòng trọ</Text>
          <Text style={styles.subtitle}>Danh sách phòng trọ sẽ hiển thị tại đây</Text>
        </View>
      </RefreshableScreenView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
