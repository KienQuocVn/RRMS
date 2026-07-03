import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SettingsIcon from '@mui/icons-material/Settings'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import DescriptionIcon from '@mui/icons-material/Description'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import 'flatpickr/dist/themes/material_blue.css'
import RoomGroupTab from './components/RoomGroupTab'
import RentIncreaseTab from './components/RentIncreaseTab'
import FeatureSettingTab from './components/FeatureSettingTab'
import InvoiceSettingTab from './components/InvoiceSettingTab'
import BankSettingTab from './components/BankSettingTab'
import CustomerAppTab from './components/CustomerAppTab'
import RuleExtensionTab from './components/RuleExtensionTab'

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`setting-motel-tabpanel-${index}`}
      aria-labelledby={`setting-motel-tab-${index}`}
      sx={{ width: '100%', display: value === index ? 'block' : 'none' }}>
      {children}
    </Box>
  )
}

const tabItems = [
  {
    label: 'Nhóm phòng',
    icon: <ViewModuleIcon />,
    content: <RoomGroupTab />
  },
  {
    label: 'Tăng giá thuê',
    icon: <TrendingUpIcon />,
    content: <RentIncreaseTab />
  },
  {
    label: 'Cài đặt tính năng',
    icon: <SettingsIcon />,
    content: <FeatureSettingTab />
  },
  {
    label: 'Cài đặt hóa đơn',
    icon: <ReceiptIcon />,
    content: <InvoiceSettingTab />
  },
  {
    label: 'Cài đặt tài khoản ngân hàng',
    icon: <AccountBalanceIcon />,
    content: <BankSettingTab />
  },
  {
    label: 'Thiết lập cho app khách thuê',
    icon: <SmartphoneIcon />,
    content: <CustomerAppTab />
  },
  {
    label: 'Nội quy, giờ giấc, tiện ích cho thuê',
    icon: <DescriptionIcon />,
    content: <RuleExtensionTab />
  }
]

const SettingMotel = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const [value, setValue] = useState(0)
  const navigate = useNavigate()
  const { motelId } = useParams()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  useEffect(() => {
    setIsAdmin(true)
    if (window.location.hash === '#bill_setting') {
      setValue(3)
    }
  }, [setIsAdmin])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#edf3f8' }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />

      <Box
        sx={{
          maxWidth: 1840,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          pb: 4
          
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'center' },
            justifyContent: 'space-between',
            gap: 3,
            mb: '20px',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                width: 4,
                height: 44,
                borderRadius: 999,
                bgcolor: '#20a9e7',
                mt: 0.5
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#333', fontSize: '1.2rem', lineHeight: 1.2 }}>
                Cài đặt nhà trọ
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  color: '#475467',
                  fontSize: 20,
                  fontStyle: 'italic'
                }}>
                Các thiết lập cho nhà trọ
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              width: { xs: '100%', lg: 'auto' }
            }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(motelId ? `/quanlytro/${motelId}` : '/quanlytro')}
              sx={{
                minWidth: 220,
                px: 3,
                py: 1.5,
                borderColor: '#d0d5dd',
                borderRadius: '8px',
                height: 48,
                color: '#101828',
                fontWeight: 600,
                textTransform: 'none',
                bgcolor: '#fff',
                '&:hover': {
                  borderColor: '#98a2b3',
                  bgcolor: '#f8fafc'
                }
              }}>
              Về trang quản lý
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              sx={{
                backgroundColor: '#20a9e7',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                height: 48,
                boxShadow: '0 2px 8px rgba(67,160,71,0.3)',
                '&:hover': { backgroundColor: '#2b7ed7' }
              }}>
              Lưu cài đặt
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: '0 12px 30px rgba(16, 24, 40, 0.08)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: 600
          }}>
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              borderRight: { md: '1px solid #e4e7ec' },
              borderBottom: { xs: '1px solid #e4e7ec', md: 'none' },
              bgcolor: '#fff'
            }}>
            <Tabs
              orientation={isDesktop ? 'vertical' : 'horizontal'}
              variant={isDesktop ? 'standard' : 'scrollable'}
              allowScrollButtonsMobile
              value={value}
              onChange={(_, newValue) => setValue(newValue)}
              aria-label="Cài đặt nhà trọ"
              sx={{
                minHeight: '100%',
                '& .MuiTabs-flexContainer': {
                  flexDirection: { xs: 'row', md: 'column' }
                },
                '& .MuiTabs-indicator': {
                  display: 'none'
                }
              }}>
              {tabItems.map((tab, index) => (
                <Tab
                  key={tab.label}
                  id={`setting-motel-tab-${index}`}
                  aria-controls={`setting-motel-tabpanel-${index}`}
                  icon={tab.icon}
                  iconPosition="start"
                    label={tab.label}
                    sx={{
                      width: { md: '100%' },
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      minHeight: 56,
                      px: 2.5,
                      py: 1.25,
                      gap: 1.25,
                      borderBottom: '1px solid #e4e7ec',
                      color: '#101828',
                      textTransform: 'none',
                      fontSize: 15,
                      fontWeight: 600,
                      textAlign: 'left',
                      whiteSpace: { xs: 'nowrap', md: 'normal' },
                      opacity: 1,
                      lineHeight: 1.25,
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                        color: 'inherit'
                      },
                      '& .MuiTab-iconWrapper, & .MuiTab-icon': {
                        marginBottom: 0,
                        marginRight: 0
                      },
                      '&.Mui-selected': {
                        bgcolor: '#20a9e7',
                        color: '#fff'
                      }
                    }}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0, bgcolor: '#fff' }}>
            {tabItems.map((tab, index) => (
              <TabPanel key={tab.label} value={value} index={index}>
                {tab.content}
              </TabPanel>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SettingMotel
