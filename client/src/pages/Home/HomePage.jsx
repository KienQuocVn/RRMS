/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import BannerSection from './sections/BannerSection'
import HighlightsSection from './sections/HighlightsSection'
import BankSupportSection from './sections/BankSupportSection'
import MultiPlatformSection from './sections/MultiPlatformSection'
import SolutionsTabSection from './sections/SolutionsTabSection'
import DigitalTransformSection from './sections/DigitalTransformSection'
import TestimonialsSection from './sections/TestimonialsSection'
import PartnersSection from './sections/PartnersSection'
import './sections/HomeSections.css'

export default function HomePage({ setIsAdmin }) {
  useEffect(() => {
    setIsAdmin(false)
  }, [])

  return (
    <div className="home-page">
      <BannerSection />
      <HighlightsSection />
      <BankSupportSection />
      <MultiPlatformSection />
      <SolutionsTabSection />
      <DigitalTransformSection />
      <TestimonialsSection />
      <PartnersSection />
    </div>
  )
}
