import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Container, Paper, Skeleton, Tab } from '@mui/material'
import imageCompression from 'browser-image-compression'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getProfile } from '~/apis/profileAPI'
import BillingTab from './BillingTab'
import NotificationTab from './NotificationTab'
import ProfileTab from './ProfileTab'
import SecurityTab from './SecurityTab'
import ProfilePageHeader from './sections/ProfilePageHeader'
import ProfileSidebarCard from './sections/ProfileSidebarCard'

function Profile({ setIsAdmin, username }) {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState('1')
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const storedUser = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user') || 'null') : null
  const effectiveUsername = username || storedUser?.username || ''

  const tabs = [
    { value: '1', label: t('profile.tabs.profile'), icon: <PersonRoundedIcon fontSize="small" /> },
    { value: '2', label: t('profile.tabs.billing'), icon: <ReceiptLongRoundedIcon fontSize="small" /> },
    { value: '3', label: t('profile.tabs.security'), icon: <SecurityRoundedIcon fontSize="small" /> },
    { value: '4', label: t('profile.tabs.notifications'), icon: <NotificationsActiveRoundedIcon fontSize="small" /> }
  ]

  const metricItems = [
    { label: t('profile.metrics.monthsRented'), value: 0, color: '#0f172a' },
    { label: t('profile.metrics.monthsPaid'), value: 0, color: '#16a34a' },
    { label: t('profile.metrics.monthsUnpaid'), value: 0, color: '#ef4444' }
  ]

  useEffect(() => {
    setIsAdmin(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!effectiveUsername) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const nextProfile = await getProfile(effectiveUsername)
        setProfile(nextProfile)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error(t('profile.alerts.loadFailed'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [effectiveUsername, t])

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedImage)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedImage])

  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const handleImageChange = async (event) => {
    const image = event.target.files?.[0]
    if (!image) return

    try {
      const compressedImage = await imageCompression(image, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true
      })
      setSelectedImage(compressedImage)
    } catch (error) {
      console.error('Image compression failed:', error)
      toast.error(t('profile.alerts.imageFailed'))
    }
  }

  const handleCopyProfileLink = async () => {
    const profileLink = `${window.location.origin}/profile`

    try {
      await navigator.clipboard.writeText(profileLink)
      toast.success(t('profile.alerts.copiedLink'))
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error(t('profile.alerts.copyFailed'))
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Skeleton variant="rounded" height={140} sx={{ borderRadius: 4 }} />
          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0, 1fr)' },
              gap: 3
            }}
          >
            <Skeleton variant="rounded" height={420} sx={{ borderRadius: 4 }} />
            <Skeleton variant="rounded" height={520} sx={{ borderRadius: 4 }} />
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 4 },
        background: 'linear-gradient(180deg, #f5f9ff 0%, #eef6ff 42%, #ffffff 100%)'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <ProfilePageHeader profile={profile} username={effectiveUsername} />

          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0, 1fr)' },
              gap: 3,
              alignItems: 'start'
            }}
          >
            <ProfileSidebarCard
              profile={profile}
              avatarPreview={previewUrl || profile.avatar}
              metrics={metricItems}
              profileLink={`${window.location.origin}/profile`}
              onImageChange={handleImageChange}
              onCopyLink={handleCopyProfileLink}
            />

            <Paper
              variant="outlined"
              sx={{
                overflow: 'hidden',
                borderRadius: 4,
                borderColor: 'rgba(148, 163, 184, 0.2)',
                boxShadow: '0 24px 60px rgba(15, 23, 42, 0.06)',
                backgroundColor: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <TabContext value={tabIndex}>
                <Box
                  sx={{
                    px: { xs: 1.5, md: 2.5 },
                    pt: { xs: 1.5, md: 2 },
                    borderBottom: '1px solid rgba(148, 163, 184, 0.16)'
                  }}
                >
                  <TabList
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label={t('profile.header.title')}
                    sx={{
                      minHeight: 58,
                      '& .MuiTabs-flexContainer': {
                        gap: 0.75
                      },
                      '& .MuiTab-root': {
                        minHeight: 46,
                        px: 1.75,
                        borderRadius: 2.5,
                        fontWeight: 700,
                        color: '#667085'
                      },
                      '& .Mui-selected': {
                        color: '#155eef',
                        backgroundColor: '#eef4ff'
                      },
                      '& .MuiTabs-indicator': {
                        display: 'none'
                      }
                    }}
                  >
                    {tabs.map((tab) => (
                      <Tab key={tab.value} icon={tab.icon} iconPosition="start" label={tab.label} value={tab.value} />
                    ))}
                  </TabList>
                </Box>

                <TabPanel value="1" sx={{ p: { xs: 2, md: 3 } }}>
                  <ProfileTab
                    profile={profile}
                    setProfile={setProfile}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    username={effectiveUsername}
                  />
                </TabPanel>
                <TabPanel value="2" sx={{ p: { xs: 2, md: 3 } }}>
                  <BillingTab />
                </TabPanel>
                <TabPanel value="3" sx={{ p: { xs: 2, md: 3 } }}>
                  <SecurityTab username={profile.username || effectiveUsername} />
                </TabPanel>
                <TabPanel value="4" sx={{ p: { xs: 2, md: 3 } }}>
                  <NotificationTab />
                </TabPanel>
              </TabContext>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Profile
