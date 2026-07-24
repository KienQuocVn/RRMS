/**
 * AddInvoiceScreen - Lập hóa đơn mới
 * API: GET rooms/motel/{motelId}, POST /invoices/create
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
import { financeService } from "@/services/api/finance.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";

// ── Component ──
export default function AddInvoiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [motelId, setMotelId] = useState("");

  // Chỉ số điện nước
  const [oldElectric, setOldElectric] = useState("");
  const [newElectric, setNewElectric] = useState("");
  const [electricPrice, setElectricPrice] = useState("4000");
  const [oldWater, setOldWater] = useState("");
  const [newWater, setNewWater] = useState("");
  const [waterPrice, setWaterPrice] = useState("15000");

  // Phụ thu
  const [extraNote, setExtraNote] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [invoiceReason, setInvoiceReason] = useState("Hóa đơn tháng");
  const [dueDate, setDueDate] = useState("");

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
      setMotelId(motel.motelId);
      const roomsRes = await roomService.getRoomsByMotel(motel.motelId);
      setRooms(roomsRes.result || []);
    } catch {
      Alert.alert("Lỗi", "Không thể tải danh sách phòng.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const calcTotal = () => {
    const roomPrice = Number(selectedRoom?.price ?? 0);
    const elec =
      (Number(newElectric || 0) - Number(oldElectric || 0)) *
      Number(electricPrice || 0);
    const water =
      (Number(newWater || 0) - Number(oldWater || 0)) * Number(waterPrice || 0);
    const extra = Number(extraAmount || 0);
    return roomPrice + elec + water + extra;
  };

  const handleSave = async () => {
    if (!selectedRoom)
      return Alert.alert("Thiếu thông tin", "Vui lòng chọn phòng.");

    setIsSaving(true);
    try {
      const serviceDetails: any[] = [];
      if (newElectric && oldElectric) {
        serviceDetails.push({
          serviceName: "Tiền điện",
          price: Number(electricPrice),
          oldIndex: Number(oldElectric),
          newIndex: Number(newElectric),
        });
      }
      if (newWater && oldWater) {
        serviceDetails.push({
          serviceName: "Tiền nước",
          price: Number(waterPrice),
          oldIndex: Number(oldWater),
          newIndex: Number(newWater),
        });
      }

      await financeService.createInvoice({
        roomId: selectedRoom.roomId,
        invoiceReason,
        dueDate: dueDate || undefined,
        serviceDetails,
        additionItems:
          extraAmount && extraNote
            ? [{ name: extraNote, amount: Number(extraAmount) }]
            : [],
      });

      Alert.alert("Thành công", "Lập hóa đơn thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể lập hóa đơn.",
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
        <Text style={styles.headerTitle}>Lập hóa đơn mới</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityLabel="Lưu hóa đơn"
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
          {/* Chọn phòng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin phòng</Text>
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
                {selectedRoom
                  ? `${selectedRoom.name} — ${Number(selectedRoom.price ?? 0).toLocaleString("vi-VN")} đ/tháng`
                  : "Chọn phòng..."}
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
                    onPress={() => {
                      setSelectedRoom(room);
                      setShowRoomPicker(false);
                    }}
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
          </View>

          {/* Điện nước */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chỉ số điện - nước</Text>
            <View style={styles.row2col}>
              <View style={styles.col2}>
                <Text style={styles.label}>Số điện cũ</Text>
                <TextInput
                  style={styles.input}
                  value={oldElectric}
                  onChangeText={setOldElectric}
                  placeholder="0"
                  keyboardType="numeric"
                  accessibilityLabel="Số điện cũ"
                />
              </View>
              <View style={styles.col2}>
                <Text style={styles.label}>Số điện mới</Text>
                <TextInput
                  style={styles.input}
                  value={newElectric}
                  onChangeText={setNewElectric}
                  placeholder="0"
                  keyboardType="numeric"
                  accessibilityLabel="Số điện mới"
                />
              </View>
            </View>
            <Text style={styles.label}>Giá điện (đ/kWh)</Text>
            <TextInput
              style={styles.input}
              value={electricPrice}
              onChangeText={setElectricPrice}
              keyboardType="numeric"
              accessibilityLabel="Giá điện"
            />

            <View style={[styles.row2col, { marginTop: Spacing.md }]}>
              <View style={styles.col2}>
                <Text style={styles.label}>Số nước cũ</Text>
                <TextInput
                  style={styles.input}
                  value={oldWater}
                  onChangeText={setOldWater}
                  placeholder="0"
                  keyboardType="numeric"
                  accessibilityLabel="Số nước cũ"
                />
              </View>
              <View style={styles.col2}>
                <Text style={styles.label}>Số nước mới</Text>
                <TextInput
                  style={styles.input}
                  value={newWater}
                  onChangeText={setNewWater}
                  placeholder="0"
                  keyboardType="numeric"
                  accessibilityLabel="Số nước mới"
                />
              </View>
            </View>
            <Text style={styles.label}>Giá nước (đ/khối)</Text>
            <TextInput
              style={styles.input}
              value={waterPrice}
              onChangeText={setWaterPrice}
              keyboardType="numeric"
              accessibilityLabel="Giá nước"
            />
          </View>

          {/* Phụ thu */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Khoản phụ thu (nếu có)</Text>
            <Text style={styles.label}>Tên khoản</Text>
            <TextInput
              style={styles.input}
              value={extraNote}
              onChangeText={setExtraNote}
              placeholder="VD: Phí giữ xe, tiền rác..."
              accessibilityLabel="Tên khoản phụ thu"
            />
            <Text style={styles.label}>Số tiền (đ)</Text>
            <TextInput
              style={styles.input}
              value={extraAmount}
              onChangeText={setExtraAmount}
              placeholder="0"
              keyboardType="numeric"
              accessibilityLabel="Số tiền phụ thu"
            />
          </View>

          {/* Ghi chú & hạn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin thêm</Text>
            <Text style={styles.label}>Lý do / tiêu đề hóa đơn</Text>
            <TextInput
              style={styles.input}
              value={invoiceReason}
              onChangeText={setInvoiceReason}
              accessibilityLabel="Lý do hóa đơn"
            />
            <Text style={styles.label}>Hạn thanh toán (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="2026-08-10"
              accessibilityLabel="Hạn thanh toán"
            />
          </View>

          {/* Tổng dự tính */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Tổng dự tính</Text>
            <Text style={styles.totalValue}>
              {calcTotal().toLocaleString("vi-VN")} đ
            </Text>
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  pickerText: { fontSize: FontSizes.md, color: Colors.textPrimary },
  pickerPlaceholder: { fontSize: FontSizes.md, color: Colors.placeholder },
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
  dropItemSelected: { backgroundColor: "#FFF3E0" },
  dropItemText: { fontSize: FontSizes.md, color: Colors.textPrimary },
  dropItemTextSelected: { color: "#20a9e7", fontWeight: FontWeights.bold },
  row2col: { flexDirection: "row", gap: Spacing.sm },
  col2: { flex: 1 },
  totalCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: "#20a9e7",
  },
  totalLabel: { fontSize: FontSizes.base, color: Colors.textSecondary },
  totalValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: "#20a9e7",
  },
});
