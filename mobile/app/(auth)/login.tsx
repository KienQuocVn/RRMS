import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useRouter } from 'expo-router';
import {
  AuthLogo,
  AuthInput,
  AuthButton,
  PasswordHints,
  SupportFooter,
} from '@/components/auth';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const visibleAuthError =
    authError === 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      ? null
      : authError;
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (!trimmedPhone || !trimmedPassword) {
      return;
    }

    await login({ phone: trimmedPhone, password: trimmedPassword });
  };

  const handleLoginZalo = () => {
    // TODO: Integrate Zalo SDK.
  };

  const handleLoginApple = () => {
    // TODO: Integrate Apple Sign In.
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthLogo size="normal" />

        <View style={styles.form}>
          <AuthInput
            label="Số điện thoại"
            required
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <AuthInput
            label="Mật khẩu"
            required
            placeholder="Nhập mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PasswordHints password={password} />

          

          {visibleAuthError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{visibleAuthError}</Text>
            </View>
          ) : null}

          <AuthButton
            title="Đăng nhập tài khoản"
            variant="primary"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!phone.trim() || !password.trim()}
          />

          <AuthButton
            title="Đăng nhập với ZALO"
            variant="social-zalo"
            icon="chatbubble-ellipses"
            onPress={handleLoginZalo}
          />

          <AuthButton
            title="Đăng nhập bằng Apple"
            variant="social-apple"
            icon="logo-apple"
            onPress={handleLoginApple}
          />

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkText}>Tạo tài khoản</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.linkText}>Quên tài khoản?</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
  },
  form: {
    flex: 1,
  },
  devHintContainer: {
    backgroundColor: '#EEF7FF',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#C9E4FF',
  },
  devHintTitle: {
    color: '#1565C0',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    marginBottom: 4,
  },
  devHintText: {
    color: '#1565C0',
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFB2B2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  linkText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
});
