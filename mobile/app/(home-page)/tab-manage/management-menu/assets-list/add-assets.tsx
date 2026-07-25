/**
 * AddAssetsScreen - Thêm tài sản mới
 */

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from "@/constants/theme";
import { motelDeviceService } from "@/services/api/motel-device.service";

// Danh sách các biểu tượng tài sản có trong hình mẫu
const ASSET_ICONS = [
  { id: "refrigerator", iconName: "cube-outline" as const, label: "Tủ lạnh" },
  {
    id: "washing_machine",
    iconName: "sync-outline" as const,
    label: "Máy giặt",
  },
  {
    id: "air_conditioner",
    iconName: "thermometer-outline" as const,
    label: "Điều hòa",
  },
  { id: "bulb", iconName: "bulb-outline" as const, label: "Bóng đèn" },
  { id: "table", iconName: "grid-outline" as const, label: "Bàn" },
  { id: "sofa", iconName: "tv-outline" as const, label: "Ghế sofa" },
  {
    id: "wardrobe",
    iconName: "file-tray-stacked-outline" as const,
    label: "Tủ quần áo",
  },
  { id: "bookshelf", iconName: "book-outline" as const, label: "Giá sách" },
  { id: "key", iconName: "key-outline" as const, label: "Chìa khóa" },
  { id: "key_hanger", iconName: "keypad-outline" as const, label: "Móc treo" },
  { id: "bed", iconName: "bed-outline" as const, label: "Giường" },
  { id: "desk", iconName: "desktop-outline" as const, label: "Bàn học" },
];

const UNIT_OPTIONS = [
  { label: "Cái", value: "cai" },
  { label: "Chiếc", value: "chiec" },
  { label: "Bộ", value: "bo" },
  { label: "Cặp", value: "cap" },
];

function normalizeDigits(value: string) {
  return value.replace(/[^\d]/g, "");
}

function formatNumber(value: string) {
  if (!value) return "";
  return Number(value).toLocaleString("vi-VN");
}

export default function AddAssetsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Các field form
  const [deviceName, setDeviceName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("refrigerator");
  const [value, setValue] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("1");
  const [supplier, setSupplier] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("cai"); // mặc định là 'cai' (Cái)

  const handleSelectUnit = useCallback(() => {
    Alert.alert("Chọn đơn vị tính", "Vui lòng chọn đơn vị tính mẫu:", [
      ...UNIT_OPTIONS.map((opt) => ({
        text: opt.label,
        onPress: () => setSelectedUnit(opt.value),
      })),
      { text: "Hủy", style: "cancel" as const },
    ]);
  }, []);

  const getUnitDisplay = (val: string) => {
    const found = UNIT_OPTIONS.find((o) => o.value === val);
    return found ? found.label : "Cái";
  };

  const handleSubmit = useCallback(async () => {
    const trimmedName = deviceName.trim();
    const cleanValue = normalizeDigits(value);
    const cleanValueInput = normalizeDigits(valueInput);
    const cleanQty = normalizeDigits(totalQuantity);

    if (!params.motelId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin nhà trọ.");
      return;
    }

    if (!trimmedName) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên tài sản.");
      return;
    }

    if (!cleanValue) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập giá trị tài sản.");
      return;
    }

    if (!cleanValueInput) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập giá nhập vào.");
      return;
    }

    if (!cleanQty || Number(cleanQty) <= 0) {
      Alert.alert("Thiếu thông tin", "Số lượng tài sản phải lớn hơn 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        motel: {
          motelId: params.motelId,
        },
        deviceName: trimmedName,
        icon: selectedIcon,
        value: Number(cleanValue),
        valueInput: Number(cleanValueInput),
        totalQuantity: Number(cleanQty),
        totalUsing: 0,
        totalNull: Number(cleanQty),
        supplier: supplier.trim(),
        unit: selectedUnit,
      };

      const response = await motelDeviceService.insertDevice(payload);
      if (response.code === 201 || response.result) {
        Alert.alert("Thành công", "Đã thêm tài sản mới.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Thất bại", response.message || "Không thể thêm tài sản.");
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message || error?.message || "Lỗi hệ thống";
      Alert.alert("Lỗi", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    deviceName,
    selectedIcon,
    value,
    valueInput,
    totalQuantity,
    supplier,
    selectedUnit,
    params.motelId,
    router,
  ]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
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
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm tài sản</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tên tài sản */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            Tên tài sản <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Tủ lạnh"
            placeholderTextColor={Colors.gray400}
            value={deviceName}
            onChangeText={setDeviceName}
          />
        </View>

        {/* Chọn biểu tượng */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Chọn biểu tượng</Text>
          <View style={styles.iconsGrid}>
            {ASSET_ICONS.map((item) => {
              const isSelected = selectedIcon === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.iconBox, isSelected && styles.iconBoxSelected]}
                  onPress={() => setSelectedIcon(item.id)}
                >
                  <Ionicons
                    name={item.iconName}
                    size={26}
                    color={isSelected ? "#20a9e7" : Colors.textSecondary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Hàng: Giá trị & Giá nhập */}
        <View style={styles.rowFields}>
          <View style={[styles.fieldBlock, { flex: 1 }]}>
            <Text style={styles.label}>
              Giá trị tài sản <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.currencyInputWrap}>
              <TextInput
                style={styles.currencyInput}
                placeholder="Giá trị tài sản"
                placeholderTextColor={Colors.gray400}
                keyboardType="numeric"
                value={formatNumber(value)}
                onChangeText={(val) => setValue(normalizeDigits(val))}
              />
              <Text style={styles.currencySuffix}>đ</Text>
            </View>
          </View>

          <View style={[styles.fieldBlock, { flex: 1 }]}>
            <Text style={styles.label}>
              Giá nhập vào <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.currencyInputWrap}>
              <TextInput
                style={styles.currencyInput}
                placeholder="Giá nhập vào"
                placeholderTextColor={Colors.gray400}
                keyboardType="numeric"
                value={formatNumber(valueInput)}
                onChangeText={(val) => setValueInput(normalizeDigits(val))}
              />
              <Text style={styles.currencySuffix}>đ</Text>
            </View>
          </View>
        </View>

        {/* Hàng: Số lượng & Nhà cung cấp */}
        <View style={styles.rowFields}>
          <View style={[styles.fieldBlock, { flex: 1 }]}>
            <Text style={styles.label}>
              Số lượng tài sản <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={Colors.gray400}
              keyboardType="numeric"
              value={totalQuantity}
              onChangeText={(val) => setTotalQuantity(normalizeDigits(val))}
            />
          </View>

          <View style={[styles.fieldBlock, { flex: 1 }]}>
            <Text style={styles.label}>Nhà cung cấp</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhà cung cấp"
              placeholderTextColor={Colors.gray400}
              value={supplier}
              onChangeText={setSupplier}
            />
          </View>
        </View>

        {/* Đơn vị tính */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Đơn vị tính</Text>
          <View style={styles.unitContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  flex: 1,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              ]}
              value={getUnitDisplay(selectedUnit)}
              editable={false}
            />
            <TouchableOpacity
              style={styles.selectModelButton}
              onPress={handleSelectUnit}
              activeOpacity={0.7}
            >
              <Ionicons name="grid-outline" size={16} color="#20a9e7" />
              <Text style={styles.selectModelText}>Chọn mẫu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trạng thái */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>
            Trạng thái <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>Đang hoạt động</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.base) },
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons
                name="add"
                size={20}
                color={Colors.white}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.submitButtonText}>Thêm tài sản</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    borderWidth: 1,
    borderColor: Colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
    backgroundColor: Colors.gray500 || "#FAFAFA",
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 140,
  },
  fieldBlock: {
    marginBottom: Spacing.lg,
  },
  rowFields: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  label: {
    marginBottom: 8,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  required: {
    color: "#E53935",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  currencyInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
  },
  currencyInput: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  currencySuffix: {
    paddingRight: Spacing.base,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    fontWeight: FontWeights.bold,
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  iconBox: {
    width: "14.5%", // 6 icons per row approx
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  iconBoxSelected: {
    borderColor: "#20a9e7",
    backgroundColor: "#20a9e722",
  },
  unitContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectModelButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#20a9e7",
    borderLeftWidth: 0,
    borderTopRightRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    backgroundColor: "#20a9e722",
    paddingHorizontal: Spacing.md,
    height: "100%",
    paddingVertical: 14,
  },
  selectModelText: {
    color: "#20a9e7",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
    marginLeft: 4,
  },
  statusBox: {
    backgroundColor: "#EAEAEA",
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: 16,
  },
  statusText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    flexDirection: "row",
    gap: Spacing.md,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  closeButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: "#1F2937",
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#20a9e7",
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    flexDirection: "row",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
