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
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Handlers ──
  const handleRequestReset = async () => {
    setLoading(true);
    // TODO: Gọi API yêu cầu đổi mật khẩu
    setTimeout(() => {
      setLoading(false);
    }, 1500);
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
          <AuthInput
            label=""
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Cảnh báo */}
          <WarningBox
            variant="warning"
            message="Chú ý: Hãy chắc chắn số điện thoại của bạn nhập là đúng. Hệ thống sẽ gửi mã xác nhận qua số điện thoại này để xác minh trước khi bạn thực yêu cầu đổi mật khẩu mới."
          />

          {/* Buttons */}
          <AuthButton
            title="Yêu cầu đổi mật khẩu"
            variant="primary"
            onPress={handleRequestReset}
            loading={loading}
          />

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
