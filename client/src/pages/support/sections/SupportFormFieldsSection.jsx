import { Box, MenuItem, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import { SUPPORT_PRICE_OPTIONS } from '../hooks/support.constants'

const labelSx = {
  mb: 0.9,
  fontSize: 15,
  color: '#1f2937'
}

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: 'rgba(102, 120, 145, 0.45)'
    },
    '&:hover fieldset': {
      borderColor: '#69b6eb'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#40b3eb',
      borderWidth: 1
    }
  },
  '& .MuiInputBase-input': {
    py: 1.7,
    fontSize: 16,
    fontWeight: 700,
    color: '#1f2937',
    '&::placeholder': {
      opacity: 1,
      color: '#334155',
      fontWeight: 700
    }
  },
  '& .MuiSelect-select': {
    py: 1.7,
    fontSize: 16,
    fontWeight: 700,
    color: '#1f2937'
  },
  '& .MuiSvgIcon-root': {
    color: '#1f2937'
  }
}

export default function SupportFormFieldsSection({ formValues, onFieldChange, onDateChange, onPriceRangeChange }) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
        gap: 2.5
      }}
    >
      <Box>
        <Typography component="label" htmlFor="support-name" sx={labelSx}>
          {t('support.fields.name')}
        </Typography>
        <TextField
          id="support-name"
          fullWidth
          placeholder={t('support.fields.namePlaceholder')}
          value={formValues.name}
          onChange={onFieldChange('name')}
          sx={textFieldSx}
        />
      </Box>

      <Box>
        <Typography component="label" htmlFor="support-phone" sx={labelSx}>
          {t('support.fields.phone')}
        </Typography>
        <TextField
          id="support-phone"
          fullWidth
          placeholder={t('support.fields.phonePlaceholder')}
          value={formValues.phone}
          onChange={onFieldChange('phone')}
          inputProps={{ inputMode: 'tel' }}
          sx={textFieldSx}
        />
      </Box>

      <Box>
        <Typography component="label" sx={labelSx}>
          {t('support.fields.dateOfStay')}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={formValues.dateOfStay}
            onChange={onDateChange}
            format="MM/DD/YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                placeholder: 'mm/dd/yyyy',
                sx: textFieldSx
              }
            }}
          />
        </LocalizationProvider>
      </Box>

      <Box>
        <Typography component="label" htmlFor="support-price-range" sx={labelSx}>
          {t('support.fields.priceRange')}
        </Typography>
        <TextField
          id="support-price-range"
          select
          fullWidth
          value={formValues.priceRange}
          onChange={onPriceRangeChange}
          SelectProps={{
            displayEmpty: true,
            renderValue: (selected) => {
              const selectedOption = SUPPORT_PRICE_OPTIONS.find((option) => option.value === selected)
              return selectedOption ? t(selectedOption.labelKey) : t('support.fields.pricePlaceholder')
            }
          }}
          sx={textFieldSx}
        >
          <MenuItem value="">{t('support.fields.pricePlaceholder')}</MenuItem>
          {SUPPORT_PRICE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  )
}
