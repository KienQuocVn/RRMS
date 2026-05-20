/**
 * Home Screen - Trang chủ chính sau khi đăng nhập
 * Cuộn dọc qua tất cả sections: Header, Tab, Banner, QuickActions,
 * ManagementMenu, ExpandedMenu, OtherActions, RentalPost, TenantApp,
 * DesktopVersion, SupportFooter.
 */

import React, { useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import {
  HomeHeader,
  TabSwitcher,
  NotificationBanner,
  QuickActions,
  ManagementMenu,
  ExpandedMenu,
  OtherActions,
  RentalPost,
  TenantApp,
  DesktopVersion,
  HomeSupportFooter,
} from "@/components/home";
import OverviewTab from "@/app/(home-page)/tab-overview/overviewTab";
import { homeQuickActionScreens } from "@/src/features/tabs";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manage" | "overview">("manage");

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Platform.OS === "ios" ? insets.top : 0 },
      ]}
    >
      {/* ── Sticky Header + Tab Switcher (green area) ── */}
      <View style={styles.stickyHeader}>
        <HomeHeader userName="Quoc" />
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {activeTab === "manage" ? (
          <>
            {/* Section 1: Thông báo (Ảnh 1) */}
            <NotificationBanner />

            {/* Section 2: Thao tác thường dùng (Ảnh 1) */}
            <QuickActions
              onItemPress={(id) => {
                const route = homeQuickActionScreens.find(
                  (screen: any) => screen.id === id,
                )?.route;
                router.push((route || `/${id}`) as any);
              }}
            />

            {/* Section 3: Menu quản lý nhà trọ (Ảnh 1 + 2) */}
            <ManagementMenu />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section 4: Menu mở rộng (Ảnh 2 + 3) */}
            <ExpandedMenu />

            {/* Section 5: Thao tác khác (Ảnh 3 + 4) */}
            <OtherActions />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section 6: Đăng tin cho thuê (Ảnh 4) */}
            <RentalPost />

            {/* Section 7: APP khách thuê (Ảnh 4) */}
            <TenantApp />

            {/* Section 8: Phiên bản máy tính (Ảnh 5) */}
            <DesktopVersion />

            {/* Section 9: Kênh hỗ trợ (Ảnh 5) */}
            <HomeSupportFooter />
          </>
        ) : (
          <OverviewTab />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  stickyHeader: {
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  divider: {
    height: 8,
    backgroundColor: Colors.gray100,
    marginTop: 20,
  },
  overviewPlaceholder: {
    flex: 1,
    padding: 16,
  },
  overviewContent: {
    flex: 1,
  },
});
