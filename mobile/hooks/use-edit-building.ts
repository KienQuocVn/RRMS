import { useState } from 'react';
import { useRouter } from 'expo-router';
import { RentType } from '@/types/building.types';

export function useEditBuilding() {
  const router = useRouter();
  const [rentType, setRentType] = useState<RentType>('room');
  const [buildingName, setBuildingName] = useState('Quoc');

  const handleNext = () => {
    console.log('Next step with:', { rentType, buildingName });
  };

  const handleClose = () => {
    router.back();
  };

  const handleSave = () => {
    console.log('Save building:', { rentType, buildingName });
  };

  return {
    rentType,
    setRentType,
    buildingName,
    setBuildingName,
    handleNext,
    handleClose,
    handleSave,
  };
}
