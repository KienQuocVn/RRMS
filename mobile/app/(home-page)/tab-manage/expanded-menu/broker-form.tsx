import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { brokerService } from "@/services/api/broker.service";
import { Broker } from "@/types/broker.types";

const SOURCE_OPTIONS = ["Facebook", "Zalo", "TikTok", "Website", "Người quen"];

export default function BrokerFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string; broker?: string }>();
  const existingBroker = useMemo<Broker | null>(() => {
    if (!params.broker) return null;
    try {
      return JSON.parse(params.broker);
    } catch {
      return null;
    }
  }, [params.broker]);
  const [name, setName] = useState(existingBroker?.name ?? "");
  const [phone, setPhone] = useState(existingBroker?.phone ?? "");
  const [source, setSource] = useState(existingBroker?.source ?? "");
  const [commission, setCommission] = useState(
    String(existingBroker?.commissionRate ?? 0),
  );
  const [createAccount, setCreateAccount] = useState(!existingBroker);
  const [saving, setSaving] = useState(false);
  const isEditing = !!existingBroker;

  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/[\s.-]/g, "");
    const cleanSource = source.trim();
    const rate = Number(commission.replace(/[^\d]/g, ""));
    if (!cleanName)
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập tên môi giới.");
    if (!cleanPhone)
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập số điện thoại.");
    if (!/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(cleanPhone))
      return Alert.alert(
        "Số điện thoại không hợp lệ",
        "Nhập số điện thoại Việt Nam, ví dụ 0829280927.",
      );
    if (!cleanSource)
      return Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập hoặc chọn nguồn môi giới.",
      );
    if (!Number.isFinite(rate) || rate < 0 || rate > 100)
      return Alert.alert(
        "Hoa hồng không hợp lệ",
        "Hệ số hoa hồng phải từ 0 đến 100%.",
      );
    if (!params.motelId)
      return Alert.alert(
        "Thiếu nhà trọ",
        "Không xác định được nhà trọ đang quản lý.",
      );

    setSaving(true);
    try {
      const payload = {
        name: cleanName,
        phone: cleanPhone,
        source: cleanSource,
        motelId: params.motelId,
        commissionRate: rate,
        createAccount: isEditing ? false : createAccount,
      };
      if (existingBroker)
        await brokerService.update(existingBroker.brokerId, payload);
      else await brokerService.create(payload);
      Alert.alert(
        "Thành công",
        isEditing ? "Đã cập nhật môi giới." : "Đã thêm môi giới.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error: any) {
      Alert.alert(
        isEditing ? "Không thể cập nhật" : "Không thể thêm môi giới",
        error?.response?.data?.message || error?.message || "Vui lòng thử lại.",
      );
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    value: string,
    onChangeText: (value: string) => void,
    placeholder: string,
    keyboardType: "default" | "phone-pad" | "numeric" = "default",
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray400}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "ios" ? insets.top : insets.top + Spacing.sm,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Cập nhật môi giới" : "Thêm môi giới"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              {field("Tên môi giới", name, setName, "Nhập tên môi giới")}
            </View>
            <View style={styles.column}>
              {field(
                "Số điện thoại",
                phone,
                setPhone,
                "Nhập số điện thoại",
                "phone-pad",
              )}
            </View>
          </View>
          <View style={styles.divider} />
          {field("Nguồn", source, setSource, "Nhập nguồn")}
          <View style={styles.sourceOptions}>
            {SOURCE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sourceChip,
                  source.toLocaleLowerCase("vi") ===
                    option.toLocaleLowerCase("vi") && styles.sourceChipActive,
                ]}
                onPress={() => setSource(option)}
              >
                <Text
                  style={[
                    styles.sourceText,
                    source.toLocaleLowerCase("vi") ===
                      option.toLocaleLowerCase("vi") && styles.sourceTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.divider} />
          <Text style={styles.label}>
            Hệ số hoa hồng <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.commissionField}>
            <TextInput
              style={styles.commissionInput}
              value={commission}
              onChangeText={(value) =>
                setCommission(value.replace(/[^\d]/g, "").slice(0, 3))
              }
              keyboardType="numeric"
            />
            <Text style={styles.percent}>%</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setCommission("0")}
            >
              <Ionicons name="close" size={23} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {!isEditing && (
            <>
              <View style={styles.divider} />
              <View style={styles.accountRow}>
                <View style={styles.accountCopy}>
                  <Text style={styles.accountTitle}>
                    Tạo tài khoản môi giới
                  </Text>
                  <Text style={styles.accountHint}>
                    Mật khẩu tài khoản trùng với số điện thoại
                  </Text>
                </View>
                <Switch
                  value={createAccount}
                  onValueChange={setCreateAccount}
                  trackColor={{ false: Colors.gray300, true: "#93C5FD" }}
                  thumbColor={createAccount ? "#2479E8" : Colors.gray100}
                />
              </View>
              <Text style={styles.note}>
                Môi giới có tài khoản có thể đăng nhập và nhận booking từ hệ
                thống.
              </Text>
            </>
          )}
        </View>

        <View style={styles.benefitsCard}>
          <Benefit
            title="Nhận được booking"
            description="Môi giới sẽ nhận được các booking khi bạn đặt chuyên viên lấp phòng và được đề xuất khách thuê tiềm năng."
          />
          <Benefit
            title="Tùy chọn hệ số hoa hồng (%)"
            description="Áp dụng mức hoa hồng riêng cho từng môi giới hoặc chuyên viên."
          />
          <Benefit
            title="Hỗ trợ công cụ đăng tin"
            description="Hỗ trợ môi giới chia sẻ phòng trên Facebook, Zalo và các kênh khác."
            last
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.md) },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={21} color={Colors.textPrimary} />
          <Text style={styles.cancelText}>Đóng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Text style={styles.saveText}>Đang lưu...</Text>
          ) : (
            <>
              <Ionicons
                name={isEditing ? "pencil" : "add"}
                size={21}
                color={Colors.white}
              />
              <Text style={styles.saveText}>
                {isEditing ? "Lưu thông tin" : "Thêm thông tin"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function Benefit({
  title,
  description,
  last = false,
}: {
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.benefit, !last && styles.benefitDivider]}>
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={17} color={Colors.white} />
      </View>
      <View style={styles.benefitCopy}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    backgroundColor: Colors.gray100,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  content: { padding: Spacing.base, paddingBottom: 24, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  twoColumns: { flexDirection: "row", gap: Spacing.md },
  column: { flex: 1, minWidth: 0 },
  field: { marginBottom: Spacing.md },
  label: { fontSize: FontSizes.sm, color: Colors.textPrimary, marginBottom: 8 },
  required: { color: "#EF4444" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  sourceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: -4,
  },
  sourceChip: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.white,
  },
  sourceChipActive: { backgroundColor: "#EFF8F1", borderColor: "#2b7ed7" },
  sourceText: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  sourceTextActive: { color: "#16833D", fontWeight: FontWeights.bold },
  commissionField: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  commissionInput: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  percent: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray200,
    alignItems: "center",
    justifyContent: "center",
  },
  accountRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  accountCopy: { flex: 1 },
  accountTitle: {
    color: "#2479E8",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semiBold,
  },
  accountHint: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginTop: 4,
  },
  note: {
    color: "#E27633",
    fontSize: FontSizes.sm,
    lineHeight: 21,
    marginTop: Spacing.md,
  },
  benefitsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.base,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.base,
  },
  benefitDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2b7ed7",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitCopy: { flex: 1 },
  benefitTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeights.semiBold,
  },
  benefitDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.bold,
  },
  saveButton: {
    flex: 1,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: "#2b7ed7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveText: {
    fontSize: FontSizes.md,
    color: Colors.white,
    fontWeight: FontWeights.bold,
  },
});
