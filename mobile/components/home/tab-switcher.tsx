/**
 * TabSwitcher - Toggle giữa "Quản lý" và "Tổng quan"
 * Nằm ngay dưới header, trong vùng xanh lá.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface TabSwitcherProps {
  activeTab: 'manage' | 'overview';
  onTabChange: (tab: 'manage' | 'overview') => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manage' && styles.tabActive]}
          onPress={() => onTabChange('manage')}
        >
          <Ionicons
            name="settings-outline"
            size={16}
            color={activeTab === 'manage' ? Colors.white : Colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'manage' && styles.tabTextActive]}>
            Quản lý
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => onTabChange('overview')}
        >
          <Ionicons
            name="stats-chart-outline"
            size={16}
            color={activeTab === 'overview' ? Colors.white : Colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Tổng quan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
});
