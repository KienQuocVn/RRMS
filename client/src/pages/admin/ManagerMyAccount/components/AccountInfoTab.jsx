/**
 * AccountInfoTab - Tab hiển thị và chỉnh sửa thông tin tài khoản
 * - Load data thực từ API (không hardcode)
 * - Modal chỉnh sửa đầy đủ sử dụng MUI Dialog
 */

import React, { useState } from 'react'
import {
  Box, Typography, Grid, Paper, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Divider, CircularProgress,
  Alert, Snackbar, Chip
} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseIcon from '@mui/icons-material/Close'

import { updateProfile } from '~/apis/accountAPI'
import { format } from 'date-fns'

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateValue) => {
  if (!dateValue) return 'Chưa cập nhật'
  try {
    return format(new Date(dateValue), 'dd/MM/yyyy')
  } catch {
    return String(dateValue)
  }
}

const genderLabel = (g) => {
  if (g === 'MALE') return 'Nam'
  if (g === 'FEMALE') return 'Nữ'
  if (g === 'OTHER') return 'Khác'
  return 'Chưa cập nhật'
}

const copyToClipboard = (text) => {
  navigator.clipboard?.writeText(text).catch(() => {})
}

// ── InfoCard ──────────────────────────────────────────────────────────────────

const InfoCard = ({ label, value, hasCopy, valueColor }) => (
  <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #f0f0f0', borderRadius: 2, height: '100%' }}>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
      <Typography variant="body1" fontWeight="600" color={valueColor || 'text.primary'} sx={{ wordBreak: 'break-all' }}>
        {value || 'Chưa cập nhật'}
      </Typography>
      {hasCopy && value && (
        <IconButton
          size="small"
          onClick={() => copyToClipboard(value)}
          sx={{ bgcolor: '#f0f8ff', color: '#1976d2', p: 0.5, ml: 'auto', flexShrink: 0 }}
        >
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  </Paper>
)

const formatDateForInput = (dateValue) => {
  if (!dateValue) return ''
  try {
    const d = new Date(dateValue)
    if (isNaN(d.getTime())) {
      // Trường hợp dateValue có dạng yyyy-MM-dd
      if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue
      }
      return ''
    }
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

// ── EditModal ─────────────────────────────────────────────────────────────────

const EditAccountModal = ({ open, onClose, account, onSaved }) => {
  const [form, setForm] = useState({
    username: account?.username || '',
    fullName: account?.fullName || '',
    phone: account?.phone || '',
    email: account?.email || '',
    birthday: formatDateForInput(account?.birthday),
    gender: account?.gender || '',
    cccd: account?.cccd || '',
    address: account?.address || '',
    job: account?.job || '',
    placeOfIssue: account?.placeOfIssue || '',
    dateOfIssue: formatDateForInput(account?.dateOfIssue),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Reset form khi mở modal với data mới
  React.useEffect(() => {
    if (open && account) {
      setForm({
        username: account.username || '',
        fullName: account.fullName || '',
        phone: account.phone || '',
        email: account.email || '',
        birthday: formatDateForInput(account.birthday),
        gender: account.gender || '',
        cccd: account.cccd || '',
        address: account.address || '',
        job: account.job || '',
        placeOfIssue: account.placeOfIssue || '',
        dateOfIssue: formatDateForInput(account.dateOfIssue),
      })
      setError(null)
    }
  }, [open, account])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        username: form.username,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        birthday: form.birthday || null,
        gender: form.gender || null,
        cccd: form.cccd || null,
        address: form.address || null,
        job: form.job || null,
        placeOfIssue: form.placeOfIssue || null,
        dateOfIssue: form.dateOfIssue || null,
      }
      const updated = await updateProfile(payload)
      onSaved(updated || { ...account, ...form })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const fieldSx = { mb: 0 }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3, overflow: 'visible' } }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ bgcolor: '#e3f2fd', color: '#1976d2', p: 1, borderRadius: '50%', display: 'flex' }}>
              <EditOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">Chỉnh sửa tài khoản</Typography>
              <Typography variant="caption" color="text.secondary">Cập nhật thông tin cá nhân của bạn</Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} disabled={loading} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2.5}>
          {/* Thông tin cơ bản */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Thông tin cơ bản
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 11 }}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Ngày sinh"
              name="birthday"
              value={form.birthday || ''}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Giới tính"
              name="gender"
              value={form.gender || ''}
              onChange={handleChange}
              sx={fieldSx}
            >
              <MenuItem value="">-- Chọn --</MenuItem>
              <MenuItem value="MALE">Nam</MenuItem>
              <MenuItem value="FEMALE">Nữ</MenuItem>
              <MenuItem value="OTHER">Khác</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={form.address || ''}
              onChange={handleChange}
              multiline
              rows={2}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nghề nghiệp"
              name="job"
              value={form.job || ''}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          {/* CCCD / CMND */}
          <Grid item xs={12}>
            <Divider sx={{ mt: 1, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Thông tin CCCD / CMND
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Số CCCD / CMND"
              name="cccd"
              value={form.cccd || ''}
              onChange={handleChange}
              inputProps={{ maxLength: 15 }}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nơi cấp"
              name="placeOfIssue"
              value={form.placeOfIssue || ''}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ngày cấp"
              name="dateOfIssue"
              value={form.dateOfIssue || ''}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" color="inherit" sx={{ borderRadius: 20, textTransform: 'none', px: 3 }}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || !form.fullName || !form.phone}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveOutlinedIcon />}
          sx={{ borderRadius: 20, textTransform: 'none', px: 3, bgcolor: '#20a9e7', '&:hover': { bgcolor: '#1a8ec4' } }}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── AccountInfoTab (main) ─────────────────────────────────────────────────────

const AccountInfoTab = ({ account, onAccountUpdated }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleSaved = (updatedAccount) => {
    onAccountUpdated?.(updatedAccount)
    setSnackbar({ open: true, message: 'Cập nhật tài khoản thành công!', severity: 'success' })
  }

  const isVerified = Boolean(account?.cccd && account?.email)
  const createdAt = formatDate(account?.createdAt)

  return (
    <Box>
      {/* Card header */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: '#e3f2fd', color: '#1976d2', p: 1.5, borderRadius: '50%', display: 'flex' }}>
            <PersonOutlineIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">Thông tin tài khoản</Typography>
            <Typography variant="body2" color="text.secondary">
              Thông tin cơ bản, trạng thái và các mốc sử dụng chính.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditOutlinedIcon />}
          onClick={() => setEditOpen(true)}
          sx={{ borderRadius: 20, textTransform: 'none', bgcolor: '#20a9e7', '&:hover': { bgcolor: '#1a8ec4' }, whiteSpace: 'nowrap' }}
        >
          Chỉnh sửa tài khoản
        </Button>
      </Paper>

      {/* Info grid */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoCard
            label="Tên đăng nhập"
            value={account?.username}
            hasCopy
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard
            label="Tình trạng"
            value={isVerified ? 'Đã được xác minh' : 'Chưa được xác minh'}
            valueColor={isVerified ? 'success.main' : 'warning.main'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Họ và tên" value={account?.fullName} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Số điện thoại" value={account?.phone} hasCopy />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Email" value={account?.email} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Giới tính" value={genderLabel(account?.gender)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Ngày sinh" value={formatDate(account?.birthday)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Ngày tạo tài khoản" value={createdAt} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Số CCCD / CMND" value={account?.cccd} hasCopy />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Nơi cấp CCCD" value={account?.placeOfIssue} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Ngày cấp CCCD" value={formatDate(account?.dateOfIssue)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Địa chỉ" value={account?.address} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard label="Nghề nghiệp" value={account?.job} />
        </Grid>

        {/* Vai trò */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #f0f0f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
              Vai trò
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {(account?.role ?? []).length > 0
                ? account.role.map((r) => (
                    <Chip
                      key={r}
                      label={r}
                      size="small"
                      sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, fontSize: 11 }}
                    />
                  ))
                : <Typography variant="body2" color="text.secondary">Chưa có vai trò</Typography>
              }
            </Box>
          </Paper>
        </Grid>

        {/* Hợp đồng phần mềm */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #f0f0f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, display: 'block', mb: 1 }}>
              Hợp đồng thuê phần mềm
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<DescriptionOutlinedIcon />}
              sx={{ borderRadius: 20, textTransform: 'none', bgcolor: '#20a9e7', '&:hover': { bgcolor: '#1a8ec4' } }}
            >
              Xem mẫu
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal chỉnh sửa */}
      {editOpen && (
        <EditAccountModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          account={account}
          onSaved={handleSaved}
        />
      )}

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AccountInfoTab
