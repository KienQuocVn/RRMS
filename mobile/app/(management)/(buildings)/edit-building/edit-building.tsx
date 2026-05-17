import React from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useEditBuilding } from '@/hooks/use-edit-building';
import {
  EditBuildingHeader,
  EditBuildingForm,
  EditBuildingBottomActions,
} from '@/components/edit-building';

export default function EditBuildingScreen() {
  const {
    rentType,
    setRentType,
    buildingName,
    setBuildingName,
    handleNext,
    handleClose,
    handleSave,
  } = useEditBuilding();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <EditBuildingHeader onSave={handleSave} />

      <EditBuildingForm 
        rentType={rentType}
        setRentType={setRentType}
        buildingName={buildingName}
        setBuildingName={setBuildingName}
      />

      <EditBuildingBottomActions 
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