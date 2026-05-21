import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontWeights,
  Shadows,
} from '@/constants/theme';

interface ServiceItem {
  id: string;
  name: string;
  type: string;
  price: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'electric',
    name: 'Tiền điện',
    type: 'Theo đồng hồ',
    price: '1.700 Đồng / KWh',
    icon: 'flash',
  },
  {
    id: 'water',
    name: 'Tiền nước',
    type: 'Theo đồng hồ',
    price: '18.000 Đồng / Khối',
    icon: 'water',
  },
];

export default function ServicesSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt dịch vụ</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SERVICES.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceIconWrap}>
              <Ionicons name={service.icon} size={24} color={Colors.black} />
            </View>

            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceType}>{service.type}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>

              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Đang áp dụng tất cả phòng</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.removeButton}>
              <Ionicons name="remove" size={20} color="#E24B2A" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF2F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 96,
    gap: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Shadows.sm,
  },
  serviceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0F2F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
    paddingRight: 12,
  },
  serviceName: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  serviceType: {
    fontSize: 14,
    lineHeight: 20,
    color: '#707070',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F2F4F5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});
