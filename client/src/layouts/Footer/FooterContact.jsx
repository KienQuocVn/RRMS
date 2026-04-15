import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';

export function FooterContact() {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Thông tin & Liên hệ
      </Typography>

      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box component="li" sx={{ display: 'flex', gap: 2 }}>
          <LocationOnIcon sx={{ color: '#E65100', mt: 0.3 }} />
          <Box>
            <Typography component="strong" fontWeight={500}>VP đại diện</Typography>: Verosa Park, Số 39 Đường số 10, Khu phố 2 - P.Long Trường - TP.Hồ Chí Minh
          </Box>
        </Box>

        <Box component="li" sx={{ display: 'flex', gap: 2 }}>
          <LocationOnIcon sx={{ color: '#1565C0', mt: 0.3 }} />
          <Box>
            <Typography component="strong" fontWeight={500}>VP làm việc</Typography>: 201/15 - Lê Văn Việt - P.Tăng Nhơn Phú - TP.Hồ Chí Minh
          </Box>
        </Box>

        <Box component="li" sx={{ display: 'flex', gap: 2 }}>
          <EmailIcon sx={{ color: '#2E7D32', mt: 0.3 }} />
          <Box>
            <Typography component="strong" fontWeight={500}>Email</Typography>: lozido.com@gmail.com
          </Box>
        </Box>

        <Box component="li" sx={{ display: 'flex', gap: 2 }}>
          <AccessTimeIcon sx={{ color: '#E65100', mt: 0.3 }} />
          <Box>
            <Typography component="strong" fontWeight={500}>Giờ làm</Typography>: Từ 8h – 18h từ Thứ 2 đến Thứ 6 và Sáng Thứ 7
          </Box>
        </Box>

        <Box component="li" sx={{ display: 'flex', gap: 2 }}>
          <PhoneIcon sx={{ mt: 0.3 }} />
          <Box>
            <Typography component="strong" fontWeight={500}>Hotline - Zalo</Typography>: 0965227453
          </Box>
        </Box>
      </Box>
    </Box>
  );
}