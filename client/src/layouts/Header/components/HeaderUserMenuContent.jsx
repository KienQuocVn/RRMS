import { Box, Avatar, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAccountSections } from './headerData';

const HeaderUserMenuContent = ({ 
  avatar, 
  mobile = false, 
  onClose, 
  onLogout, 
  tokenExists, 
  username 
}) => {
  const sections = getAccountSections(tokenExists);

  // Kích thước theo mobile hoặc desktop (giữ nguyên như cũ)
  const summaryHeight = mobile ? '140px' : '124px';
  const summaryAvatarSize = mobile ? 64 : 40;
  const summaryFallbackSize = mobile ? '64px' : '48px';
  const itemHeight = mobile ? '44px' : '40px';
  const sectionTitleHeight = mobile ? '42px' : '38px';

  const renderSummary = () => {
    if (tokenExists && username) {
      return (
        <MuiLink
          component={Link}
          to="/profile"
          onClick={onClose}
          underline="none"
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <Avatar 
            src={avatar} 
            sx={{ width: summaryAvatarSize, height: summaryAvatarSize }}
          >
            {username?.[0]?.toUpperCase()}
          </Avatar>
          <Box 
            sx={{ 
              marginLeft: mobile ? '12px' : '8px',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#222222',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {username}
          </Box>
        </MuiLink>
      );
    }

    // Chưa đăng nhập
    return (
      <MuiLink
        component={Link}
        to="/login"
        onClick={onClose}
        underline="none"
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          color: 'inherit',
        }}
      >
        <Box
          sx={{
            width: summaryFallbackSize,
            height: summaryFallbackSize,
            borderRadius: '50%',
            backgroundImage: `url(${avatar || '/default_user.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
          }}
        />
        <Box 
          sx={{ 
            marginLeft: mobile ? '12px' : '8px',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#222222',
          }}
        >
          Đăng nhập / Đăng ký
        </Box>
      </MuiLink>
    );
  };

  const renderMenuItem = (item) => {
    const isLogout = item.action === 'logout';

    const content = (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        padding: '0 12px',
      }}>
        <Box sx={{ width: '24px', marginRight: '12px' }}>
          <img 
            src={item.iconSrc} 
            alt={item.label} 
            style={{ width: '24px', height: '24px' }} 
          />
        </Box>

        <Box sx={{ flex: 1, fontSize: '1rem', color: '#222222' }}>
          {item.label}
        </Box>

        {item.actionLabel && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#4bcffa',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}>
            <b>{item.actionLabel}</b>
            <img 
              src={item.actionIconSrc} 
              alt="chevron" 
              style={{ marginLeft: '4px', width: '16px' }} 
            />
          </Box>
        )}
      </Box>
    );

    const baseStyle = {
      height: itemHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      color: '#222222',
      textDecoration: 'none',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#E8E8E8',
      },
    };

    if (isLogout) {
      return (
        <Box
          component="a"
          onClick={onLogout}
          sx={baseStyle}
        >
          {content}
        </Box>
      );
    }

    return (
      <MuiLink
        component={Link}
        to={item.to}
        onClick={onClose}
        underline="none"
        sx={{
          ...baseStyle,
          backgroundColor: item.highlight ? '#ebfaff' : 'transparent',
        }}
      >
        {content}
      </MuiLink>
    );
  };

  return (
    <Box>
      {/* Phần Summary (Avatar + Tên hoặc Đăng nhập) */}
      <Box 
        sx={{ 
          position: 'relative', 
          padding: '12px', 
          height: summaryHeight 
        }}
      >
        {renderSummary()}

        {/* Virtual Account Banner */}
        <Box 
          sx={{ 
            marginTop: '8px',
            backgroundColor: '#306bd9',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '47px', position: 'relative' }}>
            <img 
              src="/virtual-account-banner-icon.png" 
              alt="va_banner_icon" 
              style={{ 
                position: 'absolute', 
                left: '-3px', 
                bottom: '0', 
                width: '50px', 
                height: '40px' 
              }} 
            />
            <span>Nạp Đồng Tốt giá trị linh hoạt</span>
          </Box>

          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M5.37301 3.12235C5.58129 2.91407 5.91893 2.91407 6.12721 3.12235L10.6273 7.62235C10.8356 7.83063 10.8356 8.16827 10.6273 8.37655L6.12721 12.8766C5.91893 13.0849 5.58129 13.0849 5.37301 12.8766C5.16473 12.6683 5.16473 12.3307 5.37301 12.1224L9.49588 7.99951L5.37301 3.87664C5.16473 3.66836 5.16473 3.33072 5.37301 3.0183Z" 
              fill="#fff" 
            />
          </svg>
        </Box>
      </Box>

      {/* Các Section */}
      {sections.map((section) => (
        <Box key={section.title} sx={{ marginTop: '20px' }}>
          {/* Tiêu đề section */}
          <Box
            sx={{
              height: sectionTitleHeight,
              backgroundColor: '#f5f5f5',
              padding: '10px 0 10px 12px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#777777',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {section.title}
          </Box>

          {/* Danh sách items */}
          {section.items.map((item) => (
            <Box key={item.label} sx={{ padding: '0' }}>
              {renderMenuItem(item)}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default HeaderUserMenuContent;