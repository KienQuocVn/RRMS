import React, { useState } from 'react';
import { Box, Typography, Button, Badge, Collapse, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Custom Momo Icon
const MomoIcon = () => (
  <Box
    component="span"
    sx={{
      width: '16px',
      height: '16px',
      borderRadius: '4px',
      bgcolor: '#ae2070',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '9px',
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      mr: '6px',
    }}
  >
    M
  </Box>
);

const BillCardItem = ({ bill, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showTableDetail, setShowTableDetail] = useState(bill.status === 'unpaid'); // unpaid luôn hiện bảng chi tiết

  const isUnpaid = bill.status === 'unpaid';

  const handleToggleExpand = () => {
    if (!isUnpaid) {
      setExpanded(!expanded);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: '12px',
        border: '0.5px solid #e5e7eb',
        overflow: 'hidden',
        marginTop: '12px',
      }}
    >
      {/* Card Header */}
      <Box
        onClick={handleToggleExpand}
        sx={{
          padding: '14px 16px',
          borderBottom: (isUnpaid || expanded) ? '0.5px solid #f0f0f0' : 'none',
          display: 'flex',
          alignItems: 'center',
          cursor: isUnpaid ? 'default' : 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Left Block */}
        <Box>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}
          >
            THÁNG {bill.month}
          </Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a', marginTop: '2px' }}>
            Hóa đơn sinh hoạt
          </Typography>
        </Box>

        {/* Middle Block */}
        {isUnpaid ? (
          <Box sx={{ marginLeft: '24px' }}>
            <Typography sx={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.1 }}>
              Hạn thanh toán
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#E24B4A', marginTop: '2px' }}>
              {bill.dueDate}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ marginLeft: '24px' }}>
            <Typography sx={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.1 }}>
              Tổng cộng
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', marginTop: '2px' }}>
              {bill.totalAmount}
            </Typography>
          </Box>
        )}

        {/* Right Block */}
        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isUnpaid && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.1 }}>
                Tổng cộng
              </Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a', marginTop: '2px' }}>
                {bill.totalAmount}
              </Typography>
            </Box>
          )}

          {/* Status Badge */}
          <Box
            sx={{
              bgcolor: isUnpaid ? '#FAEEDA' : '#EAF3DE',
              color: isUnpaid ? '#BA7517' : '#27500A',
              fontSize: '11px',
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: '6px',
              textTransform: 'uppercase',
            }}
          >
            {isUnpaid ? 'Chưa thanh toán' : 'Đã thanh toán'}
          </Box>

          {/* Chevron Icon for Paid status */}
          {!isUnpaid && (
            <Box sx={{ color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          )}
        </Box>
      </Box>

      {/* Card Body - Line items table (Collapsible for Paid bills) */}
      <Collapse in={isUnpaid || expanded} timeout="auto" unmountOnExit>
        {/* Nếu đã thanh toán, ban đầu có thể chỉ hiện Payment Info, click link thì mới hiện Table Detail */}
        {(!isUnpaid && expanded) && (
          <Box sx={{ padding: '12px 16px 14px', borderBottom: showTableDetail ? '0.5px solid #f0f0f0' : 'none' }}>
            <Link
              component="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTableDetail(!showTableDetail);
              }}
              sx={{
                fontSize: '12px',
                color: '#20a9e7',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '2px',
                mb: '8px',
                fontWeight: 500,
                border: 'none',
                bg: 'transparent',
                cursor: 'pointer',
                p: 0,
              }}
            >
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: '16px',
                  transform: showTableDetail ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
              Xem chi tiết các khoản
            </Link>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <Box sx={{ display: 'flex', gap: '24px' }}>
                <Box>
                  <Typography sx={{ fontSize: '11px', color: '#9ca3af', mb: '2px' }}>Ngày thanh toán</Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{bill.paymentDate}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '11px', color: '#9ca3af', mb: '2px' }}>Phương thức</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {bill.paymentMethod === 'momo' ? (
                      <>
                        <MomoIcon />
                        <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>Momo</Typography>
                      </>
                    ) : (
                      <>
                        <AccountBalanceIcon sx={{ color: '#20a9e7', fontSize: '14px', mr: '6px' }} />
                        <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>
                          Chuyển khoản (Techcombank)
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  border: '0.5px solid #e5e7eb',
                  color: '#6b7280',
                  bgcolor: '#ffffff',
                  fontSize: '12px',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#20a9e7',
                    color: '#20a9e7',
                    bgcolor: '#f0f9ff',
                  },
                  marginLeft: 'auto',
                }}
              >
                In biên lai
              </Button>
            </Box>
          </Box>
        )}

        <Collapse in={showTableDetail} timeout="auto" unmountOnExit>
          <Box sx={{ padding: '0 16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', height: '36px' }}>
                  <th style={{ textAlign: 'left', width: '35%', fontSize: '11px', color: '#9ca3af', paddingLeft: '12px', fontWeight: 500 }}>
                    HẠNG MỤC
                  </th>
                  <th style={{ textAlign: 'center', width: '20%', fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
                    CHỈ SỐ (CŨ/MỚI)
                  </th>
                  <th style={{ textAlign: 'center', width: '15%', fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
                    SỐ LƯỢNG
                  </th>
                  <th style={{ textAlign: 'right', width: '15%', fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
                    ĐƠN GIÁ
                  </th>
                  <th style={{ textAlign: 'right', width: '15%', fontSize: '11px', color: '#9ca3af', paddingRight: '12px', fontWeight: 500 }}>
                    THÀNH TIỀN
                  </th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={index} style={{ height: '44px', borderBottom: '0.5px solid #f5f5f5' }}>
                    {/* Hạng mục */}
                    <td style={{ paddingLeft: '12px' }}>
                      <Link
                        href="#"
                        underline="hover"
                        sx={{
                          color: '#20a9e7',
                          fontWeight: 500,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        {item.name}
                      </Link>
                    </td>
                    {/* Chỉ số (Cũ/Mới) */}
                    <td style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                      {item.indexRange || '—'}
                    </td>
                    {/* Số lượng */}
                    <td style={{ textAlign: 'center', color: '#1a1a1a' }}>
                      {item.quantity}
                    </td>
                    {/* Đơn giá */}
                    <td style={{ textAlign: 'right', color: '#1a1a1a' }}>
                      {item.price}
                    </td>
                    {/* Thành tiền */}
                    <td style={{ textAlign: 'right', fontWeight: 500, color: '#1a1a1a', paddingRight: '12px' }}>
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Collapse>

        {/* Card Footer (Chỉ hiện cho hóa đơn Chưa thanh toán) */}
        {isUnpaid && (
          <Box
            sx={{
              padding: '12px 16px',
              bgcolor: '#fff9f0',
              borderTop: '0.5px solid #f0e6d3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#BA7517' }}>
              <InfoOutlinedIcon sx={{ fontSize: '15px', mr: '6px' }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                Vui lòng thanh toán trước ngày 05 để tránh phát sinh phí phạt.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CreditCardIcon sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: '#20a9e7',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                '&:hover': {
                  bgcolor: '#2b7ed7',
                },
              }}
            >
              Thanh toán ngay
            </Button>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default BillCardItem;
