import { useState } from 'react';
import { RentType } from '@/types/building.types';
import { useRouter } from 'expo-router';

export function useAddBuilding() {
  const router = useRouter();
  const [rentType, setRentType] = useState<RentType>('room');
  const [isAutoInit, setIsAutoInit] = useState(true);

  const handleNext = () => {
    // Logic cho việc lưu và chuyển bước tiếp theo
    console.log('Next step with:', { rentType, isAutoInit });
  };

  const handleClose = () => {
    router.back();
  };

  return {
    rentType,
    setRentType,
    isAutoInit,
    setIsAutoInit,
    handleNext,
    handleClose,
  };
}
