/**
 * AddVehicleScreen - Thêm phương tiện mới
 * API: GET rooms, GET tenants by room, POST /cars
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
import { useRouter } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { motelService } from "@/services/api/motel.service";
import { roomService } from "@/services/api/room.service";
import { tenantService } from "@/services/api/tenant.service";
import { vehicleService } from "@/services/api/vehicle.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";

// ── Component ──
export default function AddVehicleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [rooms, setRooms] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [showTenantPicker, setShowTenantPicker] = useState(false);

  const [vehicleName, setVehicleName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const loadRooms = useCallback(async () => {
    if (!user?.username) return;
    setIsLoading(true);
    try {
      const motelsRes = await motelService.getMotelsByAccount(user.username);
      const list = motelsRes.result || [];
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const motel =
        list.find((m: any) => m.motelId === storedId) ?? list[0] ?? null;
      if (!motel) return;
      const roomsRes = await roomService.getRoomsByMotel(motel.motelId);
      setRooms(roomsRes.result || []);
    } catch {
      Alert.alert("Lỗi", "Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleSelectRoom = async (room: any) => {
    setSelectedRoom(room);
    setSelectedTenant(null);
    setShowRoomPicker(false);
    try {
      const res = await tenantService.getTenantsByRoom(room.roomId);
      setTenants(Array.isArray(res?.result) ? res.result : []);
    } catch {
      setTenants([]);
    }
  };

  const handleSave = async () => {
    if (!vehicleName.trim())
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập loại xe.");
    if (!plateNumber.trim())
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập biển số xe.");
    if (!selectedRoom)
      return Alert.alert("Thiếu thông tin", "Vui lòng chọn phòng.");
    if (!selectedTenant)
      return Alert.alert(
        "Thiếu thông tin",
        "Vui lòng chọn khách thuê sở hữu xe.",
      );

    setIsSaving(true);
    try {
      await vehicleService.createVehicle({
        name: vehicleName.trim(),
        number: plateNumber.trim().toUpperCase(),
        roomId: selectedRoom.roomId,
        tenantId: selectedTenant.tenantId,
      });
      Alert.alert("Thành công", "Đã đăng ký phương tiện mới!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể thêm phương tiện.",
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
        <Text style={styles.headerTitle}>Đăng ký phương tiện</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityLabel="Lưu phương tiện"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin xe</Text>

            <Text style={styles.label}>Loại xe / Tên xe *</Text>
            <TextInput
              style={styles.input}
              value={vehicleName}
              onChangeText={setVehicleName}
              placeholder="VD: Honda Wave, Toyota Vios..."
              placeholderTextColor={Colors.placeholder}
              accessibilityLabel="Loại xe"
            />

            <Text style={styles.label}>Biển số xe *</Text>
            <TextInput
              style={styles.input}
              value={plateNumber}
              onChangeText={setPlateNumber}
              placeholder="VD: 51F-123.45"
              placeholderTextColor={Colors.placeholder}
              autoCapitalize="characters"
              accessibilityLabel="Biển số xe"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Liên kết với phòng & khách thuê
            </Text>

            {/* Chọn phòng */}
            <Text style={styles.label}>Chọn phòng *</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowRoomPicker(!showRoomPicker)}
              accessibilityLabel="Chọn phòng"
            >
              <Text
                style={
                  selectedRoom ? styles.pickerText : styles.pickerPlaceholder
                }
              >
                {selectedRoom ? selectedRoom.name : "Chọn phòng..."}
              </Text>
              <Ionicons
                name={showRoomPicker ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
            {showRoomPicker && (
              <View style={styles.dropList}>
                {rooms.map((room) => (
                  <TouchableOpacity
                    key={room.roomId}
                    style={[
                      styles.dropItem,
                      selectedRoom?.roomId === room.roomId &&
                        styles.dropItemSelected,
                    ]}
                    onPress={() => handleSelectRoom(room)}
                    accessibilityLabel={room.name}
                  >
                    <Text
                      style={[
                        styles.dropItemText,
                        selectedRoom?.roomId === room.roomId &&
                          styles.dropItemTextSelected,
                      ]}
                    >
                      {room.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Chọn khách thuê */}
            <Text style={styles.label}>Chủ xe (khách thuê) *</Text>
            <TouchableOpacity
              style={[styles.picker, !selectedRoom && styles.pickerDisabled]}
              onPress={() => {
                if (selectedRoom) setShowTenantPicker(!showTenantPicker);
              }}
              accessibilityLabel="Chọn khách thuê"
            >
              <Text
                style={
                  selectedTenant ? styles.pickerText : styles.pickerPlaceholder
                }
              >
                {!selectedRoom
                  ? "Chọn phòng trước..."
                  : selectedTenant
                    ? `${selectedTenant.fullName} — ${selectedTenant.phone}`
                    : "Chọn khách thuê..."}
              </Text>
              <Ionicons
                name={showTenantPicker ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
            {showTenantPicker && (
              <View style={styles.dropList}>
                {tenants.length === 0 ? (
                  <Text style={styles.noData}>
                    Không có khách thuê trong phòng này
                  </Text>
                ) : (
                  tenants.map((tenant) => (
                    <TouchableOpacity
                      key={tenant.tenantId}
                      style={[
                        styles.dropItem,
                        selectedTenant?.tenantId === tenant.tenantId &&
                          styles.dropItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedTenant(tenant);
                        setShowTenantPicker(false);
                      }}
                      accessibilityLabel={tenant.fullName}
                    >
                      <Text
                        style={[
                          styles.dropItemText,
                          selectedTenant?.tenantId === tenant.tenantId &&
                            styles.dropItemTextSelected,
                        ]}
                      >
                        {tenant.fullName}
                      </Text>
                      <Text style={styles.dropItemSub}>
                        {tenant.phone ?? ""}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
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
  picker: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerDisabled: { backgroundColor: Colors.gray50 },
  pickerText: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  pickerPlaceholder: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.placeholder,
  },
  dropList: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    marginTop: 4,
    overflow: "hidden",
  },
  dropItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropItemSelected: { backgroundColor: "#ECEFF1" },
  dropItemText: { fontSize: FontSizes.md, color: Colors.textPrimary },
  dropItemTextSelected: { color: "#20a9e7", fontWeight: FontWeights.bold },
  dropItemSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  noData: {
    padding: Spacing.md,
    textAlign: "center",
    color: Colors.textSecondary,
  },
});
