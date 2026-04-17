import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

// ── Mock data ──
const ROOMS = [
  { id: '1', title: 'Phòng 1', price: '3.000.000', status: 'empty' },
  { id: '2', title: 'Phòng 2', price: '3.000.000', status: 'empty' },
  { id: '3', title: 'Phòng 3', price: '3.000.000', status: 'empty' },
];

type FilterTab = 'all' | 'depositing';

export default function DepositScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchText, setSearchText] = useState('');

  // ── Header ──
  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Có thể "Cọc giữ chỗ"</Text>
        <Text style={styles.headerSub}>Chọn 1 phòng để thực hiện</Text>
      </View>
    </View>
  );

  // ── Search Bar ──
  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên phòng..."
          placeholderTextColor={Colors.gray400}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchIconBtn}>
          <Ionicons name="search" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Filter Tabs ──
  const FilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
        {/* Tab: Tất cả */}
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.7}
        >
          <Ionicons name="funnel-outline" size={14} color={activeFilter === 'all' ? Colors.white : Colors.textPrimary} style={{ marginRight: 4 }} />
          <Text style={activeFilter === 'all' ? styles.filterTextActive : styles.filterTextInactive}>Tất cả</Text>
          <View style={[styles.tabBadge, { backgroundColor: '#FF9800' }]}>
            <Text style={styles.tabBadgeText}>5</Text>
          </View>
        </TouchableOpacity>

        {/* Tab: Đang cọc giữ chỗ */}
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'depositing' ? styles.filterTabActive : styles.filterTabInactive]}
          onPress={() => setActiveFilter('depositing')}
          activeOpacity={0.7}
        >
          <Text style={activeFilter === 'depositing' ? styles.filterTextActive : styles.filterTextInactive}>Đang cọc giữ chỗ</Text>
          <View style={[styles.tabBadge, { backgroundColor: '#FF5722' }]}>
            <Text style={styles.tabBadgeText}>0</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // ── Room Card ──
  const RoomCard = ({ title, price }: { title: string; price: string }) => (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.roomIconBox}>
          <Ionicons name="storefront" size={20} color={Colors.gray700} />
        </View>
        <Text style={styles.roomTitle}>{title}</Text>
        <TouchableOpacity style={styles.arrowBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={16} color={Colors.success} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardDivider} />

      {/* Status Section */}
      <View style={styles.cardBody}>
        <View style={styles.statusBox}>
          <View style={styles.statusBoxHeader}>
            <Ionicons name="pricetag-outline" size={13} color={Colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.statusBoxTitle}>Trạng thái</Text>
          </View>
          <View style={styles.statusList}>
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.statusText}>Đang trống</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.statusText}>Chờ kỳ thu tới</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* Footer: Price + Actions */}
      <View style={styles.cardFooter}>
        <View style={styles.priceCol}>
          <View style={styles.priceLabelRow}>
            <Ionicons name="cash" size={14} color={Colors.success} style={{ marginRight: 4 }} />
            <Text style={styles.priceLabel}>Giá thuê</Text>
          </View>
          <Text style={styles.priceValue}>{price} đ</Text>
        </View>
        <View style={styles.actionsBox}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <View style={[styles.btnDot, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.actionBtnText}>Lập phòng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <View style={[styles.btnDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.actionBtnText}>Đăng tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar />
      <FilterTabs />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ROOMS.map((room) => (
          <RoomCard key={room.id} title={room.title} price={room.price} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Container ──
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    ...Shadows.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
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
    marginBottom: 2,
  },
  headerSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // ── Search ──
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  searchInputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    height: 46,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.lg,
    paddingRight: 48,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  searchIconBtn: {
    position: 'absolute',
    right: 14,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Filter Tabs ──
  filterContainer: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing.md,
  },
  filterTabs: {
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    position: 'relative',
  },
  filterTabActive: {
    backgroundColor: '#8BC34A',
  },
  filterTabInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  filterTextActive: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  filterTextInactive: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  tabBadge: {
    position: 'absolute',
    top: -8,
    right: -6,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },

  // ── Scroll ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.md,
  },

  // ── Card ──
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.base,
  },
  cardBody: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },

  // ── Room Icon ──
  roomIconBox: {
    width: 36,
    height: 36,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  roomTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Status Box ──
  statusBox: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
  },
  statusBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusBoxTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statusList: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },

  // ── Price ──
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
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // ── Action Buttons ──
  actionsBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    position: 'relative',
  },
  actionBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: '#4CAF50',
  },
  btnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: -3,
    right: -1,
  },
});
