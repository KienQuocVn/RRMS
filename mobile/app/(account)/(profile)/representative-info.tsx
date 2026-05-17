import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { buildProfileUpdatePayload, profileService } from '@/services/api/profile.service';
import { Profile } from '@/types/profile.types';

type RepresentativeForm = {
  fullName: string;
  phone: string;
  birthday: string;
  job: string;
  address: string;
  cccd: string;
  placeOfIssue: string;
  dateOfIssue: string;
};

function formatDateForInput(value?: string | null) {
  if (!value) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  return value;
}

function parseDateToApi(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, rawDay, rawMonth, year] = match;
  const day = rawDay.padStart(2, '0');
  const month = rawMonth.padStart(2, '0');
  const isoValue = `${year}-${month}-${day}`;
  const parsedDate = new Date(`${isoValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return isoValue;
}

function buildForm(profile: Profile): RepresentativeForm {
  return {
    fullName: profile.fullName || '',
    phone: profile.phone || '',
    birthday: formatDateForInput(profile.birthday),
    job: profile.job || '',
    address: profile.address || '',
    cccd: profile.cccd || '',
    placeOfIssue: profile.placeOfIssue || '',
    dateOfIssue: formatDateForInput(profile.dateOfIssue),
  };
}

export default function RepresentativeInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const updateUserProfile = useAuth((state) => state.updateUserProfile);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<RepresentativeForm>({
    fullName: '',
    phone: '',
    birthday: '',
    job: '',
    address: '',
    cccd: '',
    placeOfIssue: '',
    dateOfIssue: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const username = user?.username;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProfile() {
        if (!username) {
          if (isActive) {
            setIsLoading(false);
            Alert.alert('Thông báo', 'Không tìm thấy tài khoản đăng nhập.');
          }
          return;
        }

        setIsLoading(true);

        try {
          const response = await profileService.getProfile(username);
          if (!isActive) {
            return;
          }

          setProfile(response.result);
          setForm(buildForm(response.result));
        } catch (error: any) {
          if (isActive) {
            Alert.alert(
              'Không thể tải thông tin',
              error?.response?.data?.message || 'Vui lòng thử lại sau.',
            );
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      void loadProfile();

      return () => {
        isActive = false;
      };
    }, [username]),
  );

  const setField = useCallback((key: keyof RepresentativeForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile) {
      return;
    }

    const trimmedValues = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      birthday: form.birthday.trim(),
      job: form.job.trim(),
      address: form.address.trim(),
      cccd: form.cccd.trim(),
      placeOfIssue: form.placeOfIssue.trim(),
      dateOfIssue: form.dateOfIssue.trim(),
    };

    if (
      !trimmedValues.fullName ||
      !trimmedValues.phone ||
      !trimmedValues.birthday ||
      !trimmedValues.job ||
      !trimmedValues.address ||
      !trimmedValues.cccd ||
      !trimmedValues.placeOfIssue ||
      !trimmedValues.dateOfIssue
    ) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const birthday = parseDateToApi(trimmedValues.birthday);
    const dateOfIssue = parseDateToApi(trimmedValues.dateOfIssue);

    if (!birthday || !dateOfIssue) {
      Alert.alert(
        'Ngày chưa hợp lệ',
        'Vui lòng nhập ngày theo định dạng dd/mm/yyyy hoặc yyyy-mm-dd.',
      );
      return;
    }

    setIsSaving(true);

    try {
      const response = await profileService.updateProfile(
        buildProfileUpdatePayload(profile, {
          fullName: trimmedValues.fullName,
          phone: trimmedValues.phone,
          birthday,
          job: trimmedValues.job,
          address: trimmedValues.address,
          cccd: trimmedValues.cccd,
          placeOfIssue: trimmedValues.placeOfIssue,
          dateOfIssue,
        }),
      );

      setProfile(response.result);
      setForm(buildForm(response.result));
      await updateUserProfile({
        fullName: response.result.fullName,
        fullname: response.result.fullName,
        phone: response.result.phone,
        birthday: response.result.birthday ?? undefined,
        cccd: response.result.cccd ?? undefined,
      });

      Alert.alert('Thành công', 'Thông tin đại diện chủ tòa nhà đã được lưu.');
    } catch (error: any) {
      Alert.alert(
        'Lưu thất bại',
        error?.response?.data?.message || 'Không thể lưu thông tin lúc này.',
      );
    } finally {
      setIsSaving(false);
    }
  }, [form, profile, updateUserProfile]);

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
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Thông tin đại diện của tòa nhà</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.centerText}>Đang tải thông tin đại diện...</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.alertBanner}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#E65100"
                style={styles.alertIcon}
              />
              <Text style={styles.alertText}>
                Các thông tin này sẽ được dùng làm dữ liệu mẫu cho hợp đồng, văn bản tạm trú và
                các biểu mẫu liên quan đến khách thuê.
              </Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flexItem, styles.rowSpacing]}>
                <Text style={styles.label}>
                  Tên người đại diện <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.fullName}
                  onChangeText={(value) => setField('fullName', value)}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor={Colors.gray400}
                />
              </View>
              <View style={[styles.inputGroup, styles.flexItem]}>
                <Text style={styles.label}>
                  Số điện thoại <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.phone}
                  onChangeText={(value) => setField('phone', value)}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Ngày sinh <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.birthday}
                onChangeText={(value) => setField('birthday', value)}
                placeholder="dd/mm/yyyy hoặc yyyy-mm-dd"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nghề nghiệp <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.job}
                onChangeText={(value) => setField('job', value)}
                placeholder="Ví dụ: Quản lý tòa nhà"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Địa chỉ <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(value) => setField('address', value)}
                placeholder="Nhập địa chỉ"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Số CCCD/Passport <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.cccd}
                onChangeText={(value) => setField('cccd', value)}
                placeholder="Nhập số CCCD hoặc passport"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flexItem, styles.rowSpacing]}>
                <Text style={styles.label}>
                  Nơi cấp <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.placeOfIssue}
                  onChangeText={(value) => setField('placeOfIssue', value)}
                  placeholder="Nhập nơi cấp"
                  placeholderTextColor={Colors.gray400}
                />
              </View>
              <View style={[styles.inputGroup, styles.flexItem]}>
                <Text style={styles.label}>
                  Ngày cấp <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.dateOfIssue}
                  onChangeText={(value) => setField('dateOfIssue', value)}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor={Colors.gray400}
                />
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
              <Ionicons name="close" size={18} color={Colors.textPrimary} style={styles.footerIcon} />
              <Text style={styles.btnCancelText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSave, isSaving && styles.btnSaveDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Ionicons
                    name="save-outline"
                    size={18}
                    color={Colors.white}
                    style={styles.footerIcon}
                  />
                  <Text style={styles.btnSaveText}>Lưu thông tin</Text>
                </>
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
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  alertIcon: {
    marginRight: 8,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
  },
  flexItem: {
    flex: 1,
  },
  rowSpacing: {
    marginRight: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: Spacing.md,
  },
  btnCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnCancelText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  btnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnSaveDisabled: {
    opacity: 0.7,
  },
  btnSaveText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.white,
  },
  footerIcon: {
    marginRight: 6,
  },
});
