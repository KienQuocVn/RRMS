import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { motelService } from "@/services/api/motel.service";
import { roomService } from "@/services/api/room.service";
import { authStorage } from "@/services/storage/auth.storage";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import {
  isDeposited,
  isRenting,
  isExpiring,
  isReportedLeaving,
  isOverdue,
  isDebt,
  isAvailable,
  formatCurrency,
  getCustomerDebt,
  getRoomDeposit,
  getHoldingDeposit,
} from "@/utils/room-status";

export default function OverviewTab() {
  const router = useRouter();
  const user = useAuth((state) => state.user);

  const [activeMotelId, setActiveMotelId] = useState<string>("");
  const [motelName, setMotelName] = useState<string>("Nhà trọ");
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState({
    available: 0,
    availablePercent: 0,
    renting: 0,
    rentingPercent: 0,
    expiring: 0,
    expiringPercent: 0,
    reportedLeaving: 0,
    reportedLeavingPercent: 0,
    overdue: 0,
    overduePercent: 0,
    debt: 0,
    debtPercent: 0,
    deposited: 0,
    depositedPercent: 0,
    connectedContracts: 0,
    customerDebt: 0,
    deposit: 0,
    holdingDeposit: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const token = await authStorage.getToken();
      if (!token && !user) {
        // Chưa đăng nhập: không gọi API được bảo vệ để tránh lỗi 401
        setLoading(false);
        return;
      }

      let targetMotelId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      let currentMotel: any = null;

      // 1. Lấy danh sách nhà trọ và xác định nhà trọ đang active
      try {
        if (user?.username) {
          const res = await motelService.getMotelsByAccount(user.username);
          const list = res.result || [];
          currentMotel = list.find((m: any) => m.motelId === targetMotelId) ?? list[0] ?? null;
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          console.warn("[OverviewTab] Chưa xác thực khi lấy nhà trọ (401)");
        } else {
          console.warn("[OverviewTab] Lỗi lấy danh sách nhà trọ:", err);
        }
      }

      if (currentMotel) {
        setMotelName(currentMotel.name || "Nhà trọ");
        targetMotelId = currentMotel.motelId;
        await safeAsyncStorage.setItem("rrms_active_motel_id", currentMotel.motelId);
      }

      if (targetMotelId) {
        setActiveMotelId(targetMotelId);
      }

      if (!targetMotelId) {
        setTotalRooms(0);
        setLoading(false);
        return;
      }

      // 2. Gọi API backend lấy danh sách phòng của nhà trọ
      let rooms: any[] = [];
      try {
        const roomsResponse = await roomService.getRoomsByMotel(targetMotelId);
        rooms = roomsResponse.result || [];
      } catch (err: any) {
        if (err?.response?.status === 401) {
          console.warn("[OverviewTab] Chưa xác thực khi lấy danh sách phòng (401)");
          setLoading(false);
          return;
        }
        throw err;
      }

      const total = rooms.length;
      setTotalRooms(total);

      const now = Date.now();

      // 3. Đếm số lượng các trạng thái dùng logic chuẩn từ utils/room-status
      const availableCount = rooms.filter(isAvailable).length;
      const rentingCount = rooms.filter(isRenting).length;
      const expiringCount = rooms.filter((r) => isExpiring(r, now)).length;
      const reportedLeavingCount = rooms.filter(isReportedLeaving).length;
      const overdueCount = rooms.filter((r) => isOverdue(r, now)).length;
      const debtCount = rooms.filter(isDebt).length;
      const depositedCount = rooms.filter(isDeposited).length;

      const calcPercent = (count: number) => {
        if (!total) return 0;
        return Math.round((count / total) * 100);
      };

      // 4. Tính toán số tiền nợ và cọc chuẩn hóa
      let totalCustomerDebt = 0;
      let totalDeposit = 0;
      let totalHoldingDeposit = 0;
      let connectedContractsCount = 0;

      rooms.forEach((r: any) => {
        const d = getCustomerDebt(r);
        if (d > 0) totalCustomerDebt += d;

        const dep = getRoomDeposit(r);
        totalDeposit += dep;

        const hold = getHoldingDeposit(r);
        totalHoldingDeposit += hold;

        if (r.latestContract && r.latestContract.status !== "ENDED") {
          connectedContractsCount += 1;
        }
      });

      setStats({
        available: availableCount,
        availablePercent: calcPercent(availableCount),
        renting: rentingCount,
        rentingPercent: calcPercent(rentingCount),
        expiring: expiringCount,
        expiringPercent: calcPercent(expiringCount),
        reportedLeaving: reportedLeavingCount,
        reportedLeavingPercent: calcPercent(reportedLeavingCount),
        overdue: overdueCount,
        overduePercent: calcPercent(overdueCount),
        debt: debtCount,
        debtPercent: calcPercent(debtCount),
        deposited: depositedCount,
        depositedPercent: calcPercent(depositedCount),
        connectedContracts: connectedContractsCount,
        customerDebt: totalCustomerDebt,
        deposit: totalDeposit,
        holdingDeposit: totalHoldingDeposit,
      });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.warn("[OverviewTab] Chưa đăng nhập hoặc phiên làm việc hết hạn (401)");
      } else {
        console.error("[OverviewTab] loadData error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <View style={styles.container}>
      {/* Thống kê hiện trạng */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.subtitle}>Thống kê hiện trạng</Text>
          <Text style={styles.subtitle}>Tổng số phòng</Text>
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity>
            <Text style={styles.greenLink}>{motelName}</Text>
            <View style={styles.linkUnderline} />
          </TouchableOpacity>
          <Text style={styles.boldText}>
            {totalRooms} <Text style={styles.normalText}>phòng</Text>
          </Text>
        </View>
      </View>

      {/* Tình trạng phòng */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIndicator} />
        <View>
          <Text style={styles.sectionTitle}>Tình trạng phòng</Text>
          <Text style={styles.sectionSubtitle}>
            Tình trạng phòng đang thuê trong hệ thống
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <RoomStatCard
          icon="cart"
          iconColor={Colors.error}
          title="Số phòng có thể cho thuê"
          count={stats.available}
          percent={stats.availablePercent}
          percentColor={Colors.error}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/room-status/available-rooms",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <RoomStatCard
          icon="cube-outline"
          iconColor={Colors.primary}
          title="Số phòng đang thuê"
          count={stats.renting}
          percent={stats.rentingPercent}
          percentColor={Colors.success}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/room-status/renting-rooms",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <RoomStatCard
          icon="warning"
          iconColor={Colors.warning}
          title="Số phòng sắp kết thúc hợp đồng"
          count={stats.expiring}
          percent={stats.expiringPercent}
          percentColor={Colors.error}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/room-status/expiring-rooms",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <RoomStatCard
          icon="clipboard-list"
          iconColor={Colors.warning}
          title="Số phòng báo kết thúc hợp đồng"
          count={stats.reportedLeaving}
          percent={stats.reportedLeavingPercent}
          percentColor={Colors.error}
          iconType="material"
          onPress={() =>
            router.push({
              pathname: "/tab-overview/room-status/reported-leaving-rooms",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <RoomStatCard
          icon="time"
          iconColor={Colors.textPrimary}
          title="Số phòng quá hạn hợp đồng"
          count={stats.overdue}
          percent={stats.overduePercent}
          percentColor={Colors.error}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/room-status/overdue-rooms",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <RoomStatCard
          icon="logo-usd"
          iconColor={Colors.success}
          title="Số phòng đang nợ tiền"
          count={stats.debt}
          percent={stats.debtPercent}
          percentColor={Colors.error}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/room-status/debt-rooms",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <RoomStatCard
          icon="anchor"
          iconColor="#5B7E91"
          title="Số phòng đang cọc giữ chỗ"
          count={stats.deposited}
          percent={stats.depositedPercent}
          percentColor={Colors.success}
          iconType="material"
          onPress={() =>
            router.push({
              pathname: "/tab-overview/room-status/deposited-rooms",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
      </View>

      {/* Banner */}
      <TouchableOpacity style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>
            Có <Text style={styles.bannerHighlight}>{stats.connectedContracts} hợp đồng</Text> đang kết
            nối
          </Text>
          <Text style={styles.bannerDesc}>
            Báo hóa đơn tự động, thanh toán tự động, nhập thông tin online...
          </Text>
          <View style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>
              Giảm 10% phí khi trên 50% kết nối
            </Text>
          </View>
        </View>
        <Ionicons
          name="bag-handle"
          size={60}
          color={Colors.error}
          style={styles.bannerIcon}
        />
      </TouchableOpacity>

      {/* Thống kê tài chính */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIndicator} />
        <View>
          <Text style={styles.sectionTitle}>Thống kê tài chính</Text>
          <Text style={styles.sectionSubtitle}>
            Thống kê các loại tiền bạn đang quản lý
          </Text>
        </View>
      </View>

      <View style={styles.financeList}>
        <FinanceCard
          icon="logo-usd"
          iconColor={Colors.error}
          title="Số tiền khách nợ"
          subtitle="Tổng tiền khách thuê đang nợ"
          amount={formatCurrency(stats.customerDebt)}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/financial-statistics/customer-debt",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <FinanceCard
          icon="logo-usd"
          iconColor={Colors.gray400}
          title="Số tiền cọc"
          subtitle="Tổng tiền khách thuê đặt cọc khi ở"
          amount={formatCurrency(stats.deposit)}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/financial-statistics/room-deposit",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
        <FinanceCard
          icon="logo-usd"
          iconColor={Colors.success}
          title="Số tiền khách cọc giữ chỗ"
          subtitle="Tổng tiền khách thuê đang cọc giữ chỗ"
          amount={formatCurrency(stats.holdingDeposit)}
          onPress={() =>
            router.push({
              pathname: "/tab-overview/financial-statistics/holding-deposit",
              params: activeMotelId ? { motelId: activeMotelId } : undefined,
            } as any)
          }
        />
      </View>
    </View>
  );
}

function RoomStatCard({
  icon,
  iconColor,
  title,
  count,
  percent,
  percentColor,
  iconType = "ionicon",
  onPress,
}: any) {
  return (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <View style={styles.statTop}>
        <View style={styles.statDetail}>
          <View style={[styles.iconWrap, { backgroundColor: iconColor }]}>
            {iconType === "material" ? (
              <MaterialCommunityIcons
                name={icon}
                size={20}
                color={Colors.white}
              />
            ) : (
              <Ionicons name={icon} size={20} color={Colors.white} />
            )}
          </View>
          <Text style={styles.statCount}>{count}</Text>
          <View
            style={[
              styles.percentBadge,
              { backgroundColor: percentColor + "15" },
            ]}
          >
            <Text style={[styles.percentText, { color: percentColor }]}>
              {percent}%
            </Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.textSecondary}
        />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

function FinanceCard({
  icon,
  iconColor,
  title,
  subtitle,
  amount,
  onPress,
}: any) {
  return (
    <TouchableOpacity style={styles.financeCard} onPress={onPress}>
      <View style={[styles.financeIconWrap, { backgroundColor: iconColor }]}>
        <Ionicons name={icon} size={24} color={Colors.white} />
      </View>
      <View style={styles.financeInfo}>
        <Text style={styles.financeTitle}>{title}</Text>
        <Text style={styles.financeSubtitle}>{subtitle}</Text>
        <Text style={styles.financeAmount}>{amount}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    backgroundColor: "#F7F8FA",
  },
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  greenLink: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  linkUnderline: {
    height: 1,
    backgroundColor: Colors.success,
    marginTop: 2,
  },
  boldText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  normalText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: "48%",
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  statCount: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.xs,
  },
  percentBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  percentText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  statTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bannerContainer: {
    backgroundColor: "#FFF0E6",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#FFD1B3",
    borderStyle: "dashed",
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  bannerContent: {
    flex: 1,
    paddingRight: Spacing.base,
  },
  bannerTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  bannerHighlight: {
    color: Colors.error,
  },
  bannerDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  bannerButton: {
    backgroundColor: Colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  bannerIcon: {
    opacity: 0.8,
  },
  financeList: {
    marginBottom: Spacing.xl,
  },
  financeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  financeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.base,
  },
  financeInfo: {
    flex: 1,
  },
  financeTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  financeSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  financeAmount: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
});
