import { Link } from 'react-router-dom'
import { Box, Avatar } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'

const MenuItem = ({ to, icon, label, highlight, badge, onClick }) => (
  <Box sx={{ p: 0 }}>
    <Box
      component={to ? Link : 'a'}
      to={to}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 40,
        width: '100%',
        px: 1.5,
        textDecoration: 'none',
        color: '#222222',
        fontSize: '1rem',
        cursor: 'pointer',
        bgcolor: highlight ? '#ebfaff' : 'transparent',
        '&:hover': { bgcolor: '#E8E8E8', color: '#222222' }
      }}
    >
      <Box component="img" src={icon} alt="" sx={{ width: 24, height: 24 }} />
      <Box component="span" sx={{ ml: 1.5, lineHeight: '24px', flex: 1 }}>{label}</Box>
      {badge && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#4bcffa', fontSize: '0.875rem', mr: 1.25 }}>
          <strong>{badge}&nbsp;</strong>
          <Box component="img" src="/chervon_right_orange.svg" alt="" />
        </Box>
      )}
    </Box>
  </Box>
)

const SectionLabel = ({ label }) => (
  <Box sx={{ height: 38, bgcolor: '#f5f5f5', px: 1.5, py: '10px 0 10px' }}>
    <Box component="span" sx={{ color: '#777777', lineHeight: '18px', fontSize: '0.875rem', fontWeight: 700, display: 'block' }}>
      {label}
    </Box>
  </Box>
)

export default function AccountMenu({ username, avatar, tokenExists, onMenuClose, onLogout }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'absolute',
        width: 300,
        maxHeight: '80vh',
        overflowY: 'auto',
        top: 50,
        right: -5,
        bgcolor: '#FFFFFF',
        py: 1,
        border: '1px solid rgba(0,0,0,0.15)',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        borderTop: 'none',
        zIndex: 1001
      }}
    >
      {/* User header */}
      <Box sx={{ position: 'relative', p: 1.5, height: 124 }}>
        {username ? (
          <Box component={Link} to="/profile" onClick={onMenuClose} sx={{ display: 'flex', textDecoration: 'none' }}>
            <Avatar sx={{ width: 48, height: 48 }}>{username[0]}</Avatar>
            <Box sx={{ ml: 1, mt: '14px', fontWeight: 700, fontSize: '1rem', color: '#222222' }}>{username}</Box>
          </Box>
        ) : (
          <Box component={Link} to="/login" onClick={onMenuClose} sx={{ display: 'flex', textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'block',
                backgroundImage: `url(${avatar || '/default_user.png'})`,
                backgroundSize: '100%',
                borderRadius: '50%',
                height: 48,
                width: 48,
                flexShrink: 0
              }}
            />
            <Box sx={{ ml: 1, mt: '14px', fontWeight: 700, fontSize: '1rem', color: '#222222' }}>
              Đăng nhập / Đăng ký
            </Box>
          </Box>
        )}

        {/* VA Banner */}
        <Box
          sx={{
            width: '100%',
            mt: 1,
            pt: 1.5,
            mb: 1.5,
            fontSize: '0.75rem',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              pr: 0,
              borderRadius: '8px',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: '20px',
              bgcolor: '#306bd9',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '47px', position: 'relative' }}>
              <Box component="img" src="/virtual-account-banner-icon.png" alt="" sx={{ width: 50, height: 40, position: 'absolute', left: -3, bottom: 0 }} />
              <span>Nạp Đồng Tốt giá trị linh hoạt</span>
            </Box>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fill="#fff" d="M5.37301 3.12235C5.58129 2.91407 5.91893 2.91407 6.12721 3.12235L10.6273 7.62235C10.8356 7.83063 10.8356 8.16827 10.6273 8.37655L6.12721 12.8766C5.91893 13.0849 5.58129 13.0849 5.37301 12.8766C5.16473 12.6683 5.16473 12.3307 5.37301 12.1224L9.49588 7.99951L5.37301 3.87664C5.16473 3.66836 5.16473 3.33072 5.37301 3.0183Z" />
            </svg>
          </Box>
        </Box>
        <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', mt: 1 }} />
      </Box>

      {/* Quản lý đơn hàng */}
      <SectionLabel label="Quản lí đơn hàng" />
      <MenuItem to="#" icon="/escrow_buy_orders.svg" label="Đơn mua" onClick={onMenuClose} />
      <MenuItem to="#" icon="/escrow-orders.svg" label="Đơn bán" onClick={onMenuClose} />
      <MenuItem to="#" icon="/escrow.svg" label="Ví bán hàng" badge="Liên kết ngay" highlight onClick={onMenuClose} />

      {/* Tiện ích - chỉ hiện khi đã đăng nhập */}
      {tokenExists && (
        <>
          <SectionLabel label="Tiện ích" />
          <MenuItem to="/heart" icon="/menu-saved-ad.svg" label="Tin đăng đã lưu" onClick={onMenuClose} />
          <MenuItem to="#" icon="/menu-saved-search.svg" label="Tìm kiếm đã lưu" onClick={onMenuClose} />
          <MenuItem to="/rating-history" icon="/menu-rating-management.svg" label="Đánh giá từ tôi" onClick={onMenuClose} />
        </>
      )}

      {/* Dịch vụ trả phí */}
      <SectionLabel label="Dịch vụ trả phí" />
      <MenuItem to="#" icon="/sub-pro.svg" label="Gói PRO" onClick={onMenuClose} />
      {tokenExists && (
        <MenuItem to="#" icon="/circle-list.svg" label="Lịch sử giao dịch" onClick={onMenuClose} />
      )}
      <MenuItem to="#" icon="/shop-more.svg" label="Cửa hàng" badge="Tạo ngay" highlight onClick={onMenuClose} />

      {/* Ưu đãi */}
      <SectionLabel label="Ưu đãi, khuyến mãi" />
      <MenuItem to="#" icon="/reward-icon.svg" label="RRMS ưu đãi" onClick={onMenuClose} />
      <MenuItem to="#" icon="/voucher-icon.svg" label="Ưu đãi của tôi" onClick={onMenuClose} />

      {/* Khác */}
      <SectionLabel label="Khác" />
      {tokenExists && (
        <MenuItem to="/profile" icon="/setting.svg" label="Cài đặt tài khoản" onClick={onMenuClose} />
      )}
      <MenuItem to="#" icon="/setting.svg" label="Trợ giúp" onClick={onMenuClose} />
      {tokenExists && (
        <MenuItem icon="/setting.svg" label="Đăng xuất" onClick={onLogout} />
      )}
    </Box>
  )
}
