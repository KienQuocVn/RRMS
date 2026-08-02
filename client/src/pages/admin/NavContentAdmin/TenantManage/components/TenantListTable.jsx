import { Fragment } from 'react'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material'
import TenantMenuUpdate from '../../TenantMenuUpdate'

const EMPTY_VALUE = 'Chưa có'

const headCellSx = {
  fontWeight: 700,
  color: '#0f172a',
  backgroundColor: '#f8fbff',
  borderBottom: '1px solid #d8e1eb',
  borderRight: '1px solid #e7edf5',
  fontSize: '0.78rem',
  py: 1,
  px: 1,
  whiteSpace: 'nowrap'
}

const bodyCellSx = {
  borderBottom: '1px solid #e7edf5',
  borderRight: '1px solid #eef2f7',
  verticalAlign: 'middle',
  fontSize: '0.78rem',
  py: 1,
  px: 1
}

const getDisplayValue = (...values) => {
  const matched = values.find((value) => {
    if (typeof value === 'boolean') return true
    return value !== null && value !== undefined && String(value).trim() !== ''
  })

  return matched ?? EMPTY_VALUE
}

const formatDate = (value) => {
  if (!value) return EMPTY_VALUE

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return value

  return parsedDate.toLocaleDateString('vi-VN')
}

const getGenderLabel = (value) => {
  const genderValue = String(value ?? '').toUpperCase()

  if (genderValue === 'MALE') return 'Nam'
  if (genderValue === 'FEMALE') return 'Nữ'
  if (genderValue === 'OTHER') return 'Khác'

  return getDisplayValue(value)
}



const getVehicleLabel = (row) =>
  getDisplayValue(row.licensePlate, row.vehicleNumber, row.vehicle?.number, row.vehicle?.licensePlate)

const getResidenceStart = (row) =>
  formatDate(row.temporaryResidenceDate ?? row.residenceStartDate ?? row.temporaryResidenceStartDate)

const getResidenceEnd = (row) =>
  formatDate(row.temporaryResidenceExpireDate ?? row.residenceEndDate ?? row.temporaryResidenceEndDate)

const getResidenceTemplate = (row) =>
  getDisplayValue(row.residenceTemplateName, row.templateName, row.temporaryResidenceTemplateName)

const getGroupLabel = (row) => getDisplayValue(row.room?.name, row.roomName, row.nameRoom, 'Chưa phân phòng')

const TenantListTable = ({
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewResidenceForm,
  onPrintResidenceForm,
  onEditTenant,
  onDeleteTenant
}) => {
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const groupedRows = paginatedRows.reduce((result, row) => {
    const groupLabel = getGroupLabel(row)
    result[groupLabel] = result[groupLabel] || []
    result[groupLabel].push(row)
    return result
  }, {})

  return (
    <Paper
      sx={{
        mt: 2,
        borderRadius: 2,
        border: '1px solid #d8e1eb',
        overflow: 'hidden',
        boxShadow: 'none'
      }}>
      <TableContainer sx={{ maxHeight: 720 }}>
        <Table stickyHeader size="small" sx={{ minWidth: 1450 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, minWidth: 160 }}>Tên khách thuê</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>Số điện thoại</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 75 }}>Ngày sinh</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 65 }}>Giới tính</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>Địa chỉ <br/> Nghề nghiệp</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>Thông tin CCCD</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 90 }}>Xe</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 85 }}>Ngày tạm trú</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 85 }}>Hạn tạm trú</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 75 }}>Quan hệ</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>Mẫu tạm trú</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>Loại người thuê</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>Trạng thái <br/> giấy tờ</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>Trạng thái <br/> tạm trú</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 50, backgroundColor: '#dfeafb', borderRight: 0 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} align="center" sx={{ py: 8 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <img
                      src="/client/public/empty-box.webp"
                      alt="Không có dữ liệu"
                      style={{ maxWidth: '260px', width: '100%', opacity: 0.72, marginBottom: '16px' }}
                    />
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Không có dữ liệu khách thuê
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedRows).map(([groupLabel, tenantRows]) => (
                <Fragment key={groupLabel}>
                  <TableRow>
                    <TableCell
                      colSpan={15}
                      sx={{
                        backgroundColor: '#eef6ff',
                        borderBottom: '1px solid #d8e1eb',
                        py: 1.25
                      }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KeyboardArrowDownRoundedIcon sx={{ color: '#475569' }} />
                        <Typography sx={{ fontWeight: 700, color: '#1f2937' }}>{groupLabel}</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#d32f2f' }}>
                          ({tenantRows.length}) khách thuê
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {tenantRows.map((row) => (
                    <TableRow
                      hover
                      key={row.tenantId || row.fullname}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#fafcff'
                        }
                      }}>
                      <TableCell sx={{ ...bodyCellSx, backgroundColor: '#eef6ff' }}>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          

                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700, color: '#1f2937', fontSize: '0.78rem', lineHeight: 1.2 }}>
                              {getDisplayValue(row.fullname, row.fullName)}
                            </Typography>
                            <Typography sx={{ color: '#475569', fontSize: '0.72rem', mt: 0.25, wordBreak: 'break-all' }}>
                              {getDisplayValue(row.username, row.email)}
                            </Typography>

                            <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ mt: 0.75 }}>
                              <Chip
                                size="small"
                                label={row.type_of_tenant ? 'Đại diện liên hệ' : 'Thành viên phòng'}
                                sx={{
                                  height: 18,
                                  bgcolor: row.type_of_tenant ? '#e7f7e7' : '#fff4df',
                                  color: row.type_of_tenant ? '#2e7d32' : '#ef6c00',
                                  fontWeight: 600,
                                  fontSize: '0.68rem'
                                }}
                              />

                              {!row.accountId && !row.userId && (
                                <Chip
                                  size="small"
                                  label="Chưa có TK App"
                                  sx={{
                                    height: 18,
                                    bgcolor: '#fff1f2',
                                    color: '#f97316',
                                    fontWeight: 600,
                                    fontSize: '0.68rem'
                                  }}
                                />
                              )}
                            </Stack>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{getDisplayValue(row.phone)}</Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                            {formatDate(row.birthday)}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontSize: '0.78rem' }}>{getGenderLabel(row.gender)}</Typography>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Stack spacing={0.75}>
                          <Stack direction="row" spacing={0.5} alignItems="flex-start">
                            <Typography sx={{ color: '#475569', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                              {getDisplayValue(row.address)}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.5} alignItems="flex-start">
                            <Typography sx={{ color: '#475569', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                              {getDisplayValue(row.job)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{getDisplayValue(row.cccd)}</Typography>
                          </Stack>
                          <Typography sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                            Ngày cấp: {formatDate(row.licenseDate)}
                          </Typography>
                          <Typography sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                            Nơi cấp: {getDisplayValue(row.placeOfLicense)}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography sx={{ fontSize: '0.75rem', wordBreak: 'break-word' }}>{getVehicleLabel(row)}</Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {getResidenceStart(row)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {getResidenceEnd(row)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontSize: '0.75rem' }}>{getDisplayValue(row.relationship)}</Typography>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontSize: '0.75rem', wordBreak: 'break-word' }}>{getResidenceTemplate(row)}</Typography>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Chip
                          size="small"
                          label={row.type_of_tenant ? 'Người liên hệ' : 'Thành viên'}
                          sx={{
                            height: 18,
                            bgcolor: row.type_of_tenant ? '#7bc043' : '#e2e8f0',
                            color: row.type_of_tenant ? '#fff' : '#334155',
                            fontWeight: 700,
                            fontSize: '0.68rem'
                          }}
                        />
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Chip
                          size="small"
                          label={row.informationVerify ? 'Đã đầy đủ' : 'Chưa đầy đủ'}
                          sx={{
                            height: 18,
                            bgcolor: row.informationVerify ? '#ff9800' : '#fb8c00',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.68rem'
                          }}
                        />
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Chip
                          size="small"
                          label={row.temporaryResidence ? 'Đã có tạm trú' : 'Chưa có tạm trú'}
                          sx={{
                            height: 18,
                            bgcolor: row.temporaryResidence ? '#20a9e7' : '#e53935',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.68rem'
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{ ...bodyCellSx, backgroundColor: '#eef6ff', borderRight: 0, textAlign: 'center' }}>
                        <TenantMenuUpdate
                          tenantId={row.tenantId}
                          onViewResidenceForm={onViewResidenceForm}
                          onPrintResidenceForm={onPrintResidenceForm}
                          onEditTenant={onEditTenant}
                          onDeleteTenant={onDeleteTenant}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  )
}

export default TenantListTable
