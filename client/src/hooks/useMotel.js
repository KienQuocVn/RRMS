import { useContext } from 'react'
import { MotelContext } from '~/contexts/MotelContext'

export const useMotel = () => {
  const context = useContext(MotelContext)
  if (!context) {
    throw new Error('useMotel must be used within MotelProvider')
  }
  return context
}
