/**
 * ExpiringRoomsScreen - Màn hình thống kê phòng sắp kết thúc hợp đồng
 * Dùng cho: Theo dõi danh sách phòng có hợp đồng sắp hết hạn để chuẩn bị ký mới hoặc thu hồi phòng
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

export default function ExpiringRoomsScreen() {
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
      <Text style={styles.headerTitle}>Thống kê phòng sắp kết thúc hợp đồng</Text>
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
          Sắp kết thúc hợp đồng
        </Text>
      </Text>
    </View>
  );

  const RoomCardRenting = ({ title }: { title: string }) => (
    <View style={[styles.card, { borderLeftColor: "#FF9800" }]}>
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
          <Text style={styles.detailValue}>18/04/2026 - Sắp hết hạn</Text>
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
              <View style={[styles.dot, { backgroundColor: "#FF9800" }]} />
              <Text style={styles.statusText}>Sắp kết thúc hợp đồng</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: "#FF9800" }]} />
              <Text style={styles.statusText}>Chưa gia hạn</Text>
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
        <RoomCardRenting title="Phòng 1" />
        <RoomCardRenting title="Phòng 2" />
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
});
