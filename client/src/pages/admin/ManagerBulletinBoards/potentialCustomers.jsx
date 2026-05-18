import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';

const mockData = [
  { id: 1, name: 'Hạnh', phone: '0774-177-324', price: '2.000.000 đ - 3.000.000 đ', area: 'Không yêu cầu', type: 'Nhà trọ', date: '01/06/2026', status: 'Yêu cầu mới', supportStatus: 'Đã liên hệ qua zalo', hasContacted: true },
  { id: 2, name: 'Quốc Bảo', phone: '0829-902-220', price: '3.000.000 đ - 4.000.000 đ', area: 'Không yêu cầu', type: 'Nhà trọ', date: '09/05/2026', status: 'Yêu cầu mới', supportStatus: 'Chưa hỗ trợ', hasContacted: false },
  { id: 3, name: 'kiệt', phone: '0372-797-115', price: '2.000.000 đ - 3.000.000 đ', area: 'Không yêu cầu', type: 'Nhà trọ', date: '03/05/2026', status: 'Yêu cầu mới', supportStatus: 'Chưa hỗ trợ', hasContacted: false },
  { id: 4, name: 'Hồng Tâm', phone: '0528-463-633', price: '2.000.000 đ - 3.000.000 đ', area: 'Không yêu cầu', type: 'Nhà trọ', date: '09/04/2026', status: 'Yêu cầu mới', supportStatus: 'Chưa hỗ trợ', hasContacted: false },
  { id: 5, name: 'En En', phone: '0374-329-846', price: '3.000.000 đ - 4.000.000 đ', area: 'Không yêu cầu', type: 'Nhà trọ', date: '30/05/2026', status: 'Yêu cầu mới', supportStatus: 'Chưa hỗ trợ', hasContacted: false },
  { id: 6, name: 'nguyengiamanh', phone: '0879-259-805', price: '2.000.000 đ - 3.000.000 đ', area: 'Không yêu cầu', type: 'Nhà trọ', date: '17/03/2026', status: 'Yêu cầu mới', supportStatus: 'Chưa hỗ trợ', hasContacted: false },
  { id: 7, name: 'Venus Sama', phone: '0376-570-552', price: '3.000.000 đ - 3.000.000 đ', area: '25 m2 - 25 m2', type: 'Nhà trọ', date: '23/02/2026', status: 'Yêu cầu mới', supportStatus: 'Chưa hỗ trợ', hasContacted: false },
  { id: 8, name: 'Thư', phone: '0988-592-346', price: '2.000.000 đ - 3.000.000 đ', area: 'Không yêu cầu', type: 'Nhà trọ', date: '01/04/2026', status: 'Yêu cầu mới', supportStatus: 'Chưa hỗ trợ', hasContacted: false },
];

const Customer = () => {
  return (
    <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0', boxShadow: 'none', borderRadius: 0, overflowX: 'auto' }}>
      <Table sx={{ minWidth: 1000 }} aria-label="customer table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Giá yêu cầu</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Diện tích yêu cầu</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Loại hình</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày yêu cầu</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tình trạng hỗ trợ</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Liên hệ</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', width: '80px', lineHeight: 1.2 }}>Tôi đã<br/>liên lạc</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Xóa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#fdfdfd' } }}>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '120px' }}>
                  <Avatar sx={{ bgcolor: '#d9534f', width: 32, height: 32 }}>
                    <StorefrontIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {row.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 500 }}>{row.phone}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '150px' }}>{row.price}</TableCell>
              <TableCell align="center">{row.area}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 500 }}>{row.type}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: '#e67e22', minWidth: '100px' }}>{row.date}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 500 }}>{row.status}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 500 }}>{row.supportStatus}</TableCell>
              <TableCell align="center">
                <Avatar sx={{ bgcolor: '#0084FF', width: 36, height: 36, fontSize: '0.7rem', cursor: 'pointer', margin: 'auto', fontWeight: 'bold' }}>
                  Zalo
                </Avatar>
              </TableCell>
              <TableCell align="center">
                <IconButton size="small" sx={{ bgcolor: '#198754', color: '#fff', '&:hover': { bgcolor: '#157347' }, width: 32, height: 32 }}>
                  <CheckIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton size="small" sx={{ bgcolor: '#dc3545', color: '#fff', '&:hover': { bgcolor: '#bb2d3b' }, width: 32, height: 32 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Customer;
