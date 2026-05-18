import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from "@/constants/theme";

export default function CompanyManagementScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
        <Ionicons name="arrow-back" size={22} color={Colors.textSuccess} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>
          Công ty/nhóm - Quản lý thành viên
        </Text>
        <Text style={styles.headerSub}>
          Quản lý hiệu quả hơn với nhiều thành viên
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerLeft}>
            {/* Using a placeholder for illustration */}
            <Ionicons name="people" size={60} color="#A5D6A7" />
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerText}>
              Hiệu quả hơn khi quản lý cùng các thành viên
            </Text>
            <Text style={styles.bannerHighlight}>Thành viên - Quyền hạn</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Thiết lập công ty hoặc nhóm của bạn
          </Text>
          <Text style={styles.subTitle}>
            Phần mềm sẽ giúp bạn tạo ra một công ty hoặc một đội nhóm và được
            chia quyền hạn để quản lý phần mềm!
          </Text>
        </View>

        {/* Alert Section */}
        <View style={styles.alertBox}>
          <Ionicons
            name="warning-outline"
            size={24}
            color="#E65100"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.alertText}>
            Để sử dụng tính năng này. Hãy liên hệ chuyên viên để được hỗ trợ!
          </Text>
        </View>

        {/* Support Section */}
        <View style={styles.supportHeader}>
          <View style={styles.redDotContainer}>
            <View style={styles.redDotLarge} />
            <View style={styles.redDotSmall} />
          </View>
          <View>
            <Text style={styles.supportTitle}>Hỗ trợ tính năng</Text>
            <Text style={styles.supportSub}>
              Chuyên viên luôn sẵn sàng hỗ trợ 24/7
            </Text>
          </View>
        </View>

        {/* Contact Buttons */}
        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons
            name="call"
            size={24}
            color={Colors.textSuccess}
            style={{ marginRight: 12 }}
          />
          <Text style={styles.contactBtnText}>
            Gọi điện trực tiếp (sẵn sàng)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactBtn}>
          <View style={styles.zaloIconWrapper}>
            <Text style={styles.zaloIconText}>Zalo</Text>
          </View>
          <Text style={styles.contactBtnText}>
            Chat/Gọi điện qua Zalo (sẵn sàng)
          </Text>
        </TouchableOpacity>
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
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textSuccess,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  bannerContainer: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  bannerLeft: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  bannerRight: {
    flex: 1,
    alignItems: "center",
  },
  bannerText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.textSuccess,
    textAlign: "center",
    marginBottom: 8,
  },
  bannerHighlight: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.success,
    textAlign: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  mainTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.textSuccess,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderColor: "#FFB74D",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSuccess,
    lineHeight: 20,
  },
  supportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  redDotContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  redDotLarge: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(244, 67, 54, 0.2)",
  },
  redDotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F44336",
  },
  supportTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.textSuccess,
  },
  supportSub: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: Spacing.sm,
  },
  contactBtnText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.textSuccess,
  },
  zaloIconWrapper: {
    backgroundColor: "#0084FF",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  zaloIconText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: "bold",
  },
});
