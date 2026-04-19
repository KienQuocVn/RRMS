import React, { useState } from "react";
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

export default function LinkPhoneScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [phone, setPhone] = useState("");

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
        <Text style={styles.headerTitle}>Liên kết số điện thoại</Text>
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
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoTextMain}>
            <Text style={{ color: "#4CAF50" }}>// </Text>RRMS
          </Text>
          <Text style={styles.logoTextSub}>
            Quản lý{" "}
            <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
              NHÀ CHO THUÊ
            </Text>
          </Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Số điện thoại <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={Colors.gray400}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertIconWrap}>
            <Ionicons name="warning" size={20} color={Colors.white} />
          </View>
          <Text style={styles.alertText}>
            Chú ý: Hãy chắc chắn nhập số điện thoại đúng. Hệ thống sẽ gửi{" "}
            <Text style={{ fontWeight: "bold" }}>mã xác nhận</Text> qua số điện
            thoại để xác minh.
          </Text>
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
          <Text style={styles.btnCancelText}>Đóng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSubmit}>
          <Text style={styles.btnSubmitText}>Thêm số điện thoại</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: Spacing["3xl"],
  },
  logoTextMain: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  logoTextSub: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
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
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E65100",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  alertIconWrap: {
    backgroundColor: "#E65100",
    padding: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
    padding: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    padding: Spacing.base,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  btnCancel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnCancelText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  btnSubmit: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnSubmitText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.white,
  },
});
