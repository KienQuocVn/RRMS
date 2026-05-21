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
import { Colors, Spacing, FontWeights, Shadows } from '@/constants/theme';

interface CategoryItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

const INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'rent', icon: 'receipt-outline', title: 'Thu tiền phòng' },
  { id: 'bed', icon: 'pricetag-outline', title: 'Thu tiền giường' },
  { id: 'monthly', icon: 'pricetag-outline', title: 'Thu tiền hàng tháng' },
  { id: 'first-month', icon: 'pricetag-outline', title: 'Thu tiền tháng đầu tiên' },
  { id: 'contract-end', icon: 'pricetag-outline', title: 'Thu tiền kết thúc hợp đồng' },
  { id: 'cycle', icon: 'pricetag-outline', title: 'Thu tiền theo chu kỳ' },
  { id: 'service', icon: 'business-outline', title: 'Thu tiền dịch vụ' },
  { id: 'deposit', icon: 'pricetag-outline', title: 'Thu tiền cọc' },
];

export default function IncomeExpenseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt thu/chi</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.repeatCard} activeOpacity={0.85}>
          <View style={styles.repeatIconCircle}>
            <Ionicons name="receipt-outline" size={24} color={Colors.black} />
          </View>
          <View style={styles.repeatContent}>
            <Text style={styles.repeatTitle}>Phiếu thu/chi lặp lại hàng tháng</Text>
            <Text style={styles.repeatDesc}>Xem và chỉnh sửa các phiếu thu chi lặp lại hàng tháng</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color={Colors.black} />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Danh mục thu</Text>
            <Text style={styles.sectionDesc}>Danh sách danh mục thu</Text>
          </View>

          <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Thêm danh mục thu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.cardList}>
          {INCOME_CATEGORIES.map((item) => (
            <View key={item.id} style={styles.categoryCard}>
              <View style={styles.categoryIconWrap}>
                <Ionicons name={item.icon} size={24} color={Colors.black} />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryHint}>Hệ thống tạo, không thể sửa</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 24,
  },
  repeatCard: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  repeatIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAF8ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  repeatContent: {
    flex: 1,
    paddingRight: 12,
  },
  repeatTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  repeatDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  sectionHeader: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sectionDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.white,
    fontWeight: FontWeights.medium,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#D9DDE2',
  },
  cardList: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  categoryCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    ...Shadows.sm,
  },
  categoryIconWrap: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  categoryHint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666',
  },
});
