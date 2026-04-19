import React from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAddBuilding } from '@/hooks/use-add-building';
import {
  AddBuildingHeader,
  AddBuildingForm,
  AddBuildingBottomActions,
} from '@/components/add-building';

export default function AddBuildingScreen() {
  const {
    rentType,
    setRentType,
    isAutoInit,
    setIsAutoInit,
    handleNext,
    handleClose,
  } = useAddBuilding();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AddBuildingHeader />

      <AddBuildingForm 
        rentType={rentType}
        setRentType={setRentType}
        isAutoInit={isAutoInit}
        setIsAutoInit={setIsAutoInit}
      />

      <AddBuildingBottomActions 
        onClose={handleClose}
        onNext={handleNext}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
});
