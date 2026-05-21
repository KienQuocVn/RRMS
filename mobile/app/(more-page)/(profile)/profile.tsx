import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { profileService } from '@/services/api/profile.service';
import { Profile } from '@/types/profile.types';

function formatGenderLabel(gender?: Profile['gender']) {
  switch (gender) {
    case 'MALE':
      return 'Nam';
    case 'FEMALE':
      return 'Nữ';
    case 'OTHER':
      return 'Khác';
    default:
      return 'Chưa cập nhật';
  }
}

function formatDateLabel(value?: string | null) {
  if (!value) {
    return 'Chưa cập nhật';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  return value;
}

type ProfileItemProps = {
  label: string;
  value?: string;
  valueColor?: string;
  valueBold?: boolean;
};

function ProfileItem({ label, value, valueColor, valueBold }: ProfileItemProps) {
  return (
    <View style={styles.profileItem}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text
        style={[
          styles.itemValue,
          { color: valueColor || Colors.textPrimary, fontWeight: valueBold ? '700' : '400' },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const username = user?.username;

  const loadProfile = useCallback(async () => {
    if (!username) {
      setError('Không tìm thấy thông tin tài khoản.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await profileService.getProfile(username);
      setProfile(response.result);
    } catch (fetchError: any) {
      setError(fetchError?.response?.data?.message || 'Không thể tải hồ sơ cá nhân.');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  const avatarUri = profile?.avatar || 'https://avatar.iran.liara.run/public/boy';

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Thêm</Text>
          <Text style={styles.headerSub}>Cá nhân</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/edit-profile')}>
            <Ionicons name="pencil" size={16} color={Colors.textPrimary} style={styles.editIcon} />
            <Text style={styles.editBtnText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.stateText}>Đang tải thông tin hồ sơ...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => void loadProfile()}>
              <Text style={styles.retryBtnText}>Tải lại</Text>
            </TouchableOpacity>
          </View>
        ) : profile ? (
          <View style={styles.listSection}>
            <ProfileItem label="Tên đăng nhập" value={profile.username} valueBold />
            <ProfileItem label="Trạng thái tài khoản" value="Đã xác minh" valueColor={Colors.success} valueBold />
            <ProfileItem label="Họ và tên" value={profile.fullName} valueBold />
            <ProfileItem
              label="Số điện thoại"
              value={profile.phone || 'Chưa cung cấp'}
              valueColor={profile.phone ? Colors.textPrimary : '#E65100'}
              valueBold={Boolean(profile.phone)}
            />
            <ProfileItem label="Email" value={profile.email || 'Chưa cập nhật'} valueBold />
            <ProfileItem label="Giới tính" value={formatGenderLabel(profile.gender)} />
            <ProfileItem label="Ngày sinh" value={formatDateLabel(profile.birthday)} />
          </View>
        ) : null}

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.8}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={Colors.textPrimary} />
            ) : (
              <>
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={Colors.textPrimary}
                  style={styles.actionIcon}
                />
                <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.deleteLabel}>Tôi muốn xóa tài khoản</Text>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => Alert.alert('Thông báo', 'Chức năng xóa tài khoản chưa được hỗ trợ.')}
          >
            <Ionicons name="trash" size={18} color={Colors.white} style={styles.actionIcon} />
            <Text style={styles.deleteBtnText}>Xóa tài khoản vĩnh viễn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
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
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  topSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.gray200,
    marginBottom: Spacing.md,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editIcon: {
    marginRight: 6,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stateBox: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.xl,
  },
  stateText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  errorText: {
    textAlign: 'center',
    fontSize: FontSizes.md,
    color: Colors.error,
  },
  retryBtn: {
    marginTop: Spacing.md,
    borderRadius: 999,
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  retryBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  listSection: {
    backgroundColor: Colors.white,
    marginTop: Spacing.md,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    gap: Spacing.md,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  itemValue: {
    maxWidth: '55%',
    fontSize: 14,
    textAlign: 'right',
  },
  actionsSection: {
    backgroundColor: Colors.white,
    marginTop: Spacing.md,
    padding: Spacing.base,
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  logoutBtn: {
    minHeight: 52,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: Spacing.xl,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  deleteLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  deleteBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    paddingVertical: 14,
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  actionIcon: {
    marginRight: 8,
  },
});
