/**
 * Room Detail Screen - Chi tiết phòng trọ (placeholder)
 * Dynamic route: /rooms/[id]
 * TODO: Fetch room detail từ API
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: `Phòng #${id}` }} />
      <View style={styles.container}>
        <Text style={styles.title}>🏠 Chi tiết phòng</Text>
        <Text style={styles.subtitle}>Mã phòng: {id}</Text>
        <Text style={styles.description}>
          Thông tin chi tiết phòng trọ sẽ hiển thị tại đây
        </Text>
      </View>
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
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
});
