import  { useEffect, useState } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import { env } from '~/configs/environment';

const RentalStatusTab = ({ username }) => {
  const [houses, setHouses] = useState([]);
  const [roomCounts, setRoomCounts] = useState([]);
  const [tenantSummaries, setTenantSummaries] = useState([]);
  const [error, setError] = useState(null);
  const [selectedHouseForContract, setSelectedHouseForContract] = useState('');

  useEffect(() => {
    const fetchTotalRooms = async () => {
      const userData = JSON.parse(sessionStorage.getItem('user'));
      const token = userData?.token;
      if (!token || !username) {
        setError('Token hoặc username không tồn tại');
        return;
      }

      try {
        const housesResponse = await axios.get(`${env.API_URL}/api/v1/motels/account/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedHouses = await Promise.all(
          housesResponse.data.result.map(async (house) => {
            const totalRoomsResponse = await axios.get(
              `${env.API_URL}/api/v1/reports/total-rooms?motelId=${house.motelId}&username=${username}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const totalRooms = totalRoomsResponse.data?.result || 0;

            const totalTenantsResponse = await axios.get(
              `${env.API_URL}/api/v1/reports/${house.motelId}/tenants/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const totalTenants = totalTenantsResponse.data?.result || 0;

            return {
              ...house,
              totalRooms: totalRooms,
              totalTenants: totalTenants,
            };
          })
        );

        const roomCountsResponse = await axios.get(`${env.API_URL}/api/v1/reports/room-counts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tenantSummaryResponse = await axios.get(`${env.API_URL}/api/v1/reports/tenant/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (housesResponse.data.result) {
          setHouses(updatedHouses);
          setRoomCounts(roomCountsResponse.data?.result || []);
          setTenantSummaries(tenantSummaryResponse.data?.result || []);
        } else {
          alert('lỗi');
        }
      } catch (err) {
        setError('Failed to fetch total rooms');
        console.error(err);
      }
    };

    fetchTotalRooms();
  }, [username]);

  const calcTotal = (field) => {
    return houses.reduce((acc, house) => {
      if (field === 'totalRooms') return acc + house.totalRooms;
      const countData = roomCounts.find((rc) => rc.motelId === house.motelId);
      if (!countData) return acc;
      return acc + (countData[field] || 0);
    }, 0);
  };

  const totalRoomsAll = calcTotal('totalRooms');
  const totalNoContract = calcTotal('noContractCount');
  const totalActive = calcTotal('activeCount');
  const totalReserved = calcTotal('reservedCount');
  const totalDebt = 0; // Đang nợ không có trong api data
  const totalEnded = calcTotal('endedCount');
  const totalExpiring = calcTotal('iatExpireCount');

  const calcPercent = (val, total) => {
    if (total === 0) return '0%';
    return ((val / total) * 100).toFixed(2) + '%';
  };

  return (
    <Box>
      {/* Tình trạng các nhà cho thuê */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Tình trạng các nhà cho thuê</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Thông tin về số phòng đang ở, đang nợ, đang cọc....
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên nhà cho thuê</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tổng phòng</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Có thể cho thuê</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đang thuê</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đang cọc giữ phòng</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đang nợ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Báo kết thúc</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Sắp kết thúc</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quá hạn hợp đồng</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Hợp đồng đã liên kết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {houses.map((house) => {
                const countData = roomCounts.find((rc) => rc.motelId === house.motelId) || {};
                const totalRooms = house.totalRooms || 0;
                return (
                  <TableRow key={house.motelId}>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{house.motelName}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{totalRooms}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 'bold' }}>{countData.noContractCount || 0}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: '#2ecc71' }}>({calcPercent(countData.noContractCount || 0, totalRooms)})</Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 'bold' }}>{countData.activeCount || 0}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: '#2ecc71' }}>({calcPercent(countData.activeCount || 0, totalRooms)})</Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 'bold' }}>{countData.reservedCount || 0}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: '#2ecc71' }}>({calcPercent(countData.reservedCount || 0, totalRooms)})</Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 'bold' }}>0</Box>
                      <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>(0%)</Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 'bold' }}>{countData.endedCount || 0}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>({calcPercent(countData.endedCount || 0, totalRooms)})</Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 'bold' }}>{countData.iatExpireCount || 0}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>({calcPercent(countData.iatExpireCount || 0, totalRooms)})</Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 'bold' }}>0</Box>
                      <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>(0%)</Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>0</TableCell>
                  </TableRow>
                );
              })}
              <TableRow sx={{ backgroundColor: '#e8f8f5' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tổng cộng</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{totalRoomsAll}</TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 'bold' }}>{totalNoContract}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#2ecc71' }}>({calcPercent(totalNoContract, totalRoomsAll)})</Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 'bold' }}>{totalActive}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#2ecc71' }}>({calcPercent(totalActive, totalRoomsAll)})</Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 'bold' }}>{totalReserved}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#2ecc71' }}>({calcPercent(totalReserved, totalRoomsAll)})</Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 'bold' }}>{totalDebt}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>(0%)</Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 'bold' }}>{totalEnded}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>({calcPercent(totalEnded, totalRoomsAll)})</Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 'bold' }}>{totalExpiring}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>({calcPercent(totalExpiring, totalRoomsAll)})</Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ fontWeight: 'bold' }}>0</Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#e74c3c' }}>(0%)</Box>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Hợp đồng sắp kết thúc */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Hợp đồng sắp kết thúc</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Hợp đồng báo kết thúc, sắp hết hạn.
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={selectedHouseForContract}
              onChange={(e) => setSelectedHouseForContract(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Tất cả nhà cho thuê</MenuItem>
              {houses.map((h) => (
                <MenuItem key={h.motelId} value={h.motelId}>{h.motelName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Alert severity="error" sx={{ backgroundColor: '#fadbd8', color: '#c0392b', '& .MuiAlert-icon': { display: 'none' } }}>
          Không có hợp đồng nào sắp kết thúc
        </Alert>
      </Box>

      {/* Tình trạng khách thuê */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ borderLeft: '4px solid #2ecc71', pl: 2, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Tình trạng khách thuê</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Tổng khách thuê, số khách thuê đã ghi nhận giấy tờ, khai báo tạm trú
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên nhà cho thuê</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tổng khách thuê hiện tại</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số người chưa đăng ký tạm trú</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số người chưa đủ thông tin liên lạc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {houses.map((house) => {
                const ts = tenantSummaries.find((t) => t.motelId === house.motelId) || {};
                return (
                  <TableRow key={house.motelId}>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{house.motelName}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{house.totalTenants}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{ts.temporaryResidenceCount || 0}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{ts.verifiedInformationCount || 0}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default RentalStatusTab;
