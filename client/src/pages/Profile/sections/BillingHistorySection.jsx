import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import ProfileSectionCard from './ProfileSectionCard'

function BillingHistorySection({ rows, page, rowsPerPage, emptyRows, pagination }) {
  const visibleRows = rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows

  return (
    <ProfileSectionCard
      title="Lịch sử chi tiêu"
      description="Theo dõi các giao dịch gần đây để quản lý chi tiêu minh bạch hơn."
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: 'rgba(148, 163, 184, 0.18)',
          boxShadow: 'none'
        }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="billing history table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Hạng mục</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Giá trị
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Chỉ số
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <Typography sx={{ fontWeight: 600, color: '#344054' }}>{row.name}</Typography>
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>{pagination}</TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </ProfileSectionCard>
  )
}

export default BillingHistorySection
