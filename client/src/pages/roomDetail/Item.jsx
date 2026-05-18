import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { GlassMagnifier } from '@datobs/react-image-magnifiers';
import { Box, Button, Chip, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Item = ({ item, index, totalItems, addressDetail }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const openGoogleMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressDetail || '')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!item?.imageLink) {
    return (
      <Box
        sx={{
          height: { xs: 280, md: 520 },
          borderRadius: 3,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
        }}>
        <Typography color="text.secondary">Không có hình ảnh</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', px: { xs: 0.5, md: 1 }, pb: 1 }}>
      <Box sx={{ overflow: 'hidden', borderRadius: 3 }}>
        <GlassMagnifier
          imageAlt={`Hinh anh ${index + 1}`}
          imageSrc={item.imageLink}
          square
          style={{
            width: '100%',
            height: isMobile ? '320px' : '520px',
            objectFit: 'cover',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          bottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}>
        <Button
          variant="contained"
          onClick={openGoogleMap}
          startIcon={<FmdGoodIcon />}
          sx={{
            borderRadius: 999,
            px: 2,
            py: 1,
            boxShadow: 6,
            backdropFilter: 'blur(8px)',
          }}>
          {isMobile ? 'Vị trí' : 'Xem vị trí'}
        </Button>

        <Chip
          label={`Ảnh ${index + 1}/${totalItems}`}
          sx={{
            color: 'common.white',
            fontWeight: 700,
            bgcolor: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(10px)',
          }}
        />
      </Box>
    </Box>
  );
};

export default Item;
