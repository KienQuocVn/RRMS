/* eslint-disable react-hooks/exhaustive-deps */
import FirstPageIcon from '@mui/icons-material/FirstPage'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import LastPageIcon from '@mui/icons-material/LastPage'
import StartIcon from '@mui/icons-material/Start'
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { introspect } from '~/apis/accountAPI'
import { getRatingHistory } from '~/apis/bulletinBoardReviewsAPI'

const RatingHistory = ({ setIsAdmin }) => {
  const { t } = useTranslation()
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  function TablePaginationActions(props) {
    const theme = useTheme()
    const { count, page: currentPage, rowsPerPage: currentRowsPerPage, onPageChange } = props

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0)
    }

    const handleBackButtonClick = (event) => {
      onPageChange(event, currentPage - 1)
    }

    const handleNextButtonClick = (event) => {
      onPageChange(event, currentPage + 1)
    }

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / currentRowsPerPage) - 1))
    }

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton onClick={handleFirstPageButtonClick} disabled={currentPage === 0} aria-label="first page">
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={currentPage === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={currentPage >= Math.ceil(count / currentRowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={currentPage >= Math.ceil(count / currentRowsPerPage) - 1}
          aria-label="last page"
        >
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    setIsAdmin(false)
    introspect().then((res) => {
      getRatingHistory(res.data.issuer).then((response) => {
        const newRows = Array.from(response.result).map((item) => ({
          nameRoom: item.bulletinBoard.title,
          typeRoom: item.bulletinBoard.rentalCategory,
          address: item.bulletinBoard.address,
          price: item.bulletinBoard.rentPrice,
          roomArea: item.bulletinBoard.area,
          available: item.bulletinBoard.status,
          isActive: item.bulletinBoard.isActive,
          bulletinBoardId: item.bulletinBoard.bulletinBoardId,
          rating: item.rating,
          content: item.content,
          bulletinBoardImages: item.bulletinBoardImages?.[0]?.imageLink || ''
        }))
        setRows(newRows)
      })
    })
  }, [])

  const visibleRows = rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mx: { xs: 2, md: 8 }, my: 3 }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        {t('ratingHistory.title')}
      </Typography>
      <TableContainer component={Paper} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Table stickyHeader sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  textAlign: 'center'
                }
              }}
            >
              <TableCell>{t('ratingHistory.columns.index')}</TableCell>
              <TableCell>{t('ratingHistory.columns.roomName')}</TableCell>
              <TableCell>{t('ratingHistory.columns.image')}</TableCell>
              <TableCell>{t('ratingHistory.columns.roomType')}</TableCell>
              <TableCell>{t('ratingHistory.columns.address')}</TableCell>
              <TableCell>{t('ratingHistory.columns.price')}</TableCell>
              <TableCell>{t('ratingHistory.columns.area')}</TableCell>
              <TableCell>{t('ratingHistory.columns.availability')}</TableCell>
              <TableCell>{t('ratingHistory.columns.approval')}</TableCell>
              <TableCell>{t('ratingHistory.columns.comment')}</TableCell>
              <TableCell>{t('ratingHistory.columns.rating')}</TableCell>
              <TableCell>{t('ratingHistory.columns.action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              flex: 1,
              overflow: 'auto'
            }}
          >
            {visibleRows.map((row, index) => (
              <TableRow
                hover
                key={row.bulletinBoardId}
                sx={{
                  '& .MuiTableCell-root': {
                    textAlign: 'center'
                  }
                }}
              >
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {row.nameRoom}
                </TableCell>
                <TableCell>
                  {row.bulletinBoardImages ? (
                    <img width={100} src={row.bulletinBoardImages} alt={row.nameRoom} />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      {t('detail.item.noImage')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{row.typeRoom}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {row.address}
                </TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.roomArea}</TableCell>
                <TableCell>
                  <Chip
                    variant="outlined"
                    sx={{ color: row.available ? '#7bed9f' : '#ff6b81' }}
                    label={row.available ? t('ratingHistory.availability.available') : t('ratingHistory.availability.rented')}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    variant="outlined"
                    sx={{ color: row.isActive ? '#7bed9f' : '#ff6b81' }}
                    label={row.isActive ? t('ratingHistory.approval.approved') : t('ratingHistory.approval.pending')}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 150,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {row.content}
                </TableCell>
                <TableCell>
                  <Rating name={`rating-${row.bulletinBoardId}`} value={row.rating} readOnly />
                </TableCell>
                <TableCell>
                  <Link to={`/detail/${row.bulletinBoardId}`} aria-label={t('ratingHistory.columns.action')}>
                    <StartIcon />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: t('ratingHistory.all'), value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': t('ratingHistory.rowsPerPage')
                    }
                  }
                }}
                labelRowsPerPage={t('ratingHistory.rowsPerPage')}
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
    </Box>
  )
}

export default RatingHistory
