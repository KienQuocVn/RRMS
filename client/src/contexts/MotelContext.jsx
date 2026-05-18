import { createContext, useMemo, useState } from 'react'

export const MotelContext = createContext(null)

export const MotelProvider = ({ children }) => {
  const [motels, setMotels] = useState([])
  const [isNavAdmin, setIsNavAdmin] = useState(false)

  const value = useMemo(
    () => ({
      motels,
      setMotels,
      isNavAdmin,
      setIsNavAdmin
    }),
    [motels, isNavAdmin]
  )

  return <MotelContext.Provider value={value}>{children}</MotelContext.Provider>
}
