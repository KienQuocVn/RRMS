import { useEffect, useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import axios from 'axios'
import Swal from 'sweetalert2'
import { env } from '~/configs/environment'
import { unwrapPageItems } from '~/utils/apiAdapters'
import UserDetailsPanel from './components/userManagement/UserDetailsPanel'
import UserEmptyState from './components/userManagement/UserEmptyState'
import UserFormModal from './components/userManagement/UserFormModal'
import UserLockModal from './components/userManagement/UserLockModal'
import UserManagementHeader from './components/userManagement/UserManagementHeader'
import UserStatsBar from './components/userManagement/UserStatsBar'
import UsersFilterBar from './components/userManagement/UsersFilterBar'
import UsersTablePanel from './components/userManagement/UsersTablePanel'
import { PAGE_BG, buildUserRecord, filterUsers, getStats } from './components/userManagement/userManagementUtils'

const DEFAULT_FILTERS = {
  role: 'Tất cả',
  status: 'Tất cả',
  verification: 'Tất cả',
  joinedAt: 'Tất cả',
  sort: 'Mới nhất'
}

const DEFAULT_FORM = {
  username: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  role: 'Người thuê',
  avatar: '',
  password: '',
  confirmPassword: '',
  sendWelcomeEmail: true,
  requireEmailVerification: true
}

const DEFAULT_LOCK_FORM = {
  duration: '7d',
  reason: 'Vi phạm quy định',
  otherReason: '',
  sendNotification: true,
  hidePosts: false
}

const apiHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const ListUsers = () => {
  const storedUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null
  const token = storedUser?.token || null
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [userNotes, setUserNotes] = useState({})
  const [formMode, setFormMode] = useState('create')
  const [userForm, setUserForm] = useState(DEFAULT_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [lockTarget, setLockTarget] = useState(null)
  const [lockForm, setLockForm] = useState(DEFAULT_LOCK_FORM)

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${env.API_URL}/api/v1/accounts/get-all-account?page=0&size=500`, apiHeaders(token))
      const items = unwrapPageItems(response) || []
      setAccounts(items.map((account, index) => buildUserRecord(account, index)))
    } catch (error) {
      console.error('Error fetching accounts', error)
      setAccounts([])
      Swal.fire({
        icon: 'error',
        title: 'Không thể tải danh sách',
        text: 'Đã xảy ra lỗi khi lấy danh sách người dùng.'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const filteredUsers = useMemo(() => filterUsers(accounts, filters, searchValue), [accounts, filters, searchValue])
  const stats = useMemo(() => getStats(accounts), [accounts])

  useEffect(() => {
    setPage(0)
    setIsDetailOpen(false)
  }, [filters, searchValue])

  useEffect(() => {
    if (!filteredUsers.length) {
      setSelectedRowId(null)
      setSelectedIds([])
      setIsDetailOpen(false)
      return
    }

    if (selectedRowId) {
      const selectedExists = filteredUsers.some((item) => item.id === selectedRowId)
      if (!selectedExists) {
        setSelectedRowId(null)
        setIsDetailOpen(false)
      }
    }
  }, [filteredUsers, selectedRowId])

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage
    return filteredUsers.slice(start, start + rowsPerPage)
  }, [filteredUsers, page, rowsPerPage])

  const selectedUser = filteredUsers.find((item) => item.id === selectedRowId) || null

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setIsDetailOpen(false)
  }

  const handleOpenCreateModal = () => {
    setFormMode('create')
    setUserForm(DEFAULT_FORM)
    setShowPassword(false)
    setIsUserModalOpen(true)
  }

  const handleOpenEditModal = (user) => {
    setFormMode('edit')
    setUserForm({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone === '--' ? '' : user.phone,
      address: user.address === '--' ? '' : user.address,
      role: user.role,
      avatar: user.avatar,
      password: '',
      confirmPassword: '',
      sendWelcomeEmail: true,
      requireEmailVerification: true
    })
    setShowPassword(false)
    setIsUserModalOpen(true)
  }

  const handleSubmitUser = async (payloadRole) => {
    const isCreate = formMode === 'create'
    if (!userForm.fullName || !userForm.email || !userForm.role || (isCreate && !userForm.username)) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập đầy đủ các trường bắt buộc.' })
      return
    }

    if (isCreate && (!userForm.password || userForm.password !== userForm.confirmPassword)) {
      Swal.fire({ icon: 'warning', title: 'Mật khẩu chưa hợp lệ', text: 'Vui lòng kiểm tra lại mật khẩu và xác nhận mật khẩu.' })
      return
    }

    try {
      if (isCreate) {
        await axios.post(
          `${env.API_URL}/api/v1/accounts`,
          {
            username: userForm.username,
            password: userForm.password,
            fullName: userForm.fullName,
            phone: userForm.phone,
            email: userForm.email,
            avatar: userForm.avatar,
            address: userForm.address,
            role: [payloadRole]
          },
          apiHeaders(token)
        )
      } else {
        await axios.put(
          `${env.API_URL}/api/v1/accounts/${userForm.username}`,
          {
            username: userForm.username,
            fullName: userForm.fullName,
            phone: userForm.phone,
            email: userForm.email,
            avatar: userForm.avatar,
            address: userForm.address,
            role: [payloadRole]
          },
          apiHeaders(token)
        )
      }

      setIsUserModalOpen(false)
      await fetchAccounts()
      Swal.fire({
        icon: 'success',
        title: isCreate ? 'Đã tạo tài khoản' : 'Đã cập nhật người dùng',
        text: isCreate ? 'Người dùng mới đã được thêm vào hệ thống.' : 'Thông tin người dùng đã được cập nhật.'
      })
    } catch (error) {
      console.error('Error saving account', error)
      Swal.fire({
        icon: 'error',
        title: 'Không thể lưu người dùng',
        text: error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.'
      })
    }
  }

  const handleConfirmLock = () => {
    if (!lockTarget) return
    const lockReason = lockForm.reason === 'Lý do khác' ? lockForm.otherReason : lockForm.reason
    if (!lockReason) {
      Swal.fire({ icon: 'warning', title: 'Thiếu lý do khóa', text: 'Vui lòng chọn hoặc nhập lý do khóa tài khoản.' })
      return
    }

    setAccounts((prev) =>
      prev.map((item) =>
        item.id === lockTarget.id
          ? {
              ...item,
              status: 'Bị khóa',
              recentActivities: [
                {
                  id: `${item.id}-locked`,
                  title: `Tài khoản bị khóa: ${lockReason}`,
                  time: 'Vừa xong',
                  color: '#E24B4A'
                },
                ...item.recentActivities
              ]
            }
          : item
      )
    )
    setLockTarget(null)
    setLockForm(DEFAULT_LOCK_FORM)
    Swal.fire({
      icon: 'success',
      title: 'Đã khóa tài khoản',
      text: `${lockTarget.fullName} đã được chuyển sang trạng thái bị khóa.`
    })
  }

  const handleToggleLock = (user) => {
    if (user.status === 'Bị khóa') {
      setAccounts((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? {
                ...item,
                status: 'Đang hoạt động'
              }
            : item
        )
      )
      Swal.fire({
        icon: 'success',
        title: 'Đã mở khóa tài khoản',
        text: `${user.fullName} có thể hoạt động trở lại.`
      })
      return
    }

    setLockTarget(user)
    setLockForm(DEFAULT_LOCK_FORM)
  }

  const handleExport = () => {
    const header = ['Ho ten', 'Email', 'So dien thoai', 'Vai tro', 'Trang thai', 'Ngay tham gia']
    const lines = filteredUsers.map((item) => [item.fullName, item.email, item.phone, item.role, item.status, item.createdAt].join(','))
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'danh-sach-nguoi-dung.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Box sx={{ px: { xs: 2, lg: 3 }, py: 2, background: PAGE_BG, minHeight: '100%' }}>
      <Stack spacing={2}>
        <UserManagementHeader totalUsers={accounts.length} onExport={handleExport} onAddUser={handleOpenCreateModal} />
        <UserStatsBar stats={stats} />
        <UsersFilterBar
          filters={filters}
          searchValue={searchValue}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchValue}
        />

        {filteredUsers.length === 0 && !loading ? (
          <UserEmptyState
            onReset={() => {
              setFilters(DEFAULT_FILTERS)
              setSearchValue('')
            }}
          />
        ) : (
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, xl: isDetailOpen ? 7 : 12 }}>
              <UsersTablePanel
                rows={paginatedUsers}
                allRows={filteredUsers}
                selectedRowId={selectedRowId}
                selectedIds={selectedIds}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredUsers.length}
                loading={loading}
                onRowSelect={(id) => {
                  setSelectedRowId(id)
                  setIsDetailOpen(true)
                }}
                onToggleSelectOne={(id) => {
                  setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
                }}
                onToggleSelectAll={(checked) => {
                  if (!checked) {
                    setSelectedIds([])
                    return
                  }
                  setSelectedIds(paginatedUsers.map((item) => item.id))
                }}
                onPageChange={setPage}
                onRowsPerPageChange={(size) => {
                  setRowsPerPage(size)
                  setPage(0)
                }}
                onClearSelection={() => setSelectedIds([])}
                onEditUser={handleOpenEditModal}
                onToggleLock={handleToggleLock}
              />
            </Grid>

            {selectedUser && isDetailOpen && (
              <Grid size={{ xs: 12, xl: 5 }}>
                <UserDetailsPanel
                  user={selectedUser}
                  note={userNotes[selectedUser.id] || ''}
                  onNoteChange={(value) => setUserNotes((prev) => ({ ...prev, [selectedUser.id]: value }))}
                  onClose={() => setIsDetailOpen(false)}
                  onEditUser={handleOpenEditModal}
                  onToggleLock={handleToggleLock}
                />
              </Grid>
            )}
          </Grid>
        )}
      </Stack>

      <UserFormModal
        open={isUserModalOpen}
        mode={formMode}
        form={userForm}
        showPassword={showPassword}
        onClose={() => setIsUserModalOpen(false)}
        onChange={(field, value) => setUserForm((prev) => ({ ...prev, [field]: value }))}
        onToggleShowPassword={() => setShowPassword((prev) => !prev)}
        onSubmit={handleSubmitUser}
      />

      <UserLockModal
        open={Boolean(lockTarget)}
        user={lockTarget}
        form={lockForm}
        onClose={() => {
          setLockTarget(null)
          setLockForm(DEFAULT_LOCK_FORM)
        }}
        onChange={(field, value) => setLockForm((prev) => ({ ...prev, [field]: value }))}
        onConfirm={handleConfirmLock}
      />
    </Box>
  )
}

export default ListUsers
