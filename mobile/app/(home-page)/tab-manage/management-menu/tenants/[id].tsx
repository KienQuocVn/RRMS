/**
 * TenantDetailScreen - Sửa thông tin khách thuê
 * Route: /tab-manage/management-menu/tenants/[id]
 * API: GET /tenant/tenant-id, PUT /tenant/{id}, DELETE /tenant/{id}
 */

import React, { useState, useEffect, useCallback } from "react";
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
import { Gender, TenantResponse } from "@/types/tenant.types";

// ── Component ──
export default function TenantDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
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
  const [isMain, setIsMain] = useState(true);

  const loadTenant = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await tenantService.getTenantById(id);
      const t: TenantResponse = res?.result ?? res;
      if (t) {
        setFullName(t.fullName ?? "");
        setPhone(t.phone ?? "");
        setCccd(t.cccd ?? "");
        setEmail(t.email ?? "");
        setBirthday(t.birthday ?? "");
        setGender((t.gender as Gender) ?? Gender.MALE);
        setAddress(t.address ?? "");
        setJob(t.job ?? "");
        setRelationship(t.relationship ?? "");
        setIsMain(t.role ?? true);
      }
    } catch {
      Alert.alert("Lỗi", "Không thể tải thông tin khách thuê.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTenant();
  }, [loadTenant]);

  const handleSave = async () => {
    if (!fullName.trim())
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập họ tên.");
    setIsSaving(true);
    try {
      await tenantService.updateTenant(id!, {
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
      Alert.alert("Thành công", "Đã cập nhật thông tin khách thuê!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err?.response?.data?.message || "Không thể cập nhật.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", `Xóa khách thuê "${fullName}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await tenantService.deleteTenant(id!);
            Alert.alert("Đã xóa", "Khách thuê đã bị xóa.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (err: any) {
            Alert.alert(
              "Lỗi",
              err?.response?.data?.message || "Không thể xóa.",
            );
          }
        },
      },
    ]);
  };

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.success} />
      </View>
    );

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
        <Text style={styles.headerTitle}>Sửa khách thuê</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityLabel="Lưu"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarChar}>
              {fullName?.charAt(0)?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <Text style={styles.avatarName}>{fullName || "Khách thuê"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          <Field
            label="Họ và tên *"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nguyễn Văn A"
          />
          <Field
            label="Số điện thoại"
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
                accessibilityLabel={g}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <Field
            label="Địa chỉ thường trú"
            value={address}
            onChangeText={setAddress}
          />
          <Field label="Nghề nghiệp" value={job} onChangeText={setJob} />
          <Field
            label="Quan hệ với khách chính"
            value={relationship}
            onChangeText={setRelationship}
          />

          <Text style={styles.label}>Vai trò</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderChip, isMain && styles.genderChipActive]}
              onPress={() => setIsMain(true)}
              accessibilityLabel="Khách chính"
            >
              <Text
                style={[styles.genderText, isMain && styles.genderTextActive]}
              >
                Khách chính
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderChip, !isMain && styles.genderChipActive]}
              onPress={() => setIsMain(false)}
              accessibilityLabel="Khách phụ"
            >
              <Text
                style={[styles.genderText, !isMain && styles.genderTextActive]}
              >
                Khách phụ
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.deleteSection}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            accessibilityLabel="Xóa khách thuê"
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={Colors.white}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.deleteBtnText}>Xóa khách thuê</Text>
          </TouchableOpacity>
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
        placeholder={placeholder ?? ""}
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
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
  avatarSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  avatarChar: {
    fontSize: FontSizes["3xl"],
    fontWeight: FontWeights.bold,
    color: "#20a9e7",
  },
  avatarName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
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
  deleteSection: { marginHorizontal: Spacing.base, marginTop: Spacing.xl },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
  },
  deleteBtnText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.base,
  },
});
