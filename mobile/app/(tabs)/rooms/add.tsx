/**
 * Add Room Screen - Thêm phòng trọ mới (placeholder)
 * TODO: Form thêm phòng trọ
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';

export default function AddRoomScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Thêm phòng trọ' }} />
      <View style={styles.container}>
        <Text style={styles.title}>➕ Thêm phòng trọ</Text>
        <Text style={styles.subtitle}>Form thêm phòng sẽ hiển thị tại đây</Text>
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
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
});
