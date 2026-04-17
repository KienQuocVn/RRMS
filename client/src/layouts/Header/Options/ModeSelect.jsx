import { IconButton, useColorScheme } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

const ModeSelect = () => {
  const { mode, setMode } = useColorScheme()

  if (!mode) {
    return null
  }

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  return (
    <IconButton
      onClick={toggleMode}
      aria-label="toggle color mode"
      color="inherit"
      sx={{
        p: 0.5,
        color: 'inherit',
        flexShrink: 0
      }}
    >
      {mode === 'light' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </IconButton>
  )
}

export default ModeSelect
