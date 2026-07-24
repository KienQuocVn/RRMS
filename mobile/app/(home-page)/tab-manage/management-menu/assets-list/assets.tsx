/**
 * AssetsListScreen - Danh sách tài sản
 * Dùng cho: Hiển thị danh sách tài sản trong nhà cho thuê (sofa, tủ lạnh, bàn...)
 * Điều hướng từ: ManagementMenu > "Quản lý tài sản"
 */

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { motelDeviceService, MotelDeviceItem } from "@/services/api/motel-device.service";
import { MotelResponse } from "@/types/motel.types";

// Biểu tượng tương ứng với id được lưu trong DB
const getIconName = (iconId: string): keyof typeof Ionicons.glyphMap => {
  switch (iconId) {
    case 'refrigerator': return 'cube-outline';
    case 'washing_machine': return 'sync-outline';
    case 'air_conditioner': return 'thermometer-outline';
    case 'bulb': return 'bulb-outline';
    case 'table': return 'grid-outline';
    case 'sofa': return 'tv-outline';
    case 'wardrobe': return 'file-tray-stacked-outline';
    case 'bookshelf': return 'book-outline';
    case 'key': return 'key-outline';
    case 'key_hanger': return 'keypad-outline';
    case 'bed': return 'bed-outline';
    case 'desk': return 'desktop-outline';
    default: return 'cube-outline';
  }
};

const getUnitLabel = (unit?: string) => {
  if (!unit) return 'Cái';
  switch (unit.toLowerCase()) {
    case 'cai': return 'Cái';
    case 'chiec': return 'Chiếc';
    case 'bo': return 'Bộ';
    case 'cap': return 'Cặp';
    default: return 'Cái';
  }
};

function formatMoney(value: number) {
  return value ? value.toLocaleString('vi-VN') + ' đ' : '0 đ';
}

function resolveCurrentMotel(motels: MotelResponse[], motelIdParam?: string) {
  if (motelIdParam) {
    return motels.find((motel) => motel.motelId === motelIdParam) ?? motels[0] ?? null;
  }
  return motels[0] ?? null;
}

export default function AssetsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string }>();
  const user = useAuth((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [activeMotel, setActiveMotel] = useState<MotelResponse | null>(null);
  const [assets, setAssets] = useState<MotelDeviceItem[]>([]);

  const loadData = useCallback(async () => {
    if (!user?.username) {
      setActiveMotel(null);
      setAssets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const motelsResponse = await motelService.getMotelsByAccount(user.username);
      const currentMotel = resolveCurrentMotel(motelsResponse.result || [], params.motelId);

      if (!currentMotel) {
        setActiveMotel(null);
        setAssets([]);
        return;
      }

      setActiveMotel(currentMotel);
      
      const devicesResponse = await motelDeviceService.getDevicesByMotel(currentMotel.motelId);
      setAssets(devicesResponse.result || []);
    } catch (error: any) {
      Alert.alert(
        'Không thể tải tài sản',
        error?.response?.data?.message || 'Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [params.motelId, user?.username]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const handleDelete = useCallback((asset: MotelDeviceItem) => {
    Alert.alert(
      'Xóa tài sản',
      `Bạn có chắc chắn muốn xóa tài sản "${asset.deviceName}" khỏi nhà trọ này không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeletingId(asset.motel_device_id);
              const response = await motelDeviceService.deleteDevice(asset.motel_device_id);
              if (response.code === 200) {
                setAssets((current) =>
                  current.filter((item) => item.motel_device_id !== asset.motel_device_id)
                );
                Alert.alert('Thành công', 'Đã xóa tài sản khỏi nhà trọ.');
              } else {
                Alert.alert('Xóa thất bại', response.message || 'Không thể xóa tài sản này.');
              }
            } catch (error: any) {
              const errMsg = error?.response?.data?.message || error?.message || 'Lỗi hệ thống';
              Alert.alert('Xóa thất bại', errMsg);
            } finally {
              setIsDeletingId(null);
            }
          },
        },
      ]
    );
  }, []);

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
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Danh sách tài sản</Text>
          <Text style={styles.headerSubtitle}>
            {activeMotel?.motelName || 'Quản lý tài sản đang có'}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.centerText}>Đang tải danh sách tài sản...</Text>
        </View>
      ) : !activeMotel ? (
        <View style={styles.emptyState}>
          <Ionicons name="business-outline" size={28} color={Colors.gray500} />
          <Text style={styles.emptyTitle}>Chưa tìm thấy nhà trọ đang quản lý</Text>
          <Text style={styles.emptyDescription}>
            Hãy tạo hoặc chọn nhà trọ trước khi cấu hình tài sản.
          </Text>
        </View>
      ) : assets.length === 0 ? (
        <View style={styles.emptyCard}>
          {/* Asset Icons Row */}
          <View style={styles.assetIconsRow}>
            <View style={[styles.assetIconWrap, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="bed-outline" size={36} color="#FF7043" />
            </View>
            <View style={[styles.assetIconWrap, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="cube-outline" size={36} color="#42A5F5" />
            </View>
            <View style={[styles.assetIconWrap, { backgroundColor: "#F3E5F5" }]}>
              <Ionicons name="desktop-outline" size={36} color="#AB47BC" />
            </View>
          </View>

          {/* Empty Message */}
          <Text style={styles.emptyTitle}>Hiện nhà chưa có tài sản nào!</Text>
          <Text style={styles.emptyDesc}>
            Vui lòng thêm tài sản vào nhà cho thuê để quản lý
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {assets.map((asset) => (
            <View key={asset.motel_device_id} style={styles.assetCard}>
              <TouchableOpacity
                style={styles.assetPressable}
                activeOpacity={0.75}
                onPress={() =>
                  router.push({
                    pathname: '/tab-manage/management-menu/assets-list/edit-assets',
                    params: {
                      motelId: activeMotel.motelId,
                      deviceId: asset.motel_device_id,
                    },
                  } as any)
                }
              >
                <View style={styles.assetIconWrap}>
                  <Ionicons
                    name={getIconName(asset.icon)}
                    size={24}
                    color={Colors.textPrimary}
                  />
                </View>

                <View style={styles.assetContent}>
                  <Text style={styles.assetName}>{asset.deviceName}</Text>
                  <Text style={styles.assetInfo}>
                    Giá trị: <Text style={styles.boldText}>{formatMoney(asset.value)}</Text>
                  </Text>
                  <Text style={styles.assetInfo}>
                    Giá nhập: <Text style={styles.boldText}>{formatMoney(asset.valueInput)}</Text>
                  </Text>
                  <Text style={styles.assetInfo}>
                    SL: <Text style={styles.boldText}>{asset.totalQuantity}</Text> {getUnitLabel(asset.unit)}
                  </Text>
                  {asset.supplier ? (
                    <Text style={styles.assetSupplier}>NCC: {asset.supplier}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleDelete(asset)}
                disabled={isDeletingId === asset.motel_device_id}
              >
                {isDeletingId === asset.motel_device_id ? (
                  <ActivityIndicator size="small" color="#E24B2A" />
                ) : (
                  <Ionicons name="remove" size={20} color="#E24B2A" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── FAB ── */}
      <TouchableOpacity
        style={[styles.fab, !activeMotel && styles.fabDisabled]}
        disabled={!activeMotel}
        onPress={() =>
          router.push({
            pathname: '/tab-manage/management-menu/assets-list/add-assets',
            params: activeMotel ? { motelId: activeMotel.motelId } : undefined,
          } as any)
        }
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Thêm tài sản mới"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF2F3',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    backgroundColor: '#FAFAFA',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  centerText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  emptyState: {
    margin: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },
  emptyDescription: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: Colors.textSecondary,
  },

  // Empty card
  emptyCard: {
    margin: Spacing.base,
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  assetIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  assetIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
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
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Shadows.sm,
  },
  assetPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetContent: {
    flex: 1,
    paddingRight: 12,
  },
  assetName: {
    fontSize: FontSizes.lg,
    lineHeight: 24,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  assetInfo: {
    fontSize: FontSizes.md,
    lineHeight: 20,
    color: '#707070',
    marginBottom: 2,
  },
  boldText: {
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  assetSupplier: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#20a9e7',
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  fabDisabled: {
    backgroundColor: Colors.gray400,
  },
});
