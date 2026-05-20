import { Link } from 'react-router-dom'
import { Box, Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

const roleOptionSx = {
  m: 0,
  flex: 1,
  minHeight: 52,
  borderRadius: 2,
  bgcolor: '#f3f4f6',
  px: 1.5,
  py: 0.5,
  alignItems: 'center'
}

const RegisterForm = ({ form, updateField, onSubmit }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ borderRadius: 2, boxShadow: '0 5px 8px 0 rgba(0,0,0,.2), 0 9px 26px 0 rgba(0,0,0,.19)', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: '#fff', p: '5%' }}>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ p: '5%' }}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <RadioGroup row value={form.userType} onChange={updateField('userType')} sx={{ gap: 1.5, flexWrap: 'wrap' }}>
              <FormControlLabel value="HOST" control={<Radio />} label={t('auth.register.host')} sx={roleOptionSx} />
              <FormControlLabel value="CUSTOMER" control={<Radio />} label={t('auth.register.customer')} sx={roleOptionSx} />
              <FormControlLabel value="BROKER" control={<Radio />} label={t('auth.register.broker')} sx={roleOptionSx} />
            </RadioGroup>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={t('auth.register.username')}
                placeholder={t('auth.register.usernamePlaceholder')}
                value={form.username}
                onChange={updateField('username')}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={t('auth.register.phone')}
                placeholder={t('auth.register.phonePlaceholder')}
                value={form.phone}
                onChange={updateField('phone')}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="password"
                label={t('auth.register.password')}
                placeholder={t('auth.register.passwordPlaceholder')}
                value={form.password}
                onChange={updateField('password')}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="password"
                label={t('auth.register.confirmPassword')}
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                value={form.passwordConfirmation}
                onChange={updateField('passwordConfirmation')}
                size="small"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 1,
              background: 'linear-gradient(to right, #6fceee, #4bcffa)',
              borderRadius: '10px',
              fontWeight: 600,
              border: 'none',
              height: 48,
              '&:hover': { background: 'linear-gradient(to right, #4bcffa, #6fceee)' }
            }}
          >
            {t('auth.register.submit')}
          </Button>

          <Box textAlign="center">
            <Button component={Link} to="/login" variant="text">
              {t('auth.register.haveAccount')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RegisterForm
