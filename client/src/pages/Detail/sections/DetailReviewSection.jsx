import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { Card, Pagination, Stack, Typography } from '@mui/material';
import Comment from '../Comment';
import RaitingAvg from '../RaitingAvg';
import UserRaiting from '../UserRaiting';

const DetailReviewSection = ({
  account,
  bulletinBoardId,
  comments,
  currentPage,
  onPageChange,
  refreshBulletinBoards,
  review,
  reviews,
  roomRating,
  setReview,
  totalPages,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2, md: 3 },
      }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <ChatBubbleOutlineRoundedIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Đánh giá và nhận xét
          </Typography>
        </Stack>

        <RaitingAvg rating={roomRating} reviews={reviews} />

        {reviews.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Chưa có đánh giá nào cho tin đăng này.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {comments.map((item) => (
              <Comment
                key={item.bulletinBoardReviewsId}
                item={item}
                refreshBulletinBoards={refreshBulletinBoards}
                roomId={bulletinBoardId}
                setReview={setReview}
                username={account?.username}
              />
            ))}
          </Stack>
        )}

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            sx={{ alignSelf: 'center' }}
          />
        )}

        {account && (
          <UserRaiting
            account={account}
            refreshBulletinBoards={refreshBulletinBoards}
            review={review}
            roomId={bulletinBoardId}
            setReview={setReview}
            username={account.username}
          />
        )}
      </Stack>
    </Card>
  );
};

export default DetailReviewSection;
