import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const LanguageSelect = ({ toggleLanguage, currentLanguage }) => {
  const { t, i18n } = useTranslation()
  const activeLanguage = (currentLanguage || i18n.resolvedLanguage || i18n.language || 'vi').startsWith('vi') ? 'vi' : 'en'

  const handleToggleLanguage = () => {
    if (toggleLanguage) {
      toggleLanguage()
      return
    }

    const nextLanguage = activeLanguage === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLanguage)
    localStorage.setItem('language', nextLanguage)
  }

  return (
    <Box
      onClick={handleToggleLanguage}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 'fit-content',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        lineHeight: 1,
        color: 'inherit',
        cursor: 'pointer',
        '& img': {
          display: 'block'
        }
      }}>
      {activeLanguage === 'vi' ? (
        <img
          src="/american.jpg"
          alt="Vietnam"
          width={24}
          height={24}
        />
      ) : (
        <img
          src="/vietnam.png"
          alt="American"
          width={24}
          height={24}
        />
      )}
      <span>{activeLanguage === 'vi' ? t('header.language.vi') : t('header.language.en')}</span>
    </Box>
  )
}

export default LanguageSelect
