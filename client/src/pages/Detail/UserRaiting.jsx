import { useEffect } from 'react';
import { Avatar, Box, Button, Rating, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import {
  getBulletinBoardReviewByBulletinBoardIdAndUsername,
  postBulletinBoardReview,
} from '~/apis/bulletinBoardReviewsAPI';

const UserRating = ({ roomId, username, setReview, review, refreshBulletinBoards, account }) => {
  useEffect(() => {
    if (!roomId || !username) {
      setReview({
        username: '',
        bulletinBoardId: roomId,
        rating: 1,
        content: '',
      });
      return;
    }

    getBulletinBoardReviewByBulletinBoardIdAndUsername(roomId, username).then((res) => {
      const result = res.result;

      if (result) {
        setReview({
          username,
          bulletinBoardId: roomId,
          rating: result.rating || 1,
          content: result.content || '',
        });
        return;
      }

      setReview({
        username,
        bulletinBoardId: roomId,
        rating: 1,
        content: '',
      });
    });
  }, [roomId, setReview, username]);

  const handleComment = async () => {
    const payload = {
      ...review,
      username,
      bulletinBoardId: roomId,
    };

    try {
      await postBulletinBoardReview(payload);
      toast.success('Danh gia thanh cong');
      refreshBulletinBoards();
    } catch (error) {
      console.error('Loi khi dang binh luan:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Đánh giá của bạn
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-start' }}>
        <Tooltip title={account?.fullname || ''}>
          <Avatar src={account?.avatar} sx={{ width: 48, height: 48 }}>
            {account?.fullname?.[0]}
          </Avatar>
        </Tooltip>

        <Stack spacing={1.5} sx={{ flex: 1 }}>
          <Rating
            name="user-rating"
            value={review.rating}
            onChange={(event, newValue) => {
              setReview({ ...review, rating: newValue || 1 });
            }}
          />

          <TextField
            multiline
            minRows={4}
            fullWidth
            value={review.content}
            placeholder="Chia sẻ cảm nhận của bạn về phòng này"
            onChange={(event) => setReview({ ...review, content: event.target.value })}
          />

          <Button variant="contained" onClick={handleComment} sx={{ alignSelf: 'flex-end', borderRadius: 3 }}>
            Gửi đánh giá
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserRating;
