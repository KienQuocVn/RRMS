import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Box, Card, Rating, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ChartRaiting from './ChartRaiting';

const RaitingAvg = ({ rating, reviews }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2, md: 2.5 },
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
      }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems={{ md: 'center' }}>
        <Box
          sx={{
            minWidth: { md: 200 },
            textAlign: { xs: 'left', md: 'center' },
          }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ md: 'center' }}>
            <StarRoundedIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Đánh giá trung bình
            </Typography>
          </Stack>

          <Typography variant="h2" sx={{ fontWeight: 800, mt: 1 }}>
            {rating}
          </Typography>

          <Rating name="average-rating" value={rating} precision={0.1} readOnly />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {reviews.length} lượt đánh giá
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ChartRaiting reviews={reviews} />
        </Box>
      </Stack>
    </Card>
  );
};

export default RaitingAvg;
