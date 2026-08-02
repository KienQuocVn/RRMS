import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material'
import PropTypes from 'prop-types'
import { useTheme } from '@emotion/react'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { deleteBulletinBoard, hideBulletinBoard } from '~/apis/bulletinBoardAPI'
import Swal from 'sweetalert2'
function TablePaginationActions(props) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
}

const PostRoomTable = ({ rows, handleOpen, setBulletinBoardId, refreshBulletinBoards }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
        <Table stickyHeader sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên phòng</TableCell>
              <TableCell>Loại phòng</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Giá phòng</TableCell>
              <TableCell>Diện tích</TableCell>
              <TableCell>Tình trạng</TableCell>
              <TableCell>Trạng thái duyệt</TableCell>
              <TableCell>Trạng thái tin đăng</TableCell>
              <TableCell>Lý do từ chối</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              flex: 1,
              overflow: 'auto'
            }}>
            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
              (row, i) => (
                <TableRow
                  hover
                  key={row.bulletinBoardId ?? `bulletin-row-${page * rowsPerPage + i}`}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 150,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                    {row.nameRoom}
                  </TableCell>
                  <TableCell>{row.typeRoom}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 150,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                    {row.address}
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.roomArea}</TableCell>
                  <TableCell>
                    <Chip
                      sx={{ 
                        bgcolor: row.roomStatus === 'OCCUPIED' ? '#fff3e0' : '#e8f5e9', 
                        color: row.roomStatus === 'OCCUPIED' ? '#ef6c00' : '#2e7d32', 
                        fontWeight: '600', 
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: row.roomStatus === 'OCCUPIED' ? '1px solid #ffe0b2' : '1px solid #c8e6c9'
                      }}
                      label={row.roomStatus === 'OCCUPIED' ? 'Đang cho thuê' : 'Đang trống'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{ 
                        bgcolor: 'black', 
                        color: 'white', 
                        fontWeight: '500', 
                        fontSize: '0.75rem',
                        borderRadius: '6px'
                      }}
                      label={
                        row.isHidden
                          ? 'Đã ẩn'
                          : row.isActive
                            ? 'Đã phê duyệt'
                            : row.rejectionReason
                              ? 'Từ chối'
                              : 'Chờ phê duyệt'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{ 
                        bgcolor: (row.isHidden || row.roomStatus === 'OCCUPIED') 
                          ? '#ffebee' 
                          : row.isActive
                            ? '#e8f5e9'
                            : row.rejectionReason
                              ? '#fff3e0'
                              : '#efebe9',
                        color: (row.isHidden || row.roomStatus === 'OCCUPIED') 
                          ? '#c62828' 
                          : row.isActive
                            ? '#2e7d32'
                            : row.rejectionReason
                              ? '#ef6c00'
                              : '#4e342e',
                        fontWeight: '600', 
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: (row.isHidden || row.roomStatus === 'OCCUPIED')
                          ? '1px solid #ffcdd2'
                          : row.isActive
                            ? '1px solid #c8e6c9'
                            : row.rejectionReason
                              ? '1px solid #ffe0b2'
                              : '1px solid #d7ccc8'
                      }}
                      label={
                        (row.isHidden || row.roomStatus === 'OCCUPIED')
                          ? 'Đang ẩn'
                          : row.isActive
                            ? 'Đang đăng'
                            : row.rejectionReason
                              ? 'Từ chối'
                              : 'Chờ phê duyệt'
                      }
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 180,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={row.rejectionReason || ''}>
                    {row.rejectionReason || '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EditIcon
                        sx={{ cursor: 'pointer', color: '#1e90ff' }}
                        onClick={() => {
                          setBulletinBoardId(row.bulletinBoardId)
                          handleOpen()
                        }}
                      />
                      {!row.isHidden && (
                        <VisibilityOffIcon
                          sx={{ cursor: 'pointer', color: '#f39c12' }}
                          onClick={() => {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Xác nhận ẩn tin đăng',
                              text: `Bạn có chắc muốn ẩn tin "${row.nameRoom}" khỏi danh sách công khai?`,
                              showCancelButton: true,
                              confirmButtonText: 'Ẩn tin',
                              cancelButtonText: 'Hủy',
                              reverseButtons: true
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                try {
                                  await hideBulletinBoard(row.bulletinBoardId)
                                  refreshBulletinBoards()
                                  Swal.fire('Thành công', 'Tin đăng đã được ẩn.', 'success')
                                } catch {
                                  Swal.fire('Lỗi', 'Không thể ẩn tin đăng. Vui lòng thử lại.', 'error')
                                }
                              }
                            })
                          }}
                        />
                      )}
                      <DeleteIcon
                        sx={{ cursor: 'pointer', color: '#ff4757' }}
                        onClick={() => {
                          Swal.fire({
                            icon: 'warning',
                            title: 'Thông báo',
                            text: 'Bạn có muốn xóa tin này?',
                            showCancelButton: true,
                            confirmButtonText: 'Xóa',
                            cancelButtonText: 'Hủy',
                            reverseButtons: true
                          }).then((result) => {
                            if (result.isConfirmed) {
                              deleteBulletinBoard(row.bulletinBoardId)
                              refreshBulletinBoards()
                            }
                          })
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              )
            )}
            {emptyRows > 0 && (
              <TableRow key="empty-rows" style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={11} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={4}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page2'
                    }
                  }
                }}
                labelRowsPerPage="Số dòng mỗi trang:"
                sx={{
                  '&.MuiTablePagination-root': {
                    overflow: 'visible',
                    border: 'none'
                  },
                  '& .MuiTablePagination-selectLabel': {
                    mb: 0
                  },
                  '& .MuiTablePagination-displayedRows': {
                    mb: 0
                  }
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}

export default PostRoomTable
