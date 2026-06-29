import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Button,
  Select
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { useState } from 'react'
import { DASHBOARD_COLORS, dashboardCardSx } from '../../Dashboard/constants/dashboardTheme'
import {
  POST_APPROVAL_PAGE_SIZE_OPTIONS,
  POST_APPROVAL_STATUS_STYLES
} from './postApprovalUtils'

const HEADER_COLUMNS = [
  '',
  'Tiêu đề',
  'Chủ trọ',
  'Loại phòng',
  'Địa chỉ',
  'Giá/tháng',
  'Ngày đăng',
  'Trạng thái',
  'Hành động'
]

const StatusChip = ({ label }) => {
  const style = POST_APPROVAL_STATUS_STYLES[label] || POST_APPROVAL_STATUS_STYLES['Chờ duyệt']
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 22,
        px: 0.5,
        bgcolor: style.background,
        color: style.color,
        fontSize: 11,
        fontWeight: 600,
        borderRadius: '999px',
        border: 'none'
      }}
    />
  )
}

const RowActionMenu = ({ post, onMenuAction }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVertRoundedIcon sx={{ fontSize: 18, color: '#6b7280' }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {['Ẩn bài', 'Liên hệ chủ trọ', 'Xem lịch sử'].map((item) => (
          <MenuItem
            key={item}
            onClick={() => {
              setAnchorEl(null)
              onMenuAction(item, post)
            }}
            sx={{ fontSize: 13 }}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

const PostApprovalTable = ({
  posts,
  activePostId,
  checkedIds,
  page,
  rowsPerPage,
  onRowClick,
  onToggleCheck,
  onToggleCheckAll,
  onChangePage,
  onChangeRowsPerPage,
  onApprove,
  onReject,
  onPreview,
  onMenuAction,
  onApproveSelected,
  onRejectSelected,
  onClearSelection
}) => {
  const pageCount = Math.max(Math.ceil(posts.length / rowsPerPage), 1)
  const paginatedPosts = posts.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  const allVisibleChecked = paginatedPosts.length > 0 && paginatedPosts.every((post) => checkedIds.includes(post.uiKey))

  return (
    <Box sx={{ ...dashboardCardSx, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 720 }}>
      {checkedIds.length > 0 && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
            px: 2,
            py: 1.25,
            bgcolor: DASHBOARD_COLORS.primary,
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.25,
            flexWrap: 'wrap'
          }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Đã chọn {checkedIds.length} bài</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              size="small"
              variant="contained"
              onClick={onApproveSelected}
              sx={{
                textTransform: 'none',
                bgcolor: '#fff',
                color: DASHBOARD_COLORS.primary,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#eef8ff', boxShadow: 'none' }
              }}>
              Duyệt tất cả
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onRejectSelected}
              sx={{
                textTransform: 'none',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.7)',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' }
              }}>
              Từ chối tất cả
            </Button>
            <Button
              size="small"
              onClick={onClearSelection}
              sx={{
                textTransform: 'none',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
              }}>
              Bỏ chọn
            </Button>
          </Stack>
        </Box>
      )}

      <Box sx={{ overflowX: 'auto', flexGrow: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              {HEADER_COLUMNS.map((column, index) => (
                <TableCell
                  key={column || index}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: DASHBOARD_COLORS.textMuted,
                    borderBottom: `0.5px solid ${DASHBOARD_COLORS.border}`,
                    whiteSpace: 'nowrap',
                    py: 1.4
                  }}>
                  {index === 0 ? (
                    <Checkbox
                      size="small"
                      checked={allVisibleChecked}
                      indeterminate={!allVisibleChecked && checkedIds.length > 0}
                      onChange={() => onToggleCheckAll(paginatedPosts)}
                    />
                  ) : (
                    column
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ py: 8, textAlign: 'center', color: DASHBOARD_COLORS.textMuted }}>
                  Không tìm thấy bài đăng phù hợp bộ lọc hiện tại.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPosts.map((post) => {
                const isChecked = checkedIds.includes(post.uiKey)
                const isActive = post.uiKey === activePostId

                return (
                  <TableRow
                    key={post.uiKey}
                    hover
                    onClick={() => onRowClick(post)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: isChecked ? '#e6f1fb' : isActive ? '#f5fbff' : '#fff',
                      borderLeft: isChecked || isActive ? `2px solid ${DASHBOARD_COLORS.primary}` : '2px solid transparent',
                      '&:hover': { bgcolor: '#f0f9ff' }
                    }}>
                    <TableCell sx={{ py: 1.5 }}>
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => onToggleCheck(post.uiKey)}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 220, py: 1.5 }}>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        {post.images[0] ? (
                          <Box
                            component="img"
                            src={post.images[0]}
                            alt={post.title}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              objectFit: 'cover',
                              bgcolor: '#eef2f7',
                              border: `0.5px solid ${DASHBOARD_COLORS.border}`
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              bgcolor: '#eef2f7',
                              border: `0.5px solid ${DASHBOARD_COLORS.border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#cbd5e1'
                            }}>
                            <ImageOutlinedIcon sx={{ fontSize: 18 }} />
                          </Box>
                        )}
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: DASHBOARD_COLORS.textDark }} noWrap>
                          {post.title || 'Chưa có tiêu đề'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ minWidth: 150, py: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: '#efe8df', color: '#6b7280' }}>
                          {post.ownerInitials}
                        </Avatar>
                        <Typography sx={{ fontSize: 13 }} noWrap>
                          {post.ownerName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, minWidth: 110 }}>{post.roomTypeLabel}</TableCell>
                    <TableCell sx={{ fontSize: 13, minWidth: 160 }} title={post.addressParts.fullAddress}>
                      <Typography sx={{ fontSize: 13 }} noWrap>
                        {post.addressParts.shortAddress}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, fontWeight: 600, color: DASHBOARD_COLORS.primary, whiteSpace: 'nowrap' }}>
                      {post.priceLabel}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>{post.postedDateLabel}</TableCell>
                    <TableCell sx={{ minWidth: 110 }}>
                      <StatusChip label={post.statusLabel} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Stack direction="row" spacing={0.25} alignItems="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation()
                              onPreview(post)
                            }}>
                            <VisibilityOutlinedIcon sx={{ fontSize: 18, color: DASHBOARD_COLORS.primary }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Duyệt">
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation()
                              onApprove(post)
                            }}>
                            <CheckRoundedIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Từ chối">
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation()
                              onReject(post)
                            }}>
                            <CloseRoundedIcon sx={{ fontSize: 18, color: '#d32f2f' }} />
                          </IconButton>
                        </Tooltip>
                        <RowActionMenu post={post} onMenuAction={onMenuAction} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: `0.5px solid ${DASHBOARD_COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
        <Typography sx={{ fontSize: 12.5, color: '#4b5563' }}>
          {posts.length
            ? `Hiển thị ${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, posts.length)} trong ${posts.length} bài chờ duyệt`
            : 'Hiển thị 0 bài'}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography sx={{ fontSize: 12.5, color: '#6b7280' }}>Hiển thị</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(event) => onChangeRowsPerPage(Number(event.target.value))}
            sx={{
              minWidth: 76,
              fontSize: 13,
              '& .MuiSelect-select': { py: 0.7 }
            }}>
            {POST_APPROVAL_PAGE_SIZE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: 13 }}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Button
            size="small"
            startIcon={<ChevronLeftRoundedIcon />}
            disabled={page === 0}
            onClick={() => onChangePage(page - 1)}
            sx={{ textTransform: 'none' }}>
            Trước
          </Button>

          <Stack direction="row" spacing={0.5}>
            {Array.from({ length: pageCount }, (_, index) => (
              <Button
                key={index}
                size="small"
                variant={index === page ? 'contained' : 'outlined'}
                onClick={() => onChangePage(index)}
                sx={{
                  minWidth: 34,
                  px: 0,
                  textTransform: 'none',
                  borderColor: DASHBOARD_COLORS.border,
                  bgcolor: index === page ? '#e6f1fb' : '#fff',
                  color: index === page ? DASHBOARD_COLORS.primary : '#4b5563',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    bgcolor: index === page ? '#d8ecfb' : '#f9fafb'
                  }
                }}>
                {index + 1}
              </Button>
            ))}
          </Stack>

          <Button
            size="small"
            endIcon={<ChevronRightRoundedIcon />}
            disabled={page >= pageCount - 1}
            onClick={() => onChangePage(page + 1)}
            sx={{ textTransform: 'none' }}>
            Tiếp
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default PostApprovalTable
