import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useLocalSearchParams, useRouter } from "expo-router";
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

type StatType =
  | "available"
  | "empty"
  | "renting"
  | "expiring"
  | "reported_leaving"
  | "overdue"
  | "debt"
  | "deposited";

const STAT_CONFIGS: Record<
  StatType,
  {
    title: string;
    alertBg: string;
    alertBorder: string;
    alertText: string;
    alertIcon: any;
    alertIconColor: string;
    cardLeftBorder: string;
  }
> = {
  available: {
    title: "Thống kê phòng có thể cho thuê",
    alertBg: "#FFF3E0",
    alertBorder: "#FFB74D",
    alertText:
      "Thống kê danh sách phòng hiện tại Đang trống - Báo kết thúc - Báo kết thúc & có cọc giữ chỗ",
    alertIcon: "warning",
    alertIconColor: "#F57C00",
    cardLeftBorder: "#FF9800",
  },
  empty: {
    title: "Thống kê phòng đang trống",
    alertBg: "#FFF3E0",
    alertBorder: "#FFB74D",
    alertText: "Thống kê danh sách phòng hiện tại Đang trống",
    alertIcon: "warning",
    alertIconColor: "#F57C00",
    cardLeftBorder: "#FF9800",
  },
  renting: {
    title: "Thống kê phòng đang ở",
    alertBg: "#E8F5E9",
    alertBorder: "#81C784",
    alertText: "Thống kê danh sách phòng hiện tại Đang ở",
    alertIcon: "checkmark-circle",
    alertIconColor: Colors.success,
    cardLeftBorder: Colors.success,
  },
  expiring: {
    title: "Thống kê phòng sắp kết thúc hợp đồng",
    alertBg: "#FFF3E0",
    alertBorder: "#FFB74D",
    alertText: "Thống kê danh sách phòng hiện tại Sắp kết thúc hợp đồng",
    alertIcon: "warning",
    alertIconColor: "#F57C00",
    cardLeftBorder: "#FF9800",
  },
  reported_leaving: {
    title: "Thống kê phòng báo kết thúc hợp đồng",
    alertBg: "#FFF3E0",
    alertBorder: "#FFB74D",
    alertText:
      "Thống kê danh sách phòng hiện tại Báo kết thúc hợp đồng - Báo kết thúc & có cọc giữ chỗ",
    alertIcon: "warning",
    alertIconColor: "#F57C00",
    cardLeftBorder: "#FF9800",
  },
  overdue: {
    title: "Thống kê phòng quá hạn hợp đồng",
    alertBg: "#FFEBEE",
    alertBorder: "#E57373",
    alertText: "Thống kê danh sách phòng hiện tại Quá hạn hợp đồng",
    alertIcon: "warning",
    alertIconColor: "#F44336",
    cardLeftBorder: "#F44336",
  },
  debt: {
    title: "Thống kê phòng đang nợ tiền",
    alertBg: "#FFEBEE",
    alertBorder: "#E57373",
    alertText: "Thống kê danh sách phòng hiện tại Đang nợ tiền",
    alertIcon: "warning",
    alertIconColor: "#F44336",
    cardLeftBorder: "#F44336",
  },
  deposited: {
    title: "Thống kê phòng đang cọc giữ chỗ",
    alertBg: "#E0F7FA",
    alertBorder: "#4DD0E1",
    alertText: "Thống kê danh sách phòng hiện tại Đang cọc giữ chỗ",
    alertIcon: "information-circle",
    alertIconColor: "#00BCD4",
    cardLeftBorder: "#00BCD4",
  },
};

export default function RoomStatsScreen() {
  const { type } = useLocalSearchParams<{ type: StatType }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentType = type || "available";
  const config = STAT_CONFIGS[currentType];

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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{config.title}</Text>
    </View>
  );

  const Tabs = () => (
    <View style={styles.tabsContainer}>
      <View style={styles.tabActive}>
        <Text style={styles.tabTextActive}>Tầng trệt</Text>
      </View>
      <View style={styles.tabBorder} />
    </View>
  );

  const AlertBanner = () => (
    <View
      style={[
        styles.alertBanner,
        { backgroundColor: config.alertBg, borderColor: config.alertBorder },
      ]}
    >
      <Ionicons
        name={config.alertIcon}
        size={24}
        color={config.alertIconColor}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.alertText, { color: config.alertIconColor }]}>
        {config.alertText
          .split(
            currentType === "renting"
              ? "Đang ở"
              : currentType === "available"
                ? "Đang trống - Báo kết thúc - Báo kết thúc & có cọc giữ chỗ"
                : currentType === "empty"
                  ? "Đang trống"
                  : currentType === "reported_leaving"
                    ? "Báo kết thúc hợp đồng - Báo kết thúc & có cọc giữ chỗ"
                    : "...",
          )
          .map((part, index, array) => {
            if (index === array.length - 1) return part;
            let highlight = "";
            if (currentType === "renting") highlight = "Đang ở";
            else if (currentType === "available")
              highlight =
                "Đang trống - Báo kết thúc - Báo kết thúc & có cọc giữ chỗ";
            else if (currentType === "empty") highlight = "Đang trống";
            else if (currentType === "reported_leaving")
              highlight =
                "Báo kết thúc hợp đồng - Báo kết thúc & có cọc giữ chỗ";

            return (
              <React.Fragment key={index}>
                {part}
                <Text style={{ fontWeight: "bold" }}>{highlight}</Text>
              </React.Fragment>
            );
          })}
      </Text>
    </View>
  );

  const EmptyRentingActions = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
        <View style={[styles.btnDot, { backgroundColor: "#00BCD4" }]} />
        <Text style={[styles.actionBtnText, { color: Colors.success }]}>
          Lập phòng
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, { marginLeft: 8 }]}
        activeOpacity={0.7}
      >
        <View style={[styles.btnDot, { backgroundColor: "#F44336" }]} />
        <Text style={[styles.actionBtnText, { color: Colors.success }]}>
          Đăng tin
        </Text>
      </TouchableOpacity>
    </View>
  );

  const RoomCardEmpty = ({
    title,
    status2,
  }: {
    title: string;
    status2: string;
  }) => (
    <View style={[styles.card, { borderLeftColor: config.cardLeftBorder }]}>
      <View style={styles.cardHeader}>
        <View style={styles.roomIconBox}>
          <Ionicons name="storefront" size={20} color={Colors.gray700} />
        </View>
        <Text style={styles.roomTitle}>{title}</Text>
        <TouchableOpacity style={styles.dotsBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.statusBoxWrap}>
        <View style={styles.statusBox}>
          <View style={styles.statusBoxHeader}>
            <Ionicons
              name="pricetag-outline"
              size={14}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.statusBoxTitle}>Trạng thái</Text>
          </View>
          <View style={styles.statusList}>
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: "#FF9800" }]} />
              <Text style={styles.statusText}>Đang trống</Text>
            </View>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      status2 === "Chờ kỳ thu tới" ? "#8BC34A" : "#FF9800",
                  },
                ]}
              />
              <Text style={styles.statusText}>{status2}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.priceRow}>
          <View style={styles.priceCol}>
            <View style={styles.priceLabelRow}>
              <Ionicons
                name="cash"
                size={12}
                color={Colors.success}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.priceLabel}>Giá thuê</Text>
            </View>
            <Text style={styles.priceValue}>3.000.000 đ</Text>
          </View>
          {currentType === "available" && (
            <View style={[styles.priceCol, { marginLeft: 16 }]}>
              <View style={styles.priceLabelRow}>
                <Ionicons
                  name="cash"
                  size={12}
                  color={Colors.success}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.priceLabel}>Mức cọc</Text>
              </View>
              <Text style={styles.priceValue}>3.000.000 đ</Text>
            </View>
          )}
        </View>
        <EmptyRentingActions />
      </View>
    </View>
  );

  const RoomCardRenting = ({ title }: { title: string }) => (
    <View style={[styles.card, { borderLeftColor: config.cardLeftBorder }]}>
      <View style={styles.cardHeader}>
        <View style={styles.roomIconBox}>
          <Ionicons name="storefront" size={20} color={Colors.gray700} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.roomTitle}>{title}</Text>
          <View style={styles.tenantInfo}>
            <Ionicons
              name="call-outline"
              size={12}
              color={Colors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.tenantLink}>Test1 - 0919925302</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.dotsBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.detailsList}>
        <View style={styles.detailRow}>
          <View style={styles.detailLeft}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.detailLabel}>Hạn h.đồng</Text>
          </View>
          <Text style={styles.detailValue}>18/04/2026 - Vô thời hạn</Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLeft}>
            <Ionicons
              name="phone-portrait-outline"
              size={14}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.detailLabel}>Sử dụng APP</Text>
          </View>
          <View style={styles.flexRow}>
            <Ionicons
              name="information-circle-outline"
              size={12}
              color="#F57C00"
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.detailValue, { color: "#F57C00" }]}>
              Chưa sử dụng app
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLeft}>
            <Ionicons
              name="pencil-outline"
              size={14}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.detailLabel}>Hợp đồng online</Text>
          </View>
          <View style={styles.flexRow}>
            <Ionicons
              name="close"
              size={12}
              color="#F57C00"
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.detailValue, { color: "#F57C00" }]}>
              Khách chưa ký
            </Text>
          </View>
        </View>

        {currentType === "reported_leaving" && (
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={Colors.textPrimary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.detailLabel}>Báo rời đi</Text>
            </View>
            <Text style={[styles.detailValue, { color: "#F44336" }]}>
              19/04/2026
            </Text>
          </View>
        )}

        <View
          style={[
            styles.detailRow,
            {
              borderBottomWidth: 0,
              paddingBottom: 0,
              alignItems: "flex-start",
            },
          ]}
        >
          <View style={styles.detailLeft}>
            <Ionicons
              name="pricetag-outline"
              size={14}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.detailLabel}>Trạng thái</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 6 }}>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentType === "renting" ? Colors.success : "#FF9800",
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {currentType === "renting"
                  ? "Đang ở"
                  : "Đã báo kết thúc hợp đồng"}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentType === "renting" ? "#8BC34A" : "#FF9800",
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {currentType === "renting" ? "Chờ kỳ thu tới" : "Chưa thu tiền"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={[styles.cardFooter, { paddingVertical: Spacing.sm }]}>
        <View style={styles.priceRow}>
          <View style={styles.priceCol}>
            <View style={styles.priceLabelRow}>
              <Ionicons
                name="cash"
                size={12}
                color={Colors.success}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.priceLabel}>Giá thuê</Text>
            </View>
            <Text style={styles.priceValue}>3.000.000 đ</Text>
          </View>
          <View style={[styles.priceCol, { marginLeft: 16 }]}>
            <View style={styles.priceLabelRow}>
              <Ionicons
                name="cash"
                size={12}
                color={Colors.success}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.priceLabel}>Cọc đã thu</Text>
            </View>
            <Text style={styles.priceValue}>3.000.000 đ</Text>
          </View>
        </View>
        {currentType === "renting" && (
          <View style={styles.priceCol}>
            <View style={styles.priceLabelRow}>
              <Ionicons
                name="person"
                size={12}
                color={Colors.success}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.priceLabel}>Khách ghi nhận</Text>
            </View>
            <Text
              style={[
                styles.priceValue,
                {
                  textAlign: "right",
                  fontWeight: "normal",
                  fontSize: FontSizes.sm,
                },
              ]}
            >
              1/1 người
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Tabs />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <AlertBanner />

        {currentType === "empty" || currentType === "available" ? (
          <>
            <RoomCardEmpty title="Phòng 1" status2="Chưa thể thu tiền" />
            <RoomCardEmpty title="Phòng 2" status2="Chưa thể thu tiền" />
            <RoomCardEmpty title="Phòng 3" status2="Chờ kỳ thu tới" />
          </>
        ) : (
          <>
            <RoomCardRenting title="Phòng 1" />
            <RoomCardRenting title="Phòng 2" />
          </>
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
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    paddingHorizontal: Spacing.base,
  },
  tabActive: {
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: Colors.success,
    marginRight: Spacing.lg,
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
  },
  tabBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.gray200,
    zIndex: -1,
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
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
  },
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
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  dotsBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
  },
  statusBoxWrap: {
    padding: Spacing.base,
    alignItems: "center",
  },
  statusBox: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  statusBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBoxTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statusList: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
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
    fontSize: 11,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  priceRow: {
    flexDirection: "row",
  },
  priceCol: {},
  priceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: "relative",
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: FontWeights.bold,
  },
  btnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
    top: -2,
    right: -2,
  },
  tenantInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  tenantLink: {
    fontSize: 13,
    color: "#2196F3",
    textDecorationLine: "underline",
  },
  detailsList: {
    padding: Spacing.base,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
