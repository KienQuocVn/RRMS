/**
 * LoginDevicesTab - Tab hiển thị lịch sử đăng nhập thiết bị
 * - Gọi API thật để lấy danh sách thiết bị đã đăng nhập
 * - Cho phép xóa từng phiên đăng nhập
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton
} from '@mui/material'
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined'
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined'
import TabletOutlinedIcon from '@mui/icons-material/TabletOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { getLoginHistory, deleteLoginHistoryById } from '~/apis/accountAPI'

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '---'
  try {
    const d = new Date(dateTimeStr)
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return String(dateTimeStr)
  }
}

const getTimeAgo = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  try {
    const diff = Date.now() - new Date(dateTimeStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Vừa xong'
    if (mins < 60) return `${mins} phút trước`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    return `${days} ngày trước`
  } catch {
    return ''
  }
}

// ── DeviceIcon ────────────────────────────────────────────────────────────────

const DeviceIcon = ({ deviceType }) => {
  const iconProps = { sx: { fontSize: 28 } }
  const type = (deviceType || '').toUpperCase()

  if (type === 'MOBILE') {
    return (
      <Box sx={{ bgcolor: '#20a9e722', color: '#388e3c', p: 1.2, borderRadius: '50%', display: 'flex' }}>
        <SmartphoneOutlinedIcon {...iconProps} />
      </Box>
    )
  }
  if (type === 'TABLET') {
    return (
      <Box sx={{ bgcolor: '#fff3e0', color: '#f57c00', p: 1.2, borderRadius: '50%', display: 'flex' }}>
        <TabletOutlinedIcon {...iconProps} />
      </Box>
    )
  }
  return (
    <Box sx={{ bgcolor: '#e3f2fd', color: '#1976d2', p: 1.2, borderRadius: '50%', display: 'flex' }}>
      <LaptopMacOutlinedIcon {...iconProps} />
    </Box>
  )
}

// ── DeviceTypeBadge ───────────────────────────────────────────────────────────

const DeviceTypeBadge = ({ deviceType }) => {
  const type = (deviceType || 'WEB').toUpperCase()
  const config = {
    MOBILE: { label: 'Mobile', color: 'success' },
    TABLET: { label: 'Tablet', color: 'warning' },
    WEB: { label: 'Web', color: 'info' }
  }
  const { label, color } = config[type] || config.WEB
  return <Chip label={label} color={color} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 11 }} />
}

// ── Confirm Delete Dialog ─────────────────────────────────────────────────────

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, loading, deviceName }) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ bgcolor: '#ffebee', color: '#c62828', p: 1, borderRadius: '50%', display: 'flex' }}>
          <DeleteOutlineIcon />
        </Box>
        <Typography fontWeight="bold">Xóa phiên đăng nhập</Typography>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        Bạn có chắc muốn xóa phiên đăng nhập từ thiết bị:
      </Typography>
      <Typography fontWeight="600" sx={{ mt: 1, color: 'text.primary' }}>
        {deviceName || 'Thiết bị không xác định'}
      </Typography>
      <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
        Thiết bị đó sẽ bị đăng xuất nếu phiên còn hiệu lực.
      </Alert>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
      <Button
        onClick={onClose}
        disabled={loading}
        variant="outlined"
        color="inherit"
        sx={{ borderRadius: 20, textTransform: 'none' }}>
        Hủy
      </Button>
      <Button
        onClick={onConfirm}
        disabled={loading}
        variant="contained"
        color="error"
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <DeleteOutlineIcon />}
        sx={{ borderRadius: 20, textTransform: 'none' }}>
        {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
      </Button>
    </DialogActions>
  </Dialog>
)

// ── Row Skeleton ──────────────────────────────────────────────────────────────

const RowSkeleton = () => (
  <TableRow>
    {[64, 120, 100, 120, 80, 100, 120, 64].map((w, i) => (
      <TableCell key={i}>
        <Skeleton variant="rounded" width={w} height={20} />
      </TableCell>
    ))}
  </TableRow>
)

// ── LoginDevicesTab (main) ────────────────────────────────────────────────────

const LoginDevicesTab = ({ username }) => {
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, historyId: null, deviceName: '' })
  const [deleting, setDeleting] = useState(false)

  const fetchHistories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getLoginHistory()
      setHistories(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Không thể tải lịch sử đăng nhập. Vui lòng thử lại.')
      console.error('getLoginHistory error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistories()
  }, [fetchHistories])

  const handleOpenDelete = (historyId, deviceName) => {
    setDeleteDialog({ open: true, historyId, deviceName })
  }

  const handleCloseDelete = () => {
    if (!deleting) setDeleteDialog({ open: false, historyId: null, deviceName: '' })
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteLoginHistoryById(deleteDialog.historyId)
      setHistories((prev) => prev.filter((h) => h.id !== deleteDialog.historyId))
      setDeleteDialog({ open: false, historyId: null, deviceName: '' })
    } catch (err) {
      setError('Xóa thất bại. Vui lòng thử lại.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Box>
      {/* Header card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
          border: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: '#f3e5f5', color: '#9c27b0', p: 1.5, borderRadius: '50%', display: 'flex' }}>
            <DesktopWindowsOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Thiết bị đăng nhập
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danh sách các thiết bị đã đăng nhập vào tài khoản của bạn.
              {!loading && histories.length > 0 && (
                <Typography component="span" fontWeight="600" color="primary.main">
                  {' '}
                  ({histories.length} phiên)
                </Typography>
              )}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Làm mới danh sách">
          <span>
            <IconButton
              onClick={fetchHistories}
              disabled={loading}
              sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e3f2fd', color: '#1976d2' } }}>
              {loading ? <CircularProgress size={18} /> : <RefreshOutlinedIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 60 }}></TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Loại thiết bị</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tên thiết bị</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Hệ điều hành</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trình duyệt</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Địa chỉ IP</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Thời gian đăng nhập</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 60 }} align="center">
                Xóa
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              // Skeleton loading
              Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
            ) : histories.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1.5,
                      color: 'text.secondary'
                    }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    <Typography variant="body1" fontWeight={500}>
                      Chưa có lịch sử đăng nhập
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Các phiên đăng nhập sẽ xuất hiện tại đây sau khi bạn đăng nhập.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              histories.map((history, index) => (
                <TableRow
                  key={history.id}
                  hover
                  sx={{
                    // Hàng đầu tiên (mới nhất) highlight nhẹ
                    bgcolor: index === 0 ? '#fafffe' : 'inherit',
                    '&:hover': { bgcolor: '#f9f9f9' }
                  }}>
                  {/* Icon thiết bị */}
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <DeviceIcon deviceType={history.deviceType} />
                    </Box>
                  </TableCell>

                  {/* Loại thiết bị */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DeviceTypeBadge deviceType={history.deviceType} />
                      {index === 0 && (
                        <Chip
                          label="Mới nhất"
                          size="small"
                          sx={{ bgcolor: '#20a9e722', color: '#2e7d32', fontWeight: 600, fontSize: 10 }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {/* Tên thiết bị */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {history.deviceName || '---'}
                    </Typography>
                  </TableCell>

                  {/* Hệ điều hành */}
                  <TableCell>
                    <Typography variant="body2">
                      {history.osName || '---'}
                      {history.osVersion && (
                        <Typography component="span" variant="caption" color="text.secondary">
                          {' '}
                          {history.osVersion}
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>

                  {/* Trình duyệt */}
                  <TableCell>
                    <Typography variant="body2">
                      {history.browserName || '---'}
                      {history.browserVersion && (
                        <Typography component="span" variant="caption" color="text.secondary">
                          {' '}
                          v{history.browserVersion}
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>

                  {/* IP */}
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                      {history.ipAddress || '---'}
                    </Typography>
                  </TableCell>

                  {/* Thời gian */}
                  <TableCell>
                    <Tooltip title={formatDateTime(history.loginAt)} placement="top">
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {getTimeAgo(history.loginAt)}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatDateTime(history.loginAt)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  {/* Xóa */}
                  <TableCell align="center">
                    <Tooltip title="Xóa phiên đăng nhập này">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDelete(history.id, history.deviceName)}
                        sx={{ '&:hover': { bgcolor: '#ffebee' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        deviceName={deleteDialog.deviceName}
      />
    </Box>
  )
}

export default LoginDevicesTab
