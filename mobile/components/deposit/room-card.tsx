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
import { DepositRoom } from "@/types/deposit.types";

interface RoomCardProps {
  room: DepositRoom;
  onPress: () => void;
}

export const RoomCard = ({ room, onPress }: RoomCardProps) => {
  const isDeposited = !!room.reservation;

  return (
    <View
      style={[
        styles.card,
        isDeposited ? styles.cardDeposited : styles.cardEmpty,
      ]}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.roomIconBox,
            isDeposited && styles.roomIconBoxDeposited,
          ]}
        >
          <Ionicons
            name="storefront"
            size={20}
            color={isDeposited ? "#FF9800" : Colors.gray700}
          />
        </View>
        <Text style={styles.roomTitle}>{room.name}</Text>
        <TouchableOpacity
          style={styles.arrowBtn}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Ionicons name="chevron-forward" size={16} color={Colors.success} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardDivider} />

      {/* Status Section */}
      <View style={styles.cardBody}>
        {/* Ngày lập hóa đơn */}
        <View style={styles.infoRow}>
          <View style={styles.infoLabelRow}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={Colors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.infoLabel}>Ngày lập hóa đơn</Text>
          </View>
          <View style={styles.dotBadge}>
            <View style={[styles.dot, { backgroundColor: Colors.success }]} />
            <Text style={styles.dotText}>ngày 1</Text>
          </View>
        </View>

        {/* Trạng thái */}
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
            {isDeposited ? (
              <View style={styles.statusBadge}>
                <View style={[styles.dot, { backgroundColor: "#FF9800" }]} />
                <Text style={styles.statusText}>Đang cọc giữ chỗ</Text>
              </View>
            ) : (
              <View style={styles.statusBadge}>
                <View style={[styles.dot, { backgroundColor: "#FF9800" }]} />
                <Text style={styles.statusText}>Đang trống</Text>
              </View>
            )}
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: Colors.success }]} />
              <Text style={styles.statusText}>Chờ kỳ thu tới</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* Footer: Price */}
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
          <Text style={styles.priceValue}>
            {room.price?.toLocaleString("vi-VN") || "0"} đ
          </Text>
        </View>

        {isDeposited ? (
          /* Phòng đang cọc: hiển thị tiền cọc */
          <View style={styles.depositCol}>
            <View style={styles.priceLabelRow}>
              <Ionicons
                name="cash"
                size={14}
                color="#FF9800"
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.priceLabel, { color: "#FF9800" }]}>
                Tiền cọc giữ chỗ
              </Text>
            </View>
            <Text style={styles.depositAmount}>
              {room.reservation?.deposit?.toLocaleString("vi-VN") || "0"} đ
            </Text>
          </View>
        ) : (
          /* Phòng trống: nút hành động */
          <View style={styles.actionsBox}>
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.7}
              onPress={onPress}
            >
              <Text style={styles.actionBtnText}>Đặt cọc</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Thông tin người cọc (chỉ hiển thị nếu đang cọc) */}
      {isDeposited && room.reservation && (
        <>
          <View style={styles.cardDivider} />
          <View style={styles.tenantInfo}>
            <Ionicons
              name="person-outline"
              size={14}
              color={Colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.tenantText}>
              {room.reservation.nameTenant} · {room.reservation.phoneTenant}
            </Text>
            <Text style={styles.tenantMoveIn}>
              Vào: {room.reservation.moveInDate}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    overflow: "hidden",
    ...Shadows.md,
  },
  cardEmpty: {
    borderLeftColor: "#FF9800",
  },
  cardDeposited: {
    borderLeftColor: "#FF9800",
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
    gap: Spacing.sm,
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
    backgroundColor: "#20a9e722",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  roomIconBoxDeposited: {
    backgroundColor: "#FFF3E0",
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
    backgroundColor: "#20a9e722",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Info Row ──
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  dotBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  dotText: {
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
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
  depositCol: {
    alignItems: "flex-end",
  },
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
  depositAmount: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: "#FF9800",
  },

  // ── Action Button ──
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
  },
  actionBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.success,
  },

  // ── Tenant Info ──
  tenantInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: "#FFF8E1",
    gap: 4,
  },
  tenantText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  tenantMoveIn: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
});
