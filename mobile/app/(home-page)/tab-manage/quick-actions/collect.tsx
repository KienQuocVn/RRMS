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

type FilterTab = 'all' | 'unpaid' | 'partial' | 'overdue';

export default function CollectScreen() {
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
        <Text style={styles.headerTitle}>Hóa đơn cần thu tiền</Text>
        <Text style={styles.headerSub}>Chọn hóa đơn để thu tiền</Text>
      </View>
    </View>
  );

  // ── Search Bar ──
  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo phòng, khách thuê..."
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
        {[
          { key: 'all' as FilterTab, label: 'Tất cả', count: 0, icon: 'funnel-outline' as const },
          { key: 'unpaid' as FilterTab, label: 'Chưa thu', count: 0 },
          { key: 'partial' as FilterTab, label: 'Thu 1 phần', count: 0 },
          { key: 'overdue' as FilterTab, label: 'Quá hạn', count: 0 },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              activeFilter === tab.key ? styles.filterTabActive : styles.filterTabInactive,
            ]}
            onPress={() => setActiveFilter(tab.key)}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <Ionicons
                name={tab.icon}
                size={14}
                color={activeFilter === tab.key ? Colors.white : Colors.textPrimary}
                style={{ marginRight: 4 }}
              />
            )}
            <Text style={activeFilter === tab.key ? styles.filterTextActive : styles.filterTextInactive}>
              {tab.label}
            </Text>
            <View style={[styles.tabBadge, { backgroundColor: '#FF5722' }]}>
              <Text style={styles.tabBadgeText}>{tab.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar />
      <FilterTabs />

      {/* Empty State */}
      <View style={styles.emptyStateContainer}>
        <Ionicons name="receipt-outline" size={80} color={Colors.gray300} style={styles.emptyIcon} />
        <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
        <Text style={styles.emptyStateDesc}>
          Chưa có hóa đơn nào cần thu tiền.
        </Text>
        <Text style={styles.emptyStateDesc}>
          Vui lòng Lập hóa đơn trước khi thu tiền.
        </Text>
      </View>
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
    paddingTop: Spacing.sm,
    zIndex: 1,
  },
  filterTabs: {
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    paddingTop: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    position: 'relative',
    overflow: 'visible',
  },
  filterTabActive: {
    backgroundColor: Colors.success,
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

  // ── Empty State ──
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
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
