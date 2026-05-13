import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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

const CITY_OPTIONS = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'];

const DISTRICT_OPTIONS: Record<string, string[]> = {
  'Hồ Chí Minh': ['Quận 1', 'Quận 7', 'Thành phố Thủ Đức'],
  'Hà Nội': ['Ba Đình', 'Cầu Giấy', 'Hà Đông'],
  'Đà Nẵng': ['Hải Châu', 'Sơn Trà', 'Ngũ Hành Sơn'],
};

const WARD_OPTIONS: Record<string, string[]> = {
  'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Đa Kao'],
  'Quận 7': ['Phường Tân Phú', 'Phường Tân Hưng', 'Phường Phú Mỹ'],
  'Thành phố Thủ Đức': ['Phường An Khánh', 'Phường Thảo Điền', 'Phường Linh Đông'],
  'Ba Đình': ['Phường Kim Mã', 'Phường Liễu Giai', 'Phường Điện Biên'],
  'Cầu Giấy': ['Phường Dịch Vọng', 'Phường Quan Hoa', 'Phường Yên Hòa'],
  'Hà Đông': ['Phường Mộ Lao', 'Phường Phú La', 'Phường Nguyễn Trãi'],
  'Hải Châu': ['Phường Hải Châu I', 'Phường Bình Thuận', 'Phường Hòa Thuận Tây'],
  'Sơn Trà': ['Phường An Hải Bắc', 'Phường Phước Mỹ', 'Phường Nại Hiên Đông'],
  'Ngũ Hành Sơn': ['Phường Mỹ An', 'Phường Khuê Mỹ', 'Phường Hòa Hải'],
};

function cycleOption(currentValue: string, options: string[]) {
  if (options.length === 0) {
    return '';
  }

  if (!currentValue) {
    return options[0];
  }

  const currentIndex = options.indexOf(currentValue);
  const nextIndex = currentIndex === -1 || currentIndex === options.length - 1 ? 0 : currentIndex + 1;
  return options[nextIndex];
}

export default function AddBuildingAddressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const savedAddress = useAddBuildingFlow((state) => state.address);
  const setAddress = useAddBuildingFlow((state) => state.setAddress);
  const [city, setCity] = useState(savedAddress.city);
  const [district, setDistrict] = useState(savedAddress.district);
  const [ward, setWard] = useState(savedAddress.ward);
  const [detail, setDetail] = useState(savedAddress.detail);
  const [hasMapPin, setHasMapPin] = useState(savedAddress.hasMapPin);

  const districtOptions = city ? DISTRICT_OPTIONS[city] ?? [] : [];
  const wardOptions = district ? WARD_OPTIONS[district] ?? [] : [];
  const isValid = Boolean(city && district && ward && detail.trim());

  const handleCityPress = () => {
    const nextCity = cycleOption(city, CITY_OPTIONS);
    setCity(nextCity);
    setDistrict('');
    setWard('');
    setHasMapPin(false);
  };

  const handleDistrictPress = () => {
    if (!city) {
      return;
    }

    const nextDistrict = cycleOption(district, districtOptions);
    setDistrict(nextDistrict);
    setWard('');
    setHasMapPin(false);
  };

  const handleWardPress = () => {
    if (!district) {
      return;
    }

    const nextWard = cycleOption(ward, wardOptions);
    setWard(nextWard);
    setHasMapPin(false);
  };

  const handleConfirm = () => {
    if (!isValid) {
      return;
    }

    const mapLabel = hasMapPin
      ? `Đã ghim vị trí trên bản đồ tại ${ward}, ${district}`
      : '';

    setAddress({
      city,
      district,
      ward,
      detail: detail.trim(),
      hasMapPin,
      mapLabel,
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
            <Text style={styles.warningStrong}>Thông tin:</Text> Nếu địa chỉ của bạn không có trong
            danh sách bên dưới. Vui lòng liên hệ với nhân viên để được hỗ trợ!
          </Text>
        </View>

        <View style={styles.formCard}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleCityPress} style={styles.selector}>
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
            onPress={handleDistrictPress}
            style={[styles.selector, !city && styles.selectorDisabled]}
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
            onPress={handleWardPress}
            style={[styles.selector, !district && styles.selectorDisabled]}
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
            disabled={!ward}
            onPress={() => setHasMapPin((current) => !current)}
            style={[styles.mapButton, !ward && styles.mapButtonDisabled]}
          >
            <Ionicons name="location" size={22} color={Colors.textPrimary} />
            <Text style={styles.mapButtonText}>
              {hasMapPin ? 'Đã lấy vị trí trên bản đồ' : 'Lấy vị trí trên bản đồ'}
            </Text>
          </TouchableOpacity>

          {hasMapPin ? (
            <Text style={styles.mapMeta}>Vị trí mẫu đang được ghim gần khu vực {ward}</Text>
          ) : null}
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
    backgroundColor: '#30E45D',
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
    color: '#13823B',
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
    backgroundColor: '#97D8AA',
  },
  confirmButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
