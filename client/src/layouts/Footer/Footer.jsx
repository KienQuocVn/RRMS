import { Box, Container, Divider } from '@mui/material';
import { FooterInfo } from './FooterInfo';
import { FooterLinks } from './FooterLinks';
import { FooterContact } from './FooterContact';
import { FooterHotlines } from './FooterHotlines';
import { FooterSocial } from './FooterSocial';
import { FooterApps } from './FooterApps';
import { FooterCopyright } from './FooterCopyright';

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
      {/* Top section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 8 }}>
          <FooterInfo />
          <FooterLinks />
          <FooterContact />
        </Box>
      </Container>

      {/* Hotlines */}
      <Container maxWidth="md" sx={{ pb: 8 }}>
        <FooterHotlines />
      </Container>

      <Divider />

      {/* Social & Badges */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <FooterSocial />
      </Container>

      <Divider />

      {/* Apps */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <FooterApps />
      </Container>

      {/* Copyright */}
      <FooterCopyright />
    </Box>
  );
}