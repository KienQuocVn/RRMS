import React from 'react'
import { Box, Typography } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import CheckIcon from '@mui/icons-material/Check'
import { formatContractDate, mapContractStatus } from '~/apis/contractAPI'

const dash = '—'

const ContractHistoryTimeline = ({ contract = null }) => {
  // Nếu không có dữ liệu hợp đồng thì ẩn section
  if (!contract) return null

  const statusInfo = mapContractStatus(contract?.status)
  const roomName = contract?.room?.roomName ?? contract?.room?.roomCode ?? 'Phòng thuê'
  const contractCode = contract?.contractId
    ? `HD-${String(contract.contractId).split('-')[0].toUpperCase()}`
    : dash
  const startDate = formatContractDate(contract?.moveInDate)
  const endDate = formatContractDate(contract?.closeContract)

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '12px',
        border: '0.5px solid #e5e7eb',
        padding: '20px',
        marginTop: '16px',
      }}
    >
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <HistoryIcon sx={{ fontSize: '16px', color: '#20a9e7' }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
          Lịch sử hợp đồng
        </Typography>
      </Box>

      {/* Timeline container */}
      <Box sx={{ position: 'relative', paddingLeft: '40px' }}>
        {/* Vertical Line */}
        <Box
          sx={{
            position: 'absolute',
            left: '19px',
            top: '0px',
            bottom: '0px',
            width: '2px',
            bgcolor: '#e5e7eb',
          }}
        />

        {/* Timeline Item — Hợp đồng hiện tại */}
        <Box sx={{ position: 'relative' }}>
          {/* Dot */}
          <Box
            sx={{
              position: 'absolute',
              left: '-40px',
              top: '0px',
              width: '36px',
              height: '36px',
              bgcolor: '#20a9e7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <CheckIcon sx={{ color: '#ffffff', fontSize: '18px' }} />
          </Box>

          {/* Content Card */}
          <Box
            sx={{
              bgcolor: '#f0f9ff',
              borderRadius: '10px',
              border: '0.5px solid #b3ddf5',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left text */}
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
                Hợp đồng hiện tại: {contractCode}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Thời hạn: {startDate} – {endDate}
              </Typography>
              {contract?.description && (
                <Typography sx={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic', marginTop: '2px' }}>
                  {contract.description}
                </Typography>
              )}
            </Box>

            {/* Right badge */}
            <Box
              sx={{
                bgcolor: statusInfo.bgcolor,
                color: statusInfo.color,
                fontSize: '11px',
                fontWeight: 500,
                padding: '4px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-start',
              }}
            >
              {statusInfo.label}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ContractHistoryTimeline
