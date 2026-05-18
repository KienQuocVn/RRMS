import React, { useEffect, useMemo, useState } from 'react';
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

interface CandidatePin {
  id: string;
  label: string;
  top: number;
  left: number;
  latitude: number;
  longitude: number;
}

function buildCandidatePins(latitude: number, longitude: number): CandidatePin[] {
  return [
    {
      id: 'front',
      label: 'Mặt tiền',
      top: 76,
      left: 68,
      latitude: latitude + 0.00022,
      longitude: longitude - 0.00018,
    },
    {
      id: 'gate',
      label: 'Cổng nhà trọ',
      top: 132,
      left: 176,
      latitude,
      longitude,
    },
    {
      id: 'alley',
      label: 'Trong hẻm',
      top: 208,
      left: 108,
      latitude: latitude - 0.00027,
      longitude: longitude + 0.00016,
    },
  ];
}

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
  const [selectedPinId, setSelectedPinId] = useState<string | null>(address.hasMapPin ? 'gate' : null);

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
      setLoadingCenter(false);
    };

    void loadCenter();

    return () => {
      mounted = false;
    };
  }, [address.districtCode, address.provinceCode, address.wardCode]);

  const candidatePins = useMemo(() => {
    if (!baseCenter) {
      return [];
    }

    return buildCandidatePins(baseCenter.latitude, baseCenter.longitude);
  }, [baseCenter]);

  const selectedPin =
    candidatePins.find((item) => item.id === selectedPinId) ?? candidatePins[1] ?? null;

  const fullAddress = [address.detail, address.ward, address.district, address.city]
    .filter(Boolean)
    .join(', ');

  const handleConfirm = () => {
    if (!selectedPin) {
      return;
    }

    updateAddress({
      hasMapPin: true,
      latitude: selectedPin.latitude,
      longitude: selectedPin.longitude,
      mapLabel: `Đã ghim vị trí ${selectedPin.label.toLowerCase()} tại ${[
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
          <Text style={styles.headerSubtitle}>Ghim điểm gần đúng để khách tìm dễ hơn</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.addressCard}>
          <View style={styles.addressBadge}>
            <Ionicons name="location-outline" size={18} color={Colors.success} />
          </View>
          <View style={styles.addressText}>
            <Text style={styles.addressTitle}>Địa chỉ đang cấu hình</Text>
            <Text style={styles.addressValue}>{fullAddress || 'Chưa có địa chỉ chi tiết'}</Text>
          </View>
        </View>

        <View style={styles.mapCard}>
          {loadingCenter || !baseCenter ? (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="small" color={Colors.success} />
              <Text style={styles.mapLoadingText}>Đang khởi tạo khu vực bản đồ...</Text>
            </View>
          ) : (
            <>
              <View style={styles.mapCanvas}>
                <View style={styles.mapRoadHorizontal} />
                <View style={styles.mapRoadVertical} />
                <View style={styles.mapRoadDiagonal} />

                {candidatePins.map((pin) => {
                  const isSelected = pin.id === selectedPinId;

                  return (
                    <TouchableOpacity
                      key={pin.id}
                      activeOpacity={0.85}
                      onPress={() => setSelectedPinId(pin.id)}
                      style={[
                        styles.pinButton,
                        { top: pin.top, left: pin.left },
                        isSelected && styles.pinButtonActive,
                      ]}
                    >
                      <Ionicons
                        name="location"
                        size={20}
                        color={isSelected ? Colors.white : Colors.success}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.pinHintRow}>
                <Ionicons name="scan-outline" size={18} color={Colors.success} />
                <Text style={styles.pinHintText}>
                  Chọn một điểm ghim gần vị trí thật của nhà cho thuê.
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.selectionCard}>
          <Text style={styles.selectionTitle}>Điểm ghim đang chọn</Text>
          <Text style={styles.selectionValue}>{selectedPin?.label ?? 'Chưa chọn điểm'}</Text>
          {selectedPin ? (
            <Text style={styles.selectionMeta}>
              {selectedPin.latitude.toFixed(5)}, {selectedPin.longitude.toFixed(5)}
            </Text>
          ) : null}
        </View>

        <View style={styles.providerNote}>
          <View style={styles.providerNoteIcon}>
            <Ionicons name="construct-outline" size={18} color="#FF7A00" />
          </View>
          <Text style={styles.providerNoteText}>
            Màn này đang là khung triển khai để giữ UX và data flow ổn định. Bước tiếp theo có thể
            cắm `react-native-maps` + `expo-location` để lấy GPS thật và kéo thả marker.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 18) : Spacing.md },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!selectedPin}
          onPress={handleConfirm}
          style={[styles.confirmButton, !selectedPin && styles.confirmButtonDisabled]}
        >
          <Text style={styles.confirmButtonText}>Xác nhận vị trí này</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 120,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  addressBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  addressText: {
    flex: 1,
  },
  addressTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressValue: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  mapCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  mapLoading: {
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLoadingText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  mapCanvas: {
    height: 320,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#E6F5EA',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#D8E6DC',
  },
  mapRoadHorizontal: {
    position: 'absolute',
    top: 120,
    left: -20,
    right: -20,
    height: 26,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-8deg' }],
  },
  mapRoadVertical: {
    position: 'absolute',
    top: -10,
    bottom: -10,
    left: 170,
    width: 28,
    backgroundColor: '#FFFFFF',
  },
  mapRoadDiagonal: {
    position: 'absolute',
    bottom: 52,
    left: -40,
    width: 240,
    height: 24,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '24deg' }],
  },
  pinButton: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.success,
    ...Shadows.sm,
  },
  pinButtonActive: {
    backgroundColor: Colors.success,
  },
  pinHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  pinHintText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  selectionCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  selectionTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  selectionValue: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  selectionMeta: {
    marginTop: 6,
    fontSize: FontSizes.sm,
    color: Colors.success,
  },
  providerNote: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#FFD2A6',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  providerNoteIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  providerNoteText: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.base,
    paddingHorizontal: Spacing.base,
    ...Shadows.md,
  },
  confirmButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  confirmButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
