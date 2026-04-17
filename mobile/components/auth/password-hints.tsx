/**
 * PasswordHints - Gợi ý validation mật khẩu
 * Hiển thị trạng thái check (✓ xanh / ✗ xám) dựa trên password hiện tại.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

interface PasswordHintsProps {
  /** Mật khẩu hiện tại để kiểm tra */
  password: string;
}

interface HintItem {
  label: string;
  check: (password: string) => boolean;
}

/** Danh sách các tiêu chí validation */
const HINTS: HintItem[] = [
  {
    label: 'Mật khẩu phải lớn hơn 8 ký tự',
    check: (pw) => pw.length >= 8,
  },
  {
    label: 'Chú ý đến hoa thường',
    check: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  },
];

export default function PasswordHints({ password }: PasswordHintsProps) {
  return (
    <View style={styles.container}>
      {HINTS.map((hint, index) => {
        const isPassed = password.length > 0 && hint.check(password);
        return (
          <View key={index} style={styles.hintRow}>
            <Ionicons
              name={isPassed ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={18}
              color={isPassed ? Colors.primary : Colors.gray400}
            />
            <Text
              style={[
                styles.hintText,
                isPassed && styles.hintTextPassed,
              ]}
            >
              {hint.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  hintText: {
    fontSize: FontSizes.sm,
    color: Colors.gray500,
    marginLeft: Spacing.sm,
  },
  hintTextPassed: {
    color: Colors.primary,
  },
});
