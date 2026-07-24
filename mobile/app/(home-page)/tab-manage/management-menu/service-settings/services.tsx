import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { motelManagementService } from "@/services/api/motel-service.service";
import { motelService } from "@/services/api/motel.service";
import { roomService } from "@/services/api/room.service";
import { MotelResponse } from "@/types/motel.types";
import { RoomResponse2 } from "@/types/room.types";
import { MotelServiceItem } from "@/types/service-settings.types";

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN");
}

function normalizeChargeType(value?: string | null) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function getChargeTypeLabel(value?: string | null) {
  return normalizeChargeType(value) === "METER" ? "Theo đồng hồ" : "Cố định";
}

function getDefaultUnit(serviceName: string, chargeType?: string | null) {
  if (normalizeChargeType(chargeType) !== "METER") {
    return "Tháng";
  }

  const normalized = serviceName.toLowerCase();

  if (normalized.includes("điện") || normalized.includes("dien")) {
    return "KWh";
  }

  if (normalized.includes("nước") || normalized.includes("nuoc")) {
    return "Khối";
  }

  return "Số";
}

function getDeleteErrorMessage(error: any) {
  const responseMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    if (responseMessage.toLowerCase().includes("uncategorized")) {
      return "Backend đang trả lỗi hệ thống khi xóa. Hãy restart server rồi thử lại.";
    }

    return responseMessage;
  }

  return "Không thể xóa dịch vụ lúc này.";
}

function getServiceIcon(serviceName: string): keyof typeof Ionicons.glyphMap {
  const normalized = serviceName.toLowerCase();

  if (normalized.includes("điện") || normalized.includes("dien")) {
    return "flash";
  }

  if (normalized.includes("nước") || normalized.includes("nuoc")) {
    return "water";
  }

  if (normalized.includes("wifi") || normalized.includes("internet")) {
    return "wifi";
  }

  if (
    normalized.includes("xe") ||
    normalized.includes("giu xe") ||
    normalized.includes("giữ xe")
  ) {
    return "car-sport";
  }

  if (normalized.includes("rác") || normalized.includes("rac")) {
    return "trash";
  }

  return "construct";
}

function getAppliedRoomCount(serviceId: string, rooms: RoomResponse2[]) {
  return rooms.filter(
    (room) =>
      Array.isArray(room.services) &&
      room.services.some((service) => service.serviceId === serviceId),
  ).length;
}

function resolveCurrentMotel(motels: MotelResponse[], motelIdParam?: string) {
  if (motelIdParam) {
    return (
      motels.find((motel) => motel.motelId === motelIdParam) ??
      motels[0] ??
      null
    );
  }

  return motels[0] ?? null;
}

export default function ServicesSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [rooms, setRooms] = useState<RoomResponse2[]>([]);
  const [services, setServices] = useState<MotelServiceItem[]>([]);

  const totalRooms = rooms.length;

  const serviceCards = useMemo(
    () =>
      services.map((service) => {
        const appliedRoomCount = getAppliedRoomCount(
          service.motelServiceId,
          rooms,
        );
        const isAllRooms = totalRooms > 0 && appliedRoomCount === totalRooms;

        return {
          ...service,
          appliedRoomCount,
          isAllRooms,
        };
      }),
    [rooms, services, totalRooms],
  );

  const loadData = useCallback(async () => {
    if (!user?.username) {
      setActiveMotel(null);
      setRooms([]);
      setServices([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const motelsResponse = await motelService.getMotelsByAccount(
        user.username,
      );
      const currentMotel = resolveCurrentMotel(
        motelsResponse.result || [],
        params.motelId,
      );

      if (!currentMotel) {
        setActiveMotel(null);
        setRooms([]);
        setServices([]);
        return;
      }

      const roomsResponse = await roomService.getRoomsByMotel(
        currentMotel.motelId,
      );
      let motelServices = currentMotel.motelServices || [];

      if (motelServices.length === 0) {
        const servicesResponse =
          await motelManagementService.getAllMotelServices();
        motelServices = (servicesResponse.result || []).filter(
          (service) => service.motelId === currentMotel.motelId,
        );
      }

      setActiveMotel(currentMotel);
      setRooms(roomsResponse.result || []);
      setServices(motelServices);
    } catch (error: any) {
      Alert.alert(
        "Không thể tải dịch vụ",
        error?.response?.data?.message || "Vui lòng thử lại sau.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [params.motelId, user?.username]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const handleDelete = useCallback((service: MotelServiceItem) => {
    Alert.alert(
      "Xóa dịch vụ",
      `Bạn có chắc muốn xóa "${service.nameService}" khỏi nhà trọ này không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeletingId(service.motelServiceId);
              await motelManagementService.deleteMotelService(
                service.motelServiceId,
              );

              setServices((current) =>
                current.filter(
                  (item) => item.motelServiceId !== service.motelServiceId,
                ),
              );
              setRooms((current) =>
                current.map((room) => ({
                  ...room,
                  services: Array.isArray(room.services)
                    ? room.services.filter(
                        (item) => item.serviceId !== service.motelServiceId,
                      )
                    : [],
                })),
              );
            } catch (error: any) {
              Alert.alert("Xóa thất bại", getDeleteErrorMessage(error));
            } finally {
              setIsDeletingId(null);
            }
          },
        },
      ],
    );
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Cài đặt dịch vụ</Text>
          <Text style={styles.headerSubtitle}>
            {activeMotel?.motelName || "Quản lý dịch vụ đang áp dụng"}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.centerText}>Đang tải danh sách dịch vụ...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!activeMotel ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="business-outline"
                size={28}
                color={Colors.gray500}
              />
              <Text style={styles.emptyTitle}>
                Chưa tìm thấy nhà trọ đang quản lý
              </Text>
              <Text style={styles.emptyDescription}>
                Hãy tạo hoặc chọn nhà trọ trước khi cấu hình dịch vụ.
              </Text>
            </View>
          ) : serviceCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="construct-outline"
                size={28}
                color={Colors.gray500}
              />
              <Text style={styles.emptyTitle}>Chưa có dịch vụ nào</Text>
              <Text style={styles.emptyDescription}>
                Nhấn nút cộng để thêm dịch vụ mới cho {activeMotel.motelName}.
              </Text>
            </View>
          ) : (
            serviceCards.map((service) => (
              <View key={service.motelServiceId} style={styles.serviceCard}>
                <TouchableOpacity
                  style={styles.servicePressable}
                  activeOpacity={0.75}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/tab-manage/management-menu/service-settings/edit-services",
                      params: {
                        motelId: service.motelId,
                        motelServiceId: service.motelServiceId,
                      },
                    } as any)
                  }
                >
                  <View style={styles.serviceIconWrap}>
                    <Ionicons
                      name={getServiceIcon(service.nameService)}
                      size={24}
                      color={Colors.textPrimary}
                    />
                  </View>

                  <View style={styles.serviceContent}>
                    <Text style={styles.serviceName}>
                      {service.nameService}
                    </Text>
                    <Text style={styles.serviceType}>
                      {getChargeTypeLabel(service.chargetype)}
                    </Text>
                    <Text style={styles.servicePrice}>
                      {formatMoney(service.price)} Đồng /{" "}
                      {getDefaultUnit(service.nameService, service.chargetype)}
                    </Text>

                    <View style={styles.badge}>
                      <View style={styles.badgeDot} />
                      <Text style={styles.badgeText}>
                        {service.appliedRoomCount === 0
                          ? "Chưa áp dụng cho phòng nào"
                          : service.isAllRooms
                            ? "Đang áp dụng tất cả phòng"
                            : `Đang áp dụng ${service.appliedRoomCount}/${totalRooms} phòng`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleDelete(service)}
                  disabled={isDeletingId === service.motelServiceId}
                >
                  {isDeletingId === service.motelServiceId ? (
                    <ActivityIndicator size="small" color="#E24B2A" />
                  ) : (
                    <Ionicons name="remove" size={20} color="#E24B2A" />
                  )}
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        style={[styles.fab, !activeMotel && styles.fabDisabled]}
        disabled={!activeMotel}
        onPress={() =>
          router.push({
            pathname:
              "/tab-manage/management-menu/service-settings/add-services",
            params: activeMotel ? { motelId: activeMotel.motelId } : undefined,
          } as any)
        }
      >
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2F3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
    backgroundColor: "#FAFAFA",
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    lineHeight: 24,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 96,
    gap: 12,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  centerText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadows.sm,
  },
  emptyTitle: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  emptyDescription: {
    marginTop: 6,
    textAlign: "center",
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Shadows.sm,
  },
  servicePressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  serviceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F0F2F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
    paddingRight: 12,
  },
  serviceName: {
    fontSize: FontSizes.lg,
    lineHeight: 24,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  serviceType: {
    fontSize: FontSizes.md,
    lineHeight: 20,
    color: "#707070",
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: FontSizes.base,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F2F4F5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  badgeText: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#20a9e7",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  fabDisabled: {
    backgroundColor: Colors.gray400,
  },
});
