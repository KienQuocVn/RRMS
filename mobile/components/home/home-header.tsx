/**
 * HomeHeader - Header xanh lá sticky trên đầu trang chủ
 * Hiển thị: icon nhà, tên user, dropdown, QR, hamburger menu
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

interface HomeHeaderProps {
  userName?: string;
  onMenuPress?: () => void;
  onQRPress?: () => void;
}

export default function HomeHeader({
  userName = "Quoc",
  onMenuPress,
  onQRPress,
}: HomeHeaderProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current; // Initial off-screen position
  const router = useRouter();

  const handleMenuPress = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (onMenuPress) onMenuPress();
  };

  const closeMenu = (callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
      if (callback) callback();
    });
  };

  const handleSettingsPress = () => {
    closeMenu(() => {
      router.push("/motel-settings");
    });
  };

  return (
    <View style={styles.container}>
      {/* Row 1: User info + actions */}
      <View style={styles.topRow}>
        {/* Home icon */}
        <View style={styles.homeIconWrap}>
          <Ionicons name="home" size={22} color={Colors.primary} />
        </View>

        {/* User info */}
        <View style={styles.userInfo}>
          <Text style={styles.subtitle}>Đang quản lý Nhà trọ</Text>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{userName}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.white} />
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionButton} onPress={onQRPress}>
          <Ionicons name="scan-outline" size={22} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
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
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.dragHandle} />

              {/* Menu Items */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => closeMenu(() => router.push("/add-building"))}
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
                onPress={() => closeMenu(() => router.push("/edit-building"))}
              >
                <View style={[styles.menuIconWrap, styles.iconDefault]}>
                  <Ionicons name="pencil" size={20} color={Colors.gray800} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>
                    Chỉnh sửa thông tin "{userName}"
                  </Text>
                  <Text style={styles.menuItemDesc}>
                    Chỉnh sửa nhà trọ hiện tại. Bao gồm tên, địa chỉ...
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
                    Cài đặt như: máy in, chức năng, tiện ích, giờ giấc, nội
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

  // Modal Styles
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
    paddingBottom: Spacing["4xl"], // Give extra padding for iOS bottom area
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
    backgroundColor: "#E8F5E9", // Light green
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
});
