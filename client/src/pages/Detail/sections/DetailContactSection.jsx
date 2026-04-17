import { useState } from 'react';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';

const DetailContactSection = ({ item }) => {
  const theme = useTheme();
  const [showPhone, setShowPhone] = useState(false);

  const owner = item?.account || {};
  const phoneNumber = owner.phone || item?.phone;

  const handleOpenZalo = () => {
    if (!phoneNumber) {
      toast.error('Tin dang nay chua co so dien thoai lien he');
      return;
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    window.open(`https://zalo.me/${normalizedPhone}`, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePhone = async () => {
    if (!phoneNumber) {
      toast.error('Tin dang nay chua co so dien thoai lien he');
      return;
    }

    setShowPhone((prev) => !prev);

    if (!showPhone) {
      try {
        await navigator.clipboard.writeText(phoneNumber);
        toast.success('Da sao chep so dien thoai');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePendingFeature = (label) => {
    toast.info(`${label} se duoc bo sung sau`);
  };

  return (
    <Card
      elevation={0}
      sx={{
        position: { md: 'sticky' },
        top: { md: 24 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2, md: 3 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${theme.palette.background.paper} 28%)`,
      }}>
      <Stack spacing={2.5} alignItems="center">
        <Avatar
          src={owner.avatar}
          alt={owner.fullname}
          sx={{
            width: 92,
            height: 92,
            border: '4px solid',
            borderColor: alpha(theme.palette.primary.main, 0.14),
          }}>
          {owner.fullname?.[0]}
        </Avatar>

        <Stack spacing={0.5} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {owner.fullname || 'Chủ tin đăng'}
          </Typography>
          <Chip
            icon={<VerifiedRoundedIcon />}
            label={item.isActive ? 'Đã xác minh' : 'Đang chờ xác minh'}
            color={item.isActive ? 'success' : 'warning'}
            variant="outlined"
          />
        </Stack>

        <Stack spacing={1.25} sx={{ width: '100%' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<ChatRoundedIcon />}
            onClick={handleOpenZalo}
            sx={{ borderRadius: 3, py: 1.25 }}>
            Nhắn Zalo
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<PhoneRoundedIcon />}
            onClick={handleTogglePhone}
            sx={{ borderRadius: 3, py: 1.25 }}>
            {showPhone ? phoneNumber : 'Xem số điện thoại'}
          </Button>
        </Stack>

        <Divider flexItem />

        <Stack spacing={1.25} sx={{ width: '100%' }}>
          <Button
            fullWidth
            color="success"
            variant="contained"
            onClick={() => handlePendingFeature('Tinh nang quan tam')}
            startIcon={<FavoriteBorderRoundedIcon />}
            sx={{
              borderRadius: 3,
              py: 1.1,
              backgroundColor: alpha(theme.palette.success.main, 0.12),
              color: theme.palette.success.dark,
              '&:hover': {
                backgroundColor: alpha(theme.palette.success.main, 0.18),
              },
            }}>
            Quan tâm tin đăng
          </Button>

          <Button
            fullWidth
            color="error"
            variant="contained"
            onClick={() => handlePendingFeature('Tinh nang bao cao')}
            startIcon={<ReportProblemOutlinedIcon />}
            sx={{
              borderRadius: 3,
              py: 1.1,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.16),
              },
            }}>
            Báo cáo tin đăng
          </Button>
        </Stack>

        <Card
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 3,
            p: 2,
            border: '1px dashed',
            borderColor: alpha(theme.palette.warning.main, 0.45),
            backgroundColor: alpha(theme.palette.warning.main, 0.08),
          }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
            Lưu ý an toàn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ưu tiên gọi trực tiếp cho chủ tin, kiểm tra thông tin phòng thực tế và chỉ thanh toán khi đã xác minh rõ.
          </Typography>
        </Card>
      </Stack>
    </Card>
  );
};

export default DetailContactSection;
