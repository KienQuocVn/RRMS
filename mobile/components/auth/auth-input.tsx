/**
 * AuthInput - Input field có label, placeholder, icon toggle
 * Hỗ trợ: text thường, password (toggle show/hide), validation error.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  /** Label hiển thị phía trên input */
  label: string;
  /** Có bắt buộc không (hiện dấu *) */
  required?: boolean;
  /** Input mật khẩu (có nút toggle show/hide) */
  secureTextEntry?: boolean;
  /** Thông báo lỗi */
  error?: string;
  /** Container style override */
  containerStyle?: object;
}

export default function AuthInput({
  label,
  required = false,
  secureTextEntry = false,
  error,
  containerStyle,
  ...inputProps
}: AuthInputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const toggleSecure = () => setIsSecure((prev) => !prev);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {/* Input row */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : null,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.placeholder}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          {...inputProps}
        />

        {/* Toggle password visibility */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleSecure}
            style={styles.toggleButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isSecure ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={Colors.gray500}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing.base,
    height: 50,
  },
  inputWrapperFocused: {
    borderColor: Colors.inputBorderFocused,
    borderWidth: 1.5,
  },
  inputWrapperError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    height: '100%',
  },
  toggleButton: {
    paddingLeft: Spacing.sm,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
