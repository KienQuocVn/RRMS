import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

export default function InvoiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Chọn 1 để lập hóa đơn</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.monthNavBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} style={{ marginRight: 4 }} />
            <Text style={styles.monthNavText}>Tháng{'\n'}trước</Text>
          </TouchableOpacity>
          
          <View style={styles.monthCenter}>
            <Text style={styles.monthCenterLabel}>Chọn tháng</Text>
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
          <Text style={styles.emptyStateDesc}>Chưa có phòng đang ở để lập hóa đơn.</Text>
          <Text style={styles.emptyStateDesc}>Vui lòng "Lập hợp đồng mới" trước khi lập hóa đơn.</Text>
        </View>
      </View>
    </View>
  );
}

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
});
