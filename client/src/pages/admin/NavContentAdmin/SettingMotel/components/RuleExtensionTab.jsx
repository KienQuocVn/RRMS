import { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Grid, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';

const RuleExtensionTab = () => {
  // Utilities
  const [utilities, setUtilities] = useState({
    mezzanine: true,
    parking: true,
    privateToilet: true,
    separateOwner: true,
    wifi: true,
    camera: true,
    pets: false,
    balcony: false,
    livingRoom: false,
  });

  // Rules
  const [rules, setRules] = useState({
    notLate: true,
    payOnTime: true,
    noSmokingDrink: true,
    noCriminals: true,
    noNoise: true,
    politeBehavior: true,
  });

  // Hours
  const [openHour, setOpenHour] = useState('4h');
  const [closeHour, setCloseHour] = useState('22h');

  const handleUtilityChange = (key) => {
    setUtilities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRuleChange = (key) => {
    setRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Nội quy, giờ giấc, tiện ích cho thuê</Typography>
        <Typography variant="body2" color="textSecondary">
          Thiết lập thời gian, nội quy và tiện ích. Các thông tin này sẽ được sử dụng để đăng tin trong khi tìm khách thuê.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Utilities & Hours */}
        <Grid item xs={12} md={6}>
          {/* Utilities Section */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#2c3e50' }}>
            Tiện ích của Nhà trọ
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.mezzanine} onChange={() => handleUtilityChange('mezzanine')} color="info" />}
                label="Có gác lửng"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.parking} onChange={() => handleUtilityChange('parking')} color="info" />}
                label="Có chỗ giữ xe"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.privateToilet} onChange={() => handleUtilityChange('privateToilet')} color="info" />}
                label="Toilet riêng"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.separateOwner} onChange={() => handleUtilityChange('separateOwner')} color="info" />}
                label="Riêng với chủ"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.wifi} onChange={() => handleUtilityChange('wifi')} color="info" />}
                label="Có wifi"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.camera} onChange={() => handleUtilityChange('camera')} color="info" />}
                label="Có camera an ninh"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.pets} onChange={() => handleUtilityChange('pets')} color="info" />}
                label="Được nuôi thú cưng"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.balcony} onChange={() => handleUtilityChange('balcony')} color="info" />}
                label="Có ban công"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={utilities.livingRoom} onChange={() => handleUtilityChange('livingRoom')} color="info" />}
                label="Có nơi sinh hoạt"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Hours Section */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#2c3e50' }}>
            Nội dung giờ giấc của Nhà trọ
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="open-hour-label">Giờ mở cửa</InputLabel>
                <Select
                  labelId="open-hour-label"
                  value={openHour}
                  label="Giờ mở cửa"
                  onChange={(e) => setOpenHour(e.target.value)}
                >
                  <MenuItem value="4h">4h sáng</MenuItem>
                  <MenuItem value="5h">5h sáng</MenuItem>
                  <MenuItem value="6h">6h sáng</MenuItem>
                  <MenuItem value="7h">7h sáng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="close-hour-label">Giờ đóng cửa</InputLabel>
                <Select
                  labelId="close-hour-label"
                  value={closeHour}
                  label="Giờ đóng cửa"
                  onChange={(e) => setCloseHour(e.target.value)}
                >
                  <MenuItem value="21h">21h tối</MenuItem>
                  <MenuItem value="22h">22h tối</MenuItem>
                  <MenuItem value="23h">23h tối</MenuItem>
                  <MenuItem value="24h">24h khuya</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column: Rules */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#2c3e50' }}>
            Nội quy phòng trọ
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={rules.notLate} onChange={() => handleRuleChange('notLate')} color="info" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    Nhà trọ có giờ giấc không về quá khuya
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                    Không về sau 12h tối
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Checkbox checked={rules.payOnTime} onChange={() => handleRuleChange('payOnTime')} color="info" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    Đóng tiền trọ đúng ngày
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                    Đóng tiền trọ đúng ngày, không thiếu thường xuyên...
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Checkbox checked={rules.noSmokingDrink} onChange={() => handleRuleChange('noSmokingDrink')} color="info" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    Không hút thuốc, say xỉn
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                    Không tụ tập nhậu nhẹt, hát hò làm ảnh hưởng phòng xung quanh
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Checkbox checked={rules.noCriminals} onChange={() => handleRuleChange('noCriminals')} color="info" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    Không chứa chấp tội phạm
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                    Không che giấu và chứa chấp tội phạm trong phòng
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Checkbox checked={rules.noNoise} onChange={() => handleRuleChange('noNoise')} color="info" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    Không hát karaoke, nhậu nhẹt ảnh hưởng tới phòng kế bên
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                    Không gây ồn ào, mất trật tự, nhậu nhẹt, say xỉn...
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Checkbox checked={rules.politeBehavior} onChange={() => handleRuleChange('politeBehavior')} color="info" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#2c3e50' }}>
                    Cư xử văn hóa
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                    Không gây gỗ chửi thề, gây hiềm khích với mọi người, tạo văn hóa phòng trọ yên bình, hòa đồng.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RuleExtensionTab;
