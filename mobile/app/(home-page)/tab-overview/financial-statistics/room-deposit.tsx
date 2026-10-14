/**
 * RoomDepositScreen - Màn hình thống kê tiền cọc phòng
 * Dùng cho: Thống kê và quản lý các phòng hiện tại đã thu tiền cọc của khách thuê khi đang ở
 * Tuân thủ: CODING_STANDARDS.md
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { authStorage } from "@/services/storage/auth.storage";
import { motelService } from "@/services/api/motel.service";
import { roomService } from "@/services/api/room.service";
import {
  getRoomDeposit,
  formatCurrency,
  formatDisplayDate,
  getTenantInfo,
} from "@/utils/room-status";

export default function RoomDepositScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((state) => state.user);

  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await authStorage.getToken();
      if (!token && !user) {
        setIsLoading(false);
        return;
      }

      let targetMotelId = params.motelId;
      if (!targetMotelId) {
        targetMotelId =
          (await safeAsyncStorage.getItem("rrms_active_motel_id")) || undefined;
      }
      if (!targetMotelId && user?.username) {
        const res = await motelService.getMotelsByAccount(user.username);
        const list = res.result || [];
        if (list.length > 0) {
          targetMotelId = list[0].motelId;
        }
      }

      if (!targetMotelId) {
        setRooms([]);
        setIsLoading(false);
        return;
      }

      const roomsRes = await roomService.getRoomsByMotel(targetMotelId);
      const allRooms = roomsRes.result || [];
      const depositRooms = allRooms.filter((r) => getRoomDeposit(r) > 0);
      setRooms(depositRooms);
    } catch (error) {
      console.error("[RoomDepositScreen] Lỗi tải dữ liệu phòng cọc:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.username, params.motelId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const totalDeposit = useMemo(() => {
    return rooms.reduce((acc, r) => acc + getRoomDeposit(r), 0);
  }, [rooms]);

  const Header = () => (
    <View
      style={[
        styles.header,
        {
          paddingTop:
            Platform.OS === "ios" ? insets.top : insets.top + Spacing.sm,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Quay lại"
      >
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>Thống kê tiền cọc phòng</Text>
        <Text style={styles.headerSubtitle}>
          {rooms.length} phòng • Tổng: {formatCurrency(totalDeposit)}
        </Text>
      </View>
    </View>
  );

  const AlertBanner = () => (
    <View
      style={[
        styles.alertBanner,
        { backgroundColor: "#20a9e722", borderColor: "#81C784" },
      ]}
    >
      <Ionicons
        name="checkmark-circle"
        size={24}
        color={Colors.success}
        style={{ marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.alertText, { color: Colors.success }]}>
          Thống kê danh sách phòng hiện tại{" "}
          <Text style={{ fontWeight: "bold" }}>Đã thu tiền cọc</Text>
        </Text>
        <Text style={styles.alertTotalText}>
          Tổng tiền cọc: <Text style={{ color: Colors.primaryDark, fontWeight: "bold" }}>{formatCurrency(totalDeposit)}</Text>
        </Text>
      </View>
    </View>
  );

  const DepositCardItem = ({ room }: { room: any }) => {
    const deposit = getRoomDeposit(room);
    const tenant = getTenantInfo(room);
    const contract = room.latestContract;

    const dateObj = contract?.moveinDate ? new Date(contract.moveinDate) : new Date();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const dateFormatted = formatDisplayDate(contract?.moveinDate) || "18/04/2026";

    const handleCall = () => {
      if (tenant.phone) {
        Linking.openURL(`tel:${tenant.phone}`).catch(() => {
          Alert.alert("Không thể gọi", `Số điện thoại: ${tenant.phone}`);
        });
      } else {
        Alert.alert("Thông báo", "Phòng này chưa cập nhật số điện thoại khách thuê.");
      }
    };

    return (
      <View style={styles.card}>
        {/* ── Top Info Row ── */}
        <View style={styles.cardHeader}>
          {/* Date Badge */}
          <View style={styles.dateBadge}>
            <View style={styles.dateBadgeTop}>
              <Text style={styles.dateBadgeTopText}>T.{month}</Text>
            </View>
            <View style={styles.dateBadgeBottom}>
              <Text style={styles.dateBadgeBottomText}>{year}</Text>
            </View>
          </View>

          {/* Info Column */}
          <View style={styles.infoCol}>
            <Text style={styles.roomTitle}>
              {room.name} <Text style={styles.dateSubtext}>({dateFormatted})</Text>
            </Text>
            <Text style={styles.descText}>
              {tenant.name} {tenant.phone ? `• ${tenant.phone}` : ""}
            </Text>

            <View style={styles.appStatusRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={Colors.success}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.appStatusText}>Hợp đồng đang hiệu lực</Text>
            </View>

            <View style={styles.tagsRow}>
              <View style={styles.tagBadge}>
                <View style={[styles.dot, { backgroundColor: Colors.success }]} />
                <Text style={styles.tagText}>Đã thu cọc</Text>
              </View>
            </View>
          </View>

          {/* Detail Button */}
          <TouchableOpacity
            style={styles.detailBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              if (room.roomId) {
                router.push({
                  pathname: "/(home-page)/tab-manage/management-menu/rooms/[id]",
                  params: { id: room.roomId },
                } as any);
              }
            }}
          >
            <Text style={styles.detailBtnText}>Chi tiết</Text>
            <Ionicons name="chevron-forward" size={12} color="#2196F3" />
          </TouchableOpacity>
        </View>

        {/* ── Action Buttons Row ── */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionGridBtn, styles.actionCall]}
            onPress={handleCall}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="call"
              size={16}
              color="#2196F3"
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.actionGridText, { color: "#2196F3" }]}>Gọi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionGridBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => {
              Alert.alert("Hoàn cọc", `Lập thủ tục hoàn tiền cọc cho phòng ${room.name}?`);
            }}
          >
            <Ionicons
              name="cash-outline"
              size={16}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionGridText}>Hoàn cọc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionGridBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => {
              Alert.alert("Thu thêm", `Thu thêm tiền cọc cho phòng ${room.name}?`);
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={16}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionGridText}>Thu thêm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionGridBtn, { borderRightWidth: 0 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => {
              Alert.alert("In phiếu cọc", `In biên lai thu tiền cọc phòng ${room.name}`);
            }}
          >
            <Ionicons
              name="print-outline"
              size={16}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionGridText}>In phiếu</Text>
          </TouchableOpacity>
        </View>

        {/* ── Money Summary Row ── */}
        <View style={styles.moneySummary}>
          <View style={[styles.moneyCol, { backgroundColor: "#F9FAFB" }]}>
            <Text style={styles.moneyLabel}>Tiền cọc yêu cầu</Text>
            <Text style={styles.moneyValue}>{formatCurrency(room.price || deposit)}</Text>
          </View>
          <View
            style={[
              styles.moneyCol,
              { backgroundColor: "#20a9e722", marginHorizontal: 8 },
            ]}
          >
            <Text style={styles.moneyLabel}>Đã thu</Text>
            <Text style={[styles.moneyValue, { color: Colors.primaryDark }]}>
              {formatCurrency(deposit)}
            </Text>
          </View>
          <View style={[styles.moneyCol, { backgroundColor: "#FFF3E0" }]}>
            <Text style={styles.moneyLabel}>Còn thiếu</Text>
            <Text style={[styles.moneyValue, { color: "#F57C00" }]}>0 đ</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onRefreshContent={loadData}
      >
        <AlertBanner />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : rooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={48} color={Colors.gray400} />
            <Text style={styles.emptyText}>Chưa có phòng nào đóng tiền cọc</Text>
          </View>
        ) : (
          rooms.map((room) => (
            <DepositCardItem key={room.roomId || room.name} room={room} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing["4xl"],
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  alertText: {
    fontSize: 13,
    lineHeight: 20,
  },
  alertTotalText: {
    fontSize: 13,
    marginTop: 4,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  dateBadge: {
    width: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginRight: Spacing.sm,
  },
  dateBadgeTop: {
    backgroundColor: "#20a9e7",
    paddingVertical: 4,
    alignItems: "center",
  },
  dateBadgeTopText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  dateBadgeBottom: {
    backgroundColor: Colors.white,
    paddingVertical: 4,
    alignItems: "center",
  },
  dateBadgeBottomText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: "500",
  },
  infoCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  roomTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  dateSubtext: {
    fontSize: 13,
    fontWeight: "normal",
    color: Colors.textSecondary,
  },
  descText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  appStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  appStatusText: {
    fontSize: 12,
    color: Colors.success,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailBtnText: {
    color: "#2196F3",
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 2,
  },
  actionGrid: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  actionGridBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    backgroundColor: Colors.white,
  },
  actionCall: {
    backgroundColor: "#F0F8FF",
  },
  actionGridText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  moneySummary: {
    flexDirection: "row",
  },
  moneyCol: {
    flex: 1,
    borderRadius: 6,
    padding: Spacing.sm,
    alignItems: "center",
  },
  moneyLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  moneyValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});
