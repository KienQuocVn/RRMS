import { Box, Typography, Link as MuiLink } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const socialLinks = [
  { label: "Kênh ZALO", icon: "💬", href: "#" },
  { label: "Kênh Facebook", icon: "📘", href: "#", color: "#1565C0" },
  { label: "Kênh Youtube", icon: "▶️", href: "#", color: "#D32F2F" },
  { label: "Kênh Tiktok", icon: "🎵", href: "#" },
];

export function FooterSocial() {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {/* Badges */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Bộ Công Thương - Đã thông báo */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          border: '1px solid', borderColor: 'divider',
          borderRadius: 1, px: 3, py: 2
        }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '50%',
            bgcolor: '#1565C0', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <CheckIcon sx={{ fontSize: 16, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ lineHeight: 1.2, display: 'block' }}>ĐÃ THÔNG BÁO</Typography>
            <Typography variant="caption" fontWeight="bold">BỘ CÔNG THƯƠNG</Typography>
          </Box>
        </Box>

        {/* Bộ Công Thương - Đã đăng ký */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          border: '1px solid', borderColor: 'divider',
          borderRadius: 1, px: 3, py: 2
        }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '50%',
            bgcolor: '#D32F2F', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <CheckIcon sx={{ fontSize: 16, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ lineHeight: 1.2, display: 'block' }}>ĐÃ ĐĂNG KÝ</Typography>
            <Typography variant="caption" fontWeight="bold">BỘ CÔNG THƯƠNG</Typography>
          </Box>
        </Box>
      </Box>

      {/* Social buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {socialLinks.map((link) => (
          <MuiLink
            key={link.label}
            href={link.href}
            underline="none"
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              border: '1px solid', borderColor: 'divider',
              borderRadius: '9999px', px: 3, py: 1.5,
              fontSize: '0.95rem',
              color: link.color || 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </MuiLink>
        ))}
      </Box>
    </Box>
  );
}