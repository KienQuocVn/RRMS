/**
 * ServicesSettingsScreen - Cài đặt dịch vụ
 * Dùng cho: Hiển thị danh sách dịch vụ (tiền điện, tiền nước...) với giá và trạng thái áp dụng
 * Điều hướng từ: ManagementMenu > "Quản lý dịch vụ"
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

// ── Interface ──
interface ServiceItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  type: string;
  price: string;
  unit: string;
  applyAll: boolean;
}

// ── Mock Data ──
const MOCK_SERVICES: ServiceItem[] = [
  {
    id: '1',
    icon: 'flash',
    name: 'Tiền điện',
    type: 'Theo đồng hồ',
    price: '1.700',
    unit: 'KWh',
    applyAll: true,
  },
  {
    id: '2',
    icon: 'water',
    name: 'Tiền nước',
    type: 'Theo đồng hồ',
    price: '18.000',
    unit: 'Khối',
    applyAll: true,
  },
];

// ── Component ──
export default function ServicesSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt dịch vụ</Text>
      </View>

      {/* ── Service List ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm dịch vụ mới"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

// ── Service Card Sub-Component ──
function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Icon */}
        <View style={styles.serviceIconWrap}>
          <Ionicons name={service.icon} size={24} color={Colors.textPrimary} />
        </View>

        {/* Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceType}>{service.type}</Text>
          <Text style={styles.servicePrice}>
            {service.price} Đồng / {service.unit}
          </Text>
          <View style={styles.applyBadge}>
            <View style={[styles.dot, { backgroundColor: Colors.success }]} />
            <Text style={styles.applyText}>Đang áp dụng tất cả phòng</Text>
          </View>
        </View>

        {/* Remove button */}
        <TouchableOpacity
          style={styles.removeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Xóa ${service.name}`}
        >
          <View style={styles.removeBtnInner}>
            <Ionicons name="remove" size={20} color={Colors.error} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.base,
  },

  // Service Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  serviceType: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  applyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  applyText: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: FontWeights.medium,
  },
  removeBtn: {
    marginLeft: Spacing.sm,
  },
  removeBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});
