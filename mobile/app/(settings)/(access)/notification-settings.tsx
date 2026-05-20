import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [settings, setSettings] = useState({
    system: true,
    promo: true,
    manage: true,
    listing: true,
    chat: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
      <Text style={styles.headerTitle}>Cài đặt thông báo</Text>
    </View>
  );

  const SettingItem = ({
    title,
    description,
    value,
    onValueChange,
  }: {
    title: string;
    description: string;
    value: boolean;
    onValueChange: () => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextWrap}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: "#E5E7EB", true: Colors.success }}
        thumbColor={Colors.white}
        ios_backgroundColor="#E5E7EB"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <SettingItem
          title="Thông báo hệ thống"
          description="Là thông báo từ hệ thống"
          value={settings.system}
          onValueChange={() => toggleSetting("system")}
        />
        <SettingItem
          title="Thông báo khuyến mãi"
          description="Các thông báo khuyến mãi từ hệ thống"
          value={settings.promo}
          onValueChange={() => toggleSetting("promo")}
        />
        <SettingItem
          title="Thông báo quản lý dãy trọ"
          description="Các thông báo từ việc quản lý dãy trọ"
          value={settings.manage}
          onValueChange={() => toggleSetting("manage")}
        />
        <SettingItem
          title="Thông báo quản lý đăng tin dãy trọ"
          description="Các thông báo từ việc quản lý dãy trọ"
          value={settings.listing}
          onValueChange={() => toggleSetting("listing")}
        />
        <SettingItem
          title="Thông báo ứng dụng chat"
          description="Khi có tin nhắn từ người thuê chat để lấy thêm thông tin chúng tôi sẽ gửi tin nhắn tới cho bạn"
          value={settings.chat}
          onValueChange={() => toggleSetting("chat")}
        />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: Spacing.lg,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
