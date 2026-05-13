import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function RepresentativeInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Thông tin đại diện của tòa nhà</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <Ionicons name="information-circle-outline" size={24} color="#E65100" style={{ marginRight: 8 }} />
          <Text style={styles.alertText}>
            Các thông tin này sẽ được hệ thống tạo ra các văn bản tự động như <Text style={styles.alertHighlight}>Văn bản hợp đồng, văn bản thông tin nhân khẩu...</Text>
          </Text>
        </View>

        {/* Form */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Text style={styles.label}>Tên người đại diện <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Nhập tên" placeholderTextColor={Colors.gray400} />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Nhập số điện thoại" placeholderTextColor={Colors.gray400} keyboardType="phone-pad" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ngày sinh <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} placeholder="16/06/1990" placeholderTextColor={Colors.textPrimary} value="16/06/1990" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nghề nghiệp <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Nghề nghiệp" placeholderTextColor={Colors.gray400} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Địa chỉ" placeholderTextColor={Colors.gray400} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Passport (Khách nước ngoài)</Text>
          <View style={styles.inputWithAction}>
            <TextInput 
              style={[styles.input, { flex: 1, borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]} 
              placeholder="Ví dụ: 001304207098 hoặc 21232345..." 
              placeholderTextColor={Colors.gray400} 
            />
            <TouchableOpacity style={styles.actionBtnInside}>
              <Ionicons name="sync-outline" size={16} color="#4CAF50" style={{ marginRight: 4 }} />
              <Text style={styles.actionBtnText}>Thẻ CCCD</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Text style={styles.label}>Nơi cấp <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor={Colors.gray400} />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Ngày cấp <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor={Colors.gray400} />
          </View>
        </View>

      </ScrollView>

      {/* Footer Buttons */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
          <Ionicons name="close" size={18} color={Colors.textPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.btnCancelText}>Đóng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSave}>
          <Ionicons name="add" size={18} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.btnSaveText}>Thêm thông tin</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  alertHighlight: {
    color: '#E65100',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  inputWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtnInside: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderTopRightRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderLeftWidth: 0,
  },
  actionBtnText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: Spacing.md,
  },
  btnCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnCancelText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  btnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnSaveText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
