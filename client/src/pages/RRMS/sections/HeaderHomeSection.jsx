import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Autocomplete, Box, Button, Chip, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { formatterAmount } from '~/utils/formatterAmount'

function HeaderHomeSection({ searchText, onSearchTextChange, onSearch, searchOptions, stats }) {
  return (
    <Box
      id="header-home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        background:
          "linear-gradient(125deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 118, 110, 0.86) 50%, rgba(245, 158, 11, 0.78) 100%), url('/backgroud_plaform.jpeg') center/cover no-repeat"
      }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(255,255,255,0.12), transparent 24%)'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 7, md: 10 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} lg={7}>
            <Chip
              icon={<AutoAwesomeRoundedIcon sx={{ color: '#0f172a !important' }} />}
              label="Nền tảng tìm phòng trọ, căn hộ mini và ký túc xá"
              sx={{
                mb: 2.5,
                bgcolor: '#fef3c7',
                color: '#0f172a',
                fontWeight: 800
              }}
            />

            <Typography
              variant="h2"
              sx={{
                maxWidth: 760,
                fontSize: { xs: '2.3rem', md: '4rem' },
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.04em'
              }}>
              Khám phá phòng cho thuê đúng khu vực, đúng mức giá và dễ ra quyết định hơn.
            </Typography>

            <Typography sx={{ mt: 2, maxWidth: 720, color: 'rgba(255,255,255,0.84)', fontSize: { xs: 15, md: 17 }, lineHeight: 1.8 }}>
              Giao diện mới chia nhỏ theo từng section rõ ràng để người dùng tìm nhanh hơn, đồng thời giúp đội ngũ dễ quản lý và mở rộng sau này.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                mt: 3.5,
                p: { xs: 2, md: 2.25 },
                borderRadius: 5,
                bgcolor: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(14px)'
              }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <Autocomplete
                  freeSolo
                  options={searchOptions}
                  fullWidth
                  inputValue={searchText}
                  onInputChange={(_, value) => onSearchTextChange(value)}
                  onChange={(_, value) => onSearch(typeof value === 'string' ? value : value?.label || '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option?.label || '')}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{option.label}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: 13 }}>{option.caption}</Typography>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Nhập tỉnh thành, quận huyện, phường xã hoặc tên đường"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          onSearch(searchText)
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <SearchRoundedIcon sx={{ mr: 1, color: '#64748b' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          minHeight: 58,
                          bgcolor: '#fff',
                          borderRadius: 3.5
                        }
                      }}
                    />
                  )}
                />

                <Button
                  variant="contained"
                  onClick={() => onSearch(searchText)}
                  sx={{
                    minWidth: { xs: '100%', md: 156 },
                    minHeight: 58,
                    borderRadius: 3.5,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                    color: '#111827',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                    }
                  }}>
                  Tìm ngay
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.16)',
                bgcolor: 'rgba(255,255,255,0.92)',
                boxShadow: '0 24px 70px rgba(15, 23, 42, 0.16)'
              }}>
              <Box
                sx={{
                  minHeight: 300,
                  borderRadius: 4,
                  background:
                    "linear-gradient(160deg, rgba(16, 185, 129, 0.18), rgba(59, 130, 246, 0.1)), url('/RRMS.png') center/cover no-repeat"
                }}
              />

              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2.25, borderRadius: 4, bgcolor: '#f8fafc', height: '100%' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#0f766e' }}>
                      Mạng lưới hiện có
                    </Typography>
                    <Typography sx={{ mt: 1, fontSize: 30, fontWeight: 900, color: '#0f172a' }}>{stats.totalRooms}</Typography>
                    <Typography sx={{ mt: 0.5, color: '#475569', lineHeight: 1.65 }}>Tin cho thuê đang hoạt động và sẵn sàng để tìm kiếm.</Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2.25, borderRadius: 4, bgcolor: '#0f172a', color: '#fff', height: '100%' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>Giá thuê trung bình</Typography>
                    <Typography sx={{ mt: 1, fontSize: 24, fontWeight: 900 }}>{formatterAmount(stats.averagePrice)}</Typography>
                    <Typography sx={{ mt: 0.5, color: 'rgba(255,255,255,0.76)', lineHeight: 1.65 }}>Giúp người thuê có một mốc tham chiếu nhanh trước khi lọc sâu.</Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha('#0f766e', 0.12)} 0%, ${alpha('#2563eb', 0.08)} 100%)`
                    }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                      {stats.provinces} tỉnh thành, {stats.districts} quận huyện và {stats.wards} phường xã đã có tin đăng
                    </Typography>
                    <Typography sx={{ mt: 1, color: '#475569', lineHeight: 1.65 }}>
                      Bạn có thể bắt đầu từ địa bàn lớn, sau đó đi dần xuống từng quận huyện hoặc phường xã ngay trên cùng một trang.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HeaderHomeSection
