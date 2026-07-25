import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/api/auth.service';
import {
  AuthLogo,
  AuthInput,
  AuthButton,
  PasswordHints,
  SupportFooter,
  WarningBox,
} from '@/components/auth';
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from '@/constants/theme';
import { UserType } from '@/types/auth.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('HOST');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login');
    }
  };

  const validateRegisterForm = () => {
    if (!username.trim() || !phone.trim() || !password.trim()) {
      return 'Vui lòng điền đầy đủ thông tin bắt buộc.';
    }

    if (username.trim().length < 3) {
      return 'Tên đăng nhập phải có ít nhất 3 ký tự.';
    }

    const normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      return 'Số điện thoại phải từ 10 đến 11 số.';
    }

    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự.';
    }

    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp.';
    }

    return null;
  };

  const handleRegister = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    const validationError = validateRegisterForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      const registerResponse = await authService.register({
        username: username.trim(),
        phone: phone.replace(/\D/g, ''),
        password,
        userType,
      });

      if (registerResponse.code === 1000 || registerResponse.result?.status) {
        setSuccessMessage('Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...');
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1500);
        return;
      }

      const errorMsg = registerResponse.message || 'Không thể tạo tài khoản.';
      setErrorMessage(`Đăng ký thất bại: ${errorMsg}`);
    } catch (err: any) {
      const serverErrorMsg = err?.response?.data?.message;
      if (serverErrorMsg) {
        setErrorMessage(`Đăng ký thất bại: ${serverErrorMsg}`);
      } else {
        const connErrorMsg = err?.message || 'Không thể kết nối máy chủ.';
        setErrorMessage(`Lỗi kết nối: ${connErrorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký tài khoản</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthLogo size="small" />

        <View style={styles.form}>
          <AuthInput
            label="Tên đăng nhập"
            required
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChangeText={setUsername}
          />

          <AuthInput
            label="Số điện thoại"
            required
            placeholder="Nhập đúng SĐT của bạn"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />



          <View style={styles.passwordRow}>
            <View style={styles.passwordCol}>
              <AuthInput
                label="Mật khẩu"
                required
                placeholder="Nhập mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                containerStyle={styles.noMarginBottom}
              />
            </View>
            <View style={styles.passwordColGap} />
            <View style={styles.passwordCol}>
              <AuthInput
                label="Xác nhận mật khẩu"
                required
                placeholder="Nhập lại mật khẩu"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                containerStyle={styles.noMarginBottom}
              />
            </View>
          </View>

          <PasswordHints password={password} />

          <Text style={styles.terms}>
            Khi tạo tài khoản là bạn đã chấp nhận{' '}
            <Text style={styles.termsLink}>Điều khoản dịch vụ</Text>
            {' '}và{' '}
            <Text style={styles.termsLink}>Chính sách bảo mật</Text>
            {' '}của chúng tôi.
          </Text>

          {errorMessage ? (
            <WarningBox variant="error" message={errorMessage} />
          ) : null}

          {successMessage ? (
            <WarningBox variant="info" message={successMessage} />
          ) : null}

          <AuthButton
            title="Đăng ký"
            variant="primary"
            onPress={handleRegister}
            loading={loading}
          />

          <AuthButton
            title="Bạn đã có tài khoản, Đăng nhập?"
            variant="outline"
            onPress={() => router.replace('/(auth)/login')}
          />
        </View>

        <SupportFooter showSupportDetails />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Platform.OS === 'ios' ? 56 : 12,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },

  passwordRow: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  passwordCol: {
    flex: 1,
  },
  passwordColGap: {
    width: Spacing.md,
  },
  noMarginBottom: {
    marginBottom: 0,
  },
  terms: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    textDecorationLine: 'underline',
  },
  secondaryLink: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  secondaryLinkText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
});
