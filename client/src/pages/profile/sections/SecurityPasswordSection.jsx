import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ProfileSectionCard from './ProfileSectionCard'

function SecurityPasswordSection({ passwordData, showPassword, onFieldChange, onTogglePassword, onSubmit }) {
  const { t } = useTranslation()

  const fields = [
    { label: t('profile.security.currentPassword'), name: 'oldPassword' },
    { label: t('profile.security.newPassword'), name: 'newPassword' },
    { label: t('profile.security.confirmPassword'), name: 'confirmPassword' }
  ]

  return (
    <ProfileSectionCard title={t('profile.security.title')} description={t('profile.security.description')}>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {fields.map((field) => (
          <FormControl
            key={field.name}
            variant="outlined"
            sx={{
              width: '100%',
              '.MuiInputBase-input': {
                border: 'none',
                height: 'auto'
              }
            }}
          >
            <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
            <OutlinedInput
              id={field.name}
              type={showPassword ? 'text' : 'password'}
              name={field.name}
              value={passwordData[field.name]}
              onChange={onFieldChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label={t('profile.security.toggleVisibility')} onClick={onTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={field.label}
            />
          </FormControl>
        ))}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onSubmit}
          sx={{
            height: 46,
            borderRadius: 2.5,
            fontWeight: 700
          }}
        >
          {t('profile.security.submit')}
        </Button>
      </Box>
    </ProfileSectionCard>
  )
}

export default SecurityPasswordSection
