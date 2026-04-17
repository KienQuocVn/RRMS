import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Card, Stack, Typography } from '@mui/material';
import RoomOther from '../RoomOther';

const DetailRelatedSection = ({ currentBulletinBoardId, items, province, rentalCategory }) => {
  const relatedItems = (items || []).filter((item) => item.bulletinBoardId !== currentBulletinBoardId);

  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2, md: 3 },
      }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ sm: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesomeRoundedIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Gợi ý cùng khu vực
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Xem thêm {rentalCategory} tại {province}
          </Typography>
        </Stack>

        <RoomOther items={relatedItems} />
      </Stack>
    </Card>
  );
};

export default DetailRelatedSection;
