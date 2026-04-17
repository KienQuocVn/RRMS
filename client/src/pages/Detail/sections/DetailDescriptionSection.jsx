import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Button, Card, Stack, Typography } from '@mui/material';

const DetailDescriptionSection = ({
  description,
  onCopyDescription,
  onSaveForLater,
  onShare,
  onShareFacebook,
}) => {
  const paragraphs = (description || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2, md: 3 },
      }}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ sm: 'center' }}>
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Thông tin mô tả
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nội dung được giữ nguyên từ tin đăng gốc để không ảnh hưởng dữ liệu backend.
            </Typography>
          </Stack>

          <Button variant="outlined" startIcon={<ContentCopyRoundedIcon />} onClick={onCopyDescription} sx={{ borderRadius: 999 }}>
            Sao chép mô tả
          </Button>
        </Stack>

        <Stack spacing={1.75}>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <Typography key={`${paragraph}-${index}`} variant="body1" sx={{ lineHeight: 1.8 }}>
                {paragraph}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              Chưa có mô tả chi tiết cho tin đăng này.
            </Typography>
          )}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="outlined" startIcon={<BookmarkBorderRoundedIcon />} onClick={onSaveForLater} sx={{ borderRadius: 3 }}>
            Lưu xem sau
          </Button>
          <Button variant="contained" startIcon={<FacebookRoundedIcon />} onClick={onShareFacebook} sx={{ borderRadius: 3 }}>
            Chia sẻ Facebook
          </Button>
          <Button variant="contained" color="secondary" startIcon={<SendRoundedIcon />} onClick={onShare} sx={{ borderRadius: 3 }}>
            Chia sẻ tin đăng
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default DetailDescriptionSection;
