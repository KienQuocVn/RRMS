import { useState } from 'react';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { createViolationReport } from '~/apis/violationReportAPI';

const REPORT_REASONS = [
  'Lừa đảo',
  'Thông tin sai lệch',
  'Giá không hợp lý',
  'Hình ảnh không phù hợp',
  'Spam',
  'Nội dung phản cảm',
  'Khác',
];

const DetailContactSection = ({ item }) => {
  const theme = useTheme();
  const [showPhone, setShowPhone] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [reportContent, setReportContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const owner = item?.account || {};
  const ownerName = owner.fullName || owner.fullname || owner.username || 'Chủ tin đăng';
  const phoneNumber = owner.phone || item?.phone;

  const handleOpenZalo = () => {
    if (!phoneNumber) {
      toast.error('Tin đăng này chưa có số điện thoại liên hệ');
      return;
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    window.open(`https://zalo.me/${normalizedPhone}`, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePhone = async () => {
    if (!phoneNumber) {
      toast.error('Tin đăng này chưa có số điện thoại liên hệ');
      return;
    }

    setShowPhone((prev) => !prev);

    if (!showPhone) {
      try {
        await navigator.clipboard.writeText(phoneNumber);
        toast.success('Đã sao chép số điện thoại');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePendingFeature = (label) => {
    toast.info(`${label} sẽ được bổ sung sau`);
  };

  const handleOpenReport = () => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      toast.warning('Vui lòng đăng nhập để gửi báo cáo bài viết!');
      return;
    }
    setOpenReportModal(true);
  };

  const handleCloseReport = () => {
    if (isSubmitting) return;
    setOpenReportModal(false);
    setSelectedReason(REPORT_REASONS[0]);
    setReportContent('');
  };

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      toast.warning('Vui lòng chọn lý do báo cáo');
      return;
    }

    if (!reportContent.trim()) {
      toast.warning('Vui lòng nhập chi tiết nội dung báo cáo');
      return;
    }

    const storedUser = sessionStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const payload = {
      reporterUsername: user?.username || null,
      subjectType: 'POST',
      bulletinBoardId: item?.bulletinBoardId || null,
      reportedUsername: owner?.username || null,
      reason: selectedReason,
      content: reportContent.trim(),
    };

    setIsSubmitting(true);
    try {
      await createViolationReport(payload);
      toast.success('Báo cáo bài viết thành công. Quản trị viên sẽ sớm kiểm tra và xử lý!');
      handleCloseReport();
    } catch (error) {
      console.error('Lỗi khi gửi báo cáo:', error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo bài viết.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
            alt={ownerName}
            sx={{
              width: 92,
              height: 92,
              border: '4px solid',
              borderColor: alpha(theme.palette.primary.main, 0.14),
            }}>
            {ownerName?.[0]}
          </Avatar>

          <Stack spacing={0.5} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {ownerName}
            </Typography>
            <Chip
              icon={<VerifiedRoundedIcon />}
              label={item?.isActive ? 'Đã xác minh' : 'Đang chờ xác minh'}
              color={item?.isActive ? 'success' : 'warning'}
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
              onClick={() => handlePendingFeature('Tính năng quan tâm')}
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
              onClick={handleOpenReport}
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

      {/* Modal Báo Cáo Tin Đăng */}
      <Dialog
        open={openReportModal}
        onClose={handleCloseReport}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            p: 1,
          },
        }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                display: 'flex',
                p: 0.75,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              }}>
              <ReportProblemOutlinedIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Báo cáo tin đăng
            </Typography>
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleCloseReport}
            disabled={isSubmitting}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2.5 }}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.12),
              }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                ĐỐI TƯỢNG BỊ BÁO CÁO
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {item?.title || 'Phòng trọ'}
              </Typography>
              {item?.address && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {item.address}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Lý do báo cáo vi phạm <span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}>
                  {REPORT_REASONS.map((reason) => (
                    <FormControlLabel
                      key={reason}
                      value={reason}
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">{reason}</Typography>}
                      sx={{ py: 0.2 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Nội dung chi tiết <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Mô tả cụ thể vấn đề bạn gặp phải (Ví dụ: sau khi chuyển cọc thì người đăng không phản hồi, thông tin giá sai lệch...)"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseReport}
            variant="outlined"
            disabled={isSubmitting}
            sx={{ borderRadius: 2.5, px: 2.5 }}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmitReport}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <ReportProblemOutlinedIcon />}
            sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetailContactSection;

