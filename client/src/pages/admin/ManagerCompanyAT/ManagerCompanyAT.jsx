import { useEffect } from 'react'
import {
  Alert,
  Box,
  Paper,
  Typography
} from '@mui/material'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import InfoIcon from '@mui/icons-material/Info'
import NavAdmin from '~/layouts/admin/NavbarAdmin'

// ── Sub-component: Sidebar tab ──────────────────────────────────────────────
const SidebarTab = ({ icon, label, active }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2,
      py: 1.5,
      cursor: 'pointer',
      bgcolor: active ? '#20a9e7' : 'transparent',
      color: active ? '#fff' : '#555',
      fontWeight: active ? 700 : 400,
      fontSize: '14px',
      borderRadius: '8px 8px 0 0',
      userSelect: 'none',
      transition: 'background 0.2s'
    }}
  >
    {icon}
    <span>{label}</span>
  </Box>
)

// ── Sub-component: Video button ─────────────────────────────────────────────
const VideoButton = ({ label }) => (
  <Box
    component="a"
    href="#"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      bgcolor: '#e53935',
      color: '#fff',
      borderRadius: '20px',
      px: 2,
      py: 0.7,
      fontSize: '13px',
      fontWeight: 600,
      textDecoration: 'none',
      boxShadow: '0 2px 8px rgba(229,57,53,0.3)',
      '&:hover': { bgcolor: '#b71c1c' },
      transition: 'background 0.2s'
    }}
  >
    <PlayCircleIcon sx={{ fontSize: 22 }} />
    {label}
  </Box>
)

// ── Sub-component: Upgrade alert ────────────────────────────────────────────
const UpgradeAlert = ({ message }) => (
  <Alert
    icon={<InfoIcon sx={{ color: '#e65100', fontSize: 22 }} />}
    severity="warning"
    sx={{
      mx: 3,
      mb: 3,
      borderRadius: '8px',
      bgcolor: '#fff8e1',
      border: '1px solid #ffe082',
      color: '#5d4037',
      fontSize: '13px',
      fontWeight: 600,
      alignItems: 'center',
      '& .MuiAlert-icon': { mr: 1.5 }
    }}
  >
    {message}
  </Alert>
)

// ── Main Component ───────────────────────────────────────────────────────────
const ManagerCompanyAT = ({ setIsAdmin, motels, setmotels }) => {
  useEffect(() => {
    setIsAdmin(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <NavAdmin setIsAdmin={setIsAdmin} setmotels={setmotels} motels={motels} />

      <Box sx={{minHeight: '100vh', pb: 5 }}>
        {/* Page title row */}
        <Box
          sx={{
            maxWidth: '1000px',
            mx: 'auto',
            pt: 3,
            px: 2,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography
              sx={{ fontWeight: 700, fontSize: '22px', color: '#1a1a1a', lineHeight: 1.3 }}
            >
              <Box component="span" sx={{ color: '#20a9e7', mr: 1 }}>
                |
              </Box>
              Tính năng công ty - nhóm
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#555', fontStyle: 'italic', mt: 0.3 }}>
              Tạo tài khoản cho nhân viên, chia quyền quản lý...
            </Typography>
          </Box>

          <VideoButton label="Xem video tính năng" />
        </Box>

        {/* Card */}
        <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: 2.5, px: 2 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              minHeight: '360px'
            }}
          >
            {/* Sidebar */}
            <Box
              sx={{
                width: '220px',
                flexShrink: 0,
                bgcolor: '#fafafa',
                borderRight: '1px solid #e8e8e8'
              }}
            >
              <SidebarTab
                icon={<BusinessCenterIcon sx={{ fontSize: 18 }} />}
                label="Công ty / nhóm"
                active={true}
              />
            </Box>

            {/* Main panel */}
            <Box sx={{ flex: 1 }}>
              {/* Banner area */}
              <Box
                sx={{
                  bgcolor: '#cbf6fb',
                  mx: 3,
                  mt: 3,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px'
                }}
              >
                <Box
                  component="img"
                  src="/groups_baner.png"
                  alt="Công ty nhóm"
                  sx={{
                    maxHeight: '200px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </Box>

              {/* Text content */}
              <Box sx={{ textAlign: 'center', px: 3, mt: 3, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a', mb: 1 }}>
                  Thiết lập công ty hoặc nhóm của bạn
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#555', mb: 1 }}>
                  Phần mềm sẽ giúp bạn tạo ra một công ty hoặc một đội nhóm và được chia quyền hạn để quản lý phần mềm!
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#555', mb: 2.5 }}>
                  Bạn chưa có nhóm/công ty. Hãy tạo 1 nhóm/công ty để cấp quyền cho nhân viên quản lý của bạn
                </Typography>
              </Box>

              {/* Upgrade alert */}
              <UpgradeAlert message="Để sử dụng tính năng này bạn phải nâng cấp gói có phí để tiếp tục sử dụng!" />
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  )
}

export default ManagerCompanyAT
