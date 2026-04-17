import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

export default function EditBuildingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // States for demo purposes
  const [rentType, setRentType] = useState<'room' | 'bed'>('room');
  const [buildingName, setBuildingName] = useState('Quoc');

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Chỉnh sửa nhà trọ</Text>
      
      {/* Save Button */}
      <TouchableOpacity style={styles.saveIconBtn}>
        <Ionicons name="save-outline" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const SectionTitle = ({ title, subTitle }: { title: string; subTitle: string }) => (
    <View style={styles.sectionTitleContainer}>
      <View style={styles.hashtagIcon}>
        <Text style={styles.hashtagText}>#</Text>
      </View>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.sectionTitleMain}>{title}</Text>
        <Text style={styles.sectionTitleSub}>{subTitle}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* --- Section 1: Thông tin nhà cho thuê --- */}
        <SectionTitle 
          title="Thông tin nhà cho thuê" 
          subTitle="Thông tin cơ bản tên, loại hình..." 
        />
        
        <View style={styles.card}>
          {/* Loại hình cho thuê (Disabled styling) */}
          <Text style={styles.label}>Loại hình cho thuê <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainerDisabled}>
            <Text style={styles.inputText}>Nhà trọ</Text>
          </View>

          {/* Cards select */}
          <View style={styles.rentTypeContainer}>
            <TouchableOpacity 
              style={[styles.rentTypeCard, rentType === 'room' && styles.rentTypeCardActive]}
              onPress={() => setRentType('room')}
              activeOpacity={0.7}
            >
              <Ionicons name="git-network-outline" size={32} color={rentType === 'room' ? Colors.success : Colors.gray500} />
              <Text style={styles.rentTypeTitle}>Thuê theo phòng</Text>
              <Text style={styles.rentTypeSub}>Tính tiền thuê theo phòng</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.rentTypeCard, rentType === 'bed' && styles.rentTypeCardActive]}
              onPress={() => setRentType('bed')}
              activeOpacity={0.7}
            >
              <Ionicons name="business-outline" size={32} color={rentType === 'bed' ? Colors.gray500 : Colors.gray500} />
              <Text style={styles.rentTypeTitle}>Thuê theo giường</Text>
              <Text style={styles.rentTypeSub}>Tính tiền theo giường</Text>
            </TouchableOpacity>
          </View>

          {/* Tên Nhà trọ */}
          <Text style={styles.label}>Tên Nhà trọ <Text style={styles.required}>*</Text></Text>
          <View style={[styles.inputContainer, styles.inputContainerBorder]}>
            <TextInput 
              style={styles.textInput} 
              value={buildingName}
              onChangeText={setBuildingName}
            />
            <View style={styles.inputSuffixBox}>
              <Text style={styles.inputSuffixText}>Nhà trọ</Text>
            </View>
          </View>
          <Text style={styles.displayNameText}>Tên hiển thị: Nhà trọ {buildingName}</Text>
        </View>

        {/* --- Section 2: Cách khởi tạo dữ liệu --- */}
        <SectionTitle 
          title="Cách khởi tạo dữ liệu" 
          subTitle="Theo mẫu hoặc từ excel hoặc thủ công" 
        />
        
        <View style={[styles.card, { borderBottomWidth: 0 }]}>
          {/* Read-only Data Summary Box */}
          <View style={styles.summaryBox}>
            {/* Row 1 */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Loại nhà cho thuê</Text>
                <Text style={styles.summaryValue}>Dãy trọ (Tầng trệt)</Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Tổng số tầng</Text>
                <Text style={styles.summaryValue}>1 tầng</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            {/* Row 2 */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Phương thức tạo phòng</Text>
                <Text style={styles.summaryValue}>Khởi tạo theo mẫu</Text>
              </View>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>Tổng số phòng</Text>
                <Text style={styles.summaryValue}>5 phòng</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            {/* Row 3 (3 cols) */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCol, { flex: 1 }]}>
                <Text style={styles.summaryLabel}>Diện tích mẫu</Text>
                <Text style={styles.summaryValue}>15 m2</Text>
              </View>
              <View style={[styles.summaryCol, { flex: 1.2 }]}>
                <Text style={styles.summaryLabel}>Giá mẫu</Text>
                <Text style={styles.summaryValue}>3.000.000 đ</Text>
              </View>
              <View style={[styles.summaryCol, { flex: 1 }]}>
                <Text style={styles.summaryLabel}>Tối đa người ở</Text>
                <Text style={styles.summaryValue}>3 người</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* --- Section 3: Cài đặt ngày chốt & hạn hóa đơn --- */}
        <SectionTitle 
          title="Cài đặt ngày chốt & hạn hóa đơn" 
          subTitle="Tùy chỉnh tính năng sử dụng cho Nhà trọ" 
        />
        
        <View style={styles.cardNoPadding}>
          <View style={[styles.row, { padding: Spacing.base }]}>
            <View style={styles.columnView}>
              <Text style={styles.label}>Ngày lập hóa đơn thu tiền <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputContainer, styles.inputContainerBorder]}>
                <TextInput 
                  style={styles.textInput} 
                  defaultValue="1" 
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.helperText}>Nhập ngày cuối tháng hoặc ngày cố định trong tháng.</Text>
            </View>

            <View style={styles.columnView}>
              <Text style={styles.label}>Hạn đóng tiền <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputContainer, styles.inputContainerBorder]}>
                <TextInput 
                  style={styles.textInput} 
                  defaultValue="5"
                  keyboardType="numeric"
                />
                <View style={styles.inputSuffixBox}>
                  <Text style={styles.inputSuffixText}>Ngày</Text>
                </View>
              </View>
              <Text style={styles.helperText}>Số ngày hết đóng tiền thuê kể từ ngày lập hóa đơn</Text>
            </View>
          </View>

          <View style={styles.infoAlert}>
            <View style={styles.infoAlertIcon}>
              <Ionicons name="information" size={16} color={Colors.white} />
            </View>
            <Text style={styles.infoAlertText}>
              <Text style={{ fontWeight: 'bold' }}>Thông tin:</Text> Khi có khách thuê không đóng tiền đúng hạn. Phần mềm sẽ nhắc nhở bạn.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* --- Bottom Actions --- */}
      <View style={styles.bottomBar}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressSegment, { backgroundColor: Colors.success }]} />
          <View style={[styles.progressSegment, { backgroundColor: Colors.gray200 }]} />
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => router.back()}>
            <Text style={styles.btnSecondaryText}>Đóng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>Tiếp theo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  saveIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
  },
  
  // Section Titles
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  hashtagIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.success,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  hashtagText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: FontSizes.lg,
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionTitleMain: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionTitleSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardNoPadding: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    width: '100%',
  },
  
  // Form Controls
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  inputContainerDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  inputContainerBorder: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputText: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.base,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
  },
  inputSuffixBox: {
    backgroundColor: Colors.gray50,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputSuffixText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  displayNameText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    marginTop: 4,
    marginBottom: Spacing.md,
  },

  // Rent Type Cards
  rentTypeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  rentTypeCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
  },
  rentTypeCardActive: {
    borderColor: Colors.success,
    backgroundColor: '#F1F9F4', 
  },
  rentTypeTitle: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  rentTypeSub: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // Summary Box (Read-only data)
  summaryBox: {
    backgroundColor: '#F0F4E8', // Light greenish beige from image
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#E2E8D5',
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryCol: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: Spacing.sm,
  },

  // Layout Helpers
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  columnView: {
    flex: 1,
  },
  
  // Notes and Alerts
  helperText: {
    fontSize: FontSizes.xs,
    color: '#D84315', 
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoAlert: {
    flexDirection: 'row',
    backgroundColor: '#F1F9F4',
    borderWidth: 1,
    borderColor: Colors.success,
    padding: Spacing.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'flex-start',
  },
  infoAlertIcon: {
    backgroundColor: Colors.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  infoAlertText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  // Bottom Nav
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md, // Safe area bottom
  },
  progressContainer: {
    flexDirection: 'row',
    height: 3,
    width: '100%',
    marginBottom: Spacing.md,
  },
  progressSegment: {
    flex: 1,
    marginHorizontal: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: Colors.gray100,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
