// MUI Icons for asset icon picker
import SingleBedOutlined from '@mui/icons-material/SingleBedOutlined'
import LocalLaundryServiceOutlined from '@mui/icons-material/LocalLaundryServiceOutlined'
import TableBarOutlined from '@mui/icons-material/TableBarOutlined'
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined'
import NightlightOutlined from '@mui/icons-material/NightlightOutlined'
import AcUnitOutlined from '@mui/icons-material/AcUnitOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import WeekendOutlined from '@mui/icons-material/WeekendOutlined'
import DoorSlidingOutlined from '@mui/icons-material/DoorSlidingOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import KitchenOutlined from '@mui/icons-material/KitchenOutlined'
import TvOutlined from '@mui/icons-material/TvOutlined'
import ChairOutlined from '@mui/icons-material/ChairOutlined'
import ShowerOutlined from '@mui/icons-material/ShowerOutlined'
import MicrowaveOutlined from '@mui/icons-material/MicrowaveOutlined'
import CardGiftcardOutlined from '@mui/icons-material/CardGiftcardOutlined'

export const PRIMARY_COLOR = '#20a9e7'

// Icon registry - maps backend icon IDs to MUI icon components
export const ASSET_ICONS = [
  { id: 'ban', label: 'Bàn', Icon: TableBarOutlined },
  { id: 'ghe', label: 'Ghế', Icon: ChairOutlined },
  { id: 'bed', label: 'Giường', Icon: SingleBedOutlined },
  { id: 'chiakhoa', label: 'Chìa khóa', Icon: VpnKeyOutlined },
  { id: 'denngu', label: 'Đèn ngủ', Icon: NightlightOutlined },
  { id: 'maygiat', label: 'Máy giặt', Icon: LocalLaundryServiceOutlined },
  { id: 'maylanh', label: 'Máy lạnh', Icon: AcUnitOutlined },
  { id: 'okhoa', label: 'Ổ khóa', Icon: LockOutlined },
  { id: 'sofa', label: 'Sofa', Icon: WeekendOutlined },
  { id: 'tuao', label: 'Tủ áo', Icon: DoorSlidingOutlined },
  { id: 'tusach', label: 'Tủ sách', Icon: MenuBookOutlined },
  { id: 'tivi', label: 'Tivi', Icon: TvOutlined },
  { id: 'bep', label: 'Bếp', Icon: KitchenOutlined },
  { id: 'voisen', label: 'Vòi sen', Icon: ShowerOutlined },
  { id: 'lovisong', label: 'Lò vi sóng', Icon: MicrowaveOutlined },
]

// Lookup map for quick icon access
export const ICON_MAP = ASSET_ICONS.reduce((map, item) => {
  map[item.id] = item
  return map
}, {})

// Render icon by ID — trả về JSX nên file phải là .jsx
export const renderAssetIcon = (iconId, size = 28) => {
  const found = ICON_MAP[iconId]
  if (found) {
    const { Icon } = found
    return <Icon sx={{ fontSize: size, color: '#555' }} />
  }
  return <CardGiftcardOutlined sx={{ fontSize: size, color: '#555' }} />
}

// Format currency VND
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 đ'
  return `${Number(value).toLocaleString('vi-VN')} đ`
}

// Unit label mapping
export const getUnitLabel = (unit) => {
  const map = { CAI: 'Cái', cai: 'Cái', CHIEC: 'Chiếc', chiec: 'Chiếc', BO: 'Bộ', bo: 'Bộ', CAP: 'Cặp', cap: 'Cặp' }
  return map[unit] || unit || 'Cái'
}

// SweetAlert2 options để hiển thị trên modal (z-index cao hơn MUI Dialog)
export const SWAL_ON_TOP = {
  customClass: { container: 'swal-on-top' },
}
