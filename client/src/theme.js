import { createTheme } from '@mui/material/styles'

// Shared color constants used across components
export const Colors = {
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  primary: '#20a9e7',
  grey: '#757575',
}

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#20a9e7', // Brand blue
          contrastText: '#fff'
        },
        secondary: {
          main: '#dcdde1'
        },
        background: {
          default: '#fff',
          paper: '#fff'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#20a9e7'
        },
        secondary: {
          main: '#353b48'
        },
        background: {
          default: '#1f1f1f',
          paper: '#1f1f1f'
        }
      }
    }
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: 'primary.main'
        },
        root: {
          height: '40px',
          alignItems: 'center'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '16px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 8,
          '&:last-child': {
            paddingBottom: 8
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          color: '#222'
        }
      }
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: '52px',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.25)'
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 0,
          padding: '6px 8px',
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem'
          },
          '& span': {
            fontSize: '0.625rem',
            lineHeight: 1
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          marginTop: '8px'
        }
      }
    }
  },
  shape: {
    borderRadius: 4
  }
})

export default theme
