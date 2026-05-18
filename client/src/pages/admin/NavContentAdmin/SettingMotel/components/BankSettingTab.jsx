import  { useState } from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Grid, FormControl, InputLabel, Select, MenuItem, Button, Card, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const BankSettingTab = () => {
  const [hasAccount, setHasAccount] = useState(false);
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [syncAll, setSyncAll] = useState(false);

  const handleSave = () => {
    if (bankName && accountName && accountNumber) {
      setHasAccount(true);
    } else {
      alert('Vui lòng điền các trường bắt buộc (*)');
    }
  };

  const handleCancel = () => {
    setHasAccount(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Cài đặt ngân hàng</Typography>
        <Typography variant="body2" color="textSecondary">
          Dùng để hiển thị trên hóa đơn, mã xóa mã QR giúp khách thuê thanh toán chuyển khoản cho bạn dễ dàng hơn
        </Typography>
      </Box>

      {!hasAccount ? (
        // Premium Dashed Add Button Card
        <Card 
          variant="outlined" 
          onClick={() => setHasAccount(true)}
          sx={{ 
            border: '2px dashed rgb(46 166 204 / 40%)',
            borderRadius: 3,
            bgcolor: 'rgba(46, 204, 113, 0.01)',
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease-on-out',
            '&:hover': {
              bgcolor: 'rgba(46, 204, 113, 0.05)',
              borderColor: '#20a9e7',
              boxShadow: '0 4px 20px rgba(46, 204, 113, 0.12)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                bgcolor: 'rgba(46, 204, 113, 0.1)', 
                color: '#20a9e7', 
                borderRadius: '50%', 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AddIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#20a9e7' }}>
              Thêm tài khoản ngân hàng
            </Typography>
          </Box>
        </Card>
      ) : (
        // Complete Form Fields Card
        <Card variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceIcon sx={{ color: '#20a9e7' }} /> Thiết lập thông tin ngân hàng
            </Typography>
            <Button size="small" onClick={handleCancel} startIcon={<CloseIcon />} color="inherit">
              Hủy
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Tên ngân hàng */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="bank-name-label">Tên ngân hàng *</InputLabel>
                <Select
                  labelId="bank-name-label"
                  value={bankName}
                  label="Tên ngân hàng *"
                  onChange={(e) => setBankName(e.target.value)}
                >
                  <MenuItem value="Vietcombank">Vietcombank - Ngân hàng Ngoại thương Việt Nam</MenuItem>
                  <MenuItem value="BIDV">BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam</MenuItem>
                  <MenuItem value="Techcombank">Techcombank - Ngân hàng Kỹ thương Việt Nam</MenuItem>
                  <MenuItem value="Agribank">Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam</MenuItem>
                  <MenuItem value="ACB">ACB - Ngân hàng Á Châu</MenuItem>
                  <MenuItem value="MB">MB Bank - Ngân hàng Quân đội</MenuItem>
                  <MenuItem value="TPBank">TPBank - Ngân hàng Tiên Phong</MenuItem>
                  <MenuItem value="VPBank">VPBank - Ngân hàng Thịnh Vượng</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Chi nhánh */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chi nhánh ngân hàng"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* Subheading */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2c3e50', mb: -1 }}>
                Thông tin tài khoản
              </Typography>
            </Grid>

            {/* Tên chủ tài khoản */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên chủ tài khoản *"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            {/* Số tài khoản */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số tài khoản *"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            {/* Đồng bộ tất cả nhà trọ */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={syncAll} 
                    onChange={(e) => setSyncAll(e.target.checked)} 
                    color="success" 
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                      Đồng bộ tất cả nhà trọ
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                      Đồng bộ thông tin ngân hàng nay cho tất cả các nhà trọ khác trong cùng hệ thống
                    </Typography>
                  </Box>
                }
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleCancel}
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                >
                  Quay lại
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                  sx={{ bgcolor: '#20a9e7', '&:hover': { bgcolor: '#20a9e7' }, textTransform: 'none' }}
                >
                  Lưu cài đặt
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
};

export default BankSettingTab;
