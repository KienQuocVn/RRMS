import { useState } from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ReceiptIcon from '@mui/icons-material/Receipt'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import InventoryIcon from '@mui/icons-material/Inventory'
import ArticleIcon from '@mui/icons-material/Article'
import PhoneIcon from '@mui/icons-material/Phone'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'

const TAB_ITEMS = [
  { icon: <MenuBookIcon />, label: 'Quản lí phòng' },
  { icon: <ReceiptIcon />, label: 'Quản lí hóa đơn' },
  { icon: <MedicalServicesIcon />, label: 'Quản lí dịch vụ' },
  { icon: <InventoryIcon />, label: 'Quản lí tài sản' },
  { icon: <ArticleIcon />, label: 'Quản lí hợp đồng' },
  { icon: <PhoneIcon />, label: 'Quản lí khách thuê' },
  { icon: <BarChartIcon />, label: 'Thu/Chi - Tổng kết' },
  { icon: <SettingsIcon />, label: 'Cài đặt' },
]

const tabSx = {
  background: '#fff',
  border: '1px solid #34495e',
  borderRadius: '15px',
  width: 150,
  height: 100,
  color: 'black',
  textTransform: 'none',
  mx: '4px',
  '&.Mui-selected': {
    color: '#1976d2',
    borderColor: '#1976d2',
  },
}

const TabLabel = ({ icon, label }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
    {icon}
    <span>{label}</span>
  </Box>
)

const NavTabs = () => {
  const [selected, setSelected] = useState(0)

  return (
    <Tabs
      value={selected}
      onChange={(_, val) => setSelected(val)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
    >
      {TAB_ITEMS.map(({ icon, label }) => (
        <Tab
          key={label}
          sx={tabSx}
          label={<TabLabel icon={icon} label={label} />}
        />
      ))}
    </Tabs>
  )
}

export default NavTabs
