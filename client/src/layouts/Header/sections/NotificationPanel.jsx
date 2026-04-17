import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import { useState } from 'react'

const TABS = [
  { id: 'hoatdong', label: 'HOẠT ĐỘNG' },
  { id: 'tinmoi', label: 'TIN MỚI' }
]

export default function NotificationPanel() {
  const [activeTab, setActiveTab] = useState('hoatdong')
  const tokenExists = sessionStorage.getItem('user') !== null

  return (
    <Box
      sx={{
        position: { xs: 'fixed', md: 'absolute' },
        left: { xs: 0, md: 'auto' },
        right: { xs: 0, md: 0 },
        top: { xs: 52, md: 50 },
        width: { xs: '100%', md: 400 },
        height: { xs: 'calc(100% - 50px)', md: 'auto' },
        bgcolor: '#fff',
        boxShadow: '0px 2px 4px rgba(0,0,0,.5)',
        zIndex: 1001
      }}
    >
      {/* Tabs */}
      <Box
        component="ul"
        sx={{
          display: 'flex',
          borderBottom: '1px solid #C0C0C0',
          m: 0,
          p: 0,
          listStyle: 'none'
        }}
      >
        {TABS.map((tab) => (
          <Box
            key={tab.id}
            component="li"
            onClick={() => setActiveTab(tab.id)}
            sx={{
              flex: 1,
              textAlign: 'center',
              cursor: 'pointer',
              py: 1.5,
              color: activeTab === tab.id ? '#222222' : '#8C8C8C',
              fontWeight: activeTab === tab.id ? 700 : 400,
              borderBottom: activeTab === tab.id ? '3px solid #4bcffa' : 'none',
              fontSize: '0.875rem',
              '&:hover': { bgcolor: '#E8E8E8' }
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* Tab content */}
      {activeTab === 'hoatdong' && (
        <Box sx={{ textAlign: 'center', py: 1 }}>
          {!tokenExists ? (
            <>
              <Box sx={{ mt: 1, mb: 1, lineHeight: '30px' }}>Vui lòng đăng nhập để xem danh sách hoạt động.</Box>
              <Box
                component={Link}
                to="/login"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  py: 1,
                  color: '#2A70DF',
                  bgcolor: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Đăng ký / Đăng nhập
              </Box>
            </>
          ) : (
            <Box sx={{ py: 1 }}>Không có hoạt động nào.</Box>
          )}
        </Box>
      )}

      {activeTab === 'tinmoi' && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          Chúng tôi không có cập nhật nào. Vui lòng kiểm tra lại sau
        </Box>
      )}
    </Box>
  )
}
