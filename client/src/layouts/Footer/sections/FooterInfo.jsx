import { Box, Typography } from '@mui/material';

export function FooterInfo() {
  return (
    <Box sx={{ maxWidth: 420 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {/* Logo SVG */}
        <Box>
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <rect x="2" y="8" width="16" height="24" rx="2" fill="#2E7D32" />
            <rect x="10" y="4" width="16" height="24" rx="2" fill="#43A047" opacity="0.8" />
            <rect x="18" y="8" width="16" height="24" rx="2" fill="#66BB6A" opacity="0.6" />
          </svg>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1 }}>
            LOZIDO
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
            <Typography component="span" color="text.secondary">Tìm</Typography>
            <Typography component="span" fontWeight="bold" color="#E65100">TRỌ</Typography>
            <Typography component="span" color="text.secondary">-</Typography>
            <Typography component="span" fontWeight="bold" color="#2E7D32">CĂN HỘ</Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        LOZIDO là kênh chuyên cung cấp giải pháp tìm kiếm nhà ở chất lượng và thuận tiện. 
        Với sự kết hợp công nghệ và dịch vụ chuyên nghiệp, LOZIDO đã nhanh chóng trở thành 
        điểm đến hàng đầu cho người tìm nhà ở, thuê trọ...
      </Typography>
    </Box>
  );
}