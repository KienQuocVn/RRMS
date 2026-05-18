import { useState } from 'react';
import { Box, Typography, TextField, Switch, Grid, Alert, Button, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';

const InvoiceSettingTab = () => {
  const [invoiceDay, setInvoiceDay] = useState('1');
  const [paymentDeadline, setPaymentDeadline] = useState('30');
  const [zaloAutoSend, setZaloAutoSend] = useState(true);
  const [zaloTemplate, setZaloTemplate] = useState('table');
  const [showQR, setShowQR] = useState(true);
  const [classifyCategory, setClassifyCategory] = useState(false);
  const [roundInvoice, setRoundInvoice] = useState(true);
  const [defaultPayment, setDefaultPayment] = useState('cash');
  const [notes, setNotes] = useState('');

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ borderLeft: '4px solid #20a9e7', pl: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Cài đặt phiếu thu (hóa đơn)</Typography>
        <Typography variant="body2" color="textSecondary">Thiết lập, tùy chỉnh cho hóa đơn của bạn</Typography>
      </Box>

      {/* Grid Inputs */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ngày lập hóa đơn (trong khoảng 1 đến 31) *"
            value={invoiceDay}
            onChange={(e) => setInvoiceDay(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Hạn đóng tiền *"
            value={paymentDeadline}
            onChange={(e) => setPaymentDeadline(e.target.value)}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Grid Alerts */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Alert 
            icon={<InfoOutlinedIcon sx={{ color: '#20a9e7' }} />}
            sx={{ bgcolor: 'rgba(46, 204, 113, 0.08)', border: '1px solid rgba(46, 204, 113, 0.3)', color: '#2c3e50' }}
          >
            <Typography variant="body2" fontWeight="bold" sx={{ color: '#000000' }}>
              Thông tin: Khi đến ngày lập hóa đơn hệ thống sẽ nhắc nhở qua thông báo
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Alert 
            icon={<InfoOutlinedIcon sx={{ color: '#20a9e7' }} />}
            sx={{ bgcolor: 'rgba(46, 204, 113, 0.08)', border: '1px solid rgba(46, 204, 113, 0.3)', color: '#2c3e50' }}
          >
            <Typography variant="body2" fontWeight="bold" sx={{ color: '#000000' }}>
              Thông tin: Khi khách đóng tiền không đúng thời hạn hệ thống sẽ nhắc nhở
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Grid Guide Texts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary" sx={{ pl: 1 }}>
            - Là ngày lập hóa đơn tiền điện, nước...
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ pl: 1 }}>
            - Nhập một ngày trong tháng. Nếu không nhập mặc định là cuối tháng.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="textSecondary" sx={{ pl: 1, fontStyle: 'italic' }}>
            <b>Ví dụ:</b> Bạn lập phiếu ngày 01 và hạn đóng tiền thuê trọ ở đây là 5 ngày thì ngày 05 sẽ là ngày hết hạn
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Zalo Section */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Gửi hóa đơn tự động cho khách qua Zalo</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Tự động gửi hóa đơn qua zalo cho khách ngay khi tạo hóa đơn
              </Typography>
              <Typography variant="body2" color="error" sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                * Tính năng chỉ hoạt động khi bạn đang sử dụng gói có phí
              </Typography>
              <Typography variant="body2" color="error" sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                * Chỉ gửi từ 6h sáng đến 22h tối
              </Typography>
            </Box>
            <Switch 
              checked={zaloAutoSend} 
              onChange={() => setZaloAutoSend(!zaloAutoSend)} 
              color="info"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              variant="contained" 
              startIcon={<SendIcon />} 
              sx={{ bgcolor: '#20a9e7', '&:hover': { bgcolor: '#2b7ed7' }, textTransform: 'none' }}
            >
              Gửi xem trước
            </Button>
            <Button   
              variant="contained" 
              startIcon={<VisibilityIcon />} 
              sx={{ bgcolor: '#f39c12', '&:hover': { bgcolor: '#e67e22' }, textTransform: 'none' }}
            >
              Xem hình mẫu gửi zalo
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="zalo-template-label">Mẫu hóa đơn gửi qua zalo</InputLabel>
            <Select
              labelId="zalo-template-label"
              value={zaloTemplate}
              label="Mẫu hóa đơn gửi qua zalo"
              onChange={(e) => setZaloTemplate(e.target.value)}
            >
              <MenuItem value="table">Mẫu dạng bảng</MenuItem>
              <MenuItem value="simple">Mẫu đơn giản</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Switch options */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ pr: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Ẩn/Hiển mã QR trong hóa đơn</Typography>
              <Typography variant="body2" color="textSecondary">
                Bạn muốn hiển thị thông tin tài khoản & số tiền hóa đơn bằng mã QR giúp khách hàng thanh toán chuyển khoản nhanh hơn ?
              </Typography>
            </Box>
            <Switch 
              checked={showQR} 
              onChange={() => setShowQR(!showQR)} 
              color="info"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ pr: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Phân loại thu/chi từ hóa đơn</Typography>
              <Typography variant="body2" color="textSecondary">
                Khi thu tiền hóa đơn bạn muốn phân tách các phiếu thu chi rõ ràng như: Tiền phòng/giường, tiền dịch vụ, giảm trừ, cộng thêm
              </Typography>
            </Box>
            <Switch 
              checked={classifyCategory} 
              onChange={() => setClassifyCategory(!classifyCategory)} 
              color="info"
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Round & Default Payment */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ pr: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50' }}>Làm tròn hóa đơn</Typography>
              <Typography variant="body2" color="textSecondary">
                Làm tròn đơn vị 1.000 đ Ví dụ: 4.300 đ &rarr; 4.000đ, 4.500 đ &rarr; 4.000 đ, 4.600 đ &rarr; 5.000đ, 4.800 đ &rarr; 5.000đ
              </Typography>
            </Box>
            <Switch 
              checked={roundInvoice} 
              onChange={() => setRoundInvoice(!roundInvoice)} 
              color="info"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="default-payment-label">Hình thức thanh toán mặc định *</InputLabel>
            <Select
              labelId="default-payment-label"
              value={defaultPayment}
              label="Hình thức thanh toán mặc định *"
              onChange={(e) => setDefaultPayment(e.target.value)}
            >
              <MenuItem value="cash">Tiền mặt</MenuItem>
              <MenuItem value="transfer">Chuyển khoản</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Notes */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" fontWeight="bold" sx={{ color: '#2c3e50', mb: 1 }}>Ghi chú thêm cho hóa đơn</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Ví dụ: Các vi phạm khi đóng tiền trễ hạn..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default InvoiceSettingTab;
