/**
 * Rooms List Screen - Danh sách phòng trọ (placeholder)
 * TODO: Fetch rooms list từ API, hiển thị FlatList
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';

export default function RoomsListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Danh sách phòng' }} />
      <View style={styles.container}>
        <Text style={styles.title}>🏢 Phòng trọ</Text>
        <Text style={styles.subtitle}>Danh sách phòng trọ sẽ hiển thị tại đây</Text>
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
