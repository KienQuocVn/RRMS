// components/OTPInput.jsx
import { useEffect, useState } from 'react'
import { Box, InputBase } from '@mui/material'

const OTPInput = ({ length, value = '', onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))

  useEffect(() => {
    const normalized = value
      .slice(0, length)
      .split('')
      .concat(new Array(Math.max(length - value.length, 0)).fill(''))
    setOtp(normalized)
  }, [length, value])

  const handleChange = (val, index) => {
    if (isNaN(val)) return
    const next = [...otp]
    next[index] = val
    setOtp(next)
    onChange(next.join(''))
    if (val && index < length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus()
    }
  }

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus()
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 300 }}>
      {otp.map((val, index) => (
        <InputBase
          key={index}
          id={`otp-input-${index}`}
          inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 18, fontWeight: 600 } }}
          value={val}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleBackspace(e, index)}
          sx={{
            width: 44,
            height: 44,
            border: '1px solid #ccc',
            borderRadius: 1,
            '&.Mui-focused': { borderColor: '#4bcffa' },
            '& input': { p: 0 }
          }}
        />
      ))}
    </Box>
  )
}

export default OTPInput
