import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
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

export default function BrandSettingsScreen() {
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
        <Text style={styles.headerTitle}>Cài đặt thương hiệu nhà cho thuê</Text>
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
        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#E65100"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.alertText}>
            Vui lòng chọn kích thước, hình ảnh đẹp... Kích thước chuẩn{" "}
            <Text style={styles.alertHighlight}>200 x 100</Text>
          </Text>
        </View>

        {/* Upload Logo Area */}
        <View style={styles.uploadArea}>
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="cloud-upload-outline" size={32} color={Colors.textSuccess} />
            <Text style={styles.uploadText}>Logo thương hiệu</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.descriptionText}>
          Logo này hệ thống sẽ cá nhân hóa thương hiệu của bạn ví dụ: Xuất hiện
          trong hóa đơn, hiển thị trong app cho khách thuê...
        </Text>

        {/* Website Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Website thương hiệu</Text>
          <TextInput
            style={styles.input}
            placeholder="ví dụ: rrms.me"
            placeholderTextColor={Colors.gray400}
          />
        </View>
        <Text style={styles.descriptionText}>
          Đường dẫn website: Xuất hiện trong hóa đơn, hiển thị trong phần mềm
          cho khách thuê...
        </Text>

        {/* Marketing Card */}
        <View style={styles.marketingCard}>
          <View style={styles.marketingIconWrap}>
            <Ionicons name="megaphone-outline" size={30} color="#00BCD4" />
            <View style={styles.marketingGear}>
              <Ionicons name="settings" size={14} color={Colors.textSuccess} />
            </View>
          </View>
          <View style={styles.marketingContent}>
            <Text style={styles.marketingTitle}>
              Marketing & Thiết kế thương hiệu
            </Text>
            <Text style={styles.marketingDesc}>
              Bạn cần khẳng định thương hiệu cho thuê của bạn? RRMS sẽ nâng tầm
              thương hiệu của bạn với dịch vụ thiết kế logo, website, hình ảnh,
              video giới thiệu nhà cho thuê.
            </Text>
            <TouchableOpacity style={styles.readMoreBtn}>
              <Text style={styles.readMoreText}>Xem thêm</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.textSuccess} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.btnCancel}
          onPress={() => router.back()}
        >
          <Ionicons
            name="close"
            size={18}
            color={Colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.btnCancelText}>Đóng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSave}>
          <Ionicons
            name="add"
            size={18}
            color={Colors.white}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.btnSaveText}>Thêm thương hiệu</Text>
        </TouchableOpacity>
      </View>
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
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderColor: "#FFCC80",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  alertHighlight: {
    color: "#E65100",
    fontWeight: "bold",
  },
  uploadArea: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  uploadBox: {
    width: "60%",
    height: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  marketingCard: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  marketingIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    position: "relative",
  },
  marketingGear: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 2,
  },
  marketingContent: {
    flex: 1,
  },
  marketingTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  marketingDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  readMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  readMoreText: {
    fontSize: 13,
    color: Colors.textSuccess,
    marginRight: 4,
  },
  footer: {
    flexDirection: "row",
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: Spacing.md,
  },
  btnCancel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnCancelText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  btnSave: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnSaveText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.white,
  },
});
