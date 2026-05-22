import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Shadows,
  Spacing,
} from '@/constants/theme';
import { useAddBuildingFlow } from '@/hooks/use-add-building-flow';
import { getAddressCenter } from '@/services/address/address.service';
import MapComponent from '@/components/map-component';

export default function AddBuildingMapPickerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const address = useAddBuildingFlow((state) => state.address);
  const updateAddress = useAddBuildingFlow((state) => state.updateAddress);

  const [loadingCenter, setLoadingCenter] = useState(true);
  const [baseCenter, setBaseCenter] = useState<{ latitude: number; longitude: number } | null>(
    address.latitude !== null && address.longitude !== null
      ? { latitude: address.latitude, longitude: address.longitude }
      : null,
  );
  
  // Lưu tọa độ đã ghim chọn trên bản đồ
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(
    address.latitude !== null && address.longitude !== null
      ? { latitude: address.latitude, longitude: address.longitude }
      : null,
  );

  useEffect(() => {
    let mounted = true;

    const loadCenter = async () => {
      setLoadingCenter(true);
      const center = await getAddressCenter({
        provinceCode: address.provinceCode,
        districtCode: address.districtCode,
        wardCode: address.wardCode,
      });

      if (!mounted) {
        return;
      }

      setBaseCenter(center);
      // Nếu chưa có vị trí ghim sẵn, gán vị trí mặc định từ tâm của địa chỉ phường/xã/quận/huyện
      if (!selectedCoords && center) {
        setSelectedCoords(center);
      }
      setLoadingCenter(false);
    };

    void loadCenter();

    return () => {
      mounted = false;
    };
  }, [address.districtCode, address.provinceCode, address.wardCode]);

  const fullAddress = [address.detail, address.ward, address.district, address.city]
    .filter(Boolean)
    .join(', ');

  const handleConfirm = () => {
    if (!selectedCoords) {
      return;
    }

    updateAddress({
      hasMapPin: true,
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
      mapLabel: `Đã ghim vị trí tại ${[
        address.ward,
        address.district,
        address.city,
      ]
        .filter(Boolean)
        .join(', ')}`,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Lấy vị trí trên bản đồ</Text>
          <Text style={styles.headerSubtitle}>Ghim điểm để khách tìm kiếm phòng dễ dàng hơn</Text>
        </View>
      </View>

      {/* Phần nội dung bản đồ full màn hình */}
      <View style={styles.mapWrapper}>
        {loadingCenter || !baseCenter ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="small" color="#12A04A" />
            <Text style={styles.mapLoadingText}>Đang tải bản đồ...</Text>
          </View>
        ) : (
          <>
            <MapComponent
              position={selectedCoords}
              setPosition={setSelectedCoords}
              style={styles.fullscreenMap}
            />

            {/* Nút định vị GPS */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.gpsButton}
              onPress={() => {
                if (baseCenter) {
                  setSelectedCoords(baseCenter);
                }
              }}
            >
              <Ionicons name="navigate" size={24} color="#12A04A" />
            </TouchableOpacity>

            {/* Card nổi hiển thị thông tin ghim và các nút hành động */}
            <View
              style={[
                styles.floatingCard,
                { paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 16) : 16 },
              ]}
            >
              {selectedCoords ? (
                <Text style={styles.coordsText}>
                  {selectedCoords.latitude.toFixed(15)}, {selectedCoords.longitude.toFixed(15)}
                </Text>
              ) : (
                <Text style={styles.coordsText}>Chưa chọn điểm ghim nào</Text>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.back()}
                  style={styles.cancelButtonFloat}
                >
                  <Ionicons name="close" size={20} color={Colors.textPrimary} style={{ marginRight: 6 }} />
                  <Text style={styles.cancelButtonFloatText}>Đóng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={!selectedCoords}
                  onPress={handleConfirm}
                  style={[
                    styles.confirmButtonFloat,
                    !selectedCoords && styles.confirmButtonFloatDisabled,
                  ]}
                >
                  <Text style={styles.confirmButtonFloatText}>Xác định vị trí</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  headerText: {
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
  mapWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.gray50,
  },
  fullscreenMap: {
    flex: 1,
    height: '100%',
    width: '100%',
    borderRadius: 0,
    borderWidth: 0,
  },
  mapLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLoadingText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  gpsButton: {
    position: 'absolute',
    bottom: 200,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    zIndex: 10,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadows.lg,
    zIndex: 10,
  },
  coordsText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cancelButtonFloat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  cancelButtonFloatText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  confirmButtonFloat: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12A04A',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  confirmButtonFloatDisabled: {
    backgroundColor: Colors.gray300,
  },
  confirmButtonFloatText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
