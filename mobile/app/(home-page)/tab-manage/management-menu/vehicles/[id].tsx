/**
 * VehicleDetailScreen - Sửa thông tin, Xóa phương tiện
 * Route: /tab-manage/management-menu/vehicles/[id]
 * API: GET /cars/{id}, PUT /cars/{id}, DELETE /cars/{id}
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
import { vehicleService } from "@/services/api/vehicle.service";
import { VehicleResponse } from "@/types/vehicle.types";

// ── Component ──
export default function VehicleDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);

  const [vehicleName, setVehicleName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const loadVehicle = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await vehicleService.getVehicleById(id);
      const data = res.result;
      setVehicle(data);
      setVehicleName(data?.name ?? "");
      setPlateNumber(data?.number ?? "");
    } catch {
      Alert.alert("Lỗi", "Không thể tải thông tin phương tiện.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  const handleSave = async () => {
    if (!vehicleName.trim())
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập loại xe.");
    if (!plateNumber.trim())
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập biển số xe.");
    if (!vehicle) return;

    setIsSaving(true);
    try {
      await vehicleService.updateVehicle(id!, {
        name: vehicleName.trim(),
        number: plateNumber.trim().toUpperCase(),
        roomId: vehicle.roomId,
        tenantId: vehicle.tenantId,
      });
      Alert.alert("Thành công", "Đã cập nhật thông tin phương tiện!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err?.response?.data?.message || "Không thể cập nhật.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xóa", `Bạn có chắc muốn xóa xe "${plateNumber}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await vehicleService.deleteVehicle(id!);
            Alert.alert("Thành công", "Đã xóa phương tiện.", [
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
        <Text style={styles.headerTitle}>Sửa thông tin xe</Text>
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
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.iconBox}>
            <Ionicons name="car-outline" size={32} color="#20a9e7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoOwner}>
              Chủ xe: {vehicle?.tenantName ?? "—"}
            </Text>
            <Text style={styles.infoRoom}>
              Phòng: {vehicle?.roomName ?? "—"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin xe</Text>
          <Text style={styles.label}>Loại xe / Tên xe *</Text>
          <TextInput
            style={styles.input}
            value={vehicleName}
            onChangeText={setVehicleName}
            placeholder="VD: Honda Wave..."
            placeholderTextColor={Colors.placeholder}
          />

          <Text style={styles.label}>Biển số xe *</Text>
          <TextInput
            style={styles.input}
            value={plateNumber}
            onChangeText={setPlateNumber}
            placeholder="VD: 51F-123.45"
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.deleteSection}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            accessibilityLabel="Xóa xe"
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={Colors.white}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.deleteBtnText}>Xóa phương tiện</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: "#ECEFF1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  infoOwner: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  infoRoom: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
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
