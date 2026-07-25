import { useEffect, useState } from 'react'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Alert, Box, Button, Chip, Snackbar, Stack, Typography } from '@mui/material'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { env } from '~/configs/environment'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import AddTenantModal from './AddTenant'
import TenantFilterBar from './components/TenantFilterBar'
import TenantListTable from './components/TenantListTable'

const FILTER_KEYS = {
  ALL: 'all',
  TEMPORARY_REGISTERED: 'temporaryRegistered',
  TEMPORARY_MISSING: 'temporaryMissing',
  DOCUMENT_COMPLETE: 'documentComplete',
  DOCUMENT_MISSING: 'documentMissing'
}

const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const TenantManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const [open, setOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [avatar, setAvatar] = useState(true)
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [editId, setEditId] = useState(null)
  const [statusFilters, setStatusFilters] = useState({})
  const [searchValue, setSearchValue] = useState('')

  const navigate = useNavigate()
  const { motelId } = useParams()

  useEffect(() => {
    setIsAdmin(true)
  }, [setIsAdmin])

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleOpenCreate = () => {
    setAvatar(true)
    setEditId(null)
    setOpen(true)
  }

  const handleOpenEdit = (tenantId) => {
    setAvatar(false)
    setEditId(tenantId)
    setOpen(true)
  }

  const handleClose = () => {
    setEditId(null)
    setOpen(false)
    setAvatar(true)
  }

  const handleClickDoc = (tenantId) => {
    navigate(`/ResidenceForm/${tenantId}`)
  }

  const handlePrintResidence = (tenantId) => {
    window.open(`${window.location.origin}/ResidenceForm/${tenantId}`, '_blank', 'noopener,noreferrer')
  }

  const loadData = async () => {
    if (!motelId) return
    try {
      const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null

      if (!token) {
        console.error('No token found')
        return
      }

      const response = await axios.get(`${env.API_URL}/tenant/motel/${motelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': '69420'
        }
      })

      if (response.status === 200) {
        const fetchedData = response.data?.result

        if (Array.isArray(fetchedData)) {
          setRows(
            fetchedData.map((item) => ({
              ...item,
              fullname: item.fullName,
              type_of_tenant: item.typeOfTenant,
              placeOfLicense: item.placeOfLicense
            }))
          )
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error.response?.data || error.message || error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const reloadData = () => {
    loadData()
  }

  const deleteTenant = async (id) => {
    const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mã đăng nhập bị thiếu, vui lòng đăng nhập lại.'
      })
      return
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xóa khách thuê?',
      text: 'Hành động này không thể hoàn tác.',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })

    if (!result.isConfirmed) return

    try {
      const response = await axios.delete(`${env.API_URL}/tenant/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
      })

      console.log('Người thuê đã bị xóa thành công:', response.data)
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Xóa khách thuê thành công!' })
      reloadData()
    } catch (error) {
      console.error('Lỗi khi xóa khách thuê:', error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Xóa khách thuê không thành công!'
      })
    }
  }

  const filterOptions = [
    {
      key: FILTER_KEYS.TEMPORARY_REGISTERED,
      label: 'Đã đăng ký tạm trú',
      count: rows.filter((item) => item.temporaryResidence === true).length,
      badgeColor: '#20a9e7'
    },
    {
      key: FILTER_KEYS.TEMPORARY_MISSING,
      label: 'Chưa đăng ký tạm trú',
      count: rows.filter((item) => item.temporaryResidence === false).length,
      badgeColor: '#20a9e7'
    },
    {
      key: FILTER_KEYS.DOCUMENT_COMPLETE,
      label: 'Khách đã nộp giấy tờ',
      count: rows.filter((item) => item.informationVerify === true).length,
      badgeColor: '#ffb300'
    },
    {
      key: FILTER_KEYS.DOCUMENT_MISSING,
      label: 'Khách chưa nộp giấy tờ',
      count: rows.filter((item) => item.informationVerify === false).length,
      badgeColor: '#e53935'
    }
  ]

  const searchKeyword = normalizeText(searchValue)
  const selectedFilterKeys = Object.entries(statusFilters)
    .filter(([, isSelected]) => isSelected)
    .map(([key]) => key)

  const matchesFilterOption = (row, filterKey) => {
    if (filterKey === FILTER_KEYS.TEMPORARY_REGISTERED) return row.temporaryResidence === true
    if (filterKey === FILTER_KEYS.TEMPORARY_MISSING) return row.temporaryResidence === false
    if (filterKey === FILTER_KEYS.DOCUMENT_COMPLETE) return row.informationVerify === true
    if (filterKey === FILTER_KEYS.DOCUMENT_MISSING) return row.informationVerify === false

    return true
  }

  const filteredRows = rows.filter((row) => {
    if (selectedFilterKeys.length > 0 && !selectedFilterKeys.some((filterKey) => matchesFilterOption(row, filterKey))) {
      return false
    }

    if (!searchKeyword) return true

    const searchableText = normalizeText(
      [row.fullname, row.fullName, row.phone, row.cccd, row.address, row.job, row.room?.name, row.relationship].join(
        ' '
      )
    )

    return searchableText.includes(searchKeyword)
  })

  useEffect(() => {
    setPage(0)
  }, [statusFilters, searchValue])

  const handleStatusFilterChange = (filterKey, isChecked) => {
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: isChecked
    }))
  }

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1)
    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [filteredRows.length, page, rowsPerPage])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'KhachThue')
    XLSX.writeFile(workbook, 'DanhSachKhachThue.xlsx')
    showSnackbar('Xuất Excel thành công!')
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const showComingSoon = (featureName) => {
    showSnackbar(`${featureName} sẽ sớm được cập nhật.`, 'info')
  }

  return (
    <Box>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />

      <Box
        sx={{
          backgroundColor: '#fff',
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          m: '0 10px 10px 10px'
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            flexWrap: 'wrap'
          }}>
          <Stack direction="row" spacing={2} sx={{ flex: '1 1 360px', minWidth: 0 }}>
            <Box
              sx={{
                width: 4,
                minHeight: 66,
                bgcolor: 'primary.main',
                borderRadius: 999
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', fontSize: '1.2rem', lineHeight: 1.2 }}>
                Quản lý danh sách khách thuê
              </Typography>
              <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic', fontSize: '0.85rem' }}>
                Tất cả danh sách khách thuê trong ký túc xá/sleepbox của bạn
              </Typography>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={`${filteredRows.length} khách thuê đang hiển thị`}
              />
            </Box>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', xl: 'flex-end' }
            }}>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenCreate}
              sx={{
                px: 2.25,
                minHeight: 40,
                borderRadius: 2,
                bgcolor: '#1f9cf0',
                '&:hover': { bgcolor: '#0f87d8' }
              }}>
              Thêm khách thuê
            </Button>

            <Button
              variant="contained"
              startIcon={<AccessTimeOutlinedIcon />}
              onClick={() => showComingSoon('Danh sách hết tạm trú/Visa')}
              sx={{
                px: 2.25,
                minHeight: 40,
                borderRadius: 2,
                bgcolor: '#6c757d',
                '&:hover': { bgcolor: '#5a6268' }
              }}>
              Hết tạm trú/Visa
            </Button>

            <Button
              variant="contained"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={exportToExcel}
              sx={{
                px: 2.25,
                minHeight: 40,
                borderRadius: 2,
                bgcolor: '#67b52d',
                '&:hover': { bgcolor: '#579b26' }
              }}>
              Xuất excel
            </Button>

            <Button
              variant="contained"
              startIcon={<SearchOutlinedIcon />}
              onClick={() => showComingSoon('Tra cứu khách thuê cũ')}
              sx={{
                px: 2.25,
                minHeight: 40,
                borderRadius: 2,
                bgcolor: '#20a9e7',
                '&:hover': { bgcolor: '#2b7ed7' }
              }}>
              Tra cứu khách thuê cũ
            </Button>

            <Box sx={{ position: 'relative' }}>
              <Chip
                label="Mới"
                color="error"
                size="small"
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 10,
                  zIndex: 1,
                  height: 22,
                  fontWeight: 700
                }}
              />
              <Button
                variant="contained"
                startIcon={<DescriptionOutlinedIcon />}
                onClick={() => showComingSoon('Thiết lập mẫu tạm trú')}
                sx={{
                  px: 2.25,
                  minHeight: 40,
                  borderRadius: 2,
                  bgcolor: '#ffbf00',
                  color: '#1f2937',
                  '&:hover': { bgcolor: '#e6ac00' }
                }}>
                Thiết lập mẫu tạm trú
              </Button>
            </Box>
          </Box>
        </Box>

        <TenantFilterBar
          filters={filterOptions}
          statusFilters={statusFilters}
          onStatusFilterChange={handleStatusFilterChange}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <TenantListTable
          rows={filteredRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onViewResidenceForm={handleClickDoc}
          onPrintResidenceForm={handlePrintResidence}
          onEditTenant={handleOpenEdit}
          onDeleteTenant={deleteTenant}
        />
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AddTenantModal avatar={avatar} editId={editId} open={open} onClose={handleClose} reloadData={reloadData} />
    </Box>
  )
}

export default TenantManager
