import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const DetailBreadcrumbs = ({ title, province, category, homeLabel }) => {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<ChevronRightRoundedIcon sx={{ fontSize: 18 }} />}
      sx={{ mb: 3, color: 'text.secondary' }}>
      <MuiLink
        component={RouterLink}
        to="/"
        underline="hover"
        color="inherit"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
        <HomeRoundedIcon sx={{ fontSize: 18 }} />
        {homeLabel}
      </MuiLink>

      {province && (
        <Typography variant="body2" color="text.secondary">
          {province}
        </Typography>
      )}

      {category && (
        <Typography variant="body2" color="text.secondary">
          {category}
        </Typography>
      )}

      <Typography
        color="text.primary"
        sx={{
          fontWeight: 700,
          maxWidth: 420,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {title}
      </Typography>
    </Breadcrumbs>
  );
};

export default DetailBreadcrumbs;
