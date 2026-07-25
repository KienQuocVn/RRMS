import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshableScrollView } from '@/components/ui/refreshable-scroll-view';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Shadows,
  Spacing,
} from '@/constants/theme';
import { useAddBuildingFlow } from '@/hooks/use-add-building-flow';
import {
  AddressOption,
  getCommunes,
  getProvinces,
} from '@/services/address/address.service';
import MapComponent from '@/components/map-component';

type ActiveModal = 'province' | 'ward' | null;

function AddressPickerModal({
  visible,
  title,
  icon,
  options,
  selectedCode,
  emptyText,
  loading,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  options: AddressOption[];
  selectedCode: string;
  emptyText: string;
  loading: boolean;
  onSelect: (option: AddressOption) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderIcon}>
              <Ionicons name={icon} size={22} color={Colors.textPrimary} />
            </View>
            <Text style={styles.modalHeaderTitle}>{title}</Text>
          </View>

          <View style={styles.modalDivider} />

          {loading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="small" color={Colors.success} />
              <Text style={styles.modalLoadingText}>Đang tải dữ liệu...</Text>
            </View>
          ) : (
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {options.length === 0 ? (
                <View style={styles.modalEmptyState}>
                  <Text style={styles.modalEmptyText}>{emptyText}</Text>
                </View>
              ) : (
                options.map((option, index) => {
                  const isSelected = selectedCode === option.code;

                  return (
                    <View key={option.code}>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                          onSelect(option);
                          onClose();
                        }}
                        style={styles.modalOption}
                      >
                        <Text style={styles.modalOptionTitle}>{option.name}</Text>

                        {isSelected ? (
                          <View style={styles.modalCheck}>
                            <Ionicons name="checkmark" size={20} color={Colors.white} />
                          </View>
                        ) : null}
                      </TouchableOpacity>

                      {index < options.length - 1 ? (
                        <View style={styles.modalOptionDivider} />
                      ) : null}
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Đóng</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function AddBuildingAddressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const savedAddress = useAddBuildingFlow((state) => state.address);
  const setAddress = useAddBuildingFlow((state) => state.setAddress);
  const updateAddress = useAddBuildingFlow((state) => state.updateAddress);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [provinceCode, setProvinceCode] = useState(savedAddress.provinceCode);
  const [city, setCity] = useState(savedAddress.city);
  const [districtCode, setDistrictCode] = useState(savedAddress.districtCode);
  const [district, setDistrict] = useState(savedAddress.district);
  const [wardCode, setWardCode] = useState(savedAddress.wardCode);
  const [ward, setWard] = useState(savedAddress.ward);
  const [detail, setDetail] = useState(savedAddress.detail);
  const [hasMapPin, setHasMapPin] = useState(savedAddress.hasMapPin);
  const [mapLabel, setMapLabel] = useState(savedAddress.mapLabel);
  const [latitude, setLatitude] = useState<number | null>(savedAddress.latitude);
  const [longitude, setLongitude] = useState<number | null>(savedAddress.longitude);

  const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([]);
  const [wardOptions, setWardOptions] = useState<AddressOption[]>([]);
  const [loadingProvince, setLoadingProvince] = useState(true);
  const [loadingWard, setLoadingWard] = useState(false);
  const [autoGeocodeLoading, setAutoGeocodeLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProvinces = async () => {
      setLoadingProvince(true);

      try {
        const data = await getProvinces();

        if (!mounted) {
          return;
        }

        setProvinceOptions(data);
      } finally {
        if (mounted) {
          setLoadingProvince(false);
        }
      }
    };

    void loadProvinces();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadCommunes = async () => {
      if (!provinceCode) {
        setWardOptions([]);
        return;
      }

      setLoadingWard(true);

      try {
        const data = await getCommunes(provinceCode);

        if (!mounted) {
          return;
        }

        setWardOptions(data);
      } finally {
        if (mounted) {
          setLoadingWard(false);
        }
      }
    };

    void loadCommunes();

    return () => {
      mounted = false;
    };
  }, [provinceCode]);

  useEffect(() => {
    setHasMapPin(savedAddress.hasMapPin);
    setMapLabel(savedAddress.mapLabel);
    setLatitude(savedAddress.latitude);
    setLongitude(savedAddress.longitude);
  }, [savedAddress.hasMapPin, savedAddress.latitude, savedAddress.longitude, savedAddress.mapLabel]);

  const currentMapMeta = useMemo(() => {
    if (mapLabel) {
      return mapLabel;
    }

    if (hasMapPin && latitude !== null && longitude !== null) {
      return `Tọa độ đã ghim: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    }

    return '';
  }, [hasMapPin, latitude, longitude, mapLabel]);

  const currentFullAddress = useMemo(() => {
    return [detail.trim(), ward, district, city]
      .filter(Boolean)
      .join(', ');
  }, [detail, ward, district, city]);

  const geocodeQuery = useMemo(() => {
    if (!detail.trim() || !ward || !city) return '';
    return `${detail.trim()}, ${ward}, ${city}, Việt Nam`;
  }, [detail, ward, city]);

  useEffect(() => {
    if (!geocodeQuery) {
      return;
    }

    const timer = setTimeout(async () => {
      setAutoGeocodeLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocodeQuery)}&format=json&limit=1&countrycodes=vn`,
          {
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'vi',
              'User-Agent': 'RRMS/1.0 (mobile-address-picker)'
            }
          }
        );
        if (!res.ok) throw new Error('Geocoding failed');
        const data = await res.json();
        if (data && data.length > 0) {
          const newLat = parseFloat(data[0].lat);
          const newLng = parseFloat(data[0].lon);
          setLatitude(newLat);
          setLongitude(newLng);
          setHasMapPin(true);
          setMapLabel(`Đã tự động định vị: ${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
        }
      } catch (e) {
        console.log('Geocode error', e);
      } finally {
        setAutoGeocodeLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [geocodeQuery]);

  const isValid = Boolean(provinceCode && wardCode && detail.trim());

  const resetMapSelection = () => {
    setHasMapPin(false);
    setMapLabel('');
    setLatitude(null);
    setLongitude(null);
  };

  const handleSelectProvince = (option: AddressOption) => {
    if (option.code === provinceCode) {
      return;
    }

    setProvinceCode(option.code);
    setCity(option.name);
    setDistrictCode('');
    setDistrict('');
    setWardCode('');
    setWard('');
    resetMapSelection();
  };

  const handleSelectWard = (option: AddressOption) => {
    if (option.code === wardCode) {
      return;
    }

    setWardCode(option.code);
    setWard(option.name);
    setDistrictCode('');
    setDistrict('');
    resetMapSelection();
  };

  const persistDraftAddress = () => {
    updateAddress({
      provinceCode,
      city,
      districtCode,
      district,
      wardCode,
      ward,
      detail: detail.trim(),
      hasMapPin,
      mapLabel,
      latitude,
      longitude,
    });
  };

  const handleOpenMapPicker = () => {
    persistDraftAddress();
    router.push('/menu-management-home/add-building/add-building-map-picker');
  };

  const handleConfirm = () => {
    if (!isValid) {
      return;
    }

    setAddress({
      provinceCode,
      city,
      districtCode,
      district,
      wardCode,
      ward,
      detail: detail.trim(),
      hasMapPin,
      mapLabel,
      latitude,
      longitude,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Địa chỉ & vị trí</Text>
          <Text style={styles.headerSubtitle}>Vui lòng cung cấp chính xác</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!isValid}
          onPress={handleConfirm}
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
        >
          <Text
            style={[
              styles.continueButtonText,
              !isValid && styles.continueButtonTextDisabled,
            ]}
          >
            Tiếp tục
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isValid ? '#237BFF' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>

      <RefreshableScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningCard}>
          <View style={styles.warningIconWrap}>
            <Ionicons name="warning" size={24} color={Colors.white} />
          </View>
          <Text style={styles.warningText}>
            <Text style={styles.warningStrong}>Thông tin:</Text> Danh mục địa chỉ đang dùng theo
            đơn vị hành chính mới. Nếu địa chỉ của bạn không có trong danh sách, vui lòng liên hệ
            nhân viên để được hỗ trợ.
          </Text>
        </View>

        <View style={styles.formCard}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveModal('province')}
            style={[styles.selectorField, styles.selectorFieldCompact]}
          >
            <View style={styles.selectorTextWrap}>
              <Text style={styles.selectorLabel}>
                Tỉnh/Thành phố <Text style={styles.required}>*</Text>
              </Text>
              <Text style={[styles.selectorValue, !city && styles.placeholderText]}>
                {city || 'Chọn giá trị'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={Colors.gray800} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              if (provinceCode) {
                setActiveModal('ward');
              }
            }}
            style={[styles.selectorField, styles.selectorFieldCompact, !provinceCode && styles.selectorDisabled]}
          >
            <View style={styles.selectorTextWrap}>
              <Text style={styles.selectorLabel}>
                Phường/Xã hiện hành <Text style={styles.required}>*</Text>
              </Text>
              <Text style={[styles.selectorValue, !ward && styles.placeholderText]}>
                {ward || 'Chọn giá trị'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={Colors.gray800} />
          </TouchableOpacity>

          <View style={styles.detailWrap}>
            <Text style={styles.detailLabel}>
              Địa chỉ chi tiết <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.detailHint}>Số nhà, hẻm, đường</Text>
            <TextInput
              placeholder="Địa chỉ chi tiết"
              placeholderTextColor="#A0A7AE"
              style={styles.detailInput}
              value={detail}
              onChangeText={setDetail}
            />
          </View>
        </View>

        {hasMapPin && latitude !== null && longitude !== null ? (
          <View style={[styles.mapPanel, { paddingHorizontal: 0, overflow: 'hidden' }]}>
            <MapComponent 
              position={{ latitude, longitude }} 
              setPosition={(pos) => {
                setLatitude(pos.latitude);
                setLongitude(pos.longitude);
                setHasMapPin(true);
                setMapLabel(`Đã ghim vị trí tại: ${pos.latitude.toFixed(5)}, ${pos.longitude.toFixed(5)}`);
              }}
              style={{ height: 280, borderRadius: 0, borderWidth: 0 }}
            />
            <View style={{ padding: Spacing.base }}>
              <Text style={styles.mapText}>
                Hệ thống đã tự động lấy vị trí từ địa chỉ của bạn. Bạn có thể kéo marker trên bản đồ để ghim chính xác hơn.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={!wardCode}
                onPress={handleOpenMapPicker}
                style={[styles.mapButton, !wardCode && styles.mapButtonDisabled]}
              >
                <Ionicons name="expand" size={22} color={Colors.textPrimary} />
                <Text style={styles.mapButtonText}>Mở bản đồ lớn</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.mapPanel}>
            {autoGeocodeLoading ? (
               <View style={{ alignItems: 'center', marginVertical: Spacing.xl }}>
                 <ActivityIndicator size="small" color={Colors.primary} />
                 <Text style={{ marginTop: Spacing.sm, color: Colors.textSecondary }}>Đang tự động định vị...</Text>
               </View>
            ) : (
               <>
                 <View style={styles.mapIllustration}>
                   <View style={styles.mapPinCircle}>
                     <View style={styles.mapPinInner} />
                   </View>
                   <View style={styles.mapPinStem} />
                 </View>

                 <Text style={styles.mapText}>
                   Định vị vị trí nhà cho thuê trên bản đồ giúp cho người tìm trọ tìm thấy bạn. Tăng tỷ lệ
                   tiếp cận khách thuê.
                 </Text>
               </>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!wardCode}
              onPress={handleOpenMapPicker}
              style={[styles.mapButton, !wardCode && styles.mapButtonDisabled]}
            >
              <Ionicons name="location" size={22} color={Colors.textPrimary} />
              <Text style={styles.mapButtonText}>Lấy vị trí trên bản đồ</Text>
            </TouchableOpacity>
          </View>
        )}
      </RefreshableScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 18) : Spacing.md },
        ]}
      >
        {isValid ? (
          <View style={styles.footerAddressRow}>
            <Ionicons name="checkmark-circle" size={24} style={styles.informationCircle} />
            <Text style={styles.footerAddressText} numberOfLines={2}>
              {currentFullAddress}
            </Text>
          </View>
        ) : (
          <View style={styles.footerInfo}>
            <Ionicons name="information-circle" size={20} style={styles.informationCircle} />
            <Text style={styles.footerInfoText}>Nhập thông tin đầy đủ để tiếp tục!</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!isValid}
          onPress={handleConfirm}
          style={[styles.confirmButton, !isValid && styles.confirmButtonDisabled]}
        >
          <Text style={styles.confirmButtonText}>Xác nhận địa chỉ & tiếp tục</Text>
        </TouchableOpacity>
      </View>

      <AddressPickerModal
        visible={activeModal === 'province'}
        title="Tỉnh/Thành phố"
        icon="business-outline"
        options={provinceOptions}
        selectedCode={provinceCode}
        emptyText="Chưa có dữ liệu tỉnh/thành phố."
        loading={loadingProvince}
        onSelect={handleSelectProvince}
        onClose={() => setActiveModal(null)}
      />

      <AddressPickerModal
        visible={activeModal === 'ward'}
        title="Phường/Xã hiện hành"
        icon="location-outline"
        options={wardOptions}
        selectedCode={wardCode}
        emptyText="Hãy chọn Tỉnh/Thành phố trước để tải Phường/Xã."
        loading={loadingWard}
        onSelect={handleSelectWard}
        onClose={() => setActiveModal(null)}
      />
    </KeyboardAvoidingView>
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
  closeButton: {
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
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#237BFF',
    borderRadius: BorderRadius.full,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 8,
  },
  continueButtonDisabled: {
    borderColor: '#D1D5DB',
  },
  continueButtonText: {
    fontSize: FontSizes.base,
    color: '#237BFF',
    marginRight: 4,
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#FF7A00',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  warningIconWrap: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
  },
  warningText: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  warningStrong: {
    fontWeight: FontWeights.bold,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
  },
  selectorField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  selectorFieldCompact: {
    minHeight: 48,
  },
  selectorTextWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.md,
  },
  selectorDisabled: {
    opacity: 0.6,
  },
  selectorLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.error,
  },
  detailWrap: {
    paddingTop: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  detailHint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  detailInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    minHeight: 48,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  mapPanel: {
    marginTop: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  mapIllustration: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  mapPinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  mapPinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
  },
  mapPinStem: {
    width: 3,
    height: 30,
    backgroundColor: Colors.textPrimary,
    marginTop: -2,
    borderRadius: 2,
  },
  mapText: {
    fontSize: FontSizes.base,
    lineHeight: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  mapButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  mapButtonDisabled: {
    opacity: 0.6,
  },
  mapButtonText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  mapMeta: {
    marginTop: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.success,
    textAlign: 'center',
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
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  informationCircle: {
    color: Colors.success,
  },
  footerInfoText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
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
  mapPanelActive: {
    marginTop: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  currentLocationCard: {
    width: '100%',
    backgroundColor: '#F1F9F4',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  mapIllustrationActive: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mapPinCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  mapPinInnerActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
  },
  mapPinStemActive: {
    width: 3,
    height: 24,
    backgroundColor: Colors.textPrimary,
    marginTop: -2,
    borderRadius: 2,
  },
  currentLocationTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  currentLocationCoords: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  mapTextActive: {
    fontSize: FontSizes.base,
    lineHeight: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  editMapButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  editMapButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  footerAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.xs,
  },
  footerAddressText: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxHeight: '72%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  modalHeaderTitle: {
    flex: 1,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  modalLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
  },
  modalLoadingText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  modalList: {
    flexGrow: 0,
  },
  modalEmptyState: {
    paddingVertical: Spacing.xl,
  },
  modalEmptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: Spacing.sm,
  },
  modalOptionTitle: {
    flex: 1,
    paddingRight: Spacing.md,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  modalOptionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  modalCheck: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButton: {
    marginTop: Spacing.base,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  modalCloseButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
});
