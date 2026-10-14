/**
 * ExpiringRoomsScreen - Màn hình thống kê phòng sắp kết thúc hợp đồng
 * Dùng cho: Theo dõi danh sách phòng có hợp đồng sắp hết hạn để chuẩn bị ký mới hoặc thu hồi phòng
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
  isExpiring,
  formatCurrency,
  formatDisplayDate,
  getTenantInfo,
  extractUniqueFloors,
} from "@/utils/room-status";

export default function ExpiringRoomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((state) => state.user);

  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFloor, setActiveFloor] = useState<string>("Tất cả");

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
      const now = Date.now();
      const matched = allRooms.filter((r) => isExpiring(r, now));
      setRooms(matched);
    } catch (error) {
      console.error("[ExpiringRoomsScreen] Lỗi tải dữ liệu phòng:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.username, params.motelId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const floors = useMemo(() => extractUniqueFloors(rooms), [rooms]);

  const displayedRooms = useMemo(() => {
    if (activeFloor === "Tất cả") return rooms;
    return rooms.filter((r) => (r.group?.trim() || "Tầng trệt") === activeFloor);
  }, [rooms, activeFloor]);

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
      <Text style={styles.headerTitle}>
        Thống kê phòng sắp kết thúc hợp đồng ({rooms.length})
      </Text>
    </View>
  );

  const Tabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {floors.map((floor) => {
          const isActive = activeFloor === floor;
          return (
            <TouchableOpacity
              key={floor}
              style={[styles.tabItem, isActive && styles.tabActive]}
              onPress={() => setActiveFloor(floor)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={floor}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {floor}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
        <Text style={{ fontWeight: "bold" }}>Sắp kết thúc hợp đồng</Text>
      </Text>
    </View>
  );

  const RoomCardExpiring = ({ room }: { room: any }) => {
    const tenant = getTenantInfo(room);
    const contract = room.latestContract;
    const closeStr = contract?.closeContract
      ? formatDisplayDate(contract.closeContract)
      : "18/04/2026";

    return (
      <View style={[styles.card, { borderLeftColor: "#FF9800" }]}>
        <View style={styles.cardHeader}>
          <View style={styles.roomIconBox}>
            <Ionicons name="storefront" size={20} color={Colors.gray700} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.roomTitle}>{room.name}</Text>
            <View style={styles.tenantInfo}>
              <Ionicons
                name="call-outline"
                size={12}
                color={Colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.tenantLink}>
                {tenant.name}
                {tenant.phone ? ` - ${tenant.phone}` : ""}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.dotsBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={`Tùy chọn ${room.name}`}
            onPress={() => {
              if (room.roomId) {
                router.push({
                  pathname: "/(home-page)/tab-manage/management-menu/rooms/[id]",
                  params: { id: room.roomId },
                } as any);
              }
            }}
          >
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
            <Text style={styles.detailValue}>{closeStr} - Sắp hết hạn</Text>
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
              <Text style={styles.priceValue}>
                {formatCurrency(room.price || contract?.price || 0)}
              </Text>
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
              <Text style={styles.priceValue}>
                {formatCurrency(room.deposit || contract?.deposit || 0)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <Tabs />
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
        ) : displayedRooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bed-outline" size={48} color={Colors.gray400} />
            <Text style={styles.emptyText}>
              Không có phòng nào sắp kết thúc hợp đồng
            </Text>
          </View>
        ) : (
          displayedRooms.map((room) => (
            <RoomCardExpiring key={room.roomId || room.name} room={room} />
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
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    paddingHorizontal: Spacing.base,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.xs,
    marginRight: Spacing.lg,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: Colors.success,
  },
  tabText: {
    fontSize: FontSizes.sm,
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
  },
  tabTextInactive: {
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
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
    backgroundColor: "#20a9e722",
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
