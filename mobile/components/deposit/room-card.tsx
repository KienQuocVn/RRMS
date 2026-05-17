import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { Room } from "@/types/deposit.types";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => (
  <View style={styles.card}>
    {/* Card Header */}
    <View style={styles.cardHeader}>
      <View style={styles.roomIconBox}>
        <Ionicons name="storefront" size={20} color={Colors.gray700} />
      </View>
      <Text style={styles.roomTitle}>{room.title}</Text>
      <TouchableOpacity style={styles.arrowBtn} activeOpacity={0.7}>
        <Ionicons name="chevron-forward" size={16} color={Colors.success} />
      </TouchableOpacity>
    </View>

    <View style={styles.cardDivider} />

    {/* Status Section */}
    <View style={styles.cardBody}>
      <View style={styles.statusBox}>
        <View style={styles.statusBoxHeader}>
          <Ionicons
            name="pricetag-outline"
            size={13}
            color={Colors.textSecondary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.statusBoxTitle}>Trạng thái</Text>
        </View>
        <View style={styles.statusList}>
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: "#FF9800" }]} />
            <Text style={styles.statusText}>Đang trống</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: Colors.success }]} />
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
          <Ionicons
            name="cash"
            size={14}
            color={Colors.success}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.priceLabel}>Giá thuê</Text>
        </View>
        <Text style={styles.priceValue}>{room.price} đ</Text>
      </View>
      <View style={styles.actionsBox}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <View style={[styles.btnDot, { backgroundColor: "#2196F3" }]} />
          <Text style={styles.actionBtnText}>Lập phòng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <View style={[styles.btnDot, { backgroundColor: "#F44336" }]} />
          <Text style={styles.actionBtnText}>Đăng tin</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    overflow: "hidden",
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },

  // ── Room Icon ──
  roomIconBox: {
    width: 36,
    height: 36,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Status Box ──
  statusBox: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    alignItems: "center",
  },
  statusBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusBoxTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statusList: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionBtn: {
    borderWidth: 1.5,
    borderColor: Colors.success,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    position: "relative",
  },
  actionBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.success,
  },
  btnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: -3,
    right: -1,
  },
});
