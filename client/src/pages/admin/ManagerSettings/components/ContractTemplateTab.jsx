import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const ContractTemplateTab = ({ templatecontracts, motel, setSelectedTemplateId, handleDelete }) => {
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Danh sách các mẫu hợp đồng</Typography>
          <Typography variant="body2" color="text.secondary">Mẫu hợp đồng được sử dụng khi in dựa trên những thông tin bạn nhập</Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          sx={{ minWidth: 0, width: 48, height: 48, borderRadius: '50%', p: 0, bgcolor: '#20a9e7' }}
          onClick={() => setSelectedTemplateId('Create')}
        >
          <AddIcon />
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên mẫu hợp đồng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nhà đang áp dụng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 150 }}>Thứ tự sắp xếp</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 100, textAlign: 'center' }}>Chỉnh sửa</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 100, textAlign: 'center' }}>Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templatecontracts && templatecontracts.length > 0 ? (
              templatecontracts.map((tc, i) => (
                <TableRow key={i}>
                  <TableCell>{tc.templatename}</TableCell>
                  <TableCell>{motel?.motelName}</TableCell>
                  <TableCell>{tc.sortOrder}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      sx={{ border: '1px solid #e0e0e0', borderRadius: '50%' }}
                      onClick={() => setSelectedTemplateId(tc.contractTemplateId)}
                    >
                      <EditOutlinedIcon fontSize="small" sx={{ color: '#555' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      sx={{ border: '1px solid #f8bbd0', bgcolor: '#ffebee', borderRadius: '50%', color: '#d32f2f', '&:hover': { bgcolor: '#ffcdd2' } }}
                      onClick={() => handleDelete(tc.contractTemplateId)}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContractTemplateTab;
