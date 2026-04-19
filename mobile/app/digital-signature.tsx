import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function DigitalSignatureScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Thiết lập chữ ký</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        
        {/* Illustration Area */}
        <View style={styles.illustrationArea}>
          <Ionicons name="document-text" size={60} color="#80DEEA" />
          <Text style={styles.illustrationTitle}>Chữ ký số</Text>
          <Text style={styles.illustrationSub}>Dùng để ký hợp đồng thuê nhà, đăng ký tạm trú</Text>
        </View>

        {/* Signature Area */}
        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Chế độ thêm chữ ký</Text>
          <Text style={styles.sectionSub}>Thêm chữ ký vào khung & xác nhận</Text>
          
          <View style={styles.signatureBox}>
            {/* Signature drawing area placeholder */}
          </View>
        </View>

      </View>

      {/* Footer Buttons */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <TouchableOpacity style={styles.btnReset}>
          <Text style={styles.btnResetText}>Xóa làm lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnConfirm}>
          <Text style={styles.btnConfirmText}>Xác nhận chữ ký</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: Spacing.base,
  },
  illustrationArea: {
    alignItems: 'center',
    marginVertical: Spacing['2xl'],
  },
  illustrationTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  illustrationSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  signatureSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  signatureBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 250,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: Spacing.md,
  },
  btnReset: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F57C00', // Orange
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnResetText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.white,
  },
  btnConfirm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success, // Green
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnConfirmText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
