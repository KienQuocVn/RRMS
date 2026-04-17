import React from 'react'
import { Box, Button, Typography } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 520 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Có lỗi xảy ra khi hiển thị trang
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Bạn hãy tải lại trang để tiếp tục. Nếu lỗi vẫn còn, vui lòng liên hệ hỗ trợ.
            </Typography>
            <Button variant="contained" onClick={this.handleReload}>
              Tải lại trang
            </Button>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
