import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { roomService } from '@/services/api/room.service';

export default function AddRoomScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { motelId } = useLocalSearchParams<{ motelId?: string }>();
  const [name, setName] = useState('');
  const [group, setGroup] = useState('Tầng trệt');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const roomArea = Number(area.replace(/[^\d.]/g, ''));
    const roomPrice = Number(price.replace(/[^\d]/g, ''));
    const roomDeposit = Number(deposit.replace(/[^\d]/g, '')) || 0;
    if (!motelId) return Alert.alert('Thiếu nhà trọ', 'Không xác định được nhà trọ cần thêm phòng.');
    if (!name.trim()) return Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên phòng.');
    if (!Number.isFinite(roomArea) || roomArea <= 0) return Alert.alert('Diện tích không hợp lệ', 'Vui lòng nhập diện tích phòng lớn hơn 0 m².');
    if (!Number.isFinite(roomPrice) || roomPrice <= 0) return Alert.alert('Giá thuê không hợp lệ', 'Vui lòng nhập giá thuê phòng lớn hơn 0.');

    setIsSaving(true);
    try {
      await roomService.createRoom({
        motelId,
        name: name.trim(),
        group: group.trim() || 'Tầng trệt',
        area: roomArea,
        price: roomPrice,
        deposit: roomDeposit,
        status: 'AVAILABLE',
        description: description.trim() || undefined,
      });
      Alert.alert('Thành công', 'Đã thêm phòng mới.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert('Không thể thêm phòng', error?.response?.data?.message || error?.message || 'Vui lòng kiểm tra thông tin nhà trọ và thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (label: string, value: string, setter: (value: string) => void, placeholder: string, numeric = false) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label} <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor={Colors.gray400} keyboardType={numeric ? 'numeric' : 'default'} />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Quay lại"><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm phòng mới</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {renderField('Tên phòng', name, setName, 'Ví dụ: Phòng 101')}
          {renderField('Dãy / tầng', group, setGroup, 'Ví dụ: Tầng trệt')}
          <View style={styles.twoColumns}>
            <View style={styles.column}>{renderField('Diện tích (m²)', area, setArea, '20', true)}</View>
            <View style={styles.column}>{renderField('Giá thuê (đ/tháng)', price, setPrice, '3000000', true)}</View>
          </View>
          {renderField('Tiền cọc (đ)', deposit, setDeposit, '3000000', true)}
          <View style={styles.field}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Thông tin thêm về phòng" placeholderTextColor={Colors.gray400} multiline textAlignVertical="top" />
          </View>
          <View style={styles.availableNotice}><Ionicons name="checkmark-circle" size={20} color={Colors.success} /><Text style={styles.availableText}>Phòng mới sẽ được tạo với trạng thái Đang trống.</Text></View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}><Text style={styles.cancelText}>Đóng</Text></TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>{isSaving ? <ActivityIndicator color={Colors.white} /> : <><Ionicons name="add" size={21} color={Colors.white} /><Text style={styles.saveText}>Thêm phòng</Text></>}</TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingBottom: Spacing.md, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  content: { padding: Spacing.base, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.white, padding: Spacing.base, borderRadius: BorderRadius.lg },
  field: { marginBottom: Spacing.md }, label: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary, marginBottom: 7 }, required: { color: Colors.error },
  input: { minHeight: 48, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, fontSize: FontSizes.md, color: Colors.textPrimary, backgroundColor: Colors.white },
  multiline: { height: 92, paddingTop: Spacing.md }, twoColumns: { flexDirection: 'row', gap: Spacing.md }, column: { flex: 1, minWidth: 0 },
  availableNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDF4', borderRadius: BorderRadius.md, padding: Spacing.md }, availableText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary },
  footer: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingTop: Spacing.md, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  cancelButton: { flex: 1, height: 50, borderRadius: BorderRadius.md, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' }, cancelText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  saveButton: { flex: 1, height: 50, borderRadius: BorderRadius.md, backgroundColor: Colors.success, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, saveText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.white },
});
