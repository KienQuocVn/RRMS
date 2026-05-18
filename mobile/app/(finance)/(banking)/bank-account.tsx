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

const FEATURES = [
  {
    id: 'info',
    title: 'Hiển thị thông tin',
    description: 'Hiển thị tài khoản ngân hàng của bạn trên hóa đơn giúp khách thanh toán dễ dàng',
  },
  {
    id: 'qr',
    title: 'Hiển thị mã QR',
    description: 'Thanh toán nhanh hơn với mã QR trên hóa đơn',
  },
  {
    id: 'auto',
    title: 'Gạch nợ tự động',
    description: 'Khi khách chuyển khoản hệ thống tự động hoàn thành hóa đơn không cần làm thủ công',
  },
  {
    id: 'flow',
    title: 'Quản lý dòng tiền',
    description: 'Giúp bạn thống kê tiền ra, tiền vào tài khoản',
  },
];

export default function BankAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý TK ngân hàng</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          <View style={styles.heroTop}>
            <View style={styles.partnerCircle}>
              <Ionicons name="sparkles" size={22} color="#10B154" />
            </View>

            <View style={styles.heroLine} />

            <View style={styles.plugCircle}>
              <Ionicons name="power" size={24} color="#4B5563" />
            </View>

            <View style={styles.heroLine} />

            <View style={styles.partnerCircle}>
              <Ionicons name="card" size={22} color="#4F8EF7" />
            </View>
          </View>

          <Text style={styles.heroTitle}>Kết nối tài khoản với LOZIDO</Text>
          <Text style={styles.heroSubtitle}>Các ngân hàng hợp tác với LOZIDO</Text>

          <View style={styles.bankRow}>
            <View style={styles.bankBox}>
              <View style={styles.bankBadge}>
                <Text style={styles.bankBadgeText}>Miễn phí GD</Text>
              </View>
              <Text style={styles.bidvText}>BIDV</Text>
            </View>

            <View style={styles.bankBox}>
              <Text style={styles.mbText}>MB</Text>
            </View>
          </View>

          <View style={styles.featurePanel}>
            {FEATURES.map((feature, index) => (
              <View
                key={feature.id}
                style={[styles.featureRow, index < FEATURES.length - 1 && styles.featureBorder]}
              >
                <View style={styles.featureCheck}>
                  <Ionicons name="checkmark" size={18} color={Colors.white} />
                </View>

                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.learnButton}>
              <Ionicons name="help-circle-outline" size={18} color="#11A84A" />
              <Text style={styles.learnButtonText}>Tìm hiểu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={20} color={Colors.white} />
              <Text style={styles.addButtonText}>Thêm tài khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 12,
    paddingBottom: 96,
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Shadows.sm,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  partnerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#10B154',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  plugCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#5B5B5B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  heroLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#6B7280',
    marginHorizontal: 6,
  },
  heroTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  bankBox: {
    minWidth: 112,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    position: 'relative',
  },
  bankBadge: {
    position: 'absolute',
    top: -10,
    left: 8,
    backgroundColor: '#15B44A',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bankBadgeText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.white,
    fontWeight: FontWeights.medium,
  },
  bidvText: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: FontWeights.bold,
    color: '#136D66',
  },
  mbText: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: FontWeights.bold,
    color: '#3756B7',
  },
  featurePanel: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  featureBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9DDE2',
  },
  featureCheck: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7DD321',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  learnButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#15B44A',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  learnButtonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
    color: '#15B44A',
  },
  addButton: {
    flex: 1.35,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#15B44A',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#14B24B',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});
