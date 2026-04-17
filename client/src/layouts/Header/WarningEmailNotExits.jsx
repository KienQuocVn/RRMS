import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const WarningEmailNotExits = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: '#ff4757' }}>
      <Typography>{t('header.warningEmail.prefix')}</Typography>
      <Link to="/profile" style={{ margin: '0 5px' }}>
        {t('header.warningEmail.link')}
      </Link>
      <Typography>{t('header.warningEmail.suffix')}</Typography>
    </Box>
  )
}

export default WarningEmailNotExits
