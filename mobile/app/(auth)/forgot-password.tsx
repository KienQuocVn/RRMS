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
  WarningBox,
  SupportFooter,
  PasswordHints,
} from '@/components/auth';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    const normalizedEmail = email.trim();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      Alert.alert('Email không hợp lệ', 'Vui lòng nhập đúng email đã đăng ký.');
      return;
    }

    setLoading(true);
    try {
      const checkMailResponse = await authService.checkMail(normalizedEmail);

      if (!(checkMailResponse.code === 200 && checkMailResponse.result)) {
        Alert.alert('Không tìm thấy email', checkMailResponse.message || 'Email này chưa tồn tại trong hệ thống.');
        return;
      }

      const otpResponse = await authService.forgetPassword(normalizedEmail);

      if (otpResponse.code === 200 && otpResponse.result) {
        setStep(2);
        Alert.alert('Đã gửi mã OTP', 'Mã xác nhận đã được gửi tới email của bạn. Mã có hiệu lực trong 5 phút.');
        return;
      }

      Alert.alert('Yêu cầu thất bại', otpResponse.message || 'Không thể gửi OTP đổi mật khẩu.');
    } catch (err: any) {
      Alert.alert('Lỗi kết nối', err?.response?.data?.message || 'Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ OTP và mật khẩu mới.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Mật khẩu chưa hợp lệ', 'Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp', 'Mật khẩu xác nhận không giống mật khẩu mới.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.acceptChangePassword({
        email: email.trim(),
        newPassword,
        code: otp.trim(),
      });

      if (response.code === 200 && response.result) {
        Alert.alert('Đổi mật khẩu thành công', 'Bạn có thể đăng nhập lại bằng mật khẩu mới.', [
          {
            text: 'Đăng nhập',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]);
        return;
      }

      Alert.alert('Không thể đổi mật khẩu', response.message || 'Mã OTP không đúng hoặc đã hết hạn.');
    } catch (err: any) {
      Alert.alert('Lỗi kết nối', err?.response?.data?.message || 'Không thể kết nối máy chủ.');
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
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quên mật khẩu</Text>
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
          {step === 1 ? (
            <>
              <AuthInput
                label="Email"
                required
                placeholder="Nhập email đã đăng ký"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <WarningBox
                variant="warning"
                message="Hệ thống sẽ kiểm tra email trước, sau đó gửi OTP để bạn xác nhận yêu cầu đổi mật khẩu."
              />

              <AuthButton
                title="Yêu cầu đổi mật khẩu"
                variant="primary"
                onPress={handleRequestReset}
                loading={loading}
              />
            </>
          ) : (
            <>
              <WarningBox
                variant="info"
                message={`OTP đã được gửi tới ${email.trim()}. Nhập mã xác thực và mật khẩu mới để hoàn tất.`}
              />

              <AuthInput
                label="Mã OTP"
                required
                placeholder="Nhập mã OTP (5 phút)"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
              />

              <AuthInput
                label="Mật khẩu mới"
                required
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <AuthInput
                label="Xác nhận mật khẩu"
                required
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <PasswordHints password={newPassword} />

              <AuthButton
                title="Xác nhận đổi mật khẩu"
                variant="primary"
                onPress={handleResetPassword}
                loading={loading}
              />

              <AuthButton
                title="Gửi lại mã OTP"
                variant="outline"
                onPress={handleRequestReset}
                disabled={loading}
              />
            </>
          )}

          <AuthButton
            title="Quay lại đăng nhập"
            variant="outline"
            onPress={() => router.replace('/(auth)/login')}
          />
        </View>

        <View style={styles.spacer} />
        <SupportFooter showSupportDetails={false} />
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
    paddingTop: Spacing['2xl'],
  },
  form: {
    flex: 0,
  },
  spacer: {
    flex: 1,
  },
});
