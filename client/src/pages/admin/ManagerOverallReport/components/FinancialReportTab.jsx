import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Grid
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { env } from '~/configs/environment'

const FinancialReportTab = ({ username }) => {
  const [houses, setHouses] = useState([])
  const [selectedHouse, setSelectedHouse] = useState('')
  const [transactions, setTransactions] = useState([])
  const [totalInvoices, setTotalInvoices] = useState(0)
  const [totalRoomPrices, setTotalRoomPrices] = useState(0)

  const formatCurrency = (value) => {
    if (value == null) return '0 đ'
    return value.toLocaleString('vi-VN') + ' đ'
  }

  useEffect(() => {
    const fetchInvoid = async () => {
      const userData = JSON.parse(sessionStorage.getItem('user'))
      const token = userData?.token
      if (!token || !username) return

      try {
        const housesResponse = await axios.get(`${env.API_URL}/api/v1/motels/account/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (housesResponse.data.result) {
          setHouses(housesResponse.data.result)
          fetchTransactions(username)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchInvoid()
  }, [username])

  const fetchTransactions = async (username) => {
    const userData = JSON.parse(sessionStorage.getItem('user'))
    const token = userData?.token
    try {
      const response = await axios.get(`${env.API_URL}/api/v1/transactions/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(response.data?.result?.items || [])
    } catch (err) {
      console.error(err)
    }
  }

  const filteredTransactions = {
    thu: transactions.filter((t) => t.transactionType === true),
    chi: transactions.filter((t) => t.transactionType === false)
  }

  const fetchDepositData = async (motelId) => {
    const userData = JSON.parse(sessionStorage.getItem('user'))
    const token = userData?.token
    try {
      const depositResponse = await axios.get(`${env.API_URL}/api/v1/reports/${motelId}/deposits`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const reserveResponse = await axios.get(`${env.API_URL}/api/v1/reports/${motelId}/reserve-deposits`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return {
        totalDeposit: depositResponse.data?.result || 0,
        totalReserveDeposit: reserveResponse.data?.result || 0
      }
    } catch (err) {
      return { totalDeposit: 0, totalReserveDeposit: 0 }
    }
  }

  const FetchDepositData = ({ motelId }) => {
    const [val, setVal] = useState(0)
    useEffect(() => {
      fetchDepositData(motelId).then((data) => setVal(data.totalDeposit))
    }, [motelId])
    return <span>{formatCurrency(val)}</span>
  }

  const FetchReserveDepositData = ({ motelId }) => {
    const [val, setVal] = useState(0)
    useEffect(() => {
      fetchDepositData(motelId).then((data) => setVal(data.totalReserveDeposit))
    }, [motelId])
    return <span>{formatCurrency(val)}</span>
  }

  useEffect(() => {
    const fetchFinancialData = async (motelId) => {
      const userData = JSON.parse(sessionStorage.getItem('user'))
      const token = userData?.token
      try {
        const invoicesResponse = await axios.get(`${env.API_URL}/api/v1/reports/${motelId}/total-paid-invoices`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const roomPriceResponse = await axios.get(`${env.API_URL}/api/v1/reports/${motelId}/total-paid-room-price`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTotalInvoices(invoicesResponse.data?.result || 0)
        setTotalRoomPrices(roomPriceResponse.data?.result || 0)
      } catch (err) {
        console.error(err)
      }
    }
    if (selectedHouse) fetchFinancialData(selectedHouse)
    else {
      setTotalInvoices(0)
      setTotalRoomPrices(0)
    }
  }, [selectedHouse])

  // Total thu, chi from filteredTransactions for demonstration
  const totalThuAmount = filteredTransactions.thu.reduce((acc, curr) => acc + curr.amount, 0) || 5300000
  const totalChiAmount = filteredTransactions.chi.reduce((acc, curr) => acc + curr.amount, 0) || 0
  const profit = totalThuAmount - totalChiAmount

  return (
    <Box>
      {/* Thống kê khoản thu */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Thống kê các khoản thu của nhà cho thuê
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Thông tin về các khoản tiền thu vào như tiền phòng, dịch vụ....
          </Typography>
        </Box>
        <Paper variant="outlined">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Tên nhà cho thuê
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Tổng số tiền cọc
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Tổng số tiền cọc giữ chân
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Tổng số tiền khách đang nợ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {houses.map((house) => (
                <TableRow key={house.motelId}>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {house.motelName}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    <FetchDepositData motelId={house.motelId} />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    <FetchReserveDepositData motelId={house.motelId} />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Thống kê dịch vụ */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Thống kê dịch vụ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Mức sử dụng, chỉ số tiêu thụ trong các nhà cho thuê
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select defaultValue="" displayEmpty>
                <MenuItem value="">Tất cả nhà cho thuê</MenuItem>
                {houses.map((h) => (
                  <MenuItem key={h.motelId} value={h.motelId}>
                    {h.motelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['month', 'year']}
                defaultValue={dayjs()}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Paper variant="outlined">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold', borderRight: '1px solid #eee' }}>
                  Tiền điện (Người) (Người)
                </TableCell>
                <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold', borderRight: '1px solid #eee' }}>
                  Tiền nước (Tháng)
                </TableCell>
                <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold', borderRight: '1px solid #eee' }}>
                  Tiền rác (người) (Người)
                </TableCell>
                <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold' }}>
                  Tiền wifi (Tháng)
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: '#fdfdfd' }}>
                <TableCell align="center">Mức sử dụng</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #eee' }}>
                  Tổng tiền
                </TableCell>
                <TableCell align="center">Mức sử dụng</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #eee' }}>
                  Tổng tiền
                </TableCell>
                <TableCell align="center">Mức sử dụng</TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid #eee' }}>
                  Tổng tiền
                </TableCell>
                <TableCell align="center">Mức sử dụng</TableCell>
                <TableCell align="center">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  3
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid #eee' }}>
                  5.100 đ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  3
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid #eee' }}>
                  54.000 đ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  3
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid #eee' }}>
                  45.000 đ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  2
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  100.000 đ
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Thống kê thu chi */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Thống kê các khoản thu, chi của nhà cho thuê
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Thông tin về các khoản tiền thu và chi như tiền phòng, dịch vụ....
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <FormControl size="small" sx={{ width: 250 }}>
            <Select value={selectedHouse} onChange={(e) => setSelectedHouse(e.target.value)} displayEmpty>
              <MenuItem value="">Tất cả nhà cho thuê</MenuItem>
              {houses.map((h) => (
                <MenuItem key={h.motelId} value={h.motelId}>
                  {h.motelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 150 }}>
            <Select defaultValue="month">
              <MenuItem value="date">Theo ngày</MenuItem>
              <MenuItem value="month">Theo tháng</MenuItem>
              <MenuItem value="year">Theo năm</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker views={['month', 'year']} defaultValue={dayjs()} slotProps={{ textField: { size: 'small' } }} />
          </LocalizationProvider>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                bgcolor: '#76b852',
                color: 'white',
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minHeight: '100px'
              }}>
              <TrendingUpIcon fontSize="large" sx={{ opacity: 0.8 }} />
              <Box>
                <Typography variant="body2">Tổng thu</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalThuAmount)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                bgcolor: '#f39c12',
                color: 'white',
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minHeight: '100px'
              }}>
              <TrendingDownIcon fontSize="large" sx={{ opacity: 0.8 }} />
              <Box>
                <Typography variant="body2">Tổng chi</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalChiAmount)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                bgcolor: '#2ecc71',
                color: 'white',
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minHeight: '100px'
              }}>
              <AttachMoneyIcon fontSize="large" sx={{ opacity: 0.8 }} />
              <Box>
                <Typography variant="body2">Lợi nhuận</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(profit)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Chi tiết khoản thu và chi */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Chi tiết tất cả các khoản thu
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Thông tin về các khoản tiền thu vào...
            </Typography>
          </Box>
          {filteredTransactions.thu.length > 0 ? (
            <Paper variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nội dung</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Tổng tiền thu
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.thu.map((t) => (
                    <TableRow key={t.transactionId}>
                      <TableCell>{t.paymentDescription}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Paper variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Nội dung
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Tổng tiền thu
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">Thu tiền tháng đầu tiên</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      5.300.000đ
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Chi tiết tất cả các khoản chi
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Thông tin về các khoản tiền chi ra...
            </Typography>
          </Box>
          {filteredTransactions.chi.length > 0 ? (
            <Paper variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nội dung</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Tổng tiền chi
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.chi.map((t) => (
                    <TableRow key={t.transactionId}>
                      <TableCell>{t.paymentDescription}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: '#c0392b' }}>
                        {formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Alert
              severity="error"
              sx={{ backgroundColor: '#fadbd8', color: '#c0392b', '& .MuiAlert-icon': { display: 'none' } }}>
              Chưa có phiếu chi nào
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default FinancialReportTab
