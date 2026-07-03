import { useState } from 'react';
import { Box, Typography, TextField, Switch, Grid, Divider } from '@mui/material';

const CustomerAppTab = () => {
  const [autoAccount, setAutoAccount] = useState(true);
  const [defaultPassword, setDefaultPassword] = useState('123456789');
  const [electricWaterMeter, setElectricWaterMeter] = useState(true);
  const [personalInfo, setPersonalInfo] = useState(true);
  const [vehicleInfo, setVehicleInfo] = useState(true);
  const [endContract, setEndContract] = useState(true);

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Thiết lập cho App khách thuê/dân cư</Typography>
        <Typography variant="body2" color="textSecondary">
          Những thiết lập cho khách thuê khi sử dụng App khách thuê kết nối với chủ nhà
        </Typography>
      </Box>

      {/* Account Auto-creation Section */}
      <Grid container spacing={4} alignItems="flex-start" sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ pr: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Tự tạo tài khoản cho khách thuê</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1, whiteSpace: 'pre-line', fontSize: '13px', lineHeight: '1.6' }}>
                Tự tạo tài khoản đăng nhập vào App khách thuê khi lập hợp đồng.{'\n'}
                Tài khoản là số điện thoại dùng cho lập hợp đồng.{'\n'}
                Mật khẩu mặc định vui lòng nhập ở ô bên cạnh.{'\n'}
                <b style={{ color: '#e67e22' }}>* Lưu ý:</b> Yêu cầu khách thuê cập nhật lại mật khẩu mới sau khi đăng nhập vào App.
              </Typography>
            </Box>
            <Switch 
              checked={autoAccount} 
              onChange={() => setAutoAccount(!autoAccount)} 
              color="info"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Mật khẩu cho khách thuê"
            value={defaultPassword}
            onChange={(e) => setDefaultPassword(e.target.value)}
            disabled={!autoAccount}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Switches Grid */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Chốt đồng hồ điện nước</Typography>
                <Typography variant="body2" color="textSecondary">
                  Cho phép khách thuê gửi thông tin chốt điện nước để lập hóa đơn
                </Typography>
              </Box>
              <Switch 
                checked={electricWaterMeter} 
                onChange={() => setElectricWaterMeter(!electricWaterMeter)} 
                color="info"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Nhập thông tin cá nhân</Typography>
                <Typography variant="body2" color="textSecondary">
                  Cho phép khách thuê cập nhật thông tin cá nhân qua App khách thuê
                </Typography>
              </Box>
              <Switch 
                checked={personalInfo} 
                onChange={() => setPersonalInfo(!personalInfo)} 
                color="info"
              />
            </Box>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Cập nhật thông tin xe</Typography>
                <Typography variant="body2" color="textSecondary">
                  Cho phép khách thuê cập nhật thông tin xe trong phòng
                </Typography>
              </Box>
              <Switch 
                checked={vehicleInfo} 
                onChange={() => setVehicleInfo(!vehicleInfo)} 
                color="info"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Báo kết thúc hợp đồng</Typography>
                <Typography variant="body2" color="textSecondary">
                  Cho phép khách thuê báo kết thúc hợp đồng
                </Typography>
              </Box>
              <Switch 
                checked={endContract} 
                onChange={() => setEndContract(!endContract)} 
                color="info"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerAppTab;
