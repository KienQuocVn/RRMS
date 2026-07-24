/**
 * TenantsListScreen - Danh sách khách thuê
 * Gọi API: GET /tenant/roomId/{roomId} sau khi chọn phòng
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
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
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { TenantResponse } from "@/types/tenant.types";

// ── Component ──
export default function TenantsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [tenants, setTenants] = useState<TenantResponse[]>([]);
  const [searchText, setSearchText] = useState("");

  const loadRooms = useCallback(async () => {
    if (!user?.username) return;
    setIsLoading(true);
    try {
      const motelsRes = await motelService.getMotelsByAccount(user.username);
      const list = motelsRes.result || [];
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const motel =
        list.find((m: any) => m.motelId === storedId) ?? list[0] ?? null;
      if (!motel) {
        setIsLoading(false);
        return;
      }
      const roomsRes = await roomService.getRoomsByMotel(motel.motelId);
      const roomList = roomsRes.result || [];
      setRooms(roomList);
      if (roomList.length > 0) {
        setSelectedRoom(roomList[0]);
        await loadTenants(roomList[0].roomId);
      }
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể tải danh sách phòng.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  const loadTenants = async (roomId: string) => {
    try {
      const res = await tenantService.getTenantsByRoom(roomId);
      setTenants(Array.isArray(res?.result) ? res.result : []);
    } catch {
      setTenants([]);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleSelectRoom = async (room: any) => {
    setSelectedRoom(room);
    setShowRoomPicker(false);
    setIsLoading(true);
    await loadTenants(room.roomId);
    setIsLoading(false);
  };

  const handleDeleteTenant = (tenant: TenantResponse) => {
    Alert.alert(
      "Xác nhận xóa",
      `Xóa khách thuê "${tenant.fullName}" khỏi hệ thống?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await tenantService.deleteTenant(tenant.tenantId);
              setTenants((prev) =>
                prev.filter((t) => t.tenantId !== tenant.tenantId),
              );
            } catch (err: any) {
              Alert.alert(
                "Lỗi",
                err?.response?.data?.message || "Không thể xóa khách thuê.",
              );
            }
          },
        },
      ],
    );
  };

  const filtered = tenants.filter(
    (t) =>
      !searchText ||
      t.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      t.phone?.includes(searchText),
  );

  const renderItem = ({ item }: { item: TenantResponse }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.fullName?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.tenantName}>{item.fullName}</Text>
          <Text style={styles.tenantPhone}>{item.phone ?? "—"}</Text>
        </View>
        <View style={styles.roleTag}>
          <Text style={styles.roleTagText}>{item.role ? "Chính" : "Phụ"}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoGrid}>
        <InfoItem icon="card-outline" value={item.cccd ?? "—"} />
        <InfoItem icon="mail-outline" value={item.email ?? "—"} />
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            router.push({
              pathname: "/tab-manage/management-menu/tenants/[id]",
              params: { id: item.tenantId },
            } as any)
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Sửa khách thuê ${item.fullName}`}
        >
          <Ionicons name="create-outline" size={16} color="#20a9e7" />
          <Text style={styles.editBtnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteItemBtn}
          onPress={() => handleDeleteTenant(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Xóa khách thuê ${item.fullName}`}
        >
          <Ionicons name="trash-outline" size={16} color={Colors.error} />
          <Text style={styles.deleteBtnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Danh sách khách thuê</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            router.push({
              pathname: "/tab-manage/management-menu/tenants/add",
              params: selectedRoom
                ? { roomId: selectedRoom.roomId, roomName: selectedRoom.name }
                : {},
            } as any)
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Thêm khách thuê"
        >
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Chọn phòng ── */}
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.roomPicker}
          onPress={() => setShowRoomPicker(!showRoomPicker)}
          accessibilityLabel="Chọn phòng"
        >
          <Ionicons
            name="bed-outline"
            size={16}
            color={Colors.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text
            style={selectedRoom ? styles.pickerText : styles.pickerPlaceholder}
          >
            {selectedRoom ? selectedRoom.name : "Chọn phòng..."}
          </Text>
          <Ionicons
            name={showRoomPicker ? "chevron-up" : "chevron-down"}
            size={16}
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

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons
            name="search"
            size={18}
            color={Colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Nhập tên hoặc SĐT..."
            placeholderTextColor={Colors.placeholder}
            accessibilityLabel="Tìm kiếm khách thuê"
          />
        </View>
      </View>

      {/* ── Count ── */}
      {selectedRoom && (
        <View style={styles.countBar}>
          <Text style={styles.countText}>
            {filtered.length} khách thuê trong phòng {selectedRoom.name}
          </Text>
        </View>
      )}

      {/* ── List ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={64} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>Chưa có khách thuê</Text>
          <Text style={styles.emptyDesc}>Nhấn + để thêm khách thuê</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.tenantId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: "/tab-manage/management-menu/tenants/add",
            params: selectedRoom
              ? { roomId: selectedRoom.roomId, roomName: selectedRoom.name }
              : {},
          } as any)
        }
        accessibilityLabel="Thêm khách thuê"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

function InfoItem({ icon, value }: { icon: any; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons
        name={icon}
        size={14}
        color={Colors.textSecondary}
        style={{ marginRight: 4 }}
      />
      <Text style={styles.infoItemText} numberOfLines={1}>
        {value}
      </Text>
    </View>
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#20a9e7",
    alignItems: "center",
    justifyContent: "center",
  },
  filterSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  roomPicker: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
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
    overflow: "hidden",
  },
  dropItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropItemSelected: { backgroundColor: "#E0F7FA" },
  dropItemText: { fontSize: FontSizes.md, color: Colors.textPrimary },
  dropItemTextSelected: { color: "#20a9e7", fontWeight: FontWeights.bold },
  searchWrap: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  countBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray50,
  },
  countText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  listContent: { padding: Spacing.base, paddingBottom: 100, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: "#20a9e7",
    padding: Spacing.base,
    ...Shadows.sm,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#20a9e7",
  },
  tenantName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  tenantPhone: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  roleTag: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleTagText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: "#20a9e7",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  infoGrid: { flexDirection: "row", gap: Spacing.md, flexWrap: "wrap" },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },
  infoItemText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    justifyContent: "flex-end",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: "#20a9e7",
  },
  editBtnText: { fontSize: FontSizes.sm, color: "#20a9e7" },
  deleteItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteBtnText: { fontSize: FontSizes.sm, color: Colors.error },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#20a9e7",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
});
