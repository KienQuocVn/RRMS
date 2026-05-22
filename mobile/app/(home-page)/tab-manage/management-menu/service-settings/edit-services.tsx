import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { motelManagementService } from '@/services/api/motel-service.service';
import { motelService } from '@/services/api/motel.service';
import { roomService } from '@/services/api/room.service';
import { MotelResponse } from '@/types/motel.types';
import { RoomResponse2 } from '@/types/room.types';
import { MotelServiceItem } from '@/types/service-settings.types';

function normalizeDigits(value: string) {
  return value.replace(/[^\d]/g, '');
}

function formatPricePreview(value: string) {
  if (!value) {
    return '';
  }

  return Number(value).toLocaleString('vi-VN');
}

function resolveCurrentMotel(motels: MotelResponse[], motelIdParam?: string) {
  if (motelIdParam) {
    return motels.find((motel) => motel.motelId === motelIdParam) ?? motels[0] ?? null;
  }

  return motels[0] ?? null;
}

function deriveMeterState(service: MotelServiceItem) {
  return String(service.chargetype || '').trim().toUpperCase() === 'METER';
}

function getInitialUnit(service: MotelServiceItem) {
  const normalizedName = service.nameService.toLowerCase();
  if (!deriveMeterState(service)) {
    return 'Tháng';
  }

  if (normalizedName.includes('điện') || normalizedName.includes('dien')) {
    return 'KWh';
  }

  if (normalizedName.includes('nước') || normalizedName.includes('nuoc')) {
    return 'Khối';
  }

  return 'Số';
}

function buildUnitOptions(isMeterBased: boolean) {
  return isMeterBased ? ['Số', 'KWh', 'Khối'] : ['Tháng', 'Người', 'Phòng'];
}

export default function EditServicesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ motelId?: string; motelServiceId?: string }>();
  const user = useAuth((state) => state.user);

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [service, setService] = useState<MotelServiceItem | null>(null);
  const [rooms, setRooms] = useState<RoomResponse2[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [isMeterBased, setIsMeterBased] = useState(false);
  const [unit, setUnit] = useState('Tháng');
  const [priceInput, setPriceInput] = useState('');
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  const unitOptions = useMemo(() => buildUnitOptions(isMeterBased), [isMeterBased]);
  const allRoomsSelected = rooms.length > 0 && selectedRoomIds.length === rooms.length;
  const selectedRoomsCount = selectedRoomIds.length;
  const unitSuffix = `Đồng/${unit}`;

  const loadBootstrapData = useCallback(async () => {
    if (!user?.username || !params.motelServiceId) {
      setIsBootstrapping(false);
      return;
    }

    setIsBootstrapping(true);

    try {
      const [motelsResponse, serviceResponse] = await Promise.all([
        motelService.getMotelsByAccount(user.username),
        motelManagementService.getMotelServiceById(params.motelServiceId),
      ]);

      const currentMotel = resolveCurrentMotel(motelsResponse.result || [], params.motelId);

      if (!currentMotel) {
        setService(null);
        setRooms([]);
        return;
      }

      const roomsResponse = await roomService.getRoomsByMotel(currentMotel.motelId);
      const nextService = serviceResponse.result;
      const preselectedRooms = (roomsResponse.result || [])
        .filter((room) =>
          Array.isArray(room.services) &&
          room.services.some((roomServiceItem) => roomServiceItem.serviceId === nextService.motelServiceId),
        )
        .map((room) => room.roomId);

      setService(nextService);
      setRooms(roomsResponse.result || []);
      setServiceName(nextService.nameService);
      setIsMeterBased(deriveMeterState(nextService));
      setUnit(getInitialUnit(nextService));
      setPriceInput(String(nextService.price || ''));
      setSelectedRoomIds(preselectedRooms);
    } catch (error: any) {
      Alert.alert(
        'Không thể tải dịch vụ',
        error?.response?.data?.message || 'Vui lòng thử lại sau.',
      );
    } finally {
      setIsBootstrapping(false);
    }
  }, [params.motelId, params.motelServiceId, user?.username]);

  useFocusEffect(
    useCallback(() => {
      void loadBootstrapData();
    }, [loadBootstrapData]),
  );

  const handleToggleMeterBased = useCallback(() => {
    setIsMeterBased((current) => {
      const nextValue = !current;
      setUnit(nextValue ? 'Số' : 'Tháng');
      return nextValue;
    });
  }, []);

  const handleSelectUnit = useCallback(() => {
    Alert.alert(
      'Chọn đơn vị',
      'Hãy chọn đơn vị áp dụng cho dịch vụ.',
      [
        ...unitOptions.map((option) => ({
          text: option,
          onPress: () => setUnit(option),
        })),
        { text: 'Hủy', style: 'cancel' as const },
      ],
    );
  }, [unitOptions]);

  const handleResetUnit = useCallback(() => {
    if (!service) {
      setUnit(isMeterBased ? 'Số' : 'Tháng');
      return;
    }

    setUnit(getInitialUnit({ ...service, chargetype: isMeterBased ? 'METER' : 'FIXED' }));
  }, [isMeterBased, service]);

  const handleToggleRoom = useCallback((roomId: string) => {
    setSelectedRoomIds((current) =>
      current.includes(roomId)
        ? current.filter((item) => item !== roomId)
        : [...current, roomId],
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedRoomIds((current) =>
      current.length === rooms.length ? [] : rooms.map((room) => room.roomId),
    );
  }, [rooms]);

  const handleSubmit = useCallback(async () => {
    const trimmedServiceName = serviceName.trim();
    const normalizedPrice = normalizeDigits(priceInput);

    if (!service) {
      Alert.alert('Thiếu dịch vụ', 'Không tìm thấy dịch vụ để cập nhật.');
      return;
    }

    if (!trimmedServiceName) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên dịch vụ.');
      return;
    }

    if (!normalizedPrice) {
      Alert.alert('Thiếu giá dịch vụ', 'Vui lòng nhập giá dịch vụ.');
      return;
    }

    try {
      setIsSubmitting(true);
      await motelManagementService.updateMotelService(service.motelServiceId, {
        nameService: trimmedServiceName,
        price: Number(normalizedPrice),
        chargetype: isMeterBased ? 'METER' : 'FIXED',
        selectedRooms: selectedRoomIds,
      });

      Alert.alert('Thành công', 'Dịch vụ đã được cập nhật.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Cập nhật thất bại',
        error?.response?.data?.message || 'Không thể lưu thay đổi lúc này.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isMeterBased, priceInput, router, selectedRoomIds, service, serviceName]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa dịch vụ</Text>
      </View>

      {isBootstrapping ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.centerText}>Đang tải thông tin dịch vụ...</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.label}>
                Tên dịch vụ <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Tên dịch vụ"
                placeholderTextColor={Colors.gray400}
                value={serviceName}
                onChangeText={setServiceName}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.meterCard}>
                <View style={styles.meterIconWrap}>
                  <Ionicons name="speedometer-outline" size={20} color="#3F3D56" />
                </View>

                <View style={styles.meterContent}>
                  <Text style={styles.meterTitle}>Tính theo kiểu đồng hồ điện, nước ?</Text>
                  <Text style={styles.meterDescription}>
                    Mức sử dụng của khách thuê có sự chênh lệch trước & sau
                  </Text>
                  <Text style={styles.meterExample}>
                    * Ví dụ: Dịch vụ điện, nước có sự chênh lệch số cũ và số mới
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleToggleMeterBased}
                  style={[styles.toggle, isMeterBased && styles.toggleActive]}
                >
                  <View style={[styles.toggleThumb, isMeterBased && styles.toggleThumbActive]} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Đơn vị và giá</Text>
              <Text style={styles.sectionSubtitle}>Nhập thông tin đơn vị tính và giá dịch vụ</Text>

              <TouchableOpacity style={styles.unitBox} onPress={handleSelectUnit}>
                <View>
                  <Text style={styles.unitLabel}>
                    Đơn vị <Text style={styles.required}>*</Text>
                  </Text>
                  <Text style={styles.unitValue}>{unit}</Text>
                </View>

                <TouchableOpacity style={styles.unitResetButton} onPress={handleResetUnit}>
                  <Ionicons name="close" size={16} color={Colors.textPrimary} />
                </TouchableOpacity>
              </TouchableOpacity>

              <Text style={[styles.label, styles.priceLabel]}>
                Giá dịch vụ <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.priceHint}>
                Ví dụ Tiền rác: 30.000 đ / 1 người, bạn nhập là 30000
              </Text>

              <View style={styles.priceInputWrap}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Nhập giá dịch vụ"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="numeric"
                  value={formatPricePreview(priceInput)}
                  onChangeText={(value) => setPriceInput(normalizeDigits(value))}
                />
                <View style={styles.priceSuffixChip}>
                  <Text style={styles.priceSuffixText}>{unitSuffix}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.roomsHeader}>
                <View style={styles.roomsHeaderText}>
                  <Text style={styles.sectionTitle}>Chọn phòng sử dụng ({selectedRoomsCount} đã chọn)</Text>
                  <Text style={styles.sectionSubtitle}>
                    Nhấp chọn các phòng muốn áp dụng dịch vụ này
                  </Text>
                </View>

                <TouchableOpacity style={styles.selectAllBox} onPress={handleToggleSelectAll}>
                  <View style={[styles.checkboxCircle, allRoomsSelected && styles.checkboxCircleActive]}>
                    {allRoomsSelected ? (
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    ) : null}
                  </View>
                  <Text style={styles.selectAllText}>{allRoomsSelected ? 'Bỏ tất cả' : 'Chọn tất cả'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.roomsGrid}>
                {rooms.map((room) => {
                  const isSelected = selectedRoomIds.includes(room.roomId);

                  return (
                    <TouchableOpacity
                      key={room.roomId}
                      style={[styles.roomCard, isSelected && styles.roomCardSelected]}
                      onPress={() => handleToggleRoom(room.roomId)}
                    >
                      <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleActive]}>
                        {isSelected ? (
                          <Ionicons name="checkmark" size={14} color={Colors.white} />
                        ) : null}
                      </View>
                      <View style={styles.roomTextWrap}>
                        <Text style={styles.roomName}>{room.name}</Text>
                        <Text style={[styles.roomStatus, isSelected && styles.roomStatusSelected]}>
                          {isSelected ? 'Đang áp dụng' : 'Không áp dụng'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting || !service}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
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
    borderBottomColor: Colors.gray100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    backgroundColor: Colors.gray50,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  section: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
  },
  divider: {
    height: 14,
    backgroundColor: '#EEF2F4',
  },
  label: {
    marginBottom: 8,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  required: {
    color: '#E53935',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  meterCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meterIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E7FAF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  meterContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  meterTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  meterDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  meterExample: {
    fontSize: FontSizes.xs,
    lineHeight: 16,
    color: '#F97316',
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D9EEDF',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#D9F3DE',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9E9E9E',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#85C83D',
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  unitBox: {
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  unitValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  unitResetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceLabel: {
    marginTop: Spacing.lg,
  },
  priceHint: {
    marginBottom: Spacing.base,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  priceInputWrap: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingRight: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  priceSuffixChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F2FAED',
  },
  priceSuffixText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  roomsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  roomsHeaderText: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  selectAllBox: {
    alignItems: 'center',
    width: 100,
  },
  selectAllText: {
    marginTop: 4,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#2E2E46',
    backgroundColor: '#F3F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleActive: {
    backgroundColor: '#85C83D',
    borderColor: '#85C83D',
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
  },
  roomCard: {
    width: '47.5%',
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  roomCardSelected: {
    borderColor: '#85C83D',
    backgroundColor: '#F7FFF2',
  },
  roomTextWrap: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  roomName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  roomStatus: {
    fontSize: FontSizes.sm,
    color: '#F97316',
  },
  roomStatusSelected: {
    color: '#12A04A',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  submitButton: {
    backgroundColor: '#12A04A',
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
