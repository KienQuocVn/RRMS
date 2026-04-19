/**
 * InvoiceSettingsScreen - Cài đặt hóa đơn
 * Dùng cho: Cấu hình ngày lập, hạn đóng, hình thức thanh toán, gửi Zalo, mã QR, làm tròn...
 * Điều hướng từ: ManagementMenu > "Cài đặt hóa đơn"
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

// ── Component ──
export default function InvoiceSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [showInvoiceDate, setShowInvoiceDate] = useState(false);
  const [invoiceDay, setInvoiceDay] = useState('1');
  const [paymentDeadline, setPaymentDeadline] = useState('5');
  const [noteText, setNoteText] = useState(
    '* Ví dụ: Vui lòng chụp đồng hồ điện nước và gửi lên group trước ngày thanh toán tiền'
  );
  const [sendZalo, setSendZalo] = useState(true);
  const [showQR, setShowQR] = useState(true);
  const [roundInvoice, setRoundInvoice] = useState(true);
  const [classifyInvoice, setClassifyInvoice] = useState(false);

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hóa đơn</Text>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section 1: Hiển thị ngày lập hóa đơn ── */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>Hiển thị ngày lập hóa đơn</Text>
              <Text style={styles.toggleDesc}>
                Hiển thị ngày lập hóa đơn trong danh sách phòng. Giúp bạn biết được ngày chốt tiền điện nước, tiền thuê nhà... của phòng.
              </Text>
            </View>
            <Switch
              value={showInvoiceDate}
              onValueChange={setShowInvoiceDate}
              trackColor={{ false: Colors.gray300, true: '#4CAF50' }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.gray300}
            />
          </View>
        </View>

        {/* ── Section 2: Ngày lập & Hạn đóng ── */}
        <View style={styles.section}>
          <View style={styles.dateRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>
                Ngày lập hóa đơn <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.dateInputWrap}>
                <TextInput
                  style={styles.dateInput}
                  value={invoiceDay}
                  onChangeText={setInvoiceDay}
                  keyboardType="number-pad"
                  accessibilityLabel="Ngày lập hóa đơn"
                />
              </View>
            </View>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>
                Hạn đóng tiền <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.deadlineInputRow}>
                <TextInput
                  style={[styles.dateInput, { flex: 1 }]}
                  value={paymentDeadline}
                  onChangeText={setPaymentDeadline}
                  keyboardType="number-pad"
                  accessibilityLabel="Hạn đóng tiền"
                />
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Ngày</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Section 3: Hình thức thanh toán ── */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.paymentMethodRow}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Chọn hình thức thanh toán"
          >
            <View style={styles.paymentIcon}>
              <Ionicons name="people-outline" size={20} color={Colors.textSecondary} />
            </View>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentLabel}>Mặc định hình thức thanh toán</Text>
              <Text style={styles.paymentValue}>Tiền mặt</Text>
            </View>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Xóa hình thức thanh toán"
            >
              <Ionicons name="close-circle-outline" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* ── Section 4: Ghi chú hóa đơn ── */}
        <View style={styles.sectionDivider} />
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Ghi chú thêm cho hóa đơn</Text>
          <Text style={styles.sectionHint}>
            Ghi chú cho khách thuê lúc in phiếu thu (hóa đơn)
          </Text>
          <View style={styles.textAreaWrap}>
            <TextInput
              style={styles.textArea}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Ghi chú hóa đơn"
            />
          </View>
        </View>

        {/* ── Section 5: Gửi hóa đơn qua ZALO ── */}
        <View style={styles.sectionDivider} />
        <View style={styles.section}>
          <View style={styles.zaloCard}>
            <View style={styles.zaloHeader}>
              <View style={styles.zaloIconWrap}>
                <Text style={styles.zaloIcon}>Zalo</Text>
              </View>
              <View style={styles.zaloContent}>
                <Text style={styles.zaloTitle}>Gửi hóa đơn qua ZALO</Text>
                <Text style={styles.zaloDesc}>
                  Khi bật tính năng này hóa đơn sẽ được gửi tự cho khách thuê qua Zalo
                </Text>
                <Text style={styles.zaloNote}>- Tính năng này có áp dụng phí dịch vụ.</Text>
                <Text style={styles.zaloNote}>- Gửi theo thương hiệu RRMS</Text>
                <Text style={styles.zaloNote}>- Không gửi được khung giờ:</Text>
                <Text style={styles.zaloNote}>  10h PM - 6h AM</Text>
                <Text style={styles.zaloNote}>- Gửi qua APP RRMS sẽ không bị bất cứ hạn chế nào từ ZALO</Text>
              </View>
              <Switch
                value={sendZalo}
                onValueChange={setSendZalo}
                trackColor={{ false: Colors.gray300, true: '#4CAF50' }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.gray300}
              />
            </View>
            <View style={styles.zaloActions}>
              <TouchableOpacity
                style={styles.previewBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Gửi xem trước"
              >
                <Ionicons name="send-outline" size={14} color={Colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.previewBtnText}>Gửi xem trước</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.learnMoreBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Tìm hiểu thêm"
              >
                <Ionicons name="help-circle-outline" size={14} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.learnMoreText}>Tìm hiểu thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Section 6: Hiển thị mã QR ── */}
        <View style={styles.toggleRowBordered}>
          <View style={styles.toggleIconBox}>
            <Ionicons name="qr-code-outline" size={22} color={Colors.textPrimary} />
          </View>
          <View style={styles.toggleContent}>
            <Text style={styles.toggleTitle}>Hiển thị mã QR</Text>
            <Text style={styles.toggleDesc}>
              Bạn muốn hiển thị thông tin tài khoản & số tiền hóa đơn bằng mã QR giúp khách thuê thanh toán chuyển khoản nhanh hơn?
            </Text>
          </View>
          <Switch
            value={showQR}
            onValueChange={setShowQR}
            trackColor={{ false: Colors.gray300, true: '#4CAF50' }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.gray300}
          />
        </View>

        {/* ── Section 7: Làm tròn hóa đơn ── */}
        <View style={styles.toggleRowBordered}>
          <View style={styles.toggleContent}>
            <Text style={styles.toggleTitle}>Làm tròn hóa đơn tới đơn vị 1.000đ</Text>
            <Text style={styles.roundExample}>4.300 đ -{'>'} 4.000 đ</Text>
            <Text style={styles.roundExample}>4.500 đ -{'>'} 4.000 đ</Text>
            <Text style={styles.roundExample}>4.600 đ -{'>'} 5.000đ</Text>
          </View>
          <Switch
            value={roundInvoice}
            onValueChange={setRoundInvoice}
            trackColor={{ false: Colors.gray300, true: '#4CAF50' }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.gray300}
          />
        </View>

        {/* ── Section 8: Phân loại thu/chi ── */}
        <View style={styles.toggleRowBordered}>
          <View style={styles.toggleContent}>
            <Text style={styles.toggleTitle}>Phân loại thu/chi từ hóa đơn</Text>
            <Text style={styles.toggleDesc}>
              Khi thu tiền hóa đơn bạn muốn phân tách các phiếu thu chi rõ ràng như: Tiền phòng/giường, tiền dịch vụ, giảm trừ, cộng thêm?
            </Text>
          </View>
          <Switch
            value={classifyInvoice}
            onValueChange={setClassifyInvoice}
            trackColor={{ false: Colors.gray300, true: '#4CAF50' }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.gray300}
          />
        </View>
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={styles.saveButtonWrap}>
        <TouchableOpacity
          style={styles.saveButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Lưu thay đổi"
        >
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ──
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
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['2xl'],
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: Colors.gray100,
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sectionHint: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  // Toggle row
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  toggleRowBordered: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  toggleContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  toggleDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  toggleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },

  // Date row
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  dateInputWrap: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
  },
  dateInput: {
    height: 48,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  deadlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
  },
  dayBadge: {
    backgroundColor: Colors.gray200,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopRightRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  dayBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },

  // Payment method
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  paymentContent: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  paymentValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // TextArea
  textAreaWrap: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
  },
  textArea: {
    minHeight: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },

  // Zalo card
  zaloCard: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  zaloHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  zaloIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0068FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  zaloIcon: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  zaloContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  zaloTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  zaloDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  zaloNote: {
    fontSize: FontSizes.sm,
    color: '#FF9800',
    lineHeight: 18,
  },
  zaloActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  previewBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },

  // Round examples
  roundExample: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Save button
  saveButtonWrap: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  saveButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
