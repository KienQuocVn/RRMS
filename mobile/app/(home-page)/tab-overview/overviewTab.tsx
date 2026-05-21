import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/theme";

export default function OverviewTab() {
  const router = useRouter();
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
            <Text style={styles.greenLink}>Nhà trọ Quoc</Text>
            <View style={styles.linkUnderline} />
          </TouchableOpacity>
          <Text style={styles.boldText}>
            5 <Text style={styles.normalText}>phòng</Text>
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
          count={0}
          percent={0}
          percentColor={Colors.error}
          onPress={() =>
            router.push("/tab-overview/room-status/available-rooms")
          }
        />
        <RoomStatCard
          icon="cube"
          iconColor={Colors.error}
          title="Số phòng đang trống"
          count={5}
          percent={100}
          percentColor={Colors.error}
          onPress={() =>
            router.push("/tab-overview/room-status/empty-rooms")
          }
        />
        <RoomStatCard
          icon="cube-outline"
          iconColor={Colors.primary}
          title="Số phòng đang thuê"
          count={0}
          percent={0}
          percentColor={Colors.success}
          onPress={() =>
            router.push("/tab-overview/room-status/renting-rooms")
          }
        />
        <RoomStatCard
          icon="warning"
          iconColor={Colors.warning}
          title="Số phòng sắp kết thúc hợp đồng"
          count={0}
          percent={0}
          percentColor={Colors.error}
          onPress={() =>
            router.push("/tab-overview/room-status/expiring-rooms")
          }
        />
        <RoomStatCard
          icon="clipboard-list"
          iconColor={Colors.warning}
          title="Số phòng báo kết thúc hợp đồng"
          count={0}
          percent={0}
          percentColor={Colors.error}
          iconType="material"
          onPress={() =>
            router.push("/tab-overview/room-status/reported-leaving-rooms")
          }
        />
        <RoomStatCard
          icon="time"
          iconColor={Colors.textPrimary}
          title="Số phòng quá hạn hợp đồng"
          count={0}
          percent={0}
          percentColor={Colors.error}
          onPress={() =>
            router.push("/tab-overview/room-status/overdue-rooms")
          }
        />
        <RoomStatCard
          icon="logo-usd"
          iconColor={Colors.success}
          title="Số phòng đang nợ tiền"
          count={0}
          percent={0}
          percentColor={Colors.error}
          onPress={() =>
            router.push("/tab-overview/room-status/debt-rooms")
          }
        />
        <RoomStatCard
          icon="anchor"
          iconColor="#5B7E91"
          title="Số phòng đang cọc giữ chỗ"
          count={0}
          percent={0}
          percentColor={Colors.success}
          iconType="material"
          onPress={() =>
            router.push("/tab-overview/room-status/deposited-rooms")
          }
        />
      </View>

      {/* Banner */}
      <TouchableOpacity style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>
            Có <Text style={styles.bannerHighlight}>0 hợp đồng</Text> đang kết
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
          amount="0 đ"
          onPress={() =>
            router.push("/tab-overview/financial-statistics/customer-debt")
          }
        />
        <FinanceCard
          icon="logo-usd"
          iconColor={Colors.gray400}
          title="Số tiền cọc"
          subtitle="Tổng tiền khách thuê đặt cọc khi ở"
          amount="0 đ"
          onPress={() =>
            router.push("/tab-overview/financial-statistics/room-deposit")
          }
        />
        <FinanceCard
          icon="logo-usd"
          iconColor={Colors.success}
          title="Số tiền khách cọc giữ chỗ"
          subtitle="Tổng tiền khách thuê đang cọc giữ chỗ"
          amount="0 đ"
          onPress={() =>
            router.push("/tab-overview/financial-statistics/holding-deposit")
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
