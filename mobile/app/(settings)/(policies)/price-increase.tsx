import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontWeights,
  Shadows,
} from '@/constants/theme';

interface RoomItem {
  id: string;
  name: string;
  price: string;
}

const ROOMS: RoomItem[] = [
  { id: 'room-1', name: 'Phòng 1', price: '300.000 đ' },
  { id: 'room-2', name: 'Phòng 2', price: '300.000 đ' },
  { id: 'room-3', name: 'Phòng 3', price: '300.000 đ' },
  { id: 'room-4', name: 'Phòng 4', price: '300.000 đ' },
];

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={styles.checkboxWrap}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color={Colors.white} />}
      </View>
    </View>
  );
}

export default function PriceIncreaseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [newPrice, setNewPrice] = useState('300.000');

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tăng giá thuê</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.noticeShell}>
          <View style={styles.noticeBanner}>
            <View>
              <Text style={styles.noticeSmall}>ĐỪNG QUÊN!</Text>
              <Text style={styles.noticeBig}>THÔNG BÁO TRƯỚC</Text>
              <Text style={styles.noticeBig}>CHO KHÁCH THUÊ.</Text>
            </View>

            <View style={styles.noticeIllustration}>
              <Ionicons name="man" size={32} color="#334155" />
            </View>
          </View>

          <Text style={styles.noticeText}>
            Bạn nên thông báo việc lên giá thuê trước khi thực hiện chính thức. Sử
            dụng tính năng thông báo tới khách thuê để thực hiện điều này!
          </Text>

          <TouchableOpacity style={styles.noticeButton}>
            <Text style={styles.noticeButtonText}>Thông báo tới khách thuê</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Giá thuê mới <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.priceInputWrap}>
            <TextInput
              style={styles.priceInput}
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="number-pad"
            />
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyBadgeText}>đ</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.roomHeader}>
            <View style={styles.roomHeaderText}>
              <Text style={styles.label}>
                Chọn phòng áp dụng (0 đã chọn) <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.subLabel}>Danh sách phòng muốn áp dụng giá mới</Text>
            </View>

            <View style={styles.selectAllWrap}>
              <Checkbox checked={false} />
              <Text style={styles.selectAllText}>Chọn tất cả</Text>
            </View>
          </View>

          <View style={styles.roomList}>
            {ROOMS.map((room) => (
              <TouchableOpacity key={room.id} style={styles.roomCard} activeOpacity={0.85}>
                <Checkbox checked={false} />

                <View style={styles.roomInfo}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <Text style={styles.roomPrice}>{room.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  noticeShell: {
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: Spacing.base,
    padding: 12,
    ...Shadows.sm,
  },
  noticeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#FFF3CD',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  noticeSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  noticeBig: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  noticeIllustration: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  noticeButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFC947',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  noticeButtonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  section: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 8,
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: '#F24B3A',
  },
  priceInputWrap: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
  },
  priceInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  currencyBadge: {
    backgroundColor: '#F0F7E8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  currencyBadgeText: {
    fontSize: 16,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  roomHeader: {
    borderTopWidth: 1,
    borderTopColor: '#D9DDE2',
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  roomHeaderText: {
    flex: 1,
  },
  subLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
  },
  selectAllWrap: {
    alignItems: 'center',
    width: 80,
  },
  selectAllText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
  roomList: {
    gap: 10,
    marginTop: 12,
    paddingBottom: 8,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  checkboxWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#34324A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: '#13AA47',
    borderColor: '#13AA47',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#13AA47',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
