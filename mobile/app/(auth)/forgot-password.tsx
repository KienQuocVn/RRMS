/**
 * Forgot Password Screen - Màn hình quên mật khẩu
 * Header custom: "Quên mật khẩu" + back button
 * Warning box: cảnh báo xác minh SĐT
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/api/auth.service';
import {
  AuthLogo,
  AuthInput,
  AuthButton,
  WarningBox,
  SupportFooter,
} from '@/components/auth';
import { Colors, Spacing, FontSizes, FontWeights, AppConstants } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  // ── State ──
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Handlers ──
  const handleRequestReset = async () => {
    if (!email) {
      alert('Vui lòng nhập email.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.forgetPassword(email);
      if (res.code === 200 || res.result) {
        alert('Mã OTP đã được gửi đến email của bạn.');
        setStep(2);
      } else {
        alert(res.message || 'Yêu cầu thất bại.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.acceptChangePassword({
        email,
        newPassword,
        code: otp
      });
      if (res.code === 200 || res.result) {
        alert('Đổi mật khẩu thành công!');
        router.back();
      } else {
        alert(res.message || 'Mã OTP không đúng hoặc đã hết hạn.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Custom Header ── */}
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
        {/* ── Logo ── */}
        <AuthLogo size="small" />

        {/* ── Form ── */}
        <View style={styles.form}>
          {step === 1 ? (
            <>
              <AuthInput
                label="Email"
                placeholder="Nhập email của bạn"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              {/* Cảnh báo */}
              <WarningBox
                variant="warning"
                message="Chú ý: Hãy chắc chắn email của bạn nhập là đúng. Hệ thống sẽ gửi mã xác nhận qua email này để xác minh trước khi bạn thực hiện yêu cầu đổi mật khẩu mới."
              />

              {/* Buttons */}
              <AuthButton
                title="Yêu cầu đổi mật khẩu"
                variant="primary"
                onPress={handleRequestReset}
                loading={loading}
              />
            </>
          ) : (
            <>
              <AuthInput
                label="Mã OTP"
                placeholder="Nhập mã OTP (5 phút)"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
              />
              <AuthInput
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <AuthInput
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <AuthButton
                title="Xác nhận đổi mật khẩu"
                variant="primary"
                onPress={handleResetPassword}
                loading={loading}
              />
            </>
          )}

          <AuthButton
            title="Quay lại đăng nhập"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>

        {/* Spacer để đẩy footer xuống */}
        <View style={styles.spacer} />

        {/* ── Footer ── */}
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
