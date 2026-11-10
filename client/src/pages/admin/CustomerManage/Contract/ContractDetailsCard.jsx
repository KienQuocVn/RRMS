import React from 'react'
import { Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '11px 0',
  borderBottom: '0.5px solid #f5f5f5',
}

const labelStyle = {
  fontSize: '13px',
  color: '#6b7280',
}

const valueStyle = {
  fontSize: '13px',
  color: '#1a1a1a',
  textAlign: 'right',
}

const formatCurrency = (amount) => {
  if (amount == null) return '—'
  return Number(amount).toLocaleString('vi-VN') + ' VND'
}

const dash = '—'

const ContractDetailsCard = ({ details = {} }) => {
  const {
    contractCode,
    signDate,
    leaseTerm,
    startDate,
    endDate,
    monthlyRent,
    deposit,
    paymentDay,
    paymentMethod,
  } = details

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '12px',
        border: '0.5px solid #e5e7eb',
        padding: '20px',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <InfoOutlinedIcon sx={{ fontSize: '16px', color: '#20a9e7' }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
          Chi tiết hợp đồng
        </Typography>
      </Box>

      {/* Info Rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Mã HD */}
        <Box sx={rowStyle}>
          <Typography sx={labelStyle}>Mã HD</Typography>
          <Typography sx={{ ...valueStyle, fontWeight: 500 }}>{contractCode ?? dash}</Typography>
        </Box>

        {/* Ngày ký */}
        <Box sx={rowStyle}>
          <Typography sx={labelStyle}>Ngày ký</Typography>
          <Typography sx={valueStyle}>{signDate ?? dash}</Typography>
        </Box>

        {/* Thời hạn thuê */}
        <Box sx={rowStyle}>
          <Typography sx={labelStyle}>Thời hạn thuê</Typography>
          <Typography sx={valueStyle}>{leaseTerm ?? dash}</Typography>
        </Box>

        {/* Ngày bắt đầu / kết thúc */}
        <Box sx={{ ...rowStyle, alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={labelStyle}>Ngày bắt đầu / kết thúc</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
            <Typography sx={{ fontSize: '13px', color: '#1a1a1a' }}>{startDate ?? dash}</Typography>
            <Typography sx={{ fontSize: '13px', color: '#1a1a1a' }}>{endDate ?? dash}</Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: '0.5px', bgcolor: '#f0f0f0', margin: '4px 0' }} />

        {/* Tiền thuê hàng tháng */}
        <Box sx={rowStyle}>
          <Typography sx={labelStyle}>Tiền thuê hàng tháng</Typography>
          <Typography sx={{ ...valueStyle, fontSize: '15px', fontWeight: 500, color: '#20a9e7' }}>
            {formatCurrency(monthlyRent)}
          </Typography>
        </Box>

        {/* Tiền cọc */}
        <Box sx={rowStyle}>
          <Typography sx={labelStyle}>Tiền cọc</Typography>
          <Typography sx={{ ...valueStyle, fontWeight: 500 }}>{formatCurrency(deposit)}</Typography>
        </Box>

        {/* Ngày thanh toán */}
        <Box sx={rowStyle}>
          <Typography sx={labelStyle}>Ngày thanh toán</Typography>
          <Typography sx={valueStyle}>{paymentDay ?? dash}</Typography>
        </Box>

        {/* Hình thức thanh toán */}
        <Box sx={{ ...rowStyle, borderBottom: 'none' }}>
          <Typography sx={labelStyle}>Hình thức thanh toán</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AccountBalanceIcon sx={{ fontSize: '14px', color: '#6b7280' }} />
            <Typography sx={{ fontSize: '13px', color: '#1a1a1a' }}>{paymentMethod ?? dash}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ContractDetailsCard
