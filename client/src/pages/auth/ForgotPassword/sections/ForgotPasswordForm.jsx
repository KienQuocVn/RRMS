import { Link } from 'react-router-dom'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    backgroundColor: '#fff'
  }
}

const ForgotPasswordForm = ({ email, passNew, passConf, errors, setEmail, setPassNew, setPassConf, onSubmit }) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 640,
        mx: 'auto'
      }}
    >
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label={t('auth.forgotPassword.emailLabel')}
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="medium"
              error={!!errors.email}
              helperText={errors.email}
              sx={inputSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="password"
              label={t('auth.forgotPassword.newPasswordLabel')}
              placeholder={t('auth.forgotPassword.passwordPlaceholder')}
              value={passNew}
              onChange={(e) => setPassNew(e.target.value)}
              size="medium"
              error={!!errors.passNew}
              helperText={errors.passNew}
              sx={inputSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="password"
              label={t('auth.forgotPassword.confirmPasswordLabel')}
              placeholder={t('auth.forgotPassword.confirmPasswordPlaceholder')}
              value={passConf}
              onChange={(e) => setPassConf(e.target.value)}
              size="medium"
              error={!!errors.passConf}
              helperText={errors.passConf}
              sx={inputSx}
            />
          </Grid>

          {errors.identical && (
            <Grid item xs={12}>
              <Typography variant="caption" color="error" textAlign="center" display="block">
                {errors.identical}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Typography variant="body1" sx={{ mt: 2.5, mb: 0.5, lineHeight: 1.8, color: '#334155' }}>
          {t('auth.forgotPassword.description')}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={onSubmit}
          sx={{
            mt: 3,
            background: 'linear-gradient(135deg, #6fceee 0%, #4bcffa 100%)',
            borderRadius: '12px',
            fontWeight: 700,
            border: 'none',
            fontSize: '1rem',
            py: 1.6,
            textTransform: 'none',
            boxShadow: '0 14px 28px rgba(62, 169, 66, 0.18)',
            '&:hover': { background: 'linear-gradient(135deg, #4bcffa 0%, #6fceee 100%)' }
          }}
        >
          {t('auth.forgotPassword.submit')}
        </Button>

        <Box textAlign="center" mt={2}>
          <Button component={Link} to="/login" variant="text" sx={{ textDecoration: 'underline', textTransform: 'none', fontSize: '1rem' }}>
            {t('auth.forgotPassword.backToLogin')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ForgotPasswordForm
