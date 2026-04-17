/**
 * Find Tenants Screen - Tìm khách
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function FindTenantsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.sectionHeaderWrap}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionIndicator} />
            <View>
              <Text style={styles.sectionTitle}>Khách thuê tiềm năng</Text>
              <Text style={styles.sectionSubtitle}>Khách phù hợp với tin của bạn</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.sectionHeaderRight}>
            <Text style={styles.linkText}>Xem tin đăng</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.success} />
          </TouchableOpacity>
        </View>

        {/* List of Tenants */}
        <View style={styles.listContainer}>
          <TenantCard
            name="tuyến"
            isNew={true}
            date="17/04/2026"
            tag="#Yêu cầu mới"
            price="2 tr - 3 tr"
            area="10m2 - 100m2"
            location="Quận Phú Nhuận, Hồ Chí Minh"
          />
          <TenantCard
            name="thạch"
            isNew={true}
            date="17/04/2026"
            tag="#Yêu cầu mới"
            price="3.9 tr - 3.9 tr"
            area="20 m2 - 20 m2"
            location="216 Đội Cấn, Ngọc Hà, Ba Đình, Thành phố Hà Nội"
          />
          <TenantCard
            name="bống"
            isNew={true}
            date="15/05/2026"
            tag="#Yêu cầu mới"
            price="1 tr - 2 tr"
            area="10m2 - 100m2"
            location="Long Biên, Long Biên, Hà Nội"
          />
          <TenantCard
            name="孟星宇"
            isNew={true}
            date="16/04/2026"
            tag="#Yêu cầu mới"
            price="5.5 tr - 5.5 tr"
            area="65 m2 - 65 m2"
            location="124 , Thọ Quang, Sơn Trà, Thành phố Đà Nẵng"
          />
          <TenantCard
            name="kiệt"
            isNew={true}
            date="03/05/2026"
            tag="#Yêu cầu mới"
            price="1.5 tr - 2.5 tr"
            area="15 m2 - 25 m2"
            location="Quận 1, Hồ Chí Minh"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function TenantCard({ name, isNew, date, tag, price, area, location }: any) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={32} color={Colors.success} />
        </View>
        <View style={styles.avatarBadge}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.textSecondary} style={{ backgroundColor: Colors.white, borderRadius: 8 }} />
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>mới</Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textPrimary} style={styles.infoIcon} />
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.tagText}>{tag}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.comma}>, </Text>
          <Text style={styles.area}>{area}</Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} style={styles.infoIcon} />
          <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} style={styles.rightIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIndicator: {
    width: 4,
    height: 24,
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: FontWeights.medium,
    marginRight: 2,
  },
  listContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  avatarWrap: {
    position: 'relative',
    marginRight: Spacing.base,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  cardContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  newBadge: {
    backgroundColor: '#E6F6EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  tagText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.error,
  },
  comma: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  area: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
});
