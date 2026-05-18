import React from 'react';
import { Box, Typography, Button, TextField, Grid, MenuItem } from '@mui/material';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

const SectionTitle = ({ title, subtitle }) => (
  <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 1.5, mb: 2 }}>
    <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>{subtitle}</Typography>
  </Box>
);

const GeneralInfoTab = ({ formData, handleInputChange, handleDateChange, handleSave, isExistingData }) => {
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Thông tin đại diện chủ tòa nhà</Typography>
          <Typography variant="body2" color="text.secondary">Thông tin dùng làm hợp đồng tạm trú cho khách thuê</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<LaunchOutlinedIcon />}
            sx={{ textTransform: 'none', borderRadius: 1.5, bgcolor: '#20a9e7' }}
          >
            Xem hợp đồng thuê phần mềm
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSave}
            sx={{ textTransform: 'none', borderRadius: 1.5, bgcolor: '#20a9e7' }}
          >
            Lưu thông tin
          </Button>
        </Box>
      </Box>

      <form id="househoder-setting-info">
        {/* Thông tin chủ hộ */}
        <Box sx={{ mb: 4 }}>
          <SectionTitle title="Thông tin chủ hộ:" subtitle="Thông tin chủ hộ được điền vào tờ khai tạm trú" />
          <TextField
            select
            fullWidth
            label="Chủ hộ *"
            name="householdhead"
            value={formData.householdhead}
            onChange={handleInputChange}
            variant="outlined"
            size="medium"
          >
            <MenuItem value="ktlhp">Khách thuê lập hộ mới</MenuItem>
            <MenuItem value="cnlđch">Chủ nhà là đại diện chủ hộ</MenuItem>
          </TextField>
        </Box>

        {/* Thông tin cơ bản */}
        <Box sx={{ mb: 4 }}>
          <SectionTitle title="Thông tin cơ bản:" subtitle="Các thông tin cơ bản dùng để hiển thị các thông tin đại diện" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nhập tên đại diện cho các loại giấy tờ *"
                name="representativename"
                value={formData.representativename}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nhập số điện thoại liên hệ *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Flatpickr
                  className="form-control"
                  style={{ width: '100%', height: '56px', padding: '16.5px 14px', borderRadius: '4px', border: '1px solid rgba(0, 0, 0, 0.23)' }}
                  placeholder="Nhập ngày/tháng/năm sinh *"
                  options={{ allowInput: true, dateFormat: 'd/m/Y' }}
                  value={formData.birth ? new Date(formData.birth) : ''}
                  onChange={(date) => { if (date && date.length > 0) handleDateChange('birth', date); }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Địa chỉ & nghề nghiệp */}
        <Box sx={{ mb: 4 }}>
          <SectionTitle title="Địa chỉ & nghề nghiệp:" subtitle="Thông tin này dùng để hiển thị trong hợp đồng" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nhập địa chỉ thường trú *"
                name="permanentaddress"
                value={formData.permanentaddress}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nhập công việc *"
                name="job"
                value={formData.job}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Thông tin định danh */}
        <Box sx={{ mb: 4 }}>
          <SectionTitle title="Thông tin định danh:" subtitle="Thông tin này dùng để hiển thị trong hợp đồng và cả tạm trú" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nhập mã định danh *"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nhập nơi cấp *"
                name="placeofissue"
                value={formData.placeofissue}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Flatpickr
                  className="form-control"
                  style={{ width: '100%', height: '56px', padding: '16.5px 14px', borderRadius: '4px', border: '1px solid rgba(0, 0, 0, 0.23)' }}
                  placeholder="Nhập ngày cấp *"
                  options={{ allowInput: true, dateFormat: 'd/m/Y' }}
                  value={formData.dateofissue ? new Date(formData.dateofissue) : ''}
                  onChange={(date) => handleDateChange('dateofissue', date)}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  );
};

export default GeneralInfoTab;
