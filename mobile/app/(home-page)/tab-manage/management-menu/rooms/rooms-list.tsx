/**
 * RoomsListScreen - Danh sách phòng
 * Dùng cho: Hiển thị danh sách phòng trọ với trạng thái, giá thuê và action buttons
 * Điều hướng từ: ManagementMenu > "Quản lý phòng"
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RefreshableScrollView } from "@/components/ui/refreshable-scroll-view";
import { useAuth } from "@/hooks/use-auth";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { motelService } from "@/services/api/motel.service";
import { roomService } from "@/services/api/room.service";
import { RoomResponse2 } from "@/types/room.types";
import { MotelResponse } from "@/types/motel.types";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

// ── Component ──
export default function RoomsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [rooms, setRooms] = useState<RoomResponse2[]>([]);
  const [activeFloor, setActiveFloor] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse2 | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(600)).current;

  const handleOpenBottomSheet = (room: RoomResponse2) => {
    setSelectedRoom(room);
    setIsBottomSheetVisible(true);
    slideAnim.setValue(600);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 600,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsBottomSheetVisible(false);
    });
  };

  // const resolveCurrentMotel = (motels: MotelResponse[], motelIdParam?: string) => {
  //   if (motelIdParam) {
  //     return (
  //       motels.find((motel) => motel.motelId === motelIdParam) ??
  //       motels[0] ??
  //       null
  //     );
  //   }
  //   return motels[0] ?? null;
  // };

  const loadData = useCallback(async () => {
    if (!user?.username) {
      setActiveMotel(null);
      setRooms([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const motelsResponse = await motelService.getMotelsByAccount(user.username);
      const list = motelsResponse.result || [];

      // Ưu tiên: 1. Params truyền vào -> 2. Storage đang active -> 3. Motel đầu tiên
      const storedMotelId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const targetMotelId = params.motelId || storedMotelId;
      
      const currentMotel = list.find((m) => m.motelId === targetMotelId) ?? list[0] ?? null;

      if (!currentMotel) {
        setActiveMotel(null);
        setRooms([]);
        setIsLoading(false);
        return;
      }

      setActiveMotel(currentMotel);
      // Lưu lại vào storage để đồng bộ
      await safeAsyncStorage.setItem("rrms_active_motel_id", currentMotel.motelId);

      const roomsResponse = await roomService.getRoomsByMotel(currentMotel.motelId);
      setRooms(roomsResponse.result || []);
    } catch (error: any) {
      console.error("[RoomsList] loadData error:", error);
      Alert.alert(
        "Lỗi tải dữ liệu",
        error?.response?.data?.message || "Không thể kết nối đến máy chủ."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.username, params.motelId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sinh động danh sách tầng từ dữ liệu phòng thực tế
  const uniqueFloors = useMemo(() => {
    if (rooms.length === 0) {
      return ["Tầng trệt", "Tầng 1", "Tầng 2"];
    }
    const groups = rooms.map((r) => r.group?.trim() || "Tầng trệt");
    const unique = Array.from(new Set(groups));
    
    // Sắp xếp tầng thông minh (Trệt -> 1 -> 2 -> ...)
    return unique.sort((a, b) => {
      const getOrder = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("trệt") || lower.includes("tret")) return 0;
        const num = parseInt(lower.replace(/\D/g, ""), 10);
        return isNaN(num) ? 999 : num;
      };
      return getOrder(a) - getOrder(b);
    });
  }, [rooms]);

  // Lấy tầng đang chọn
  const activeFloorName = useMemo(() => {
    return uniqueFloors[activeFloor] || uniqueFloors[0] || "Tầng trệt";
  }, [uniqueFloors, activeFloor]);

  // Lọc phòng theo tầng đang chọn
  const filteredRooms = useMemo(() => {
    return rooms.filter(
      (room) => (room.group?.trim() || "Tầng trệt") === activeFloorName
    );
  }, [rooms, activeFloorName]);

  // Reset tab activeFloor về 0 nếu uniqueFloors thay đổi mà activeFloor vượt quá độ dài
  useEffect(() => {
    if (activeFloor >= uniqueFloors.length) {
      setActiveFloor(0);
    }
  }, [uniqueFloors.length, activeFloor]);

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
        <Text style={styles.headerTitle}>
          {activeMotel ? `Danh sách phòng - ${activeMotel.motelName}` : "Danh sách phòng"}
        </Text>
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
            <Text style={styles.settingsBadgeText}>{rooms.length}</Text>
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
          {uniqueFloors.map((floor, index) => (
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : (
        <RefreshableScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onRefreshContent={loadData}
        >
          {filteredRooms.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bed-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Không có phòng nào ở tầng này</Text>
            </View>
          ) : (
            filteredRooms.map((room) => (
              <RoomCard 
                key={room.roomId} 
                room={room} 
                onPressMenu={() => handleOpenBottomSheet(room)}
              />
            ))
          )}
        </RefreshableScrollView>
      )}

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm phòng mới"
        onPress={() => {
          if (activeMotel) {
            router.push({
              pathname: "/tab-manage/management-menu/motel-settings/add-room",
              params: { motelId: activeMotel.motelId }
            } as any);
          }
        }}
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>

      {/* ── Bottom Sheet Modal ── */}
      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseBottomSheet}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseBottomSheet}
        >
          <Animated.View 
            style={[
              styles.bottomSheetContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TouchableOpacity activeOpacity={1} style={{ width: "100%" }}>
              <View style={styles.dragHandle} />
              
              {selectedRoom && (
                (() => {
                  const isAvailable = selectedRoom.status === true || String(selectedRoom.status).toLowerCase() === 'available';
                  const isOccupied = selectedRoom.status === false || String(selectedRoom.status).toLowerCase() === 'occupied';
                  
                  if (isOccupied) {
                    return (
                      <View style={styles.bannerOccupied}>
                        <Ionicons name="information-circle-outline" size={20} color="#2b7ed7" style={{ marginRight: Spacing.sm }} />
                        <Text style={styles.bannerOccupiedText}>
                          Phòng {selectedRoom.name}: Trạng thái &quot;Đang ở&quot;
                        </Text>
                      </View>
                    );
                  } else if (isAvailable) {
                    return (
                      <View style={styles.bannerAvailable}>
                        <Ionicons name="warning-outline" size={20} color="#FF9800" style={{ marginRight: Spacing.sm }} />
                        <Text style={styles.bannerAvailableText}>
                          Phòng {selectedRoom.name}: Trạng thái &quot;Đang trống&quot;
                        </Text>
                      </View>
                    );
                  } else {
                    return (
                      <View style={styles.bannerOther}>
                        <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} style={{ marginRight: Spacing.sm }} />
                        <Text style={styles.bannerOtherText}>
                          Phòng {selectedRoom.name}: Trạng thái &quot;{String(selectedRoom.status).toLowerCase() === 'maintenance' ? 'Đang sửa chữa' : 'Đã đặt cọc'}&quot;
                        </Text>
                      </View>
                    );
                  }
                })()
              )}

              <ScrollView showsVerticalScrollIndicator={false} style={styles.optionsContainer}>
                {selectedRoom && (
                  (() => {
                    const isOccupied = selectedRoom.status === false || String(selectedRoom.status).toLowerCase() === 'occupied';
                    
                    const renderMenuItem = (
                      icon: keyof typeof Ionicons.glyphMap, 
                      title: string, 
                      subtext?: string, 
                      onPress?: () => void
                    ) => (
                      <TouchableOpacity key={title} style={styles.menuItem} onPress={onPress}>
                        <View style={styles.menuItemLeft}>
                          <Ionicons name={icon} size={20} color={Colors.textPrimary} style={{ marginRight: Spacing.md }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.menuItemTitle}>{title}</Text>
                            {subtext ? <Text style={styles.menuItemSubtext}>{subtext}</Text> : null}
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
                      </TouchableOpacity>
                    );

                    const handleFeatureNotImplemented = (featureName: string) => {
                      handleCloseBottomSheet();
                      Alert.alert("Chức năng đang phát triển", `Tính năng "${featureName}" đang được hoàn thiện.`);
                    };

                    const navigateTo = (path: string, params?: any) => {
                      handleCloseBottomSheet();
                      router.push({ pathname: path, params } as any);
                    };

                    if (isOccupied) {
                      return [
                        renderMenuItem("eye-outline", "Xem chi tiết phòng", undefined, () => navigateTo(`/rooms/[id]`, { id: selectedRoom.roomId })),
                        renderMenuItem("create-outline", "Chỉnh sửa thông tin cơ bản", undefined, () => handleFeatureNotImplemented("Chỉnh sửa thông tin cơ bản")),
                        renderMenuItem("settings-outline", "Thiết lập dịch vụ", "Dịch vụ điện, nước... của phòng", () => navigateTo("/tab-manage/management-menu/service-settings/services")),
                        renderMenuItem("cash-outline", "Lập hóa đơn", undefined, () => navigateTo("/tab-manage/management-menu/invoices/add", {
                          motelId: activeMotel?.motelId,
                          roomId: selectedRoom.roomId,
                          roomName: selectedRoom.name,
                          roomPrice: String(selectedRoom.price ?? 0),
                        })),
                        renderMenuItem("people-outline", "Danh sách khách thuê", undefined, () => navigateTo("/tab-manage/management-menu/tenants")),
                        renderMenuItem("person-add-outline", "Thêm khách thuê (thành viên)", undefined, () => navigateTo("/tab-manage/management-menu/tenants/add")),
                        renderMenuItem("repeat-outline", "Chuyển phòng", undefined, () => handleFeatureNotImplemented("Chuyển phòng")),
                        renderMenuItem("eye-outline", "Xem thông tin hợp đồng", undefined, () => navigateTo("/tab-manage/management-menu/contracts")),
                        renderMenuItem("create-outline", "Chỉnh sửa hợp đồng", undefined, () => navigateTo("/tab-manage/management-menu/contracts")),
                        renderMenuItem("log-out-outline", "Kết thúc hợp đồng", undefined, () => navigateTo("/tab-manage/management-menu/contracts")),
                      ];
                    } else {
                      return [
                        renderMenuItem("eye-outline", "Xem chi tiết phòng", undefined, () => navigateTo(`/rooms/[id]`, { id: selectedRoom.roomId })),
                        renderMenuItem("create-outline", "Chỉnh sửa thông tin cơ bản", undefined, () => handleFeatureNotImplemented("Chỉnh sửa thông tin cơ bản")),
                        renderMenuItem("document-text-outline", "Lập hợp đồng mới", undefined, () => navigateTo("/tab-manage/management-menu/contracts/add")),
                        renderMenuItem("bookmark-outline", "Cọc giữ chỗ", undefined, () => navigateTo("/tab-manage/quick-actions/deposit")),
                        renderMenuItem("settings-outline", "Thiết lập dịch vụ", "Dịch vụ điện, nước... của phòng", () => navigateTo("/tab-manage/management-menu/service-settings/services")),
                      ];
                    }
                  })()
                )}
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ── Room Card Sub-Component ──
function RoomCard({ room, onPressMenu }: { room: RoomResponse2; onPressMenu: () => void }) {
  // Map trạng thái phòng từ backend
  const isAvailable = room.status === true || String(room.status).toLowerCase() === 'available';
  const isOccupied = room.status === false || String(room.status).toLowerCase() === 'occupied';

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
          onPress={onPressMenu}
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
          {isAvailable && (
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.statusText}>Đang trống</Text>
            </View>
          )}
          {isOccupied && (
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: Colors.success }]} />
              <Text style={styles.statusText}>Chờ kỳ thu tới</Text>
            </View>
          )}
          {!isAvailable && !isOccupied && (
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: Colors.textSecondary }]} />
              <Text style={styles.statusText}>
                {String(room.status).toLowerCase() === 'maintenance' ? 'Đang sửa chữa' : 'Đã đặt cọc'}
              </Text>
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
          <Text style={styles.priceValue}>
            {Number(room.price || 0).toLocaleString("vi-VN")} đ
          </Text>
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

  // Loading/Empty States
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // Bottom Sheet Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheetContainer: {
    width: "100%",
  },
  bottomSheetContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === "ios" ? Spacing["4xl"] : Spacing["2xl"],
    paddingTop: Spacing.sm,
    maxHeight: "85%",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray300,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  bannerOccupied: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20a9e722",
    borderColor: "#2b7ed7",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bannerOccupiedText: {
    color: "#2b7ed7",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  bannerAvailable: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9F3",
    borderColor: "#FF9800",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bannerAvailableText: {
    color: "#FF9800",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  bannerOther: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bannerOtherText: {
    color: Colors.textSecondary,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  optionsContainer: {
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: Spacing.sm,
  },
  menuItemTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  menuItemSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
