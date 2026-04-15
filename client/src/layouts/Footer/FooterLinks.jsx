import { Box, Typography, Link as MuiLink } from '@mui/material';

const links = [
  { label: "Liên hệ", href: "#" },
  { label: "Giới thiệu về LOZIDO", href: "#" },
  { label: "Chính sách bảo mật", href: "#", highlight: true },
  { label: "Điều khoản sử dụng", href: "#" },
  { label: "Quy chế hoạt động", href: "#" },
  { label: "Chính sách giải quyết khiếu nại", href: "#" },
];

export function FooterLinks() {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Liên kết
      </Typography>
      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {links.map((link) => (
          <Box component="li" key={link.label}>
            <MuiLink
              href={link.href}
              underline="hover"
              sx={{
                color: link.highlight ? '#1565C0' : 'text.secondary',
                fontWeight: link.highlight ? 500 : 400,
                '&:hover': { color: 'primary.main' }
              }}
            >
              {link.label}
            </MuiLink>
          </Box>
        ))}
      </Box>
    </Box>
  );
}