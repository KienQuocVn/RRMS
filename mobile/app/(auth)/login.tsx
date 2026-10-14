import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
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
import { useApiConnection } from '@/hooks/use-api-connection';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const {
    isConnected,
    isChecking: isCheckingApi,
    connectionError,
    currentApiUrl,
    retry,
  } = useApiConnection();

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

    const success = await login({ phone: trimmedPhone, password: trimmedPassword });

    if (success) {
      router.replace('/(tabs)/(home)');
    }
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

        {/* Banner trạng thái kết nối backend */}
        {isCheckingApi && (
          <View style={styles.connectingBanner}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.connectingText}>Đang kết nối máy chủ...</Text>
          </View>
        )}

        {!isCheckingApi && isConnected === false && (
          <View style={styles.connectionErrorBanner}>
            <Text style={styles.connectionErrorTitle}>⚠️ Không kết nối được máy chủ</Text>
            <Text style={styles.connectionErrorText}>
              Đang thử kết nối tới:{'\n'}
              <Text style={{ fontWeight: 'bold' }}>{currentApiUrl}</Text>
              {'\n\n'}Kiểm tra: backend đang chạy, điện thoại cùng Wi-Fi với máy tính, IP trong{' '}
              <Text style={{ fontFamily: 'monospace' }}>mobile/.env</Text> đúng.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={retry}>
              <Text style={styles.retryButtonText}>Thử kết nối lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isCheckingApi && isConnected === true && (
          <View style={styles.connectedBanner}>
            <Text style={styles.connectedText}>✓ Đã kết nối máy chủ</Text>
          </View>
        )}

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
              <Text style={styles.errorTitle}>Đăng nhập thất bại</Text>
              <Text style={styles.errorText}>{visibleAuthError}</Text>
            </View>
          ) : null}

          <AuthButton
            title="Đăng nhập tài khoản"
            variant="primary"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!phone.trim() || !password.trim() || isCheckingApi || isLoading}
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
  // Banner đang kết nối
  connectingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
    gap: 8,
  },
  connectingText: {
    color: '#1565C0',
    fontSize: FontSizes.sm,
  },
  // Banner kết nối thành công
  connectedBanner: {
    backgroundColor: '#E8F5E9',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  connectedText: {
    color: '#2E7D32',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  // Banner lỗi kết nối
  connectionErrorBanner: {
    backgroundColor: '#FFF3E0',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  connectionErrorTitle: {
    color: '#E65100',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    marginBottom: 6,
  },
  connectionErrorText: {
    color: '#BF360C',
    fontSize: FontSizes.xs,
    lineHeight: 18,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#FF6F00',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  // Box lỗi đăng nhập
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFB2B2',
  },
  errorTitle: {
    color: '#C62828',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    marginBottom: 4,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: FontSizes.sm,
    lineHeight: 20,
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
