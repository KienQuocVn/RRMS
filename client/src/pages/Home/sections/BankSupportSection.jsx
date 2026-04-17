import { Box, Container, Stack, Typography } from '@mui/material'

const banks = [
  { name: 'BIDV', logo: 'https://sepay.vn/uploads/logo/BIDV.png' },
  { name: 'TPBank', logo: 'https://qr.sepay.vn/assets/img/banklogo/TPB.png' },
  { name: 'MB', logo: 'https://qr.sepay.vn/assets/img/banklogo/MB.png' },
  { name: 'VietinBank', logo: 'https://qr.sepay.vn/assets/img/banklogo/ICB.png' },
  { name: 'ACB', logo: 'https://qr.sepay.vn/assets/img/banklogo/ACB.png' },
  { name: 'OCB', logo: 'https://qr.sepay.vn/assets/img/banklogo/OCB.png' },
  { name: 'KienlongBank', logo: 'https://sepay.vn/uploads/logo/kienlongbank-logo.png' },
]

export default function BankSupportSection() {
  return (
    <Box
      component="section"
      className="home-section"
      sx={{
        py: { xs: 5, md: 6 },
        background: 'linear-gradient(180deg, rgba(244, 249, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)'
      }}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" className="home-section-content">
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '2.4rem' },
              fontWeight: 900,
              lineHeight: 1.15,
              textTransform: 'uppercase',
              color: '#000',
              textAlign: 'center'
            }}
            className="home-section-title">
            Hỗ trợ gạch nợ qua <span className="accent">nhiều ngân hàng</span>
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              mx: 'auto',
              maxWidth: 920,
              fontSize: { xs: '1rem', md: '1.05rem' },
              lineHeight: 1.8,
              color: '#384860',
              textAlign: 'center'
            }}>
            Miễn phí giao dịch, tự động đối soát khi khách thuê chuyển khoản và giảm tối đa thao tác thủ công.
          </Typography>

          <Stack direction="row" useFlexGap flexWrap="wrap" justifyContent="center" gap={1.5} sx={{ pt: 2 }}>
            {banks.map((bank) => (
              <Box
                key={bank.name}
                className="home-hover-card"
                sx={{
                  width: { xs: 130, sm: 150 },
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '20px',
                  border: '1px solid rgba(55, 100, 164, 0.12)',
                  backgroundColor: '#fff',
                  boxShadow: '0 14px 30px rgba(44, 87, 151, 0.08)',
                  px: 2
                }}>
                <Box
                  component="img"
                  src={bank.logo}
                  alt={bank.name}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '40px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
