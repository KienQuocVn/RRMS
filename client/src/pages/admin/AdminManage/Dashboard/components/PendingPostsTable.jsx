import { Box, Button, Chip, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Link as RouterLink } from 'react-router-dom'
import { DASHBOARD_COLORS } from '../constants/dashboardTheme'
import { formatPostPrice } from '../hooks/useDashboardData'
import DashboardCard from './DashboardCard'

const PendingPostsTable = ({ posts = [], onApprove, onReject }) => (
  <DashboardCard noPadding sx={{ height: '100%' }}>
    <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: DASHBOARD_COLORS.textDark }}>
        Bài đăng chờ duyệt gần đây
      </Typography>
    </Box>
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {['Tiêu đề', 'Chủ trọ', 'Địa chỉ', 'Giá', 'Ngày đăng', 'Hành động'].map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: DASHBOARD_COLORS.textMuted,
                  textTransform: 'uppercase',
                  borderBottom: `0.5px solid ${DASHBOARD_COLORS.border}`,
                  whiteSpace: 'nowrap'
                }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ py: 4, textAlign: 'center', color: DASHBOARD_COLORS.textMuted }}>
                Không có bài đăng chờ duyệt
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.bulletinBoardId} hover>
                <TableCell sx={{ fontSize: 13, maxWidth: 180 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, noWrap: true }} noWrap>
                    {post.title || '—'}
                  </Typography>
                  <Chip
                    label="Chờ duyệt"
                    size="small"
                    sx={{
                      mt: 0.5,
                      height: 20,
                      fontSize: 10,
                      bgcolor: 'rgba(239, 159, 39, 0.15)',
                      color: DASHBOARD_COLORS.warningChart,
                      border: 'none'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                  {post.account?.username || post.account?.fullName || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13, maxWidth: 160 }} noWrap>
                  {post.address || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatPostPrice(post)}
                </TableCell>
                <TableCell sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                  {post.moveInDate
                    ? new Date(post.moveInDate).toLocaleDateString('vi-VN')
                    : '—'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CheckIcon sx={{ fontSize: 14 }} />}
                      onClick={() => onApprove(post.bulletinBoardId)}
                      sx={{
                        textTransform: 'none',
                        fontSize: 12,
                        minWidth: 0,
                        px: 1.5,
                        bgcolor: DASHBOARD_COLORS.primary,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: DASHBOARD_COLORS.primaryHover, boxShadow: 'none' }
                      }}>
                      Duyệt
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                      onClick={() => onReject(post.bulletinBoardId)}
                      sx={{
                        textTransform: 'none',
                        fontSize: 12,
                        minWidth: 0,
                        px: 1.5,
                        borderColor: DASHBOARD_COLORS.danger,
                        color: DASHBOARD_COLORS.danger,
                        '&:hover': { borderColor: DASHBOARD_COLORS.danger, bgcolor: 'rgba(226, 75, 74, 0.04)' }
                      }}>
                      Từ chối
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
    <Box sx={{ px: 2.5, py: 1.5, textAlign: 'right', borderTop: `0.5px solid ${DASHBOARD_COLORS.border}` }}>
      <Link
        component={RouterLink}
        to="/adminManage/manage-posts/list"
        sx={{
          fontSize: 13,
          color: DASHBOARD_COLORS.primary,
          textDecoration: 'none',
          fontWeight: 500,
          '&:hover': { color: DASHBOARD_COLORS.primaryHover }
        }}>
        Xem tất cả →
      </Link>
    </Box>
  </DashboardCard>
)

export default PendingPostsTable
