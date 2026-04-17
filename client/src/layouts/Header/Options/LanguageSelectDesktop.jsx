import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const LanguageSelectDesktop = ({ toggleLanguage, currentLanguage }) => {
  const { t } = useTranslation()

  return (
    <Box
      onClick={toggleLanguage}
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
      }}
    >
      {currentLanguage === 'vi' ? (
        <img
          src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Fvietnam.png?alt=media&token=9e4a0137-2346-4190-b71b-147842b01ff7"
          alt="Vietnam"
          width={24}
          height={24}
        />
      ) : (
        <img
          src="https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Funited-kingdom.png?alt=media&token=82b89dec-9bfa-4b78-a551-5149518d4068"
          alt="English"
          width={24}
          height={24}
        />
      )}
      <Box component="span" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
        {currentLanguage === 'vi' ? t('header.language.vi') : t('header.language.en')}
      </Box>
    </Box>
  )
}

export default LanguageSelectDesktop
