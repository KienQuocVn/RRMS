/**
 * AvailableRoomsScreen - Màn hình thống kê phòng có thể cho thuê
 * Dùng cho: Quản lý danh sách phòng đang trống hoặc sắp trống có thể đưa ra thị trường cho thuê
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useRouter } from "expo-router";
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

export default function AvailableRoomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      <Text style={styles.headerTitle}>Thống kê phòng có thể cho thuê</Text>
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
        { backgroundColor: "#FFF3E0", borderColor: "#FFB74D" },
      ]}
    >
      <Ionicons
        name="warning"
        size={24}
        color="#F57C00"
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.alertText, { color: "#F57C00" }]}>
        Thống kê danh sách phòng hiện tại{" "}
        <Text style={{ fontWeight: "bold" }}>
          Đang trống - Báo kết thúc - Báo kết thúc & có cọc giữ chỗ
        </Text>
      </Text>
    </View>
  );

  const EmptyActions = () => (
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
    <View style={[styles.card, { borderLeftColor: "#FF9800" }]}>
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
        </View>
        <EmptyActions />
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
        <RoomCardEmpty title="Phòng 1" status2="Chưa thể thu tiền" />
        <RoomCardEmpty title="Phòng 2" status2="Chưa thể thu tiền" />
        <RoomCardEmpty title="Phòng 3" status2="Chờ kỳ thu tới" />
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
});
