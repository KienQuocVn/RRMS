import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

export default function BillScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const ProgressHeader = () => (
    <View style={[styles.progressHeader, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
      <View style={styles.progressRow}>
        {/* Step 0: Thoát */}
        <View style={styles.stepItem}>
          <TouchableOpacity style={styles.stepCircleOutline} onPress={() => router.back()}>
            <Ionicons name="close" size={16} color="#FF5722" />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Thoát</Text>
          <Text style={styles.stepSub}>Không chốt nữa</Text>
        </View>

        <View style={styles.progressLine} />

        {/* Step 1: Chốt dịch vụ */}
        <View style={styles.stepItem}>
          <View style={styles.stepCircleActive}>
            <Text style={styles.stepCircleTextLight}>1</Text>
          </View>
          <Text style={[styles.stepTitle, { color: Colors.success }]}>Chốt dịch vụ</Text>
          <Text style={styles.stepSub}>Cho từng phòng</Text>
        </View>

        <View style={styles.progressLine} />

        {/* Step 2: Lập hóa đơn */}
        <View style={styles.stepItem}>
          <View style={styles.stepCircleOutline}>
            <Text style={styles.stepCircleTextDark}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Lập hóa đơn</Text>
          <Text style={styles.stepSub}>Cho tất cả đã chốt</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ProgressHeader />
      
      <View style={styles.content}>
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.monthNavBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} style={{ marginRight: 4 }} />
            <Text style={styles.monthNavText}>Tháng{'\n'}trước</Text>
          </TouchableOpacity>
          
          <View style={styles.monthCenter}>
            <Text style={styles.monthCenterLabel}>Chốt cho tháng</Text>
            <Text style={styles.monthCenterValue}>Tháng 4, 2026</Text>
          </View>

          <TouchableOpacity style={styles.monthNavBtn}>
            <Text style={styles.monthNavText}>Tháng{'\n'}tiếp theo</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyStateContainer}>
          <Ionicons name="cube-outline" size={80} color={Colors.gray400} style={styles.emptyIcon} />
          <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
          <Text style={styles.emptyStateDesc}>Chưa có phòng nào đang ở để lập hóa đơn.</Text>
          <Text style={styles.emptyStateDesc}>Vui lòng "Lập hợp đồng mới" trước khi lập hóa đơn.</Text>
        </View>
      </View>

      {/* Bottom Alert Banner */}
      <SafeAreaView style={styles.bottomBannerWrap}>
        <View style={styles.bottomAlert}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.success} style={styles.alertIcon} />
          <Text style={styles.alertText}>
            * Nhấp một hoặc nhiều phòng để CHỐT DỊCH VỤ. Sau đó lập hóa đơn các phòng đã chốt
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  progressHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  progressLine: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray800,
    marginTop: 14, // align with circles
    marginHorizontal: Spacing.xs,
  },
  stepItem: {
    alignItems: 'center',
    width: 90,
  },
  stepCircleOutline: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF5722',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  stepCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  stepCircleTextLight: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  stepCircleTextDark: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  stepTitle: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  stepSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  content: {
    flex: 1,
    padding: Spacing.base,
  },

  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  monthNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNavText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  monthCenter: {
    alignItems: 'center',
  },
  monthCenterLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  monthCenterValue: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: '#2196F3',
  },

  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyStateDesc: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  bottomBannerWrap: {
    backgroundColor: '#F3F4F6',
  },
  bottomAlert: {
    flexDirection: 'row',
    backgroundColor: '#F1F9F4', /* light green tint */
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    padding: Spacing.base,
    alignItems: 'flex-start',
  },
  alertIcon: {
    marginTop: 2,
    marginRight: Spacing.sm,
  },
  alertText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});
