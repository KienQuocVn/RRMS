import { Box } from '@mui/material'
import { useEffect } from 'react'
import CapabilitySection from './sections/CapabilitySection'
import CoreValuesSection from './sections/CoreValuesSection'
import HeroSection from './sections/HeroSection'
import MissionVisionSection from './sections/MissionVisionSection'
import PostStepsSection from './sections/PostStepsSection'
import PromoSection from './sections/PromoSection'
import StatsSection from './sections/StatsSection'
import StorySection from './sections/StorySection'

const Introduce = ({ setIsAdmin }) => {
  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box component="main" sx={{ bgcolor: '#fff', pb: { xs: 8, md: 10 } }}>
      <HeroSection />
      <StorySection />
      <MissionVisionSection />
      <CoreValuesSection />
      <CapabilitySection />
      <PromoSection />
      <PostStepsSection />
      <StatsSection />
    </Box>
  )
}

export default Introduce
