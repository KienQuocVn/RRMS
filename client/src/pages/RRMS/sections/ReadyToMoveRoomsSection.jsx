import { Box, Grid, Skeleton } from '@mui/material'
import SectionHeading from './SectionHeading'
import { LatestRoomCard } from './RoomCard'

const CompactSkeleton = () => (
  <Box
    sx={{
      height: '100%',
      borderRadius: 6,
      overflow: 'hidden',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      boxShadow: '0 20px 55px rgba(15, 23, 42, 0.08)'
    }}>
    <Skeleton variant="rectangular" height={220} />
    <Box sx={{ p: 2.5 }}>
      <Skeleton variant="text" height={34} width="78%" />
      <Skeleton variant="text" height={24} width="60%" />
      <Skeleton variant="text" height={24} width="48%" />
    </Box>
  </Box>
)

function ReadyToMoveRoomsSection({ rooms, loading }) {
  return (
    <Box id="ready-to-move-rooms" sx={{ mt: 7 }}>
      <SectionHeading
        eyebrow="Room Ready To Move In"
        title="Phòng có thể dọn vào ngay"
        description="Section này ưu tiên các lựa chọn đã sẵn sàng để nhận phòng hoặc không yêu cầu chờ đợi quá lâu."
      />

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} md={6} xl={3} key={index}>
                <CompactSkeleton />
              </Grid>
            ))
          : rooms.slice(0, 4).map((room) => (
              <Grid item xs={12} md={6} xl={3} key={room.bulletinBoardId}>
                <LatestRoomCard room={room} />
              </Grid>
            ))}
      </Grid>
    </Box>
  )
}

export default ReadyToMoveRoomsSection
