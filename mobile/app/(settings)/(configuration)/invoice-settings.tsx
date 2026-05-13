import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontWeights,
  Shadows,
} from '@/constants/theme';

function Toggle({
  value,
  onPress,
}: {
  value: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.toggle, value && styles.toggleActive]}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );
}

export default function InvoiceSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showInvoiceDate, setShowInvoiceDate] = useState(false);
  const [sendZalo, setSendZalo] = useState(true);
  const [invoiceDay, setInvoiceDay] = useState('1');
  const [paymentDeadline, setPaymentDeadline] = useState('5');
  const [noteText, setNoteText] = useState(
    '* Ví dụ: Vui lòng chụp đồng hồ điện nước và gửi lên group trước ngày thanh toán tiền'
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hóa đơn</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.whiteSection}>
          <View style={styles.topToggleRow}>
            <View style={styles.flexContent}>
              <Text style={styles.sectionTitle}>Hiển thị ngày lập hóa đơn</Text>
              <Text style={styles.sectionDescription}>
                Hiển thị ngày lập hóa đơn trong danh sách phòng. Giúp bạn biết được
                ngày chốt tiền điện nước, tiền thuê nhà... của phòng.
              </Text>
            </View>
            <Toggle value={showInvoiceDate} onPress={() => setShowInvoiceDate((prev) => !prev)} />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGrid}>
            <View style={styles.inputColumn}>
              <Text style={styles.inputLabel}>
                Ngày lập hóa đơn <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.dayInput}
                value={invoiceDay}
                onChangeText={setInvoiceDay}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputColumn}>
              <Text style={styles.inputLabel}>
                Hạn đóng tiền <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.deadlineWrap}>
                <TextInput
                  style={styles.deadlineInput}
                  value={paymentDeadline}
                  onChangeText={setPaymentDeadline}
                  keyboardType="number-pad"
                />
                <View style={styles.unitBadge}>
                  <Text style={styles.unitBadgeText}>Ngày</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.paymentCard} activeOpacity={0.85}>
            <View style={styles.paymentIcon}>
              <Ionicons name="people" size={20} color={Colors.black} />
            </View>

            <View style={styles.paymentContent}>
              <Text style={styles.paymentLabel}>Mặc định hình thức thanh toán</Text>
              <Text style={styles.paymentValue}>Tiền mặt</Text>
            </View>

            <View style={styles.closeCircle}>
              <Ionicons name="close" size={20} color={Colors.black} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.graySpacer} />

        <View style={styles.whiteSection}>
          <Text style={styles.sectionTitle}>Ghi chú thêm cho hóa đơn</Text>
          <Text style={styles.sectionDescription}>
            Ghi chú cho khách thuê lúc in phiếu thu (hoá đơn)
          </Text>

          <TextInput
            style={styles.noteInput}
            value={noteText}
            onChangeText={setNoteText}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.graySpacer} />

        <View style={styles.whiteSection}>
          <View style={styles.zaloCard}>
            <View style={styles.zaloTopRow}>
              <View style={styles.zaloLogo}>
                <Text style={styles.zaloLogoText}>Zalo</Text>
              </View>

              <View style={styles.flexContent}>
                <Text style={styles.sectionTitle}>Gửi hóa đơn qua ZALO</Text>
                <Text style={styles.zaloDescription}>
                  Khi bật tính năng này hóa đơn sẽ được gửi tự cho khách thuê qua Zalo
                </Text>
                <Text style={styles.zaloNote}>- Tính năng này có áp dụng phí dịch vụ.</Text>
                <Text style={styles.zaloNote}>- Gửi theo thương hiệu LOZIDO</Text>
                <Text style={styles.zaloNote}>- Không gửi được khung giờ:</Text>
                <Text style={styles.zaloNote}>10h PM - 6h AM</Text>
                <Text style={styles.zaloNote}>
                  - Gửi qua APP LOZIDO sẽ không bị bất cứ hạn chế nào từ ZALO
                </Text>
              </View>

              <Toggle value={sendZalo} onPress={() => setSendZalo((prev) => !prev)} />
            </View>
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
    paddingBottom: 150,
  },
  whiteSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  graySpacer: {
    height: 12,
    backgroundColor: '#EEF2F3',
  },
  topToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexContent: {
    flex: 1,
    paddingRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9DDE2',
    marginVertical: 16,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  inputColumn: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: '#F24B3A',
  },
  dayInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  deadlineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  deadlineInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  unitBadge: {
    backgroundColor: '#EEF6E7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  unitBadgeText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textPrimary,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentContent: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  paymentValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
  },
  zaloCard: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  zaloTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zaloLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E4EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  zaloLogoText: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: '#2979FF',
  },
  zaloDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555',
    marginBottom: 4,
  },
  zaloNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#F07F2F',
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5B5B5B',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#DFF5E3',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#BDBDBD',
  },
  toggleThumbActive: {
    backgroundColor: '#7ED321',
    alignSelf: 'flex-end',
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
