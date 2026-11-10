import React, { useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import PhotoGallery from './PhotoGallery';
import RoomMainInfo from './RoomMainInfo';
import RightSidebarInfo from './RightSidebarInfo';
import { useMotel } from '~/hooks/useMotel';
import { getRoomById } from '~/apis/roomAPI';
import { getServiceRoombyRoomId } from '~/apis/roomAPI';

/* ── Empty / Error helpers ── */
const EmptyRoom = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, gap: 2 }}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 22V12h6v10M9 7h.01M15 7h.01" />
    </svg>
    <Typography sx={{ fontSize: 14, color: '#9ca3af' }}>Chưa có thông tin phòng</Typography>
  </Box>
);

const ErrorBox = ({ message }) => (
  <Box sx={{ bgcolor: '#fff7ed', border: '0.5px solid #fed7aa', borderRadius: 2, p: 2, m: 2 }}>
    <Typography sx={{ fontSize: 13, color: '#7c2d12' }}>{message}</Typography>
  </Box>
);

/* ── Container ── */
const RoomDetail = () => {
  const { motels } = useMotel();
  const [roomData, setRoomData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoom = useCallback(async () => {
    const motel = motels?.[0];
    const roomId = motel?.roomId ?? motel?.room?.roomId ?? motel?.contract?.room?.roomId ?? motel?.currentRoomId ?? null;

    if (!roomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [room, svc] = await Promise.allSettled([
        getRoomById(roomId),
        getServiceRoombyRoomId(roomId),
      ]);

      if (room.status === 'fulfilled') {
        const value = room.value
        setRoomData(value ? {
          ...value,
          roomName: value.name ?? motel?.room?.name,
          address: motel?.address,
          floor: value.group,
          startDate: motel?.contract?.moveInDate,
          price: motel?.contract?.actualPrice ?? value.price,
          maxPeople: motel?.contract?.countTenant,
          motelName: motel?.motelName
        } : value)
      }
      if (svc.status === 'fulfilled') setServices(Array.isArray(svc.value) ? svc.value : []);
    } catch (err) {
      setError('Không thể tải thông tin phòng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [motels]);

  useEffect(() => { fetchRoom(); }, [fetchRoom]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 260 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) return <ErrorBox message={error} />;
  if (!roomData) return <EmptyRoom />;

  /* Normalize photos */
  const photos = Array.isArray(roomData.images)
    ? roomData.images.map(img => img?.imageUrl ?? img?.url ?? img)
    : roomData.imageUrl ? [roomData.imageUrl] : [];

  return (
    <Box sx={{ padding: '20px', bgcolor: '#f5f7fa', minHeight: '100%' }}>
      {/* Block 1 — Photo Gallery */}
      <PhotoGallery photos={photos} />

      {/* Block 2 — Info columns */}
      <Box
        sx={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        <RoomMainInfo room={roomData} services={services} />
        <RightSidebarInfo room={roomData} motel={motels?.[0]} />
      </Box>
    </Box>
  );
};

export default RoomDetail;
