import { Box, Typography } from '@mui/material';

export function FooterCopyright() {
  return (
    <Box sx={{ bgcolor: '#37474F', color: 'white', py: 4, textAlign: 'center' }}>
      <Typography variant="body2">
        Copyright © LOZIDO - Tìm trọ, căn hộ, việc làm
      </Typography>
      <Typography variant="caption" fontWeight="bold" sx={{ mt: 1, display: 'block', textTransform: 'uppercase' }}>
        CÔNG TY TNHH GIẢI PHÁP THÔNG MINH POPIPLUS
      </Typography>
      <Typography variant="caption" sx={{ mt: 1, opacity: 0.7, display: 'block' }}>
        Đăng ký kinh doanh số 0318272823 - do Sở Kế hoạch và Đầu tư thành phố Hồ Chí Minh cấp lần đầu ngày 19 tháng 01 năm 2024
      </Typography>
    </Box>
  );
}