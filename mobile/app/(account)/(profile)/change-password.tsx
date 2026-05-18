import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
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

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        <Text style={styles.headerTitle}>Đổi mật khẩu hiện tại</Text>
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
            <Text style={{ color: Colors.textSuccess }}>{'// '}</Text>RRMS
          </Text>
          <Text style={styles.logoTextSub}>
            Quản lý{" "}
            <Text style={{ color: Colors.textSuccess, fontWeight: "bold" }}>
              NHÀ CHO THUÊ
            </Text>
          </Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Xác nhận mật khẩu <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu hiện tại"
              placeholderTextColor={Colors.gray400}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowCurrent(!showCurrent)}
            >
              <Ionicons
                name={showCurrent ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={Colors.gray800}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View
            style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}
          >
            <Text style={styles.label}>
              Mật khẩu mới <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                placeholderTextColor={Colors.gray400}
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNew(!showNew)}
              >
                <Ionicons
                  name={showNew ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={Colors.gray800}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>
              Xác nhận mật khẩu mới <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận"
                placeholderTextColor={Colors.gray400}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Ionicons
                  name={showConfirm ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={Colors.gray800}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Password Hints */}
        <View style={styles.hintBox}>
          <View style={styles.hintRow}>
            <Ionicons
              name="checkmark"
              size={16}
              color={Colors.textSuccess}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.hintText}>Mật khẩu phải lớn hơn 8 ký tự</Text>
          </View>
          <View style={styles.hintRow}>
            <Ionicons
              name="checkmark"
              size={16}
              color={Colors.textSuccess}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.hintText}>Chú ý đến hoa thường</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.md) },
        ]}
      >
        <TouchableOpacity style={styles.btnSubmit}>
          <Text style={styles.btnSubmitText}>Thay đổi mật khẩu</Text>
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
  row: {
    flexDirection: "row",
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  eyeIcon: {
    padding: 12,
  },
  hintBox: {
    backgroundColor: "#F1F8E9", // Light green
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  hintText: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  footer: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
  },
  btnSubmit: {
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
