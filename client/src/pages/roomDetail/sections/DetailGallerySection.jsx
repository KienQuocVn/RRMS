import { useState } from 'react';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { Box, Chip, Paper, Stack, Typography, useMediaQuery } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Slider from 'react-slick';
import Item from '../Item';
import NextArrow from '../NextArrow';
import PrevArrow from '../PrevArrow';

const DetailGallerySection = ({ images, address, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showArrows, setShowArrows] = useState(false);

  const settings = {
    dotsClass: 'slick-dots slick-thumb',
    dots: images.length > 1,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow visible={showArrows} />,
    prevArrow: <PrevArrow visible={showArrows} />,
    customPaging: (index) => {
      if (isMobile) {
        return <Box sx={{ display: 'none' }} />;
      }

      return (
        <Box
          component="img"
          src={images[index]?.imageLink}
          alt={`${title} ${index + 1}`}
          sx={{
            width: 72,
            height: 56,
            borderRadius: 2,
            objectFit: 'cover',
            border: '2px solid transparent',
            transition: 'all 0.2s ease',
          }}
        />
      );
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${theme.palette.background.paper} 24%)`,
        '.slick-dots.slick-thumb': {
          position: 'relative',
          inset: 'unset',
          display: 'flex !important',
          justifyContent: 'center',
          gap: 1,
          px: 2,
          pb: 2.5,
          mt: 1,
        },
        '.slick-dots.slick-thumb li': {
          width: 'auto',
          height: 'auto',
          m: 0,
        },
        '.slick-dots.slick-thumb li.slick-active img': {
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[6],
        },
      }}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}>
          <Chip
            icon={<CollectionsRoundedIcon />}
            label={`${images.length} ảnh thực tế`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, alignSelf: 'flex-start' }}
          />
          <Chip
            icon={<PlaceRoundedIcon />}
            label={address}
            variant="filled"
            sx={{
              maxWidth: '100%',
              '& .MuiChip-label': {
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          />
        </Stack>

        {images.length > 0 ? (
          <Box sx={{ px: { xs: 1.5, md: 2.5 }, pb: 1 }}>
            <Slider {...settings}>
              {images.map((item, index) => (
                <Item
                  key={`${item.imageLink}-${index}`}
                  addressDetail={address}
                  index={index}
                  item={item}
                  totalItems={images.length}
                />
              ))}
            </Slider>
          </Box>
        ) : (
          <Box
            sx={{
              mx: { xs: 2, md: 3 },
              mb: 3,
              height: { xs: 280, md: 440 },
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: 'text.secondary',
              backgroundColor: alpha(theme.palette.primary.main, 0.06),
            }}>
            <Typography variant="body1">Chưa có hình ảnh cho tin đăng này.</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default DetailGallerySection;
