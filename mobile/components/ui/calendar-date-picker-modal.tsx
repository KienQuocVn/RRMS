import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';

interface CalendarDatePickerModalProps {
  visible: boolean;
  value?: string;
  title: string;
  subtitle?: string;
  onCancel: () => void;
  onConfirm: (date: string) => void;
}

function parseDate(value?: string) {
  if (value) {
    const datePart = value.split('T')[0];
    const parts = datePart.includes('/') ? datePart.split('/') : datePart.split('-');
    if (parts.length === 3) {
      const [day, month, year] = datePart.includes('/')
        ? parts.map(Number)
        : [Number(parts[2]), Number(parts[1]), Number(parts[0])];
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date;
    }
  }
  return new Date();
}

function formatDate(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

const WEEKDAYS = ['TH 2', 'TH 3', 'TH 4', 'TH 5', 'TH 6', 'TH 7', 'CN'];
const MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

export function CalendarDatePickerModal({ visible, value, title, subtitle, onCancel, onConfirm }: CalendarDatePickerModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(() => parseDate(value));
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const initialDate = parseDate(value);
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const firstWeekday = (new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 0).getDate();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const changeMonth = (amount: number) => setDisplayedMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
          <View style={styles.titleArea}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <View style={styles.calendar}>
            <View style={styles.monthRow}>
              <Text style={styles.monthLabel}>{MONTHS[displayedMonth.getMonth()]} năm {displayedMonth.getFullYear()}</Text>
              <TouchableOpacity style={styles.monthButton} onPress={() => changeMonth(-1)} accessibilityLabel="Tháng trước"><Ionicons name="chevron-back" size={22} color={Colors.gray500} /></TouchableOpacity>
              <TouchableOpacity style={styles.monthButton} onPress={() => changeMonth(1)} accessibilityLabel="Tháng sau"><Ionicons name="chevron-forward" size={22} color={Colors.primary} /></TouchableOpacity>
            </View>
            <View style={styles.weekRow}>{WEEKDAYS.map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}</View>
            <View style={styles.daysGrid}>{cells.map((day, index) => {
              if (!day) return <View key={`blank-${index}`} style={styles.dayCell} />;
              const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === displayedMonth.getMonth() && selectedDate.getFullYear() === displayedMonth.getFullYear();
              const isToday = new Date().toDateString() === new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), day).toDateString();
              return <TouchableOpacity key={`day-${day}`} style={styles.dayCell} onPress={() => setSelectedDate(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), day))}>
                <View style={[styles.dayCircle, isToday && styles.todayCircle, isSelected && styles.selectedCircle]}><Text style={[styles.dayText, isSelected && styles.selectedText]}>{day}</Text></View>
              </TouchableOpacity>;
            })}</View>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(formatDate(selectedDate))}><Text style={styles.confirmText}>Xác nhận · {formatDate(selectedDate)}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}><Text style={styles.cancelText}>Đóng</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

interface CalendarDateFieldProps {
  value: string;
  onChange: (date: string) => void;
  title: string;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function CalendarDateField({ value, onChange, title, placeholder = 'Chọn ngày', disabled = false, containerStyle, textStyle }: CalendarDateFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity style={containerStyle} onPress={() => setVisible(true)} disabled={disabled} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={title}>
        <Text style={textStyle}>{value ? formatDate(parseDate(value)) : placeholder}</Text>
        <Ionicons name="calendar-outline" size={20} color={Colors.gray500} />
      </TouchableOpacity>
      {visible && <CalendarDatePickerModal key={`${title}-${value}`} visible value={value} title={title} onCancel={() => setVisible(false)} onConfirm={(date) => { setVisible(false); onChange(date); }} />}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.42)' },
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: 'hidden' },
  titleArea: { alignItems: 'center', paddingVertical: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  title: { textAlign: 'center', fontSize: FontSizes.lg, color: Colors.textPrimary },
  subtitle: { textAlign: 'center', marginTop: 4, color: Colors.textSecondary, fontSize: FontSizes.md },
  calendar: { paddingHorizontal: Spacing.base, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  monthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  monthLabel: { flex: 1, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  monthButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  weekRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  weekday: { width: `${100 / 7}%`, textAlign: 'center', color: Colors.gray500, fontSize: FontSizes.xs, fontWeight: FontWeights.medium, paddingVertical: Spacing.sm },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, height: 48, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  todayCircle: { borderWidth: 1, borderColor: Colors.primary },
  selectedCircle: { backgroundColor: '#DCEEFF' },
  dayText: { fontSize: FontSizes.md, color: Colors.textPrimary },
  selectedText: { color: Colors.primary, fontWeight: FontWeights.bold },
  confirmButton: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingVertical: Spacing.lg, alignItems: 'center' },
  confirmText: { color: Colors.primary, fontSize: FontSizes.lg, fontWeight: FontWeights.medium },
  cancelButton: { marginHorizontal: Spacing.base, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.gray100, alignItems: 'center' },
  cancelText: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.bold },
});
