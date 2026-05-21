/**
 * RoomsListScreen - Danh sách phòng
 * Dùng cho: Hiển thị danh sách phòng trọ với trạng thái, giá thuê và action buttons
 * Điều hướng từ: ManagementMenu > "Quản lý phòng"
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { RefreshableScrollView } from "@/components/ui/refreshable-scroll-view";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

// ── Interface ──
interface RoomData {
  id: string;
  name: string;
  price: string;
  statusEmpty: boolean;
  statusWaiting: boolean;
}

// ── Mock Data ──
const MOCK_ROOMS: RoomData[] = [
  {
    id: "1",
    name: "Phòng 1",
    price: "3.000.000",
    statusEmpty: true,
    statusWaiting: true,
  },
  {
    id: "2",
    name: "Phòng 2",
    price: "3.000.000",
    statusEmpty: true,
    statusWaiting: true,
  },
  {
    id: "3",
    name: "Phòng 3",
    price: "3.000.000",
    statusEmpty: true,
    statusWaiting: true,
  },
  {
    id: "4",
    name: "Phòng 4",
    price: "3.000.000",
    statusEmpty: true,
    statusWaiting: true,
  },
  {
    id: "5",
    name: "Phòng 5",
    price: "3.000.000",
    statusEmpty: true,
    statusWaiting: true,
  },
];

const FLOORS = ["Tầng trệt", "Tầng 1", "Tầng 2"];

// ── Component ──
export default function RoomsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFloor, setActiveFloor] = useState(0);

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách phòng</Text>
        <TouchableOpacity
          style={styles.filterButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Bộ lọc"
        >
          <Ionicons
            name="filter-outline"
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* ── Floor Tabs ── */}
      <View style={styles.floorTabContainer}>
        <TouchableOpacity style={styles.settingsIcon}>
          <View style={styles.settingsBadge}>
            <Text style={styles.settingsBadgeText}>0</Text>
          </View>
          <Ionicons
            name="settings-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.floorScroll}
        >
          {FLOORS.map((floor, index) => (
            <TouchableOpacity
              key={floor}
              style={[
                styles.floorTab,
                activeFloor === index && styles.floorTabActive,
              ]}
              onPress={() => setActiveFloor(index)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={floor}
            >
              <Text
                style={[
                  styles.floorTabText,
                  activeFloor === index && styles.floorTabTextActive,
                ]}
              >
                {floor}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Room Cards List ── */}
      <RefreshableScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ROOMS.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </RefreshableScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm phòng mới"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

// ── Room Card Sub-Component ──
function RoomCard({ room }: { room: RoomData }) {
  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.roomIconBox}>
          <Ionicons name="storefront" size={18} color={Colors.gray700} />
        </View>
        <Text style={styles.roomTitle}>{room.name}</Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Menu ${room.name}`}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Status Box */}
      <View style={styles.statusBox}>
        <View style={styles.statusBoxHeader}>
          <Ionicons
            name="pricetag-outline"
            size={12}
            color={Colors.textSecondary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.statusBoxTitle}>Trạng thái</Text>
        </View>
        <View style={styles.statusList}>
          {room.statusEmpty && (
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.statusText}>Đang trống</Text>
            </View>
          )}
          {room.statusWaiting && (
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: Colors.success }]} />
              <Text style={styles.statusText}>Chờ kỳ thu tới</Text>
            </View>
          )}
        </View>
      </View>

      {/* Card Footer */}
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
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: Colors.success }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Lập phòng ${room.name}`}
          >
            <View style={[styles.btnBadge, { backgroundColor: "#2196F3" }]} />
            <Text style={[styles.actionBtnText, { color: Colors.success }]}>
              Lập phòng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: Colors.success }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Đăng tin ${room.name}`}
          >
            <View
              style={[styles.btnBadge, { backgroundColor: Colors.error }]}
            />
            <Text style={[styles.actionBtnText, { color: Colors.success }]}>
              Đăng tin
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },

  // Floor tabs
  floorTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsIcon: {
    marginRight: Spacing.md,
    position: "relative",
  },
  settingsBadge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  settingsBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeights.bold,
  },
  floorScroll: {
    flexGrow: 0,
  },
  floorTab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  floorTabActive: {
    borderBottomColor: Colors.success,
  },
  floorTabText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  floorTabTextActive: {
    color: Colors.success,
    fontWeight: FontWeights.bold,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing["4xl"],
    gap: Spacing.base,
  },

  // Room Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  roomIconBox: {
    width: 32,
    height: 32,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
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

  // Status box
  statusBox: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  statusBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statusBoxTitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  statusList: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },

  // Footer
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  actionsBox: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: "relative",
    overflow: "visible",
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

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
});
