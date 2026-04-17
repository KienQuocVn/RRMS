/**
 * Register Screen - Màn hình đăng ký tài khoản
 * Header custom: "Đăng ký tài khoản" + back button
 * Layout 2 cột cho mật khẩu + xác nhận mật khẩu
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
  PasswordHints,
  SupportFooter,
} from '@/components/auth';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();

  // ── State ──
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Handlers ──
  const handleRegister = async () => {
    setLoading(true);
    // TODO: Gọi API đăng ký
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
        <Text style={styles.headerTitle}>Đăng ký tài khoản</Text>
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
            label="Tên (Dùng hiển thị)"
            required
            placeholder="Nhập tên của bạn"
            value={name}
            onChangeText={setName}
          />

          <AuthInput
            label="SĐT (Dùng đăng nhập)"
            required
            placeholder="Nhập đúng SĐT của bạn"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* 2 cột: Mật khẩu + Xác nhận */}
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
                placeholder="Nhập mật khẩu"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                containerStyle={styles.noMarginBottom}
              />
            </View>
          </View>

          {/* Password hints */}
          <PasswordHints password={password} />

          {/* Điều khoản */}
          <Text style={styles.terms}>
            Khi tạo tài khoản là bạn đã chấp nhận{' '}
            <Text style={styles.termsLink}>Điều khoản dịch vụ</Text>
            {' '}và{' '}
            <Text style={styles.termsLink}>Chính sách bảo mật</Text>
            {' '}của chúng tôi.
          </Text>

          {/* Nút đăng ký */}
          <AuthButton
            title="Tạo tài khoản mới"
            variant="primary"
            onPress={handleRegister}
            loading={loading}
          />

          <AuthButton
            title="Bạn đã có tài khoản, Đăng nhập?"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>

        {/* ── Footer hỗ trợ ── */}
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
});
