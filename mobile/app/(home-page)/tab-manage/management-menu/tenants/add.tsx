/**
 * AddTenantScreen - Thêm khách thuê mới vào phòng
 * API: POST /tenant/insert/{roomId}
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { tenantService } from "@/services/api/tenant.service";
import { Gender } from "@/types/tenant.types";

// ── Component ──
export default function AddTenantScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { roomId, roomName } = useLocalSearchParams<{
    roomId?: string;
    roomName?: string;
  }>();

  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cccd, setCccd] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [address, setAddress] = useState("");
  const [job, setJob] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isMain, setIsMain] = useState(true); // Khách chính hay phụ

  const handleSave = async () => {
    if (!fullName.trim())
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập họ tên khách thuê.");
    if (!roomId)
      return Alert.alert("Lỗi", "Không xác định được phòng cần thêm khách.");

    setIsSaving(true);
    try {
      await tenantService.insertTenant(roomId, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        cccd: cccd.trim() || undefined,
        email: email.trim() || undefined,
        birthday: birthday.trim() || undefined,
        gender,
        address: address.trim() || undefined,
        job: job.trim() || undefined,
        relationship: relationship.trim() || undefined,
        role: isMain,
      });
      Alert.alert("Thành công", "Đã thêm khách thuê mới!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể thêm khách thuê.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Thêm khách thuê</Text>
          {roomName && <Text style={styles.headerSub}>Phòng: {roomName}</Text>}
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityLabel="Lưu khách thuê"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Thông tin cơ bản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <Field
            label="Họ và tên *"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nguyễn Văn A"
          />
          <Field
            label="Số điện thoại *"
            value={phone}
            onChangeText={setPhone}
            placeholder="0901234567"
            keyboardType="phone-pad"
          />
          <Field
            label="CCCD/CMND"
            value={cccd}
            onChangeText={setCccd}
            placeholder="012345678901"
            keyboardType="numeric"
          />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="example@gmail.com"
            keyboardType="email-address"
          />
          <Field
            label="Ngày sinh (YYYY-MM-DD)"
            value={birthday}
            onChangeText={setBirthday}
            placeholder="2000-01-15"
          />

          {/* Giới tính */}
          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.genderRow}>
            {([Gender.MALE, Gender.FEMALE, Gender.OTHER] as const).map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderChip,
                  gender === g && styles.genderChipActive,
                ]}
                onPress={() => setGender(g)}
                accessibilityLabel={
                  g === Gender.MALE
                    ? "Nam"
                    : g === Gender.FEMALE
                      ? "Nữ"
                      : "Khác"
                }
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === g && styles.genderTextActive,
                  ]}
                >
                  {g === Gender.MALE
                    ? "Nam"
                    : g === Gender.FEMALE
                      ? "Nữ"
                      : "Khác"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thông tin thêm */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <Field
            label="Địa chỉ thường trú"
            value={address}
            onChangeText={setAddress}
            placeholder="Số 1, Đường ABC, Quận 1, TP.HCM"
          />
          <Field
            label="Nghề nghiệp"
            value={job}
            onChangeText={setJob}
            placeholder="Nhân viên văn phòng"
          />
          <Field
            label="Quan hệ với khách chính"
            value={relationship}
            onChangeText={setRelationship}
            placeholder="Vợ/Chồng/Con..."
          />

          {/* Loại khách */}
          <Text style={styles.label}>Vai trò</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleChip, isMain && styles.roleChipActive]}
              onPress={() => setIsMain(true)}
              accessibilityLabel="Khách chính"
            >
              <Text style={[styles.roleText, isMain && styles.roleTextActive]}>
                Khách chính
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleChip, !isMain && styles.roleChipActive]}
              onPress={() => setIsMain(false)}
              accessibilityLabel="Khách phụ"
            >
              <Text style={[styles.roleText, !isMain && styles.roleTextActive]}>
                Khách phụ
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }: any) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        keyboardType={keyboardType ?? "default"}
        accessibilityLabel={label}
      />
    </>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: "#20a9e7",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 60,
    alignItems: "center",
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
  scroll: { flex: 1 },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  genderRow: { flexDirection: "row", gap: Spacing.sm },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
  },
  genderChipActive: { backgroundColor: "#20a9e7", borderColor: "#20a9e7" },
  genderText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  genderTextActive: { color: Colors.white, fontWeight: FontWeights.bold },
  roleRow: { flexDirection: "row", gap: Spacing.sm },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
  },
  roleChipActive: { backgroundColor: "#20a9e7", borderColor: "#20a9e7" },
  roleText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  roleTextActive: { color: Colors.white, fontWeight: FontWeights.bold },
});
