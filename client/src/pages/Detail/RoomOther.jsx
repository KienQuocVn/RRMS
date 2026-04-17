import { useState } from 'react';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Slider from 'react-slick';
import { formatterAmount } from '~/utils/formatterAmount';
import NextArrow from './NextArrow';
import PrevArrow from './PrevArrow';

const RoomOther = ({ items }) => {
  const theme = useTheme();
  const [showArrows, setShowArrows] = useState(false);

  const calculateAvgRating = (listRating) => {
    if (listRating && listRating.length > 0) {
      const sum = listRating.reduce((total, { rating }) => total + rating, 0);
      return Number((sum / listRating.length).toFixed(2));
    }

    return 0;
  };

  const settings = {
    infinite: items.length > 3,
    speed: 500,
    slidesToShow: Math.min(items.length, 3),
    slidesToScroll: 1,
    nextArrow: <NextArrow visible={showArrows} />,
    prevArrow: <PrevArrow visible={showArrows} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(items.length, 2) || 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box
      sx={{ position: 'relative', px: { xs: 0, md: 0.5 } }}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}>
      <Slider {...settings}>
        {items.map((item) => {
          const averageRating = calculateAvgRating(item?.bulletinBoardReviews);

          return (
            <Box key={item.bulletinBoardId} sx={{ px: 1, py: 0.5 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}>
                <CardActionArea component={RouterLink} to={`/detail/${item.bulletinBoardId}`} sx={{ height: '100%' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={item?.bulletinBoardImages?.[0]?.imageLink || '/placeholder.jpg'}
                      alt={item.title}
                      sx={{ height: 220, objectFit: 'cover' }}
                    />

                    <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12, right: 12, justifyContent: 'space-between' }}>
                      <Chip
                        icon={<VerifiedRoundedIcon />}
                        label={item.isActive ? 'Đã xác minh' : 'Chưa xác minh'}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.background.paper, 0.88),
                          '& .MuiChip-label': { fontWeight: 600 },
                        }}
                      />

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={`${item?.bulletinBoardImages?.length || 0} ảnh`}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.background.paper, 0.88),
                            '& .MuiChip-label': { fontWeight: 600 },
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.background.paper, 0.88),
                            '&:hover': { bgcolor: theme.palette.background.paper },
                          }}>
                          <BookmarkBorderRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Stack spacing={1.2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 800 }}>
                            {formatterAmount(item.promotionalRentalPrice || item.rentPrice)}/tháng
                          </Typography>
                          {item.promotionalRentalPrice && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              {formatterAmount(item.rentPrice)}
                            </Typography>
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          {item?.area} m²
                        </Typography>
                      </Stack>

                      <Typography variant="subtitle1" sx={{ fontWeight: 700, minHeight: 56 }}>
                        {item?.title || item?.name}
                      </Typography>

                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Rating name={`rating-${item.bulletinBoardId}`} value={averageRating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">
                          {item?.bulletinBoardReviews?.length || 0} đánh giá
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Person4OutlinedIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {item?.account?.fullname || 'Chủ tin'}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                        {item?.address}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

export default RoomOther;
