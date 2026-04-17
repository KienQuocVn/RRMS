/**
 * OtherActions - "Thao tác khác"
 * List items: Khoản thu/chi, Tổng kết dịch vụ, Lịch sử Zalo, Lịch sử chuyển khoản
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface ActionListItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const OTHER_ACTIONS: ActionListItem[] = [
  {
    id: 'finance',
    icon: 'trending-up-outline',
    iconBg: '#FFF3E0',
    iconColor: '#FF9800',
    title: 'Khoản thu / chi & Tổng kết',
    description: 'Tổng kết việc kinh doanh & Quản lý các khoản thu (tiền vào), chi (tiền ra) trong hệ thống của bạn',
  },
  {
    id: 'service-summary',
    icon: 'bar-chart-outline',
    iconBg: '#E8F5E9',
    iconColor: '#4CAF50',
    title: 'Tổng kết dịch vụ khách sử dụng',
    description: 'Thống kê dịch vụ điện nước, wifi, rác... khách sử dụng',
  },
  {
    id: 'zalo-history',
    icon: 'chatbubble-ellipses-outline',
    iconBg: '#E3F2FD',
    iconColor: '#0068FF',
    title: 'Lịch sử gửi ZALO',
    description: 'Xem lịch sử gửi hóa đơn TỰ ĐỘNG qua zalo',
  },
  {
    id: 'transfer-history',
    icon: 'swap-horizontal-outline',
    iconBg: '#FCE4EC',
    iconColor: '#E91E63',
    title: 'Lịch sử KHÁCH CHUYỂN KHOẢN',
    description: 'Lịch sử hệ thống tự động gạch nợ khi khách chuyển khoản',
  },
];

interface OtherActionsProps {
  onItemPress?: (id: string) => void;
}

export default function OtherActions({ onItemPress }: OtherActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thao tác khác</Text>
      <Text style={styles.sectionSubtitle}>
        Chứa các thao tác nâng cao cho việc quản lý
      </Text>

      {OTHER_ACTIONS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.listItem}
          onPress={() => onItemPress?.(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={24} color={item.iconColor} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
