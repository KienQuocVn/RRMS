import { Box, Typography, Grid } from '@mui/material';

const hotlines = [
  { city: "Kinh doanh Hồ Chí Minh", label: "HỖ TRỢ CHÍNH SÁCH", labelColor: "#E65100", phone: "0965-227-453" },
  { city: "Kinh doanh Hà Nội", label: "HỖ TRỢ ĐĂNG TIN", labelColor: "#2E7D32", phone: "0868-000-845" },
  { city: "Kinh doanh Đà Nẵng", label: "HỖ TRỢ ĐĂNG TIN", labelColor: "#2E7D32", phone: "0868-000-845" },
];

export function FooterHotlines() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Liên hệ với chúng tôi nếu bạn cần hỗ trợ
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {hotlines.map((item) => (
          <Grid item xs={12} sm={4} key={item.city}>
            <Box sx={{
              border: '1px solid', borderColor: 'divider',
              borderRadius: 2, p: 3, bgcolor: 'background.paper'
            }}>
              <Typography variant="body2" color="text.secondary">{item.city}</Typography>
              <Typography variant="caption" fontWeight="bold" sx={{ color: item.labelColor, textTransform: 'uppercase' }}>
                {item.label}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                {item.phone}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}