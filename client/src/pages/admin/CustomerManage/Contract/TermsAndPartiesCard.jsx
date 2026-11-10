import React, { useState } from 'react'
import { Box, Typography, Collapse } from '@mui/material'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const partyCardStyle = {
  bgcolor: '#f9fafb',
  borderRadius: '8px',
  padding: '12px',
  border: '0.5px solid #f0f0f0',
  flex: 1,
  minWidth: 0,
}

const partyLabelStyle = {
  fontSize: '10px',
  textTransform: 'uppercase',
  color: '#9ca3af',
  letterSpacing: '0.06em',
  fontWeight: 600,
  marginBottom: '6px',
}

const accordionRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 0',
  borderBottom: '0.5px solid #f0f0f0',
  cursor: 'pointer',
  userSelect: 'none',
}

/* Các điều khoản mặc định — sử dụng khi API không trả về điều khoản cụ thể */
const DEFAULT_TERMS = [
  {
    title: 'Điều 1: Tiền thuê phòng',
    content:
      'Tiền thuê phòng cố định theo hợp đồng. Mọi thay đổi phải được thông báo trước ít nhất 02 tháng. Thanh toán từ ngày 01 đến ngày 05 hàng tháng qua tài khoản ngân hàng được chỉ định.',
  },
  {
    title: 'Điều 2: Tiền đặt cọc',
    content:
      'Tiền đặt cọc dùng để đảm bảo thực hiện hợp đồng. Tiền đặt cọc sẽ được hoàn trả đầy đủ cho Bên B khi chấm dứt hợp đồng sau khi đã khấu trừ các khoản chi phí sửa chữa hư hại (nếu có) hoặc tiền phòng/phí dịch vụ chưa đóng.',
  },
  {
    title: 'Điều 3: Trách nhiệm các bên',
    content:
      'Bên B có trách nhiệm bảo quản tài sản của phòng trọ, tuân thủ nội quy phòng trọ và khai báo tạm trú theo pháp luật. Bên A cam kết bàn giao phòng trọ đúng trạng thái và bảo trì kết cấu nhà định kỳ.',
  },
  {
    title: 'Điều 4: Chấm dứt hợp đồng',
    content:
      'Mỗi bên muốn chấm dứt hợp đồng trước hạn phải thông báo cho bên kia ít nhất 30 ngày. Trường hợp Bên B tự ý dọn đi hoặc vi phạm nghiêm trọng nội quy thì sẽ bị mất tiền cọc.',
  },
]

const dash = '—'

const TermsAndPartiesCard = ({ partyA = {}, partyB = {}, terms = null, contract = null }) => {
  const [openItems, setOpenItems] = useState({ 0: true })

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Nếu API trả về mảng điều khoản thì dùng, ngược lại dùng mặc định
  const termsList = Array.isArray(terms) && terms.length > 0 ? terms : DEFAULT_TERMS

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
        <GroupOutlinedIcon sx={{ fontSize: '16px', color: '#20a9e7' }} />
        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
          Điều khoản &amp; Thông tin các bên
        </Typography>
      </Box>

      {/* Parties Grid */}
      <Box sx={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* Bên A */}
        <Box sx={partyCardStyle}>
          <Typography sx={partyLabelStyle}>BÊN A (CHỦ TRỌ)</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
            {partyA.name ?? dash}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {partyA.phone ?? dash}
          </Typography>
        </Box>

        {/* Bên B */}
        <Box sx={partyCardStyle}>
          <Typography sx={partyLabelStyle}>BÊN B (NGƯỜI THUÊ)</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
            {partyB.name ?? dash}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {partyB.phone ?? dash}
          </Typography>
        </Box>
      </Box>

      {/* Accordion list */}
      <Box sx={{ borderTop: '0.5px solid #f0f0f0' }}>
        {termsList.map((term, idx) => (
          <Box key={idx}>
            <Box onClick={() => toggleItem(idx)} sx={accordionRowStyle}>
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
                {term.title ?? `Điều ${idx + 1}`}
              </Typography>
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: '18px',
                  color: '#6b7280',
                  transform: openItems[idx] ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </Box>
            <Collapse in={!!openItems[idx]} timeout="auto" unmountOnExit>
              <Box sx={{ padding: '0 0 14px 0', marginTop: '8px' }}>
                <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
                  {term.content ?? term.description ?? dash}
                </Typography>
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default TermsAndPartiesCard
