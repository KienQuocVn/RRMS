import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import Rating from '@mui/material/Rating';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import {
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { formatterAmount } from '~/utils/formatterAmount';

const overviewItems = (detail) => [
  {
    icon: <HomeWorkRoundedIcon color="primary" />,
    label: 'Tòa nhà',
    value: detail.motel?.motelName || 'Đang cập nhật',
  },
  {
    icon: <CheckCircleRoundedIcon color="primary" />,
    label: 'Phòng thuộc',
    value: detail.room?.name || 'Đang cập nhật',
  },
  {
    icon: <HomeWorkRoundedIcon color="primary" />,
    label: 'Chuyên mục',
    value: detail.rentalCategory || 'Đang cập nhật',
  },
  {
    icon: <CheckCircleRoundedIcon color={detail.status ? 'success' : 'error'} />,
    label: 'Tình trạng',
    value: detail.status ? 'Đang trống' : 'Đã có người thuê',
  },
  {
    icon: <CalendarMonthRoundedIcon color="primary" />,
    label: 'Giờ giấc',
    value: `${detail.openingHours || '--'} - ${detail.closeHours || '--'}`,
  },
  {
    icon: <AccessTimeRoundedIcon color="primary" />,
    label: 'Bắt đầu cho thuê',
    value: detail.moveInDate || 'Đang cập nhật',
  },
  {
    icon: <SecurityRoundedIcon color={detail.isActive ? 'success' : 'warning'} />,
    label: 'Kiểm duyệt',
    value: detail.isActive ? 'Đã kiểm duyệt' : 'Chưa kiểm duyệt',
  },
  {
    icon: <GroupRoundedIcon color="primary" />,
    label: 'Tối đa người ở',
    value: detail.maxPerson || 'Không giới hạn',
  },
];

const pricingItems = (detail) => [
  {
    icon: <PaidRoundedIcon color="primary" />,
    label: 'Tiền cọc',
    value: formatterAmount(detail.deposit),
  },
  {
    icon: <SquareFootRoundedIcon color="primary" />,
    label: 'Diện tích',
    value: `${detail.area} m²`,
  },
  {
    icon: <ElectricBoltRoundedIcon color="primary" />,
    label: 'Tiền điện',
    value: `${formatterAmount(detail.electricityPrice)}/Kw`,
  },
  {
    icon: <WaterDropRoundedIcon color="primary" />,
    label: 'Tiền nước',
    value: `${formatterAmount(detail.waterPrice)}/Khối`,
  },
];

const DetailSummarySection = ({ detail, rating }) => {
  const theme = useTheme();
  const amenities = detail?.bulletinBoardRentalAmenities || [];
  const displayedPrice = detail.promotionalRentalPrice || detail.rentPrice;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2, md: 3 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.info.main, 0.06)} 0%, ${theme.palette.background.paper} 55%)`,
      }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1.5} sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
              {detail.title}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {detail.address}
            </Typography>

            {detail.motel?.address && detail.motel.address !== detail.address ? (
              <Typography variant="body2" color="text.secondary">
                Thuộc tòa nhà tại: {detail.motel.address}
              </Typography>
            ) : null}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={detail.rentalCategory} color="primary" variant="outlined" />
              <Chip
                label={detail.status ? 'Còn trống' : 'Đã có khách'}
                color={detail.status ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                label={detail.isActive ? 'Tin đã kiểm duyệt' : 'Tin chưa kiểm duyệt'}
                color={detail.isActive ? 'success' : 'warning'}
                variant="outlined"
              />
            </Stack>
          </Stack>

          <Card
            elevation={0}
            sx={{
              minWidth: { xs: '100%', md: 260 },
              borderRadius: 3,
              p: 2.5,
              color: 'common.white',
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            }}>
            <Typography variant="overline" sx={{ opacity: 0.86, letterSpacing: 1 }}>
              Mức giá hiện tại
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {formatterAmount(displayedPrice)}/tháng
            </Typography>
            {detail.promotionalRentalPrice && (
              <Typography sx={{ textDecoration: 'line-through', opacity: 0.72, mt: 0.5 }}>
                {formatterAmount(detail.rentPrice)}
              </Typography>
            )}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
              <Rating value={rating} precision={0.1} readOnly />
              <Typography variant="body2">{rating}/5</Typography>
            </Stack>
          </Card>
        </Stack>

        <Divider />

        <Grid container spacing={2}>
          {overviewItems(detail).map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.label}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: alpha(theme.palette.background.default, 0.7),
                }}>
                <Stack direction="row" spacing={1.5} sx={{ p: 2, alignItems: 'flex-start' }}>
                  {item.icon}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          {pricingItems(detail).map((item) => (
            <Grid item xs={12} sm={6} key={item.label}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }}>
                <Stack direction="row" spacing={1.5} sx={{ p: 2, alignItems: 'center' }}>
                  {item.icon}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {amenities.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Tiện ích nổi bật
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {amenities.map((item, index) => (
                <Chip
                  key={`${item.rentalAmenities.name}-${index}`}
                  label={item.rentalAmenities.name}
                  sx={{
                    px: 1,
                    py: 2.4,
                    borderRadius: 2.5,
                    backgroundColor: alpha(theme.palette.success.main, 0.12),
                    color: theme.palette.success.dark,
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
};

export default DetailSummarySection;
