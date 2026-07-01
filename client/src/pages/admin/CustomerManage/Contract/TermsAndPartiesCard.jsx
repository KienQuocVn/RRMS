import React, { useState } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const partyCardStyle = {
  bgcolor: '#f9fafb',
  borderRadius: '8px',
  padding: '12px',
  border: '0.5px solid #f0f0f0',
  flex: 1,
  minWidth: 0,
};

const partyLabelStyle = {
  fontSize: '10px',
  textTransform: 'uppercase',
  color: '#9ca3af',
  letterSpacing: '0.06em',
  fontWeight: 600,
  marginBottom: '6px',
};

const accordionRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 0',
  borderBottom: '0.5px solid #f0f0f0',
  cursor: 'pointer',
  userSelect: 'none',
};

const TermsAndPartiesCard = () => {
  // State quản lý việc mở rộng của 4 Accordion (Điều 1 mở mặc định)
  const [openItems, setOpenItems] = useState({
    item1: true,
    item2: false,
    item3: false,
    item4: false,
  });

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
            Nguyễn Văn Quân
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            0909 xxx 789
          </Typography>
        </Box>

        {/* Bên B */}
        <Box sx={partyCardStyle}>
          <Typography sx={partyLabelStyle}>BÊN B (NGƯỜI THUÊ)</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
            Trần Văn A
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            0912 xxx 345
          </Typography>
        </Box>
      </Box>

      {/* Accordion list */}
      <Box sx={{ borderTop: '0.5px solid #f0f0f0' }}>
        
        {/* Accordion 1 — Điều 1 */}
        <Box>
          <Box onClick={() => toggleItem('item1')} sx={accordionRowStyle}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
              Điều 1: Tiền thuê phòng
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                fontSize: '18px',
                color: '#6b7280',
                transform: openItems.item1 ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
          <Collapse in={openItems.item1} timeout="auto" unmountOnExit>
            <Box sx={{ padding: '0 0 14px 0', marginTop: '8px' }}>
              <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
                Tiền thuê phòng cố định trong vòng 24 tháng. Mọi thay đổi phải được thông báo trước ít nhất 02 tháng. Thanh toán từ ngày 01 đến ngày 05 hàng tháng qua tài khoản ngân hàng được chỉ định.
              </Typography>
            </Box>
          </Collapse>
        </Box>

        {/* Accordion 2 — Điều 2 */}
        <Box>
          <Box onClick={() => toggleItem('item2')} sx={accordionRowStyle}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
              Điều 2: Tiền đặt cọc
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                fontSize: '18px',
                color: '#6b7280',
                transform: openItems.item2 ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
          <Collapse in={openItems.item2} timeout="auto" unmountOnExit>
            <Box sx={{ padding: '0 0 14px 0', marginTop: '8px' }}>
              <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
                Tiền đặt cọc dùng để đảm bảo thực hiện hợp đồng. Tiền đặt cọc sẽ được hoàn trả đầy đủ cho Bên B khi chấm dứt hợp đồng sau khi đã khấu trừ các khoản chi phí sửa chữa hư hại (nếu có) hoặc tiền phòng/phí dịch vụ chưa đóng.
              </Typography>
            </Box>
          </Collapse>
        </Box>

        {/* Accordion 3 — Điều 3 */}
        <Box>
          <Box onClick={() => toggleItem('item3')} sx={accordionRowStyle}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
              Điều 3: Trách nhiệm các bên
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                fontSize: '18px',
                color: '#6b7280',
                transform: openItems.item3 ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
          <Collapse in={openItems.item3} timeout="auto" unmountOnExit>
            <Box sx={{ padding: '0 0 14px 0', marginTop: '8px' }}>
              <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
                Bên B có trách nhiệm bảo quản tài sản của phòng trọ, tuân thủ nội quy phòng trọ và khai báo tạm trú theo pháp luật. Bên A cam kết bàn giao phòng trọ đúng trạng thái và bảo trì kết cấu nhà định kỳ.
              </Typography>
            </Box>
          </Collapse>
        </Box>

        {/* Accordion 4 — Điều 4 */}
        <Box>
          <Box onClick={() => toggleItem('item4')} sx={accordionRowStyle}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
              Điều 4: Chấm dứt hợp đồng
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                fontSize: '18px',
                color: '#6b7280',
                transform: openItems.item4 ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
          <Collapse in={openItems.item4} timeout="auto" unmountOnExit>
            <Box sx={{ padding: '0 0 14px 0', marginTop: '8px' }}>
              <Typography sx={{ fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>
                Mỗi bên muốn chấm dứt hợp đồng trước hạn phải thông báo cho bên kia ít nhất 30 ngày. Trường hợp Bên B tự ý dọn đi hoặc vi phạm nghiêm trọng nội quy thì sẽ bị mất tiền cọc.
              </Typography>
            </Box>
          </Collapse>
        </Box>

      </Box>
    </Box>
  );
};

export default TermsAndPartiesCard;
