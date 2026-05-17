import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
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
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userType, setUserType] = useState<UserType>('CUSTOMER');
  const [loading, setLoading] = useState(false);

  const validateRegisterForm = () => {
    if (!username.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      return 'Vui lòng điền đầy đủ thông tin bắt buộc.';
    }

    if (username.trim().length < 3) {
      return 'Tên đăng nhập phải có ít nhất 3 ký tự.';
    }

    const normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      return 'Số điện thoại phải từ 10 đến 11 số.';
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      return 'Email không hợp lệ.';
    }

    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự.';
    }

    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp.';
    }

    return null;
  };

  const requestOtp = async () => {
    const validationError = validateRegisterForm();
    if (validationError) {
      Alert.alert('Thông tin chưa hợp lệ', validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.authenticationRegister(email.trim());

      if (response.code === 200 && response.result) {
        setStep(2);
        Alert.alert('Đã gửi mã xác thực', 'OTP đã được gửi tới email của bạn. Mã có hiệu lực trong 5 phút.');
        return;
      }

      Alert.alert('Không thể gửi OTP', response.message || 'Yêu cầu xác thực đăng ký thất bại.');
    } catch (err: any) {
      Alert.alert('Lỗi kết nối', err?.response?.data?.message || 'Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegister = async () => {
    if (!otp.trim()) {
      Alert.alert('Thiếu mã OTP', 'Vui lòng nhập mã xác thực đã gửi qua email.');
      return;
    }

    setLoading(true);
    try {
      const verifyResponse = await authService.acceptAuthenticationRegister(email.trim(), otp.trim());

      if (!(verifyResponse.code === 200 && verifyResponse.result)) {
        Alert.alert('OTP không hợp lệ', verifyResponse.message || 'Mã OTP không đúng hoặc đã hết hạn.');
        return;
      }

      const registerResponse = await authService.register({
        username: username.trim(),
        phone: phone.replace(/\D/g, ''),
        email: email.trim(),
        password,
        userType,
      });

      if (registerResponse.code === 1000 || registerResponse.result?.status) {
        Alert.alert('Đăng ký thành công', 'Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục.', [
          {
            text: 'Đăng nhập',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]);
        return;
      }

      Alert.alert('Đăng ký thất bại', registerResponse.message || 'Không thể tạo tài khoản.');
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
          {step === 1 ? (
            <>
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

              <AuthInput
                label="Email xác thực"
                required
                placeholder="Nhập email để nhận OTP"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>
                Bạn đăng ký với vai trò? <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.radioGroup}>
                <RoleOption
                  label="Chủ trọ"
                  active={userType === 'HOST'}
                  onPress={() => setUserType('HOST')}
                />
                <RoleOption
                  label="Người tìm trọ"
                  active={userType === 'CUSTOMER'}
                  onPress={() => setUserType('CUSTOMER')}
                />
                <RoleOption
                  label="Môi giới"
                  active={userType === 'BROKER'}
                  onPress={() => setUserType('BROKER')}
                />
              </View>

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

              <AuthButton
                title="Nhận mã xác thực"
                variant="primary"
                onPress={requestOtp}
                loading={loading}
              />

              <AuthButton
                title="Bạn đã có tài khoản, Đăng nhập?"
                variant="outline"
                onPress={() => router.replace('/(auth)/login')}
              />
            </>
          ) : (
            <>
              <WarningBox
                variant="info"
                message={`Mã OTP đã được gửi tới ${email.trim()}. Hãy nhập mã trong vòng 5 phút để hoàn tất đăng ký.`}
              />

              <AuthInput
                label="Mã OTP"
                required
                placeholder="Nhập mã xác thực"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
              />

              <AuthButton
                title="Xác thực và tạo tài khoản"
                variant="primary"
                onPress={handleCompleteRegister}
                loading={loading}
              />

              <AuthButton
                title="Gửi lại mã OTP"
                variant="outline"
                onPress={requestOtp}
                disabled={loading}
              />

              <TouchableOpacity onPress={() => setStep(1)} style={styles.secondaryLink}>
                <Text style={styles.secondaryLinkText}>Quay lại chỉnh thông tin đăng ký</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <SupportFooter showSupportDetails />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface RoleOptionProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function RoleOption({ label, active, onPress }: RoleOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.radioButton, active && styles.radioButtonActive]}
      onPress={onPress}
    >
      <View style={[styles.radioCircle, active && styles.radioCircleActive]}>
        {active ? <View style={styles.radioInnerCircle} /> : null}
      </View>
      <Text style={[styles.radioLabel, active && styles.radioLabelActive]}>{label}</Text>
    </TouchableOpacity>
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
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  radioButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray400,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 12,
    color: Colors.gray600,
    fontWeight: FontWeights.medium,
  },
  radioLabelActive: {
    color: Colors.primary,
    fontWeight: FontWeights.bold,
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
