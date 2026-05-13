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

interface AmenityItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const AMENITIES: AmenityItem[] = [
  { id: 'mezzanine', title: 'Có gác lửng', icon: 'resize-outline' },
  { id: 'parking', title: 'Có chỗ giữ xe', icon: 'bicycle-outline' },
  { id: 'private-toilet', title: 'Toilet riêng', icon: 'bed-outline' },
  { id: 'owner', title: 'Riêng với chủ', icon: 'key-outline' },
  { id: 'wifi', title: 'Có wifi', icon: 'wifi-outline' },
  { id: 'camera', title: 'Có camera an ninh', icon: 'shield-checkmark-outline' },
  { id: 'pets', title: 'Được nuôi thú cưng', icon: 'paw-outline' },
  { id: 'balcony', title: 'Có ban công', icon: 'business-outline' },
  { id: 'living-space', title: 'Có nơi sinh hoạt', icon: 'sparkles-outline' },
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

export default function AmenitiesSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const allSelected = selected.length === AMENITIES.length;

  const toggleAmenity = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : AMENITIES.map((item) => item.id));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : Spacing.xl }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tiện ích</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>Tiện ích</Text>
          <Text style={styles.sectionDesc}>Tiện ích sẽ thu hút khách thuê của bạn</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.contentSection}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.sectionTitle}>Tiện ích nhà cho thuê ({selected.length} đã chọn)</Text>
            </View>
            <View style={styles.selectAllBox}>
              <Checkbox checked={allSelected} onPress={toggleAll} />
              <Text style={styles.selectAllText}>Chọn tất cả</Text>
            </View>
          </View>

          <View style={styles.dividerThin} />

          <View style={styles.chipGrid}>
            {AMENITIES.map((item) => {
              const checked = selected.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, checked && styles.chipActive, item.id === 'living-space' && styles.chipWide]}
                  onPress={() => toggleAmenity(item.id)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={item.icon} size={20} color={checked ? '#13AA47' : '#333'} />
                  <Text style={[styles.chipText, checked && styles.chipTextActive]}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
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
  contentSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerText: {
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
    marginTop: 4,
    textAlign: 'center',
  },
  checkboxWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
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
  dividerThin: {
    height: 1,
    backgroundColor: '#D9DDE2',
    marginTop: 14,
    marginBottom: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  chip: {
    width: '48.5%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  chipWide: {
    width: '48.5%',
    alignSelf: 'center',
  },
  chipActive: {
    borderColor: '#13AA47',
    backgroundColor: '#F3FFF5',
  },
  chipText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: '#13AA47',
    fontWeight: FontWeights.medium,
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
