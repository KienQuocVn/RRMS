import React from 'react';
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

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Có thể "Thanh lý"</Text>
        <Text style={styles.headerSub}>Chọn 1 phòng để thực hiện</Text>
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

      <View style={{ backgroundColor: Colors.white }}>
        <ScrollView horizontal contentContainerStyle={styles.filterTabs} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
            <Ionicons name="funnel-outline" size={16} color={Colors.white} style={{ marginRight: 4 }} />
            <Text style={styles.filterTextActive}>Tất cả</Text>
            <View style={styles.tabBadgeOrange}>
              <Text style={styles.tabBadgeText}>0</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTabInactive}>
            <Text style={styles.filterTextInactive}>Đang báo kết thúc</Text>
            <View style={styles.tabBadgeOrange}>
              <Text style={styles.tabBadgeText}>0</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTabInactive}>
            <Text style={styles.filterTextInactive}>Sắp kết thúc</Text>
            <View style={styles.tabBadgeOrange}>
              <Text style={styles.tabBadgeText}>0</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTabInactive}>
            <Text style={styles.filterTextInactive}>Quá hạn</Text>
            <View style={styles.tabBadgeOrange}>
              <Text style={styles.tabBadgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.emptyStateContainer}>
        <Ionicons name="cube-outline" size={80} color={Colors.gray400} style={styles.emptyIcon} />
        <Text style={styles.emptyStateTitle}>Không có dữ liệu!</Text>
        <Text style={styles.emptyStateDesc}>Không có phòng nào để "Thanh lý (Trả phòng)"</Text>
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

  filterTabs: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    paddingTop: 12,
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    zIndex: 1,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    position: 'relative',
    height: 36,
    overflow: 'visible',
  },
  filterTabActive: {
    backgroundColor: '#8BC34A', // Light green
  },
  filterTabInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterTextActive: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  filterTextInactive: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  tabBadgeOrange: {
    position: 'absolute',
    top: -6,
    right: -4,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },

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
