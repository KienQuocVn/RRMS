import { Box, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DASHBOARD_COLORS } from './constants/dashboardTheme'
import DashboardPageHeader from './components/DashboardPageHeader'
import StatCardsRow from './components/StatCardsRow'
import PostMonthlyBarChart from './components/charts/PostMonthlyBarChart'
import PostStatusDonutChart from './components/charts/PostStatusDonutChart'
import NewUsersLineChart from './components/charts/NewUsersLineChart'
import TopCitiesBarChart from './components/charts/TopCitiesBarChart'
import PendingPostsTable from './components/PendingPostsTable'
import RecentActivityFeed from './components/RecentActivityFeed'
import { useDashboardData } from './hooks/useDashboardData'

const DashboardHome = () => {
  const {
    loading,
    stats,
    postsByMonth,
    postStatus,
    hostsMonthly,
    tenantsMonthly,
    topCities,
    pendingPosts,
    activities,
    approvePost,
    rejectPost
  } = useDashboardData()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress sx={{ color: DASHBOARD_COLORS.primary }} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        bgcolor: DASHBOARD_COLORS.pageBg,
        minHeight: '100%',
        mx: -2,
        mt: -2,
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 }
      }}>
      <DashboardPageHeader />
      <StatCardsRow stats={stats} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <PostMonthlyBarChart data={postsByMonth} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <PostStatusDonutChart postStatus={postStatus} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <NewUsersLineChart hostsMonthly={hostsMonthly} tenantsMonthly={tenantsMonthly} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TopCitiesBarChart cities={topCities} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <PendingPostsTable posts={pendingPosts} onApprove={approvePost} onReject={rejectPost} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <RecentActivityFeed activities={activities} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardHome
