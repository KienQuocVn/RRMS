/**
 * Tasks Screen - Công việc
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'rental' | 'personal' | 'system'>('rental');

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>🔥 Giải quyết thôi nào</Text>
          <Text style={styles.headerSubtitle}>Quản lý hiệu quả với tính năng việc cần làm</Text>
        </View>
        <TouchableOpacity style={styles.headerIconWrap}>
          <MaterialCommunityIcons name="clipboard-check-outline" size={24} color={Colors.success} />
        </TouchableOpacity>
      </View>

      {/* Custom Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBackground}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'rental' && styles.activeTabButton]}
            onPress={() => setActiveTab('rental')}
          >
            <View style={styles.tabContent}>
               <Ionicons name="home-outline" size={16} color={activeTab === 'rental' ? Colors.textPrimary : Colors.white} />
               <Text style={[styles.tabText, activeTab === 'rental' && styles.activeTabText]}>
                 Nhà cho thuê
               </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'personal' && styles.activeTabButton]}
            onPress={() => setActiveTab('personal')}
          >
            <View style={styles.tabContent}>
               <Ionicons name="briefcase-outline" size={16} color={activeTab === 'personal' ? Colors.textPrimary : Colors.white} />
               <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
                 Cá nhân
               </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'system' && styles.activeTabButton]}
            onPress={() => setActiveTab('system')}
          >
            <View style={styles.tabContent}>
               <Ionicons name="person-outline" size={16} color={activeTab === 'system' ? Colors.textPrimary : Colors.white} />
               <Text style={[styles.tabText, activeTab === 'system' && styles.activeTabText]}>
                 Hệ thống
               </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Empty state */}
      <View style={styles.emptyState}>
        <View style={styles.illustrationWrap}>
          {/* We use an icon since we don't have the exact illustration */}
          <MaterialCommunityIcons name="file-document-edit-outline" size={100} color={Colors.gray300} />
        </View>
        <Text style={styles.emptyTitle}>Chưa có việc nào trong nhà cho thuê</Text>
        <Text style={styles.emptyDescription}>
          Quản lý việc nhà cho thuê giúp bạn giải quyết các công việc tồn đọng trong nhà cho thuê của bạn. Ví dụ: Hợp đồng sắp hết hạn, Yêu cầu/phản ánh từ khách thuê...
        </Text>
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabSecondary}>
          <MaterialCommunityIcons name="chevron-double-down" size={24} color={Colors.success} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabPrimary}>
          <Ionicons name="add" size={32} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
  },
  tabContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  tabBackground: {
    flexDirection: 'row',
    backgroundColor: '#1E75EA',
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: FontWeights.medium,
    color: Colors.white,
  },
  activeTabText: {
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -2,
    backgroundColor: '#F97316',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100, // Make room for FAB
  },
  illustrationWrap: {
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    right: Spacing.base,
    bottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  fabSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  fabPrimary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 4 },
    }),
  },
});
