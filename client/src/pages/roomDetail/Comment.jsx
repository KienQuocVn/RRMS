import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { Avatar, Box, Card, IconButton, Rating, Stack, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { deleteBulletinBoardReview } from '~/apis/bulletinBoardReviewsAPI';

const Comment = ({ item, username, refreshBulletinBoards, setReview, roomId }) => {
  const handleDeleteComment = async () => {
    try {
      await deleteBulletinBoardReview(item.bulletinBoardReviewsId);
      toast.success('Da xoa binh luan thanh cong');
      refreshBulletinBoards();
      setReview({
        username,
        bulletinBoardId: roomId,
        rating: 0,
        content: '',
      });
    } catch (error) {
      console.error('Loi xoa binh luan:', error);
    }
  };

  const canDelete = username === item?.account?.username;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        p: 2,
      }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start" justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={item?.account?.avatar} alt={item?.account?.fullname} sx={{ width: 48, height: 48 }}>
            {item?.account?.fullname?.[0]}
          </Avatar>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {item?.account?.fullname}
            </Typography>
            <Rating value={item?.rating || 0} size="small" readOnly />
          </Box>
        </Stack>

        {canDelete && (
          <Tooltip title="Xóa bình luận này">
            <IconButton color="error" onClick={handleDeleteComment}>
              <DeleteSweepOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Typography variant="body1" sx={{ mt: 1.5, lineHeight: 1.7 }}>
        {item?.content}
      </Typography>
    </Card>
  );
};

export default Comment;
