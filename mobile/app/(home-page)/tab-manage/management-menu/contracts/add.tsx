/**
 * AddContractScreen - Thêm hợp đồng mới
 * Gọi API: GET /api/v1/rooms/motel/{motelId}, POST /contracts
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
import { contractService } from "@/services/api/contract.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";

// ── Component ──
export default function AddContractScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);

  // Form fields
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [closeContract, setCloseContract] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("12");
  const [collectionCycle, setCollectionCycle] = useState("MONTHLY");
  const [description, setDescription] = useState("");

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
      const available = (roomsRes.result || []).filter(
        (r: any) =>
          r.status === true || String(r.status).toLowerCase() === "available",
      );
      setRooms(available);
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể tải danh sách phòng.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleSave = async () => {
    if (!selectedRoom)
      return Alert.alert("Thiếu thông tin", "Vui lòng chọn phòng.");
    if (!price)
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập giá thuê.");
    if (!moveInDate)
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập ngày vào ở.");

    setIsSaving(true);
    try {
      await contractService.createContract({
        roomId: selectedRoom.roomId,
        username: user?.username,
        price: parseFloat(price.replace(/\D/g, "")),
        deposit: parseFloat(deposit.replace(/\D/g, "") || "0"),
        moveInDate,
        closeContract: closeContract || undefined,
        leaseTerm,
        collectionCycle,
        description,
        status: "PENDING",
      });
      Alert.alert("Thành công", "Lập hợp đồng mới thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể tạo hợp đồng.",
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
        <Text style={styles.headerTitle}>Lập hợp đồng mới</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityLabel="Lưu hợp đồng"
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
            <Text style={styles.sectionTitle}>Thông tin phòng</Text>

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
                {selectedRoom ? selectedRoom.name : "Chọn phòng trống..."}
              </Text>
              <Ionicons
                name={showRoomPicker ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>

            {showRoomPicker && (
              <View style={styles.dropList}>
                {rooms.length === 0 ? (
                  <Text style={styles.noData}>Không có phòng trống nào</Text>
                ) : (
                  rooms.map((room) => (
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
                        setPrice(String(room.price ?? ""));
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
                      <Text style={styles.dropItemSub}>
                        {Number(room.price ?? 0).toLocaleString("vi-VN")}{" "}
                        đ/tháng
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin hợp đồng</Text>

            <FormInput
              label="Giá thuê (đ) *"
              value={price}
              onChangeText={setPrice}
              placeholder="VD: 3000000"
              keyboardType="numeric"
            />
            <FormInput
              label="Tiền cọc (đ)"
              value={deposit}
              onChangeText={setDeposit}
              placeholder="VD: 6000000"
              keyboardType="numeric"
            />
            <FormInput
              label="Ngày vào ở * (YYYY-MM-DD)"
              value={moveInDate}
              onChangeText={setMoveInDate}
              placeholder="2026-01-01"
            />
            <FormInput
              label="Ngày hết hạn HĐ (YYYY-MM-DD)"
              value={closeContract}
              onChangeText={setCloseContract}
              placeholder="2027-01-01"
            />
            <FormInput
              label="Thời hạn (tháng)"
              value={leaseTerm}
              onChangeText={setLeaseTerm}
              placeholder="12"
              keyboardType="numeric"
            />

            {/* Chu kỳ thu */}
            <Text style={styles.label}>Chu kỳ thu tiền</Text>
            <View style={styles.cycleRow}>
              {["MONTHLY", "QUARTERLY", "YEARLY"].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.cycleChip,
                    collectionCycle === c && styles.cycleChipActive,
                  ]}
                  onPress={() => setCollectionCycle(c)}
                  accessibilityLabel={c}
                >
                  <Text
                    style={[
                      styles.cycleText,
                      collectionCycle === c && styles.cycleTextActive,
                    ]}
                  >
                    {c === "MONTHLY"
                      ? "Hàng tháng"
                      : c === "QUARTERLY"
                        ? "Hàng quý"
                        : "Hàng năm"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Ghi chú</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ghi chú thêm về hợp đồng..."
              placeholderTextColor={Colors.placeholder}
              multiline
              accessibilityLabel="Ghi chú hợp đồng"
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: any) {
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
    backgroundColor: Colors.white,
  },
  pickerText: { fontSize: FontSizes.md, color: Colors.textPrimary },
  pickerPlaceholder: { fontSize: FontSizes.md, color: Colors.placeholder },
  dropList: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    marginTop: 4,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  dropItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropItemSelected: { backgroundColor: "#F3E5F5" },
  dropItemText: { fontSize: FontSizes.md, color: Colors.textPrimary },
  dropItemTextSelected: { color: "#20a9e7", fontWeight: FontWeights.bold },
  dropItemSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  noData: {
    padding: Spacing.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  cycleRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
    marginBottom: Spacing.sm,
  },
  cycleChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cycleChipActive: { backgroundColor: "#20a9e7", borderColor: "#20a9e7" },
  cycleText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  cycleTextActive: { color: Colors.white, fontWeight: FontWeights.bold },
});
