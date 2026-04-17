/**
 * RentalPost - "Đăng tin cho thuê"
 * Banner quảng cáo với 2 buttons: Lắp phòng trống, Tin đăng
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface RentalPostProps {
  onFillRoomPress?: () => void;
  onPostPress?: () => void;
}

export default function RentalPost({ onFillRoomPress, onPostPress }: RentalPostProps) {
  return (
    <View style={styles.container}>
      {/* Banner card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={[styles.iconWrap, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="home-outline" size={32} color={Colors.primary} />
            <View style={styles.postIndicator}>
              <Ionicons name="arrow-up-outline" size={14} color={Colors.white} />
            </View>
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.cardTitle}>Đăng tin cho thuê</Text>
            <Text style={styles.cardDescription}>
              Hơn <Text style={styles.highlight}>10.000+</Text> khách thuê tiềm năng trên hệ thống RRMS
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineBtn} onPress={onFillRoomPress}>
            <Ionicons name="cart-outline" size={16} color={Colors.primary} />
            <Text style={styles.outlineBtnText}>Lắp phòng trống</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledBtn} onPress={onPostPress}>
            <Ionicons name="share-outline" size={16} color={Colors.white} />
            <Text style={styles.filledBtnText}>Tin đăng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  postIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  highlight: {
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
  },
  outlineBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Colors.primary,
  },
  filledBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  filledBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
  },
});
