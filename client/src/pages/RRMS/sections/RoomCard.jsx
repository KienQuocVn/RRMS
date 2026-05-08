import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { Avatar, Box, Button, Card, CardContent, CardMedia, Chip, Divider, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { formatterAmount } from '~/utils/formatterAmount'
import { getEffectivePrice, getMoveInLabel, getPromotionPercent, hasPromotionalPrice } from './rrmsData'

const cardShellSx = {
  height: '100%',
  borderRadius: 6,
  border: '1px solid rgba(15, 23, 42, 0.06)',
  boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)',
  overflow: 'hidden',
  textDecoration: 'none',
  transition: 'transform 180ms ease, box-shadow 180ms ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 24px 68px rgba(15, 23, 42, 0.12)'
  }
}

const RoomMeta = ({ icon, text }) => (
  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0, color: '#64748b' }}>
    {icon}
    <Typography sx={{ fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</Typography>
  </Stack>
)

const getPrimaryImage = (room) => room?.bulletinBoardImages?.[0]?.imageLink || '/room1.jpg'

const getOwnerName = (room) => room?.account?.fullName || room?.account?.username || 'Chủ trọ xác thực'

const getShortDescription = (room) => {
  if (room?.description) return room.description
  if (room?.address) return room.address
  return 'Thông tin đang được cập nhật thêm từ bài đăng.'
}

export const NowRoomCard = ({ item }) => {
  const room = item
  const effectivePrice = getEffectivePrice(room)
  const hasPromotion = hasPromotionalPrice(room)

  return (
    <Card component={Link} to={`/detail/${room?.bulletinBoardId}`} elevation={0} sx={cardShellSx}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" image={getPrimaryImage(room)} alt={room?.title || room?.address} sx={{ height: 240 }} />

        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, left: 16, right: 16, justifyContent: 'space-between' }}>
          <Chip
            label="Đề xuất nổi bật"
            size="small"
            sx={{
              bgcolor: '#f97316',
              color: '#fff',
              fontWeight: 800,
              boxShadow: '0 10px 24px rgba(249, 115, 22, 0.34)'
            }}
          />

          <Chip
            icon={<VerifiedRoundedIcon sx={{ color: '#fff !important' }} />}
            label="Đang hiển thị"
            size="small"
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.72)',
              color: '#fff',
              backdropFilter: 'blur(8px)'
            }}
          />
        </Stack>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Typography sx={{ minHeight: 56, fontSize: 21, fontWeight: 800, lineHeight: 1.32, color: '#0f172a' }}>
          {room?.title || room?.address}
        </Typography>

        <Typography sx={{ mt: 1, minHeight: 52, color: '#475569', lineHeight: 1.7 }}>{getShortDescription(room)}</Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          <Chip
            icon={<SquareFootRoundedIcon sx={{ color: '#0f766e !important' }} />}
            label={`${room?.area || 0} m²`}
            sx={{ bgcolor: alpha('#0f766e', 0.08), color: '#0f766e', fontWeight: 700 }}
          />
          <Chip
            icon={<AccessTimeRoundedIcon sx={{ color: '#2563eb !important' }} />}
            label={getMoveInLabel(room)}
            sx={{ bgcolor: alpha('#2563eb', 0.08), color: '#2563eb', fontWeight: 700 }}
          />
          {hasPromotion ? (
            <Chip
              icon={<LocalOfferRoundedIcon sx={{ color: '#dc2626 !important' }} />}
              label={`Giảm ${getPromotionPercent(room)}%`}
              sx={{ bgcolor: alpha('#dc2626', 0.08), color: '#dc2626', fontWeight: 700 }}
            />
          ) : null}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            {hasPromotion ? (
              <Typography sx={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: 13 }}>{formatterAmount(room?.rentPrice || 0)}</Typography>
            ) : null}
            <Typography sx={{ color: '#ef4444', fontWeight: 900, fontSize: 22 }}>{formatterAmount(effectivePrice)}</Typography>
            <Typography sx={{ color: '#64748b', fontSize: 13 }}>Giá thuê mỗi tháng</Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar sx={{ bgcolor: '#0f766e', width: 38, height: 38 }}>{getOwnerName(room).charAt(0).toUpperCase()}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, color: '#0f172a' }} noWrap>
                {getOwnerName(room)}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: 13 }} noWrap>
                {room?.address}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export const LatestRoomCard = ({ room }) => {
  const effectivePrice = getEffectivePrice(room)
  const hasPromotion = hasPromotionalPrice(room)

  return (
    <Card elevation={0} sx={cardShellSx}>
      <CardMedia component="img" image={getPrimaryImage(room)} alt={room?.title || room?.address} sx={{ height: 220 }} />

      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }} useFlexGap flexWrap="wrap">
          <Chip
            size="small"
            label="Tin mới"
            sx={{
              bgcolor: alpha('#0f766e', 0.09),
              color: '#0f766e',
              fontWeight: 700
            }}
          />
          {hasPromotion ? (
            <Chip
              size="small"
              label={`Ưu đãi ${getPromotionPercent(room)}%`}
              sx={{
                bgcolor: alpha('#dc2626', 0.08),
                color: '#dc2626',
                fontWeight: 700
              }}
            />
          ) : null}
        </Stack>

        <Typography sx={{ minHeight: 54, fontSize: 20, fontWeight: 800, lineHeight: 1.35, color: '#0f172a' }}>
          {room?.title || room?.address}
        </Typography>

        <Stack spacing={1.1} sx={{ mt: 1.4 }}>
          <RoomMeta icon={<LocationOnRoundedIcon sx={{ fontSize: 17, color: '#0f766e' }} />} text={room?.address || 'Địa chỉ đang cập nhật'} />
          <RoomMeta icon={<SquareFootRoundedIcon sx={{ fontSize: 17, color: '#2563eb' }} />} text={`${room?.area || 0} m²`} />
          <RoomMeta icon={<AccessTimeRoundedIcon sx={{ fontSize: 17, color: '#f97316' }} />} text={getMoveInLabel(room)} />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            {hasPromotion ? (
              <Typography sx={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: 13 }}>{formatterAmount(room?.rentPrice || 0)}</Typography>
            ) : null}
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>{formatterAmount(effectivePrice)}</Typography>
            <Typography sx={{ color: '#64748b', fontSize: 13 }}>Thông tin giá và thời điểm vào ở</Typography>
          </Box>

          <Button
            component={Link}
            to={`/detail/${room?.bulletinBoardId}`}
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              borderRadius: 999,
              px: 2,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #115e59 0%, #0f766e 100%)',
                boxShadow: 'none'
              }
            }}>
            Xem chi tiết
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
