/**
 * HomeHeader - Header xanh la sticky tren dau trang chu
 * Hien thi: icon nha, ten user, dropdown, QR, hamburger menu
 */

import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  userName = "Quoc",
  onMenuPress,
  onQRPress,
}: HomeHeaderProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const router = useRouter();

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
      router.push("/motel-settings");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.homeIconWrap}>
          <Ionicons name="home" size={22} color={Colors.primary} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.subtitle}>Dang quan ly Nha tro</Text>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{userName}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.white} />
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={onQRPress}>
          <Ionicons name="scan-outline" size={22} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

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
                onPress={() => closeMenu(() => router.push("/add-building/add-building"))}
              >
                <View style={[styles.menuIconWrap, styles.iconAdd]}>
                  <Ionicons name="add" size={24} color={Colors.primary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Them moi toa nha cho thue</Text>
                  <Text style={styles.menuItemDesc}>
                    Ban co the them nhieu nha tai san cho thue de quan ly
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
                onPress={() => closeMenu(() => router.push("/edit-building/edit-building"))}
              >
                <View style={[styles.menuIconWrap, styles.iconDefault]}>
                  <Ionicons name="pencil" size={20} color={Colors.gray800} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>
                    {`Chinh sua thong tin "${userName}"`}
                  </Text>
                  <Text style={styles.menuItemDesc}>
                    Chinh sua nha tro hien tai, bao gom ten, dia chi...
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
                  <Text style={styles.menuItemTitle}>Cai dat</Text>
                  <Text style={styles.menuItemDesc}>
                    Cai dat nhu may in, chuc nang, tien ich, gio giac, noi quy...
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
});
