import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { BORDER, CARD_BG, PRIMARY, SEVERITY_STYLES, STATUS_STYLES, SUBJECT_TYPE_STYLES, getCountColor } from './violationReportStyles'

const headerCellSx = {
  fontSize: 11,
  textTransform: 'uppercase',
  color: '#6B7280',
  fontWeight: 600,
  letterSpacing: '0.04em',
  borderBottom: BORDER,
  background: '#F9FAFB',
  whiteSpace: 'nowrap'
}

const bodyCellSx = {
  borderBottom: BORDER,
  fontSize: 13,
  color: '#111827',
  verticalAlign: 'middle'
}

const pillSx = (style) => ({
  height: 26,
  borderRadius: '999px',
  bgcolor: style.background,
  color: style.color,
  fontSize: 12,
  fontWeight: 500
})

const ViolationReportsTable = ({
  rows,
  selectedRowId,
  selectedIds,
  page,
  rowsPerPage,
  totalCount,
  onRowSelect,
  onToggleSelectAll,
  onToggleSelectOne,
  onRowsPerPageChange,
  onPageChange,
  onOpenResolveModal
}) => {
  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage))
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
  const someSelected = rows.some((row) => selectedIds.includes(row.id)) && !allSelected
  const start = totalCount === 0 ? 0 : page * rowsPerPage + 1
  const end = Math.min((page + 1) * rowsPerPage, totalCount)

  return (
    <Box
      sx={{
        bgcolor: CARD_BG,
        border: BORDER,
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
      {selectedIds.length > 0 && (
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
            bgcolor: PRIMARY,
            color: '#ffffff',
            px: 2,
            py: 1.25
          }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Đã chọn {selectedIds.length} báo cáo</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button size="small" variant="contained" onClick={() => onOpenResolveModal(rows[0] || null)} sx={{ bgcolor: '#ffffff', color: PRIMARY, boxShadow: 'none', textTransform: 'none', '&:hover': { bgcolor: '#EFF6FF', boxShadow: 'none' } }}>
              Xử lý tất cả
            </Button>
            <Button size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.72)', color: '#ffffff', textTransform: 'none' }}>
              Bỏ qua tất cả
            </Button>
            <Button size="small" onClick={() => onToggleSelectAll(false)} sx={{ color: '#ffffff', textTransform: 'none' }}>
              Bỏ chọn
            </Button>
          </Stack>
        </Stack>
      )}

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1180 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={headerCellSx}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(event) => onToggleSelectAll(event.target.checked)}
                  size="small"
                />
              </TableCell>
              <TableCell sx={headerCellSx}>Đối tượng bị báo cáo</TableCell>
              <TableCell sx={headerCellSx}>Loại</TableCell>
              <TableCell sx={headerCellSx}>Lý do vi phạm</TableCell>
              <TableCell sx={headerCellSx}>Số lần báo cáo</TableCell>
              <TableCell sx={headerCellSx}>Người báo cáo gần nhất</TableCell>
              <TableCell sx={headerCellSx}>Thời gian</TableCell>
              <TableCell sx={headerCellSx}>Mức độ</TableCell>
              <TableCell sx={headerCellSx}>Trạng thái</TableCell>
              <TableCell sx={headerCellSx} align="right">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const isSelectedRow = row.id === selectedRowId
              const isChecked = selectedIds.includes(row.id)
              return (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowSelect(row.id)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: isSelectedRow ? '#E6F1FB' : '#ffffff',
                    '&:hover': { bgcolor: '#F0F9FF' },
                    '& td:first-of-type': {
                      borderLeft: row.severity === 'Nghiêm trọng' ? '2px solid #E24B4A' : isSelectedRow ? '2px solid #20a9e7' : '2px solid transparent'
                    }
                  }}>
                  <TableCell padding="checkbox" sx={bodyCellSx} onClick={(event) => event.stopPropagation()}>
                    <Checkbox checked={isChecked} onChange={() => onToggleSelectOne(row.id)} size="small" />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      {row.subjectType === 'Bài đăng' ? (
                        <Box component="img" src={row.subjectImage} alt={row.subjectTitle} sx={{ width: 36, height: 36, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#E6F1FB', color: '#0C447C', fontSize: 13 }}>{row.subjectTitle.slice(0, 2).toUpperCase()}</Avatar>
                      )}
                      <Typography sx={{ fontSize: 13, lineHeight: 1.4 }} noWrap>
                        {row.subjectTitle}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Chip label={row.subjectType} sx={pillSx(SUBJECT_TYPE_STYLES[row.subjectType])} />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ maxWidth: 180 }} noWrap>
                      {row.reason}
                    </Typography>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ fontWeight: row.reportCount >= 10 ? 700 : 600, color: getCountColor(row.reportCount) }}>{row.reportCount}</Typography>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#DBEAFE', color: '#1D4ED8' }}>{row.lastReporter.initials}</Avatar>
                      <Typography sx={{ fontSize: 13 }}>{row.lastReporter.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>{row.timeAgo}</TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Chip label={row.severity} sx={pillSx(SEVERITY_STYLES[row.severity])} />
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Chip label={row.status} sx={pillSx(STATUS_STYLES[row.status])} />
                  </TableCell>
                  <TableCell sx={bodyCellSx} align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end" onClick={(event) => event.stopPropagation()}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" onClick={() => onRowSelect(row.id)} sx={{ color: PRIMARY }}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xử lý">
                        <IconButton size="small" onClick={() => onOpenResolveModal(row)} sx={{ color: '#27500A' }}>
                          <GppGoodOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Bỏ qua">
                        <IconButton size="small" sx={{ color: '#6B7280', '&:hover': { color: '#E24B4A', bgcolor: '#FEF2F2' } }}>
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5} sx={{ px: 2, py: 1.5 }}>
        <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Hiển thị {start}-{end} trong {totalCount} báo cáo</Typography>
        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton size="small" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
            {Array.from({ length: Math.min(pageCount, 4) }, (_, index) => index).map((pageIndex) => (
              <Button
                key={pageIndex}
                size="small"
                onClick={() => onPageChange(pageIndex)}
                sx={{
                  minWidth: 34,
                  borderRadius: '8px',
                  textTransform: 'none',
                  bgcolor: pageIndex === page ? '#E6F1FB' : 'transparent',
                  color: pageIndex === page ? PRIMARY : '#374151'
                }}>
                {pageIndex + 1}
              </Button>
            ))}
            <IconButton size="small" disabled={page >= pageCount - 1} onClick={() => onPageChange(page + 1)}>
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Mỗi trang</Typography>
            <Select size="small" value={rowsPerPage} onChange={(event) => onRowsPerPageChange(Number(event.target.value))} sx={{ minWidth: 74, height: 32, borderRadius: '8px', '& .MuiOutlinedInput-notchedOutline': { border: BORDER } }}>
              {[8, 16, 32].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ViolationReportsTable
