import { AppBar, Toolbar, Grid } from '@mui/material'
import TopBar from './components/TopBar'
import MotelSelector from './components/MotelSelector'
import NavTabs from './components/NavTabs'

const Navbar = ({ motelName }) => (
  <AppBar position="static" sx={{ background: 'white' }}>
    <Toolbar>
      <Grid container spacing={1} alignItems="center">
        {/* Row 1: Logo + Global nav buttons */}
        <Grid item xs={12}>
          <TopBar />
        </Grid>

        {/* Row 2: Motel selector + Sub nav tabs */}
        <Grid item xs={12} sm={2} md={2} sx={{ mt: 1 }}>
          <MotelSelector motelName={motelName} />
        </Grid>

        <Grid item xs={12} sm={10} md={10} sx={{ mt: 1 }}>
          <NavTabs />
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
)

export default Navbar
