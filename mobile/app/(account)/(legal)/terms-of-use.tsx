import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";

export default function TermsOfUseScreen() {
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
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Thêm</Text>
        <Text style={styles.headerSub}>Điều khoản sử dụng</Text>
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
        <Text style={styles.mainTitle}>Điều khoản sử dụng</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Điều khoản sử dụng</Text> dưới
          đây mô tả các điều khoản sử dụng và chế tài của chúng tôi{" "}
          <Text style={{ fontWeight: "bold" }}>
            “RRMS - Quản lý nhà cho thuê”
          </Text>
          . Thông qua việc sử dụng Ứng Dụng RRMS - Quản lý nhà cho thuê (sau đây
          được gọi chung là{" "}
          <Text style={{ fontWeight: "bold" }}>“Ứng Dụng”</Text> trên toàn lãnh
          thổ Việt Nam.
        </Text>

        <Text style={styles.paragraph}>
          Điều khoản sử dụng này áp dụng cho tất cả các Khách hàng sử dụng ứng
          dụng, sau đây được gọi chung là{" "}
          <Text style={{ fontWeight: "bold" }}>“bạn”</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Vui lòng đọc kỹ Điều khoản sử dụng này để bảo đảm bạn hiểu rõ các điều
          khoản và chế tài của chúng tôi.
        </Text>

        <Text style={styles.sectionTitle}>1. Định nghĩa</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>1.1. Ứng Dụng:</Text> nghĩa là
          Ứng Dụng{" "}
          <Text style={{ fontWeight: "bold" }}>
            RRMS - Quản lý nhà cho thuê
          </Text>{" "}
          là một sản phẩm của <Text style={{ fontWeight: "bold" }}>RRMS</Text>
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>1.2. Dữ Liệu cá nhân:</Text> địa
          chỉ, ngày sinh, quốc tịch, số điện thoại, địa chỉ email, hình ảnh...
        </Text>

        {/* Spacer for scrolling */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
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
    color: Colors.textPrimary,
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
    padding: Spacing.lg,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  paragraph: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
});
