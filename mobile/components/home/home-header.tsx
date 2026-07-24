/**
 * HomeHeader - Header xanh la sticky tren dau trang chu
 * Hien thi: icon nha, ten user, dropdown, QR, hamburger menu
 * Click vao icon nha / userInfo => hien danh sach nha dang quan ly
 */

import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { motelService } from "@/services/api/motel.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { MotelResponse } from "@/types/motel.types";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";

interface HomeHeaderProps {
  userName?: string;
  onMenuPress?: () => void;
  onQRPress?: () => void;
}

export default function HomeHeader({
  userName = "Chưa chọn nhà trọ",
  onMenuPress,
  onQRPress,
}: HomeHeaderProps) {
  // Menu hamburger state
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  // Building list state
  const [isBuildingListVisible, setIsBuildingListVisible] = useState(false);
  const buildingSlideAnim = useRef(new Animated.Value(600)).current;

  // Real data state
  const [motels, setMotels] = useState<MotelResponse[]>([]);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuth((state) => state.user);
  const router = useRouter();

  // Fetch motels from API
  const fetchMotels = async () => {
    if (!user?.username) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await motelService.getMotelsByAccount(user.username);
      const list = response.result || [];
      setMotels(list);

      // Đọc active motel id từ storage để đồng bộ
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const current = list.find((m) => m.motelId === storedId) ?? list[0] ?? null;
      setActiveMotel(current);
      if (current) {
        await safeAsyncStorage.setItem("rrms_active_motel_id", current.motelId);
      }
    } catch (error) {
      console.error("[HomeHeader] fetch motels error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMotels();
  }, [user?.username]);

  // --- Hamburger menu ---
  const handleMenuPress = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    onMenuPress?.();
  };

  const closeMenu = (callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
      callback?.();
    });
  };

  const handleSettingsPress = () => {
    closeMenu(() => {
      router.push("/tab-manage/management-menu/motel-settings");
    });
  };

  // --- Building list modal ---
  const handleBuildingListOpen = () => {
    // Refresh danh sách nhà trọ mỗi khi mở modal để dữ liệu luôn mới nhất
    fetchMotels();
    setIsBuildingListVisible(true);
    Animated.timing(buildingSlideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeBuildingList = (callback?: () => void) => {
    Animated.timing(buildingSlideAnim, {
      toValue: 600,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setIsBuildingListVisible(false);
      callback?.();
    });
  };

  const handleSelectMotel = async (motel: MotelResponse) => {
    setActiveMotel(motel);
    await safeAsyncStorage.setItem("rrms_active_motel_id", motel.motelId);
    closeBuildingList();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Click vao icon nha + thong tin user => hien danh sach nha */}
        <TouchableOpacity
          style={styles.buildingSelector}
          activeOpacity={0.8}
          onPress={handleBuildingListOpen}
        >
          <View style={styles.homeIconWrap}>
            <Ionicons name="home" size={22} color={Colors.primary} />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.subtitle}>Đang quản lý Nhà trọ</Text>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>
                {activeMotel ? activeMotel.motelName : userName}
              </Text>
              <Ionicons name="chevron-down" size={16} color={Colors.white} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onQRPress}>
          <Ionicons name="scan-outline" size={22} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ===== Modal: Danh sach nha dang quan ly ===== */}
      <Modal
        visible={isBuildingListVisible}
        transparent
        animationType="none"
        onRequestClose={() => closeBuildingList()}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => closeBuildingList()}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: buildingSlideAnim }] },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Drag handle */}
              <View style={styles.dragHandle} />

              {/* Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderIcon}>
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.sheetTitle}>
                    Danh sách nhà đang quản lý
                  </Text>
                  <Text style={styles.sheetSubtitle}>
                    Chạm vào một nhà trọ để chuyển đổi quyền quản lý
                  </Text>
                </View>
              </View>

              {/* Building list */}
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <ScrollView
                  style={styles.buildingList}
                  showsVerticalScrollIndicator={false}
                >
                  {motels.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Không tìm thấy nhà trọ nào</Text>
                    </View>
                  ) : (
                    motels.map((building) => {
                      const isActive = activeMotel?.motelId === building.motelId;
                      return (
                        <View key={building.motelId} style={styles.buildingCard}>
                          {/* Info row */}
                          <View style={styles.buildingInfoRow}>
                            <View style={styles.buildingIconWrap}>
                              <Ionicons name="home" size={26} color={Colors.primary} />
                            </View>
                            <View style={styles.buildingInfo}>
                              <Text style={styles.buildingName}>{building.motelName}</Text>
                              <Text style={styles.buildingAddress} numberOfLines={1}>
                                {building.address || "Chưa cập nhật địa chỉ"}
                              </Text>
                              <Text style={styles.buildingRooms}>
                                Diện tích: {building.area || 0} m²
                              </Text>
                            </View>
                            {isActive && (
                              <View style={styles.activeBadge}>
                                <Ionicons
                                  name="checkmark-circle"
                                  size={26}
                                  color={Colors.primary}
                                />
                              </View>
                            )}
                          </View>

                          {/* Action buttons */}
                          <View style={styles.buildingActions}>
                            <TouchableOpacity
                              style={styles.btnDelete}
                              activeOpacity={0.8}
                              onPress={() => {
                                /* TODO: delete building */
                              }}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={16}
                                color={Colors.white}
                              />
                              <Text style={styles.btnDeleteText}>Xóa nhà</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.btnManage, isActive && { backgroundColor: Colors.success }]}
                              activeOpacity={0.8}
                              onPress={() => handleSelectMotel(building)}
                            >
                              <Ionicons
                                name="refresh-outline"
                                size={16}
                                color={Colors.white}
                              />
                              <Text style={styles.btnManageText}>
                                {isActive ? "Đang quản lý" : "Quản lý"}
                              </Text>
                              <Ionicons
                                name="chevron-forward"
                                size={14}
                                color={Colors.white}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })
                  )}
                </ScrollView>
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* ===== Modal: Hamburger menu ===== */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="none"
        onRequestClose={() => closeMenu()}
      >
        <Pressable style={styles.modalOverlay} onPress={() => closeMenu()}>
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Pressable onPress={(event) => event.stopPropagation()}>
              <View style={styles.dragHandle} />

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() =>
                  closeMenu(() => router.push("/menu-management-home/add-building/add-building"))
                }
              >
                <View style={[styles.menuIconWrap, styles.iconAdd]}>
                  <Ionicons name="add" size={24} color={Colors.primary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>
                    Thêm mới tòa nhà cho thuê
                  </Text>
                  <Text style={styles.menuItemDesc}>
                    Bạn có thể thêm nhiều nhà tài sản cho thuê để quản lý
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.gray400}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() =>
                  closeMenu(() => router.push("/menu-management-home/edit-building/edit-building"))
                }
              >
                <View style={[styles.menuIconWrap, styles.iconDefault]}>
                  <Ionicons name="pencil" size={20} color={Colors.gray800} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>
                    {`Chỉnh sửa thông tin nhà trọ`}
                  </Text>
                  <Text style={styles.menuItemDesc}>
                    Chỉnh sửa nhà trọ hiện tại, bao gồm tên, địa chỉ...
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.gray400}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={handleSettingsPress}
              >
                <View style={[styles.menuIconWrap, styles.iconDefault]}>
                  <Ionicons
                    name="settings-outline"
                    size={22}
                    color={Colors.gray800}
                  />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Cài đặt</Text>
                  <Text style={styles.menuItemDesc}>
                    Cài đặt như máy in, chức năng, tiện ích, giờ giấc, nội
                    quy...
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.gray400}
                />
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Wrapper bao gom icon nha + userInfo (clickable)
  buildingSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  homeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: "rgba(255,255,255,0.8)",
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },

  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["4xl"],
    paddingTop: Spacing.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray300,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },

  // Sheet header (danh sach nha)
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sheetHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Building list
  buildingList: {
    maxHeight: 420,
  },
  buildingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  buildingInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  buildingIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  buildingInfo: {
    flex: 1,
  },
  buildingName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  buildingAddress: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  buildingRooms: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  activeBadge: {
    marginLeft: Spacing.sm,
    marginTop: 2,
  },
  buildingActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  btnDelete: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#E8601C",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
  },
  btnDeleteText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  btnManage: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
  },
  btnManageText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },

  // Hamburger menu items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  iconAdd: {
    backgroundColor: "#E8F5E9",
  },
  iconDefault: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  menuItemContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  menuItemTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
