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

interface ContractRoomCardProps {
  room: DepositRoom;
  onPress: () => void;
}

export const ContractRoomCard = ({ room, onPress }: ContractRoomCardProps) => {
  const isDeposited = !!room.reservation;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isDeposited ? styles.cardDeposited : styles.cardEmpty,
      ]}
      activeOpacity={0.88}
      onPress={onPress}
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
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* Footer */}
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
            {room.price ? Number(room.price).toLocaleString("vi-VN") : "0"} đ
          </Text>
        </View>

        {isDeposited && (
          <View style={styles.depositCol}>
            <View style={styles.priceLabelRow}>
              <Ionicons
                name="cash"
                size={14}
                color="#FF9800"
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.priceLabel, { color: "#FF9800" }]}>
                Cọc giữ chỗ
              </Text>
            </View>
            <Text style={styles.depositAmount}>
              {room.reservation?.deposit
                ? Number(room.reservation.deposit).toLocaleString("vi-VN")
                : "0"}{" "}
              đ
            </Text>
          </View>
        )}

        <View style={styles.actionsBox}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: Colors.success }]}
            activeOpacity={0.7}
            onPress={onPress}
          >
            <View style={[styles.btnBadge, { backgroundColor: "#2196F3" }]} />
            <Text style={[styles.actionBtnText, { color: Colors.success }]}>
              Lập hợp đồng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  cardEmpty: {
    borderLeftColor: "#FF5722",
  },
  cardDeposited: {
    borderLeftColor: "#FF9800",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  roomIconBox: {
    width: 34,
    height: 34,
    backgroundColor: "#20a9e722",
    borderRadius: 8,
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
  cardDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  cardBody: {
    gap: Spacing.sm,
  },
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dotText: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  statusBox: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  statusBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusBoxTitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  statusList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
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
  depositCol: {},
  depositAmount: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: "#FF9800",
  },
  actionsBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: "relative",
  },
  actionBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  btnBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: -2,
    right: 2,
  },
});
