/**
 * ManagementMenu - "Menu quản lý nhà trọ"
 * Grid 3 cột x 4 hàng: Quản lý phòng, hóa đơn, dịch vụ, hợp đồng, ...
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

/** Map menu id → route path */
const MENU_ROUTES: Record<string, string> = {
  rooms: '/rooms-list',
  invoices: '/invoices-list',
  services: '/services-settings',
  contracts: '/contracts-list',
  tenants: '/tenants-list',
  assets: '/assets-list',
  vehicles: '/vehicles-list',
  'tenant-app': '/tenant-app-settings',
  'invoice-settings': '/invoice-settings',
  'motel-settings': '/motel-settings',
};

interface MenuGridItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: string;
  iconColor?: string;
}

const MENU_ITEMS: MenuGridItem[] = [
  { id: 'rooms', icon: 'bed-outline', label: 'Quản lý\nphòng', badge: '0/5', iconColor: '#4CAF50' },
  { id: 'invoices', icon: 'receipt-outline', label: 'Quản lý\nhóa đơn', iconColor: '#FF9800' },
  { id: 'services', icon: 'construct-outline', label: 'Quản lý\ndịch vụ', iconColor: '#2196F3' },
  { id: 'contracts', icon: 'document-text-outline', label: 'Quản lý\nhợp đồng', iconColor: '#9C27B0' },
  { id: 'tenants', icon: 'people-outline', label: 'Quản lý\nkhách thuê', iconColor: '#00BCD4' },
  { id: 'assets', icon: 'cube-outline', label: 'Quản lý\ntài sản', iconColor: '#795548' },
  { id: 'vehicles', icon: 'car-outline', label: 'Danh sách\nxe', iconColor: '#607D8B' },
  { id: 'tenant-app', icon: 'phone-portrait-outline', label: 'Cài đặt APP\nkhách thuê', iconColor: '#E91E63' },
  { id: 'invoice-settings', icon: 'settings-outline', label: 'Cài đặt\nhóa đơn', iconColor: '#FF5722' },
  { id: 'motel-settings', icon: 'home-outline', label: 'Cài đặt\nnhà trọ', iconColor: '#3F51B5' },
];

interface ManagementMenuProps {
  onItemPress?: (id: string) => void;
}

export default function ManagementMenu({ onItemPress }: ManagementMenuProps) {
  const router = useRouter();

  const handleItemPress = (id: string) => {
    const route = MENU_ROUTES[id];
    if (route) {
      router.push(route as any);
    } else {
      onItemPress?.(id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Menu quản lý nhà trọ</Text>
      <Text style={styles.sectionSubtitle}>
        Quản lý đối tượng nghiệp vụ trong nhà trọ
      </Text>

      <View style={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridItem}
            onPress={() => handleItemPress(item.id)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={item.label.replace('\n', ' ')}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${item.iconColor}15` }]}>
              <Ionicons name={item.icon} size={28} color={item.iconColor} />
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 24,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeights.bold,
  },
  itemLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
