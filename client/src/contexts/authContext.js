import React, { createContext, useMemo, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')
  const [account, setAccount] = useState()
  const [token, setToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const value = useMemo(
    () => ({
      username,
      setUsername,
      avatar,
      setAvatar,
      account,
      setAccount,
      token,
      setToken,
      isAdmin,
      setIsAdmin
    }),
    [username, avatar, account, token, isAdmin]
  )

  return React.createElement(AuthContext.Provider, { value }, children)
}
