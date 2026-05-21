import React, { useCallback, useState } from 'react';
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
import { useRouter } from 'expo-router';

import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { buildProfileUpdatePayload, profileService } from '@/services/api/profile.service';
import { Gender } from '@/types/auth.types';
import { Profile } from '@/types/profile.types';

const GENDER_OPTIONS = [
  { label: 'Nam', value: Gender.MALE },
  { label: 'Nữ', value: Gender.FEMALE },
  { label: 'Khác', value: Gender.OTHER },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const updateUserProfile = useAuth((state) => state.updateUserProfile);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
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
          setFullName(response.result.fullName);
          setEmail(response.result.email);
          setGender(response.result.gender ?? null);
        } catch (error: any) {
          if (isActive) {
            Alert.alert(
              'Không thể tải hồ sơ',
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

  const handleSave = useCallback(async () => {
    if (!profile) {
      return;
    }

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFullName) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ và tên.');
      return;
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      Alert.alert('Email chưa hợp lệ', 'Vui lòng nhập đúng định dạng email.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await profileService.updateProfile(
        buildProfileUpdatePayload(profile, {
          fullName: trimmedFullName,
          email: trimmedEmail,
          gender,
        }),
      );

      setProfile(response.result);
      await updateUserProfile({
        fullName: response.result.fullName,
        fullname: response.result.fullName,
        email: response.result.email,
        gender: response.result.gender ?? undefined,
      });

      Alert.alert('Thành công', 'Hồ sơ cá nhân đã được cập nhật.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Cập nhật thất bại',
        error?.response?.data?.message || 'Không thể lưu thông tin lúc này.',
      );
    } finally {
      setIsSaving(false);
    }
  }, [email, fullName, gender, profile, router, updateUserProfile]);

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
          <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          <Text style={styles.headerSub}>Cập nhật họ tên, email và giới tính</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.centerText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Họ và tên <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                placeholderTextColor={Colors.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = gender === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.genderChip, isSelected && styles.genderChipSelected]}
                      onPress={() => setGender(option.value)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          isSelected && styles.genderChipTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelBtnText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
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
  headerSub: {
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
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
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
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  genderChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  genderChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  genderChipText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  genderChipTextSelected: {
    color: Colors.primaryDark,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    backgroundColor: Colors.white,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    minHeight: 50,
  },
  cancelBtnText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    minHeight: 50,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.white,
  },
});
