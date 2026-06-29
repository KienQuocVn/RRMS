import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { useMemo, useState } from 'react'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { BORDER, PRIMARY, getInitials, getRoleStyle, getStatusStyle, getUserRowStyles, formatDate, formatRelativeTime } from './userManagementUtils'

const headerCellSx = {
  fontSize: 11,
  textTransform: 'uppercase',
  color: '#6B7280',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  bgcolor: '#F9FAFB',
  borderBottom: BORDER
}

const iconButtonSx = {
  color: '#6B7280',
  '&:hover': {
    color: PRIMARY,
    backgroundColor: '#F0F9FF'
  }
}

const Pagination = ({ page, rowsPerPage, totalCount, onPageChange, onRowsPerPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage))
  const start = totalCount === 0 ? 0 : page * rowsPerPage + 1
  const end = Math.min((page + 1) * rowsPerPage, totalCount)
  const pages = useMemo(() => {
    const list = []
    for (let current = 1; current <= Math.min(totalPages, 3); current += 1) {
      list.push(current)
    }
    return list
  }, [totalPages])

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.25}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      sx={{ px: 2, py: 1.5 }}>
      <Typography sx={{ fontSize: 13, color: '#4B5563' }}>
        Hiển thị {start}-{end} trong {totalCount.toLocaleString('vi-VN')} người dùng
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton size="small" disabled={page === 0} onClick={() => onPageChange(Math.max(0, page - 1))}>
            <ChevronLeftRoundedIcon fontSize="small" />
          </IconButton>
          {pages.map((item) => (
            <Box
              key={item}
              onClick={() => onPageChange(item - 1)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                border: BORDER,
                bgcolor: page === item - 1 ? '#E6F1FB' : '#ffffff',
                color: page === item - 1 ? '#0C447C' : '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                cursor: 'pointer'
              }}>
              {item}
            </Box>
          ))}
          {totalPages > 3 && <Typography sx={{ fontSize: 13, color: '#6B7280' }}>... {totalPages}</Typography>}
          <IconButton size="small" disabled={page >= totalPages - 1} onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}>
            <ChevronRightRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Hiển thị:</Typography>
          {[8, 16, 32].map((size) => (
            <Chip
              key={size}
              label={size}
              onClick={() => onRowsPerPageChange(size)}
              sx={{
                height: 26,
                borderRadius: '8px',
                bgcolor: rowsPerPage === size ? '#E6F1FB' : '#ffffff',
                color: rowsPerPage === size ? '#0C447C' : '#4B5563',
                border: BORDER,
                fontSize: 12
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

const UsersTablePanel = ({
  rows,
  allRows,
  selectedRowId,
  selectedIds,
  page,
  rowsPerPage,
  totalCount,
  loading,
  onRowSelect,
  onToggleSelectOne,
  onToggleSelectAll,
  onPageChange,
  onRowsPerPageChange,
  onClearSelection,
  onEditUser,
  onToggleLock
}) => {
  const [actionAnchor, setActionAnchor] = useState(null)
  const [menuUser, setMenuUser] = useState(null)
  const maxPosts = Math.max(...allRows.map((item) => item.postsCount), 1)
  const allSelectedOnPage = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))

  const handleOpenMenu = (event, row) => {
    event.stopPropagation()
    setActionAnchor(event.currentTarget)
    setMenuUser(row)
  }

  const handleCloseMenu = () => {
    setActionAnchor(null)
    setMenuUser(null)
  }

  return (
    <Paper sx={{ borderRadius: '12px', border: BORDER, boxShadow: 'none', overflow: 'hidden' }}>
      {selectedIds.length > 0 && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.25}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            bgcolor: PRIMARY,
            color: '#ffffff',
            px: 2,
            py: 1.25
          }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Đã chọn {selectedIds.length} người dùng</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="Khóa tất cả" onClick={() => null} sx={{ bgcolor: '#ffffff', color: PRIMARY, borderRadius: '8px' }} />
            <Chip label="Mở khóa tất cả" variant="outlined" onClick={() => null} sx={{ borderColor: '#ffffff', color: '#ffffff', borderRadius: '8px' }} />
            <Chip
              icon={<DownloadRoundedIcon sx={{ color: '#ffffff !important' }} />}
              label="Xuất danh sách"
              variant="outlined"
              onClick={() => null}
              sx={{ borderColor: '#ffffff', color: '#ffffff', borderRadius: '8px' }}
            />
            <Chip label="Bỏ chọn" onClick={onClearSelection} sx={{ bgcolor: 'transparent', color: '#ffffff', borderRadius: '8px' }} />
          </Stack>
        </Stack>
      )}

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1160 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={headerCellSx}>
                <Checkbox checked={allSelectedOnPage} indeterminate={!allSelectedOnPage && selectedIds.length > 0} onChange={(event) => onToggleSelectAll(event.target.checked)} />
              </TableCell>
              <TableCell sx={headerCellSx}>Người dùng</TableCell>
              <TableCell sx={headerCellSx}>Vai trò</TableCell>
              <TableCell sx={headerCellSx}>Số điện thoại</TableCell>
              <TableCell sx={headerCellSx}>Số bài đăng</TableCell>
              <TableCell sx={headerCellSx}>Số báo cáo vi phạm</TableCell>
              <TableCell sx={headerCellSx}>Ngày tham gia</TableCell>
              <TableCell sx={headerCellSx}>Đăng nhập cuối</TableCell>
              <TableCell sx={headerCellSx}>Trạng thái</TableCell>
              <TableCell sx={{ ...headerCellSx, textAlign: 'right' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(4)].map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell colSpan={10} sx={{ borderBottom: BORDER }}>
                    <LinearProgress sx={{ height: 4, borderRadius: '999px', bgcolor: '#F3F4F6' }} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              rows.map((row) => {
                const roleStyle = getRoleStyle(row.role)
                const statusStyle = getStatusStyle(row.status)
                const isSelected = selectedRowId === row.id
                const isLocked = row.status === 'Bị khóa'
                return (
                  <TableRow key={row.id} onClick={() => onRowSelect(row.id)} sx={(theme) => getUserRowStyles(theme, isSelected, isLocked)}>
                    <TableCell padding="checkbox" sx={{ borderBottom: BORDER }}>
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => onToggleSelectOne(row.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar src={row.avatar} sx={{ width: 36, height: 36, fontSize: 13, bgcolor: '#DCEEFF', color: '#0C447C' }}>
                          {getInitials(row.fullName)}
                        </Avatar>
                        <Box>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{row.fullName}</Typography>
                            {row.verifiedIdentity && <VerifiedRoundedIcon sx={{ color: PRIMARY, fontSize: 16 }} />}
                          </Stack>
                          <Typography sx={{ fontSize: 11, color: '#6B7280' }}>{row.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Chip label={row.role} sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 500, borderRadius: '999px' }} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PhoneIphoneRoundedIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
                        <Typography sx={{ fontSize: 13 }}>{row.phone}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{row.postsCount}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(row.postsCount / maxPosts) * 100}
                        sx={{
                          mt: 0.75,
                          maxWidth: 92,
                          height: 4,
                          borderRadius: '999px',
                          bgcolor: '#E5E7EB',
                          '& .MuiLinearProgress-bar': { bgcolor: PRIMARY }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: row.violationCount >= 3 ? 700 : 500,
                          color: row.violationCount === 0 ? '#6B7280' : row.violationCount <= 2 ? '#BA7517' : '#E24B4A'
                        }}>
                        {row.violationCount}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{formatDate(row.createdAt)}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{formatRelativeTime(row.lastLoginAt)}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Chip label={row.status} sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 500, borderRadius: '999px' }} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: BORDER }}>
                      <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" sx={{ ...iconButtonSx, color: PRIMARY }}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" sx={iconButtonSx} onClick={(event) => { event.stopPropagation(); onEditUser(row) }}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={row.status === 'Bị khóa' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}>
                          <IconButton size="small" sx={iconButtonSx} onClick={(event) => { event.stopPropagation(); onToggleLock(row) }}>
                            {row.status === 'Bị khóa' ? <LockOpenRoundedIcon fontSize="small" /> : <LockOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Thao tác khác">
                          <IconButton size="small" sx={iconButtonSx} onClick={(event) => handleOpenMenu(event, row)}>
                            <MoreVertRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />

      <Menu anchorEl={actionAnchor} open={Boolean(actionAnchor)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleCloseMenu}>Đặt lại mật khẩu</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Gửi email xác minh</MenuItem>
        <MenuItem onClick={() => { if (menuUser) onEditUser(menuUser); handleCloseMenu() }}>Thay đổi vai trò</MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ color: '#E24B4A' }}>
          Xóa tài khoản
        </MenuItem>
      </Menu>
    </Paper>
  )
}

export default UsersTablePanel
