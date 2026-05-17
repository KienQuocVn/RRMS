import { useRouter } from 'expo-router';
import { useAddBuildingFlow } from '@/hooks/use-add-building-flow';

export function useAddBuilding() {
  const router = useRouter();
  const rentType = useAddBuildingFlow((state) => state.rentType);
  const setRentType = useAddBuildingFlow((state) => state.setRentType);
  const isAutoInit = useAddBuildingFlow((state) => state.isAutoInit);
  const setIsAutoInit = useAddBuildingFlow((state) => state.setIsAutoInit);

  const handleNext = () => {
    router.push('/add-building/add-building-services');
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
