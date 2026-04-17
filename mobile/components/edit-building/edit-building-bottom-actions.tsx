import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface EditBuildingBottomActionsProps {
  onClose: () => void;
  onNext: () => void;
}

export const EditBuildingBottomActions = ({ onClose, onNext }: EditBuildingBottomActionsProps) => {
  return (
    <View style={styles.bottomBar}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressSegment, { backgroundColor: Colors.success }]} />
        <View style={[styles.progressSegment, { backgroundColor: Colors.gray200 }]} />
      </View>
      
      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
          <Text style={styles.btnSecondaryText}>Đóng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={onNext}>
          <Text style={styles.btnPrimaryText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md,
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
