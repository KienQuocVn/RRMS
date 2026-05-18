import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Container, Paper, Tab, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import PersonIcon from '@mui/icons-material/Person'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import Post from './Post'
import Customer from './potentialCustomers'

const PostRooms = ({ setIsAdmin }) => {
  const [tabIndex, setTabIndex] = useState('1')
  useEffect(() => {
    setIsAdmin(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }
  return (
    <Box>
      <NavAdmin />

      <Box sx={{margin:'30px'}}>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#20a9e7', width: '4px', height: '45px', mr: 1, borderRadius: '4px' }}></Box>
          <Box>
            <Typography variant="h5">Tin đăng & khách tiềm năng</Typography>
            <Typography variant="subtitle2" sx={{ fontStyle: 'italic', color: '#555' }}>Tất cả tin đăng cho thuê</Typography>
          </Box>
        </Box>
        <Paper variant="outlined" sx={{ height: '100%' }}>
          <TabContext value={tabIndex}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                sx={{
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .Mui-selected': { bgcolor: '#20a9e7', color: 'white !important' }
                }}>
                <Tab
                  iconPosition="start"
                  icon={<FormatListBulletedIcon />}
                  label="Tin đăng cho thuê"
                  value="1"
                  sx={{ fontWeight: 'bold' }}
                />
                <Tab
                  iconPosition="start"
                  icon={<PersonIcon />}
                  label="Khách thuê tiềm năng"
                  value="2"
                  sx={{ fontWeight: 'bold' }}
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Post />
            </TabPanel>
            <TabPanel value="2">
              <Customer />
            </TabPanel>
          </TabContext>
        </Paper>
      </Box>
    </Box>
  )
}

export default PostRooms
