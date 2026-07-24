/**
 * VehiclesListScreen - Danh sách phương tiện
 * Gọi API: GET /cars/motel/{motelId}
 * Điều hướng từ: ManagementMenu > "Danh sách xe"
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
import { vehicleService } from "@/services/api/vehicle.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { VehicleResponse } from "@/types/vehicle.types";
import { MotelResponse } from "@/types/motel.types";

// ── Component ──
export default function VehiclesListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [searchText, setSearchText] = useState("");

  const loadData = useCallback(async () => {
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
      setActiveMotel(motel);
      const res = await vehicleService.getVehiclesByMotel(motel.motelId);
      const items = (res.result as any)?.items ?? res.result ?? [];
      setVehicles(Array.isArray(items) ? items : []);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể tải danh sách phương tiện.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (vehicle: VehicleResponse) => {
    Alert.alert(
      "Xác nhận xóa",
      `Xóa phương tiện biển số "${vehicle.number}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await vehicleService.deleteVehicle(vehicle.carId);
              setVehicles((prev) =>
                prev.filter((v) => v.carId !== vehicle.carId),
              );
            } catch (err: any) {
              Alert.alert(
                "Lỗi",
                err?.response?.data?.message || "Không thể xóa phương tiện.",
              );
            }
          },
        },
      ],
    );
  };

  const filtered = vehicles.filter(
    (v) =>
      !searchText ||
      v.number?.toLowerCase().includes(searchText.toLowerCase()) ||
      v.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      v.tenantName?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({ item }: { item: VehicleResponse }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name="car-outline" size={22} color="#20a9e7" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.plateNumber}>{item.number}</Text>
          <Text style={styles.vehicleName}>{item.name}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/tab-manage/management-menu/vehicles/[id]",
                params: { id: item.carId },
              } as any)
            }
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.actionBtn}
            accessibilityLabel={`Sửa xe ${item.number}`}
          >
            <Ionicons name="create-outline" size={20} color="#20a9e7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.actionBtn}
            accessibilityLabel={`Xóa xe ${item.number}`}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.tenantRow}>
        <Ionicons
          name="person-outline"
          size={14}
          color={Colors.textSecondary}
          style={{ marginRight: 4 }}
        />
        <Text style={styles.tenantText}>Chủ xe: {item.tenantName ?? "—"}</Text>
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
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Danh sách phương tiện</Text>
          {activeMotel && (
            <Text style={styles.headerSub}>{activeMotel.motelName}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            router.push("/tab-manage/management-menu/vehicles/add" as any)
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Thêm phương tiện"
        >
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Count + Search ── */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>{filtered.length} phương tiện</Text>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Nhập phòng / Tên khách / Biển số..."
          placeholderTextColor={Colors.placeholder}
          accessibilityLabel="Tìm kiếm phương tiện"
        />
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
      </View>

      {/* ── List ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="car-outline" size={64} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>Không có phương tiện</Text>
          <Text style={styles.emptyDesc}>Nhấn + để thêm phương tiện mới</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.carId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadData}
          refreshing={isLoading}
        />
      )}

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push("/tab-manage/management-menu/vehicles/add" as any)
        }
        accessibilityLabel="Thêm phương tiện"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
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
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#20a9e7",
    alignItems: "center",
    justifyContent: "center",
  },
  countBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray50,
  },
  countText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
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
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: "#ECEFF1",
    alignItems: "center",
    justifyContent: "center",
  },
  plateNumber: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  vehicleName: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actions: { flexDirection: "row", gap: Spacing.sm },
  actionBtn: { padding: 6 },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  tenantRow: { flexDirection: "row", alignItems: "center" },
  tenantText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
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
