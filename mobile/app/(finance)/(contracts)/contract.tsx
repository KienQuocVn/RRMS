import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

export default function ContractScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Có thể "Lập hợp đồng mới"</Text>
        <Text style={styles.headerSub}>Chọn 1 phòng để thực hiện</Text>
      </View>
    </View>
  );

  const RoomCard = ({ title, price }: { title: string, price: string }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.roomIconBox}>
          <Ionicons name="storefront" size={20} color={Colors.gray700} />
        </View>
        <Text style={styles.roomTitle}>{title}</Text>
        <TouchableOpacity style={styles.arrowBtn}>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statusBox}>
        <View style={styles.statusBoxHeader}>
          <Ionicons name="pricetag-outline" size={12} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.statusBoxTitle}>Trạng thái</Text>
        </View>
        <View style={styles.statusList}>
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.statusText}>Đang trống</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: Colors.success }]} />
            <Text style={styles.statusText}>Chờ kỳ thu tới</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.priceCol}>
          <View style={styles.priceLabelRow}>
            <Ionicons name="cash" size={14} color={Colors.success} style={{ marginRight: 4 }} />
            <Text style={styles.priceLabel}>Giá thuê</Text>
          </View>
          <Text style={styles.priceValue}>{price} đ</Text>
        </View>
        <View style={styles.actionsBox}>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.success }]}>
            <View style={[styles.btnBadge, { backgroundColor: '#2196F3' }]} />
            <Text style={[styles.actionBtnText, { color: Colors.success }]}>Lập phòng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.success }]}>
            <View style={[styles.btnBadge, { backgroundColor: Colors.error }]} />
            <Text style={[styles.actionBtnText, { color: Colors.success }]}>Đăng tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Nhập tên phòng..."
          placeholderTextColor={Colors.gray500}
        />
        <Ionicons name="search" size={24} color={Colors.textPrimary} style={styles.searchIcon} />
      </View>

      {/* No filter tabs in contract according to Screenshot 2 */}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <RoomCard title="Phòng 1" price="3.000.000" />
        <RoomCard title="Phòng 2" price="3.000.000" />
        <RoomCard title="Phòng 3" price="3.000.000" />
        <RoomCard title="Phòng 4" price="3.000.000" />
      </ScrollView>
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
    ...Shadows.sm,
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
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  searchContainer: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
  },
  searchInput: {
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSizes.base,
  },
  searchIcon: {
    position: 'absolute',
    right: 24,
    top: 28,
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.base,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722', 
    padding: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roomIconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  roomTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  arrowBtn: {
    width: 24,
    height: 24,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statusBox: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  statusBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusBoxTitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  statusList: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceCol: {},
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  actionsBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'relative',
    overflow: 'visible',
  },
  actionBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  btnBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: -2,
    right: 2,
  },
});
