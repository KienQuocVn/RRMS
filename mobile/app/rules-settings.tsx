import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontWeights, Shadows } from '@/constants/theme';

interface RuleItem {
  id: string;
  title: string;
  description: string;
}

const RULES: RuleItem[] = [
  { id: 'curfew', title: 'Nhà trọ có giờ giấc không về quá khuya', description: 'Không về sau 12h tối' },
  { id: 'pay-on-time', title: 'Đóng tiền trọ đúng ngày', description: 'Đóng tiền trọ đúng ngày, không thiếu thường xuyên...' },
  { id: 'no-smoking', title: 'Không hút thuốc, say xỉn', description: 'Không tụ tập nhậu nhẹt, hát hò làm ảnh hưởng phòng xung quanh' },
  { id: 'no-crime', title: 'Không chứa chấp tội phạm', description: 'Không che giấu và chứa chấp tội phạm trong phòng' },
  { id: 'no-karaoke', title: 'Không hát karaoke, nhậu nhẹt ảnh hưởng tới phòng kế bên', description: 'Không gây ồn ào, mất trật tự, nhậu nhẹt, say xỉn...' },
  { id: 'civilized', title: 'Cư xử văn hóa', description: 'Không gây gổ chửi thề, gây hiềm khích với mọi người, tạo văn hóa phòng trọ yên bình, hòa đồng.' },
];

function Checkbox({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.checkboxWrap} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={14} color={Colors.white} /> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function RulesSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const toggleRule = (id: string) => {
    setSelectedRules((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const allSelected = selectedRules.length === RULES.length;

  const toggleAll = () => {
    setSelectedRules(allSelected ? [] : RULES.map((item) => item.id));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt nội quy & giờ giấc</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>Giờ giấc nhà trọ</Text>
          <Text style={styles.sectionDesc}>Giờ mở cửa, giờ đóng cửa</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.timeSection}>
          <View style={styles.timeRow}>
            <TouchableOpacity style={styles.timeBox} activeOpacity={0.85}>
              <Text style={styles.timeLabel}>Giờ mở cửa</Text>
              <View style={styles.timeValueRow}>
                <Text style={styles.timeValue}>Chọn giá trị</Text>
                <Ionicons name="chevron-down" size={24} color={Colors.black} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.timeBox} activeOpacity={0.85}>
              <Text style={styles.timeLabel}>Giờ đóng cửa</Text>
              <View style={styles.timeValueRow}>
                <Text style={styles.timeValue}>Chọn giá trị</Text>
                <Ionicons name="chevron-down" size={24} color={Colors.black} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.rulesHeader}>
          <View style={styles.rulesHeaderText}>
            <Text style={styles.sectionTitle}>Nội quy nhà cho thuê ({selectedRules.length} đã chọn)</Text>
            <Text style={styles.sectionDesc}>Thêm nội quy giúp khách thuê hiểu & giúp nâng cao an ninh</Text>
          </View>

          <View style={styles.selectAllBox}>
            <Checkbox checked={allSelected} onPress={toggleAll} />
            <Text style={styles.selectAllText}>Chọn tất cả</Text>
          </View>
        </View>

        <View style={styles.rulesDivider} />

        <View style={styles.ruleList}>
          {RULES.map((rule) => {
            const checked = selectedRules.includes(rule.id);

            return (
              <TouchableOpacity key={rule.id} style={styles.ruleCard} activeOpacity={0.85} onPress={() => toggleRule(rule.id)}>
                <Checkbox checked={checked} />
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleTitle}>{rule.title}</Text>
                  <Text style={styles.ruleDesc}>{rule.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
    backgroundColor: '#EDF2F3',
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
  topSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sectionDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9DDE2',
  },
  timeSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 18,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  timeLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  timeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  spacer: {
    height: 12,
    backgroundColor: '#EDF2F3',
  },
  rulesHeader: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 12,
    gap: 8,
  },
  rulesHeaderText: {
    flex: 1,
  },
  selectAllBox: {
    alignItems: 'center',
    width: 80,
  },
  selectAllText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 4,
  },
  rulesDivider: {
    height: 1,
    backgroundColor: '#D9DDE2',
    marginHorizontal: Spacing.base,
  },
  ruleList: {
    paddingHorizontal: Spacing.base,
    paddingTop: 12,
    gap: 10,
  },
  ruleCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 12,
    ...Shadows.sm,
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
  ruleContent: {
    flex: 1,
    paddingRight: 8,
  },
  ruleTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ruleDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#555',
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
    ...Shadows.md,
  },
  saveButtonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
