import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { DASHBOARD_COLORS, dashboardCardSx } from '../../Dashboard/constants/dashboardTheme'
import {
  getOwnerInitials,
  previewSectionLabelSx
} from './postApprovalUtils'

const PreviewInfoRow = ({ icon, children }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {icon}
    <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{children}</Typography>
  </Stack>
)

const PreviewPlaceholder = () => (
  <Box
    sx={{
      width: '100%',
      height: 180,
      borderRadius: '8px',
      bgcolor: '#e8f4fd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: DASHBOARD_COLORS.primary
    }}>
    <ImageOutlinedIcon sx={{ fontSize: 42 }} />
  </Box>
)

const PostApprovalPreview = ({
  post,
  rejectReason,
  showInlineRejectReason,
  onClose,
  onApprove,
  onReject,
  onRejectReasonChange
}) => {
  const [activeImage, setActiveImage] = useState(0)
  const [expandedDescription, setExpandedDescription] = useState(false)

  const visibleImages = useMemo(() => post?.images || [], [post])
  const imageSrc = visibleImages[activeImage]
  const descriptionNeedsToggle = (post?.descriptionText || '').length > 180

  if (!post) {
    return (
      <Box sx={{ ...dashboardCardSx, minHeight: 720, p: 2.5 }}>
        <Typography sx={{ fontSize: 14, color: '#6b7280' }}>Chọn một bài đăng để xem chi tiết.</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        ...dashboardCardSx,
        p: 0,
        height: 'calc(100vh - 180px)',
        minHeight: 720,
        position: 'sticky',
        top: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <Box sx={{ px: 2, py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: DASHBOARD_COLORS.textDark }}>
          Chi tiết bài đăng
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, pb: 2, overflowY: 'auto', flexGrow: 1 }}>
        <Box sx={{ position: 'relative' }}>
          {imageSrc ? (
            <Box
              component="img"
              src={imageSrc}
              alt={post.title}
              sx={{ width: '100%', height: 180, borderRadius: '8px', objectFit: 'cover' }}
            />
          ) : (
            <PreviewPlaceholder />
          )}
          <Chip
            label={`${visibleImages.length || 0} ảnh`}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'rgba(17,24,39,0.64)',
              color: '#fff',
              fontSize: 11,
              borderRadius: '999px'
            }}
          />
        </Box>

        <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
          {Array.from({ length: Math.max(visibleImages.slice(0, 3).length, 3) }, (_, index) => {
            const thumbnail = visibleImages[index]
            return (
              <Box
                key={thumbnail || index}
                onClick={() => thumbnail && setActiveImage(index)}
                sx={{
                  width: '33.33%',
                  height: 60,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: thumbnail && index === activeImage ? `2px solid ${DASHBOARD_COLORS.primary}` : `0.5px solid ${DASHBOARD_COLORS.border}`,
                  bgcolor: '#eef2f7',
                  cursor: thumbnail ? 'pointer' : 'default'
                }}>
                {thumbnail ? (
                  <Box component="img" src={thumbnail} alt={`${post.title}-${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
                    <ImageOutlinedIcon sx={{ fontSize: 20 }} />
                  </Box>
                )}
              </Box>
            )
          })}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: DASHBOARD_COLORS.textDark, mb: 1 }}>
            {post.title}
          </Typography>
          <Chip
            label={post.roomTypeLabel}
            size="small"
            sx={{
              mb: 1.25,
              bgcolor: '#E6F1FB',
              color: '#0C447C',
              borderRadius: '999px',
              fontSize: 11,
              fontWeight: 600
            }}
          />
          <Typography sx={{ fontSize: 18, fontWeight: 600, color: DASHBOARD_COLORS.primary, mb: 1.25 }}>
            {post.priceLabel}/tháng
          </Typography>

          <Stack spacing={1}>
            <PreviewInfoRow icon={<PlaceOutlinedIcon sx={{ fontSize: 17, color: '#9ca3af' }} />}>
              {post.addressParts.fullAddress}
            </PreviewInfoRow>
            <PreviewInfoRow icon={<SquareFootOutlinedIcon sx={{ fontSize: 17, color: '#9ca3af' }} />}>
              {post.area || 0} m²
            </PreviewInfoRow>
            <PreviewInfoRow icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 17, color: '#9ca3af' }} />}>
              {post.postedDateTimeLabel}
            </PreviewInfoRow>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography sx={previewSectionLabelSx}>Thông tin chủ trọ</Typography>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
            <Avatar src={post.ownerAvatar} sx={{ width: 36, height: 36, bgcolor: '#eff6ff', color: DASHBOARD_COLORS.primary }}>
              {getOwnerInitials(post.ownerName)}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{post.ownerName}</Typography>
                <Chip
                  size="small"
                  label={post.ownerRole}
                  sx={{
                    height: 20,
                    bgcolor: '#f3f4f6',
                    color: '#4b5563',
                    fontSize: 10.5
                  }}
                />
              </Stack>
            </Box>
          </Stack>
          <Stack spacing={1}>
            <PreviewInfoRow icon={<PhoneOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />}>
              {post.ownerPhone}
            </PreviewInfoRow>
            <PreviewInfoRow icon={<MailOutlineRoundedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />}>
              {post.ownerEmail}
            </PreviewInfoRow>
          </Stack>
          <Typography sx={{ mt: 1.25, fontSize: 12.5, color: '#6b7280' }}>
            {post.ownerStats.totalPosts} bài đã đăng | {post.ownerStats.approvedPosts} bài đã duyệt
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography sx={previewSectionLabelSx}>Mô tả</Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: '#374151',
              display: '-webkit-box',
              WebkitLineClamp: expandedDescription ? 'unset' : 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
            {post.descriptionText}
          </Typography>
          {descriptionNeedsToggle && (
            <Button
              size="small"
              onClick={() => setExpandedDescription((prev) => !prev)}
              sx={{ mt: 0.5, textTransform: 'none', px: 0 }}>
              {expandedDescription ? 'Thu gọn' : 'Xem thêm'}
            </Button>
          )}
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
            {(post.amenities.length ? post.amenities : ['Wifi', 'Điều hòa', 'Giữ xe', 'Nội thất', 'WC riêng']).map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{
                  bgcolor: '#f4f8fb',
                  color: '#37546b',
                  fontSize: 11,
                  borderRadius: '999px'
                }}
              />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography sx={previewSectionLabelSx}>Vị trí</Typography>
          <Box
            sx={{
              height: 120,
              borderRadius: '8px',
              bgcolor: '#e8f4fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: DASHBOARD_COLORS.primary,
              mb: 1
            }}>
            <RoomOutlinedIcon sx={{ fontSize: 34 }} />
          </Box>
          <Typography sx={{ fontSize: 13, color: '#4b5563' }}>{post.addressParts.shortAddress}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography sx={previewSectionLabelSx}>Lịch sử</Typography>
          <Stack spacing={1.25}>
            {post.history.map((item) => (
              <Stack key={item.id} direction="row" spacing={1} alignItems="flex-start">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: DASHBOARD_COLORS.primary, mt: 0.7 }} />
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>{item.timestamp}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ borderTop: `0.5px solid ${DASHBOARD_COLORS.border}`, p: 2, bgcolor: '#fff' }}>
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<CheckCircleRoundedIcon />}
            onClick={() => onApprove(post)}
            sx={{
              height: 40,
              textTransform: 'none',
              borderRadius: '8px',
              bgcolor: DASHBOARD_COLORS.primary,
              boxShadow: 'none',
              '&:hover': { bgcolor: DASHBOARD_COLORS.primaryHover, boxShadow: 'none' }
            }}>
            Duyệt bài
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<HighlightOffRoundedIcon />}
            onClick={() => onReject(post)}
            sx={{
              height: 40,
              textTransform: 'none',
              borderRadius: '8px',
              color: '#E24B4A',
              borderColor: '#E24B4A',
              '&:hover': { borderColor: '#E24B4A', bgcolor: 'rgba(226,75,74,0.04)' }
            }}>
            Từ chối
          </Button>
          {showInlineRejectReason && (
            <TextField
              value={rejectReason}
              onChange={(event) => onRejectReasonChange(event.target.value)}
              placeholder="Lý do từ chối (bắt buộc khi từ chối)..."
              multiline
              minRows={2}
              size="small"
            />
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default PostApprovalPreview
