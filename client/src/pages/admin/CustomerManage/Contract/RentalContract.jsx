import React, { useEffect, useState, useCallback } from 'react'
import { Box, CircularProgress } from '@mui/material'
import ContractStatusBanner from './ContractStatusBanner'
import ContractDetailsCard from './ContractDetailsCard'
import TermsAndPartiesCard from './TermsAndPartiesCard'
import ContractHistoryTimeline from './ContractHistoryTimeline'
import { getContractByRoomId, formatContractDate, mapContractStatus } from '~/apis/contractAPI'
import { useMotel } from '~/hooks/useMotel'

/* ── Error / Empty helpers ── */
const ErrorAlert = ({ message }) => (
  <Box
    sx={{
      bgcolor: '#fff7ed',
      border: '0.5px solid #fed7aa',
      borderRadius: 10,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      mt: 2,
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span style={{ fontSize: 13, color: '#7c2d12' }}>{message}</span>
  </Box>
)

const EmptyState = () => (
  <Box sx={{ textAlign: 'center', py: 8, color: '#9ca3af' }}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.4" style={{ margin: '0 auto 12px', display: 'block' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
    </svg>
    <p style={{ fontSize: 14, margin: 0 }}>Không tìm thấy hợp đồng thuê phòng.</p>
    <p style={{ fontSize: 12, marginTop: 6, color: '#d1d5db' }}>Bạn chưa có hợp đồng hoặc phòng chưa được gán hợp đồng.</p>
  </Box>
)

/* ── Main Component ── */
const RentalContract = () => {
  const { motels } = useMotel()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContract = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Lấy roomId từ motel đầu tiên của user
      const roomId = motels?.[0]?.roomId ?? motels?.[0]?.room?.roomId ?? motels?.[0]?.contract?.room?.roomId ?? null
      if (!roomId) {
        setContract(null)
        setLoading(false)
        return
      }
      if (motels?.[0]?.contract) {
        setContract(motels[0].contract)
        setLoading(false)
        return
      }
      const data = await getContractByRoomId(roomId)
      setContract(data)
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.status === 204) {
        setContract(null)
      } else {
        setError('Không thể tải thông tin hợp đồng. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }, [motels])

  useEffect(() => {
    fetchContract()
  }, [fetchContract])

  const handleDownloadPDF = () => {
    alert('Chức năng tải PDF đang được phát triển.')
  }

  /* ── Derive display data from API response ── */
  const statusInfo = mapContractStatus(contract?.status)

  // Tiêu đề: tên phòng
  const roomName = contract?.room?.roomName ?? contract?.room?.roomCode ?? contract?.room?.name ?? 'Phòng thuê'
  const bannerTitle = `Hợp đồng thuê ${roomName}`

  // Ngày kết thúc
  const endDateStr = formatContractDate(contract?.closeContract ?? contract?.reportCloseContract)

  // Chi tiết hợp đồng
  const contractDetails = {
    contractCode: contract?.contractId ? `HD-${String(contract.contractId).split('-')[0].toUpperCase()}` : null,
    signDate: formatContractDate(contract?.moveInDate ?? contract?.createDate),
    leaseTerm: contract?.leaseTerm ? `${contract.leaseTerm} tháng` : null,
    startDate: formatContractDate(contract?.moveInDate),
    endDate: formatContractDate(contract?.closeContract),
    monthlyRent: contract?.price ?? contract?.actualPrice,
    deposit: contract?.deposit,
    paymentDay: contract?.collectionCycle ?? null,
    paymentMethod: 'Chuyển khoản', // thường cố định
  }

  // Thông tin các bên
  const partyA = {
    name: contract?.username?.displayName ?? contract?.username?.username ?? null,
    phone: contract?.username?.phone ?? null,
  }
  const partyB = {
    name: contract?.tenant?.fullName ?? null,
    phone: contract?.tenant?.phone ?? null,
  }

  // Điều khoản từ contractTemplate
  const terms = contract?.contractTemplate?.clauses ?? contract?.description ?? null

  return (
    <Box sx={{ padding: '20px', bgcolor: '#f5f7fa', minHeight: '100%' }}>
      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#20a9e7' }} />
        </Box>
      )}

      {/* Error */}
      {!loading && error && <ErrorAlert message={error} />}

      {/* Không có hợp đồng */}
      {!loading && !error && !contract && <EmptyState />}

      {/* Có dữ liệu */}
      {!loading && !error && contract && (
        <>
          {/* Block 1 — Contract status banner */}
          <ContractStatusBanner
            title={bannerTitle}
            status={statusInfo.label}
            statusBgColor={statusInfo.bgcolor}
            statusColor={statusInfo.color}
            expiryDate={endDateStr}
            onDownloadPDF={handleDownloadPDF}
          />

          {/* Block 2 — Main content (2 columns) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <ContractDetailsCard details={contractDetails} />
            <TermsAndPartiesCard partyA={partyA} partyB={partyB} terms={terms} contract={contract} />
          </Box>

          {/* Block 3 — Lịch sử hợp đồng */}
          <ContractHistoryTimeline contract={contract} />
        </>
      )}
    </Box>
  )
}

export default RentalContract
