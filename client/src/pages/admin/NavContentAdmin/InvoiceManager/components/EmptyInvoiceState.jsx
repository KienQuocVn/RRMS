import { Box, Typography } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'

const EmptyInvoiceState = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
        minHeight: 260,
      }}
    >
      {/* Illustration box */}
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 100,
          mb: 2,
        }}
      >
        {/* Box body */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90,
            height: 60,
            backgroundColor: '#f5a623',
            borderRadius: '4px 4px 8px 8px',
            boxShadow: '0 4px 12px rgba(245,166,35,0.35)',
          }}
        />
        {/* Box lid left */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 55,
            left: '50%',
            transform: 'translateX(-50%) rotate(-8deg)',
            transformOrigin: 'right center',
            width: 50,
            height: 20,
            backgroundColor: '#f5a623',
            borderRadius: '4px 0 0 4px',
          }}
        />
        {/* Box lid right */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 55,
            left: '50%',
            transform: 'translateX(-50%) rotate(8deg)',
            transformOrigin: 'left center',
            width: 50,
            height: 20,
            backgroundColor: '#e8951a',
            borderRadius: '0 4px 4px 0',
          }}
        />
        {/* Cloud/paper inside */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: 30,
            backgroundColor: '#e3f2fd',
            borderRadius: '50% 50% 8px 8px',
            border: '2px solid #90caf9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#42a5f5',
            }}
          />
        </Box>
        {/* Scattered dots */}
        {[
          { top: 20, left: 10, size: 6, color: '#90caf9' },
          { top: 40, left: 5, size: 4, color: '#bbdefb' },
          { top: 15, left: 105, size: 5, color: '#90caf9' },
          { top: 45, left: 110, size: 4, color: '#bbdefb' },
        ].map((dot, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              backgroundColor: dot.color,
            }}
          />
        ))}
      </Box>

      <Typography
        variant="body1"
        sx={{
          color: '#999',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          textAlign: 'center',
        }}
      >
        Không tìm thấy dữ liệu!
      </Typography>
    </Box>
  )
}

export default EmptyInvoiceState
