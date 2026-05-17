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
  getDistricts,
  getProvinces,
  getWards,
} from '@/services/address/address.service';

type ActiveModal = 'province' | 'district' | 'ward' | null;

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
  const [districtOptions, setDistrictOptions] = useState<AddressOption[]>([]);
  const [wardOptions, setWardOptions] = useState<AddressOption[]>([]);
  const [loadingProvince, setLoadingProvince] = useState(true);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingWard, setLoadingWard] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProvinces = async () => {
      setLoadingProvince(true);
      const data = await getProvinces();

      if (!mounted) {
        return;
      }

      setProvinceOptions(data);
      setLoadingProvince(false);
    };

    void loadProvinces();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadDistricts = async () => {
      if (!provinceCode) {
        setDistrictOptions([]);
        return;
      }

      setLoadingDistrict(true);
      const data = await getDistricts(provinceCode);

      if (!mounted) {
        return;
      }

      setDistrictOptions(data);
      setLoadingDistrict(false);
    };

    void loadDistricts();

    return () => {
      mounted = false;
    };
  }, [provinceCode]);

  useEffect(() => {
    let mounted = true;

    const loadWards = async () => {
      if (!districtCode) {
        setWardOptions([]);
        return;
      }

      setLoadingWard(true);
      const data = await getWards(districtCode);

      if (!mounted) {
        return;
      }

      setWardOptions(data);
      setLoadingWard(false);
    };

    void loadWards();

    return () => {
      mounted = false;
    };
  }, [districtCode]);

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

  const isValid = Boolean(provinceCode && districtCode && wardCode && detail.trim());

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

  const handleSelectDistrict = (option: AddressOption) => {
    if (option.code === districtCode) {
      return;
    }

    setDistrictCode(option.code);
    setDistrict(option.name);
    setWardCode('');
    setWard('');
    resetMapSelection();
  };

  const handleSelectWard = (option: AddressOption) => {
    setWardCode(option.code);
    setWard(option.name);
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
    router.push('/add-building/add-building-map-picker');
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningCard}>
          <View style={styles.warningIconWrap}>
            <Ionicons name="warning" size={24} color={Colors.white} />
          </View>
          <Text style={styles.warningText}>
            <Text style={styles.warningStrong}>Thông tin:</Text> Nếu địa chỉ của bạn không có
            trong danh sách bên dưới. Vui lòng liên hệ với nhân viên để được hỗ trợ!
          </Text>
        </View>

        <View style={styles.formCard}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveModal('province')}
            style={styles.selector}
          >
            <Text style={styles.selectorLabel}>
              Tỉnh/Thành phố <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.selectorValueRow}>
              <Text style={[styles.selectorValue, !city && styles.placeholderText]}>
                {city || 'Chọn giá trị'}
              </Text>
              <Ionicons name="chevron-down" size={24} color={Colors.textPrimary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              if (provinceCode) {
                setActiveModal('district');
              }
            }}
            style={[styles.selector, !provinceCode && styles.selectorDisabled]}
          >
            <Text style={styles.selectorLabel}>
              Quận/Huyện <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.selectorValueRow}>
              <Text style={[styles.selectorValue, !district && styles.placeholderText]}>
                {district || 'Chọn giá trị'}
              </Text>
              <Ionicons name="chevron-down" size={24} color={Colors.textPrimary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              if (districtCode) {
                setActiveModal('ward');
              }
            }}
            style={[styles.selector, !districtCode && styles.selectorDisabled]}
          >
            <Text style={styles.selectorLabel}>
              Phường/Xã <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.selectorValueRow}>
              <Text style={[styles.selectorValue, !ward && styles.placeholderText]}>
                {ward || 'Chọn giá trị'}
              </Text>
              <Ionicons name="chevron-down" size={24} color={Colors.textPrimary} />
            </View>
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

        <View style={styles.mapPanel}>
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

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!wardCode}
            onPress={handleOpenMapPicker}
            style={[styles.mapButton, !wardCode && styles.mapButtonDisabled]}
          >
            <Ionicons name="location" size={22} color={Colors.textPrimary} />
            <Text style={styles.mapButtonText}>
              {hasMapPin ? 'Cập nhật vị trí trên bản đồ' : 'Lấy vị trí trên bản đồ'}
            </Text>
          </TouchableOpacity>

          {currentMapMeta ? <Text style={styles.mapMeta}>{currentMapMeta}</Text> : null}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 18) : Spacing.md },
        ]}
      >
        <View style={styles.footerInfo}>
          <Ionicons name="information-circle" size={20} color="#FF6B00" />
          <Text style={styles.footerInfoText}>Nhập thông tin đầy đủ để tiếp tục!</Text>
        </View>

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
        visible={activeModal === 'district'}
        title="Quận/Huyện"
        icon="map-outline"
        options={districtOptions}
        selectedCode={districtCode}
        emptyText="Hãy chọn Tỉnh/Thành phố trước để tải Quận/Huyện."
        loading={loadingDistrict}
        onSelect={handleSelectDistrict}
        onClose={() => setActiveModal(null)}
      />

      <AddressPickerModal
        visible={activeModal === 'ward'}
        title="Phường/Xã"
        icon="location-outline"
        options={wardOptions}
        selectedCode={wardCode}
        emptyText="Hãy chọn Quận/Huyện trước để tải Phường/Xã."
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
  selector: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: Spacing.base,
    backgroundColor: Colors.white,
  },
  selectorDisabled: {
    opacity: 0.6,
  },
  selectorLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  selectorValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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