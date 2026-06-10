import { Box, Typography, Chip, Avatar, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

const AccountHeader = ({ account }) => {
  const username = account.username;
  const phone = account.phone;
  const email = account.email;
  const isVerified = account.isVerified || false;
  const accountType = 'Trải nghiệm & Miễn phí';
  const uid = account.uid;

  return (
    <Box sx={{ bgcolor: '#2b7ed7', borderRadius: 4, color: 'white', overflow: 'hidden', mb: 3 }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar src="https://quanlytro.me/./images/avatar.png" sx={{ width: 64, height: 64, border: '2px solid white' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">{username}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5, opacity: 0.9 }}>
            <Typography variant="body2">{phone}</Typography>
            <IconButton size="small" sx={{ color: 'white', p: 0 }}><ContentCopyIcon fontSize="small" /></IconButton>
            <Typography variant="body2">• {email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<VerifiedUserOutlinedIcon style={{ color: isVerified ? 'white' : 'rgba(255,255,255,0.7)' }} />} 
              label={isVerified ? "Tài khoản Đã xác minh" : "Tài khoản Chưa được xác minh"} 
              size="small" 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} 
            />
            <Chip 
              icon={<StarOutlineIcon style={{ color: 'white' }} />} 
              label={accountType} 
              size="small" 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} 
            />
            <Chip 
              label={`UID ${uid}`} 
              size="small" 
              onDelete={() => {}} 
              deleteIcon={<ContentCopyIcon style={{ color: 'rgba(0,0,0,0.6)', fontSize: '14px' }} />}
              sx={{ bgcolor: '#fde0b2', color: '#b26500', fontWeight: 'bold' }} 
            />
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', bgcolor: '#20a9e7', p: 2, gap: 2 }}>
        <Box sx={{ flex: 1, p: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase' }}>Loại tài khoản</Typography>
          <Typography variant="subtitle1" fontWeight="bold">{accountType}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountHeader;
