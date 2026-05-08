import { useState } from 'react'
import { Box, TextField, Button, Divider, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import ValidCaptcha from '~/components/ValidCaptcha'

const LoginForm = ({ phone, setPhone, password, setPassword, setValidCaptcha, captchaResetKey, handleSubmit }) => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 1
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('auth.login.phonePlaceholder')}
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputProps={{ autoComplete: 'tel' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              '& fieldset': { border: 'none' },
              borderBottom: '1px solid #ccc'
            },
            '& input': { fontWeight: 'bold', py: '15px', px: '10px' }
          }}
        />
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('auth.login.passwordPlaceholder')}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ autoComplete: 'current-password' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((previous) => !previous)}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              '& fieldset': { border: 'none' }
            },
            '& input': { fontWeight: 'bold', py: '15px', px: '10px' }
          }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          my: 1,
          py: 1.2,
          fontWeight: 600,
          borderRadius: 2,
          background: 'linear-gradient(to right, #6fceee, #4bcffa)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(to right, #4bcffa, #6fceee)',
            boxShadow: 'none'
          }
        }}
      >
        {t('auth.login.submit')}
      </Button>

      <ValidCaptcha setValidCaptcha={setValidCaptcha} resetSignal={captchaResetKey} />

      <Divider sx={{ my: 1.5 }} />
    </Box>
  )
}

export default LoginForm
