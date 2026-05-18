import { useState } from 'react';
import { Box, Typography, TextField, Switch, Grid, Alert, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const FeatureSettingTab = () => {
  const [days, setDays] = useState('30');
  const [settings, setSettings] = useState({
    asset: true,
    broker: true,
    todo: true,
    document: true,
    vehicle: true,
    post: true,
    sms: false
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Cài đặt tính năng</Typography>
        <Typography variant="body2" color="textSecondary">Bật/Tắt các tính năng có thể áp dụng trong Nhà trọ của bạn</Typography>
      </Box>

      {/* Input number of days */}
      <TextField
        fullWidth
        label="Ngày thiết lập báo kết thúc hợp đồng"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        variant="outlined"
        required
        sx={{ mb: 3 }}
      />

      {/* Info Alert Box */}
      <Alert 
        icon={<InfoOutlinedIcon sx={{ color: '#20a9e7' }} />}
        sx={{ 
          bgcolor: 'rgba(46, 204, 113, 0.08)', 
          border: '1px solid rgba(46, 204, 113, 0.3)',
          color: '#2c3e50',
          mb: 3,
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <Typography variant="body2" fontWeight="bold" sx={{ color: '#20a9e7', mb: 0.5 }}>
          Thông tin: Hệ thống sẽ dựa ngày này để nhắc thông báo khi hợp đồng sắp hết hạn
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d', fontSize: '13px' }}>
          <b>Ví dụ:</b> Bạn thiết lập là 10 ngày, thì khi hợp đồng còn 10 ngày nữa là hết hạn, hệ thống sẽ tự động gửi thông báo cho bạn để bạn có thể chủ động liên hệ khách thuê để gia hạn hợp đồng hoặc tìm khách thuê mới, tránh tình trạng hợp đồng hết hạn mà bạn không biết
        </Typography>
      </Alert>

      <Divider sx={{ my: 3 }} />

      {/* Switches Grid */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Quản lý tài sản</Typography>
                <Typography variant="body2" color="textSecondary">Quản lý tài sản khách thuê sử dụng</Typography>
              </Box>
              <Switch 
                checked={settings.asset} 
                onChange={() => handleToggle('asset')} 
                color="info"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Quản lý môi giới</Typography>
                <Typography variant="body2" color="textSecondary">Các thông tin về môi giới</Typography>
              </Box>
              <Switch 
                checked={settings.broker} 
                onChange={() => handleToggle('broker')} 
                color="info"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Quản lý công việc cần làm</Typography>
                <Typography variant="body2" color="textSecondary">Các thông tin về việc cần làm</Typography>
              </Box>
              <Switch 
                checked={settings.todo} 
                onChange={() => handleToggle('todo')} 
                color="info"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Hình ảnh, file chứng từ hợp đồng</Typography>
                <Typography variant="body2" color="textSecondary">Bật/Tắt thêm hình ảnh, file chứng từ cho hợp đồng</Typography>
              </Box>
              <Switch 
                checked={settings.document} 
                onChange={() => handleToggle('document')} 
                color="info"
              />
            </Box>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Quản lý xe</Typography>
                <Typography variant="body2" color="textSecondary">Các thông tin xe của khách thuê</Typography>
              </Box>
              <Switch 
                checked={settings.vehicle} 
                onChange={() => handleToggle('vehicle')} 
                color="info"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Quản lý tin đăng</Typography>
                <Typography variant="body2" color="textSecondary">Các thông tin về tin đăng</Typography>
              </Box>
              <Switch 
                checked={settings.post} 
                onChange={() => handleToggle('post')} 
                color="info"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Gửi tin nhắn tự động cho khách thuê</Typography>
                <Typography variant="body2" color="textSecondary">Gửi tin nhắn SMS tự động cho khách thuê sau khi lập phiếu</Typography>
              </Box>
              <Switch 
                checked={settings.sms} 
                onChange={() => handleToggle('sms')} 
                color="info"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeatureSettingTab;
