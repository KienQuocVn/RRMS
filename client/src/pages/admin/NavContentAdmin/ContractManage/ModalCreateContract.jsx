import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Swal from 'sweetalert2';
import {
  getRoomById,
  getServiceRoombyRoomId,
  updateSerivceRoom,
  DeleteRoomServiceByid,
  createRoomService
} from '~/apis/roomAPI';
import { getPhuongXa, getQuanHuyen, getTinhThanh } from '~/apis/addressAPI';
import { getMotelById } from '~/apis/motelAPI';
import { getAllMotelDevices, getAllDeviceByRomId, deleteRoomDevice, insertRoomDevice } from '~/apis/deviceAPT';
import { getContractTemplatesByMotelId, createTenant, createContract } from '~/apis/contractTemplateAPI';

function ModalCreateContract({ toggleModal, modalOpen, roomId, motelId }) {
  const username = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).username : null;
  const [room, setRoom] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [motelServices, setMotelServices] = useState([]);
  const [motelDevices, setMotelSDevices] = useState([]);
  const [contractTemplates, setcontractTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomServices, setRoomServices] = useState([]);
  const [roomDevices, setRoomDevices] = useState([]);

  const [tenant, setTenant] = useState({
    fullName: '',
    phone: '',
    cccd: '',
    email: '',
    birthday: null,
    gender: 'OTHER',
    address: '',
    job: '',
    licenseDate: null,
    placeOfLicense: '',
    frontPhoto: '',
    backPhoto: '',
    role: true,
    temporaryResidence: false,
    informationVerify: false
  });

  const [contract, setContract] = useState({
    roomId: null,
    tenantId: null,
    username: username,
    contracttemplateId: null,
    brokerId: null,
    moveinDate: new Date().toISOString().slice(0, 10),
    leaseTerm: '',
    closeContract: '',
    description: '',
    debt: 0.0,
    price: 0.0,
    deposit: 0.0,
    collectioncycle: '1',
    createdate: new Date().toISOString().slice(0, 10),
    signcontract: 'Khách chưa ký',
    language: 'Viêt Nam',
    countTenant: 1,
    status: 'ACTIVE'
  });

  const fetchDataRoom = async (id) => {
    if (id) {
      try {
        const response = await getRoomById(id);
        if (response) {
          setRoom(response);
          fetchDataServiceRooms(id);
          fetchDataDeviceRooms(id);
          setContract((prev) => ({
            ...prev,
            roomId: response.roomId,
            price: response.price,
            deposit: response.price
          }));
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    }
  };

  const fetchDataServiceRooms = async (id) => {
    try {
      const roomServicesResponse = await getServiceRoombyRoomId(id);
      const updatedServices = motelServices.map((service) => {
        const roomService = roomServicesResponse.find(
          (rs) => rs.service.motelServiceId === service.motelServiceId
        );
        return {
          ...service,
          isSelected: !!roomService,
          quantity: roomService ? roomService.quantity : 0,
          roomId: id,
          roomServiceId: roomService ? roomService.roomServiceId : null
        };
      });
      setRoomServices(updatedServices);
    } catch (error) {
      console.error('Error fetching room services:', error);
    }
  };

  const fetchDataDeviceRooms = async (id) => {
    try {
      const roomDevicesResponse = await getAllDeviceByRomId(id);
      const updatedDevices = motelDevices.map((device) => {
        const roomDevice = roomDevicesResponse.result.find(
          (rd) => rd.motelDevice.motel_device_id === device.motel_device_id
        );
        return {
          ...device,
          isSelected: !!roomDevice,
          quantity: roomDevice ? roomDevice.quantity : 0,
          roomId: id,
          roomDeviceId: roomDevice ? roomDevice.roomDeviceId : null
        };
      });
      setRoomDevices(updatedDevices);
    } catch (error) {
      console.error('Error fetching room devices:', error);
    }
  };

  const handleContractChange = (e) => {
    const { name, value } = e.target;
    setContract((prev) => {
      const newContract = { ...prev };
      if (name === 'price' || name === 'deposit') {
        const numericValue = value.replace(/[^0-9]/g, '');
        newContract[name] = numericValue;
      } else if (name === 'leaseTerm' && prev.moveinDate) {
        const monthsToAdd = parseInt(value, 10);
        if (!isNaN(monthsToAdd)) {
          const moveinDate = new Date(prev.moveinDate);
          moveinDate.setMonth(moveinDate.getMonth() + monthsToAdd);
          newContract.closeContract = moveinDate.toISOString().slice(0, 10);
        }
        newContract.leaseTerm = value;
      } else {
        newContract[name] = value;
      }
      return newContract;
    });
  };

  const handleTenantChange = (e) => {
    const { name, value } = e.target;
    setTenant((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCity = async () => {
    try {
      const response = await getTinhThanh();
      if (response.data.error === 0) {
        setProvinces(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await getQuanHuyen(provinceId);
      if (response.data.error === 0) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await getPhuongXa(districtId);
      if (response.data.error === 0) {
        setWards(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleProvinceChange = (e) => {
    const provinceId = Number(e.target.value);
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedWard('');
    fetchDistricts(provinceId);
  };

  const handleDistrictChange = (e) => {
    const districtId = Number(e.target.value);
    setSelectedDistrict(districtId);
    setSelectedWard('');
    fetchWards(districtId);
  };

  const handleWardChange = (e) => {
    setSelectedWard(Number(e.target.value));
  };

  const fetchMotelServices = async (id) => {
    try {
      const response = await getMotelById(id);
      if (response.data?.code === 200 && response.data.result?.motelServices) {
        setMotelServices(response.data.result.motelServices);
      }
    } catch (error) {
      console.error('Error fetching motel services:', error);
    }
  };

  const fetchMotelDevices = async (id) => {
    try {
      const response = await getAllMotelDevices(id);
      if (response.code === 200) {
        setMotelSDevices(response.result);
      }
    } catch (error) {
      console.error('Error fetching motel devices:', error);
    }
  };

  const fetchMotelContractTemplate = async (id) => {
    try {
      const response = await getContractTemplatesByMotelId(id);
      if (response) {
        setcontractTemplates(response);
      }
    } catch (error) {
      console.error('Error fetching contract templates:', error);
    }
  };

  const handleApplyServices = async () => {
    const servicesToDelete = roomServices.filter((s) => !s.isSelected && s.roomServiceId);
    const servicesToUpdateOrAdd = roomServices.filter((s) => s.isSelected);
    
    const deletePromises = servicesToDelete.map((s) => DeleteRoomServiceByid(s.roomServiceId));
    const updateOrAddPromises = servicesToUpdateOrAdd.map((s) => {
      const data = {
        roomServiceId: s.roomServiceId || null,
        roomId: room.roomId,
        serviceId: s.motelServiceId,
        quantity: s.quantity || 1
      };
      return s.roomServiceId ? updateSerivceRoom(s.roomServiceId, data) : createRoomService(data);
    });

    await Promise.all([...deletePromises, ...updateOrAddPromises]);
  };

  const handleApplyDevice = async () => {
    const devicesToDelete = roomDevices.filter((d) => !d.isSelected && d.roomDeviceId);
    const devicesToAdd = roomDevices.filter((d) => d.isSelected && !d.roomDeviceId);

    const deletePromises = devicesToDelete.map((d) => deleteRoomDevice(d.roomId, d.motel_device_id));
    const addPromises = devicesToAdd.map((d) => {
      const data = {
        room: { roomId: d.roomId },
        motelDevice: { motel_device_id: d.motel_device_id },
        quantity: d.quantity || 1
      };
      return insertRoomDevice(data);
    });

    await Promise.all([...deletePromises, ...addPromises]);
  };

  const handleSubmit = async () => {
    if (!room?.roomId) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Chưa chọn phòng nào!' });
      return;
    }

    try {
      setLoading(true);
      Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await handleApplyServices();
      await handleApplyDevice();

      const tenantResponse = await createTenant(room.roomId, tenant);

      // Kiểm tra response hợp lệ từ createTenant
      if (!tenantResponse?.result?.tenantId) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tạo thông tin khách thuê. Vui lòng kiểm tra lại!' });
        return;
      }

      // Đổi contracttemplateId → contractTemplateId để khớp với backend DTO
      const { contracttemplateId, ...rest } = contract;
      const updatedContract = {
        ...rest,
        tenantId: tenantResponse.result.tenantId,
        contractTemplateId: contracttemplateId
      };
      await createContract(updatedContract);

      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Tạo hợp đồng thành công!' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra trong quá trình xử lý!' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen && roomId && motelId) {
      fetchDataRoom(roomId);
      fetchMotelServices(motelId);
      fetchMotelDevices(motelId);
      fetchMotelContractTemplate(motelId);
      fetchCity();
    }
  }, [modalOpen, roomId, motelId]);

  return (
    <Dialog open={modalOpen} onClose={toggleModal} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            mr: 2, bgcolor: '#20a9e7', color: 'white', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BookIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Thêm hợp đồng mới - {room?.name || '...'}
          </Typography>
        </Box>
        <IconButton onClick={toggleModal}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          
          {/* Section: Thời hạn hợp đồng */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon sx={{ mr: 1, color: '#20a9e7' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Thời hạn hợp đồng</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select fullWidth label="Thời hạn hợp đồng"
                  name="leaseTerm" value={contract.leaseTerm} onChange={handleContractChange}
                  size="small"
                >
                  <MenuItem value="">--Chọn thời hạn--</MenuItem>
                  {[
                    { v: '1', l: '1 tháng' }, { v: '2', l: '2 tháng' }, { v: '3', l: '3 tháng' },
                    { v: '6', l: '6 tháng' }, { v: '12', l: '1 năm' }, { v: '24', l: '2 năm' }
                  ].map((opt) => <MenuItem key={opt.v} value={opt.v}>{opt.l}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth type="date" label="Ngày vào ở"
                  name="moveinDate" value={contract.moveinDate} onChange={handleContractChange}
                  InputLabelProps={{ shrink: true }} size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth type="date" label="Ngày kết thúc hợp đồng"
                  name="closeContract" value={contract.closeContract} onChange={handleContractChange}
                  InputLabelProps={{ shrink: true }} size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          {/* Section: Thông tin khách thuê */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: '#20a9e7' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Thông tin khách thuê</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth type="number" label="Số lượng thành viên"
                  name="countTenant" value={contract.countTenant} onChange={handleContractChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Tên người ở"
                  name="fullName" value={tenant.fullName} onChange={handleTenantChange}
                  size="small" required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Số điện thoại"
                  name="phone" value={tenant.phone} onChange={handleTenantChange}
                  size="small" required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="CMND/CCCD"
                  name="cccd" value={tenant.cccd} onChange={handleTenantChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth select label="Tỉnh/Thành phố"
                  value={selectedProvince} onChange={handleProvinceChange}
                  size="small"
                >
                  <MenuItem value="">Chọn Tỉnh/Thành phố</MenuItem>
                  {provinces.map((p) => <MenuItem key={p.id} value={p.id}>{p.full_name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth select label="Quận/Huyện"
                  value={selectedDistrict} onChange={handleDistrictChange}
                  size="small" disabled={!selectedProvince}
                >
                  <MenuItem value="">Chọn quận/huyện</MenuItem>
                  {districts.map((d) => <MenuItem key={d.id} value={d.id}>{d.full_name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth select label="Phường/Xã"
                  value={selectedWard} onChange={handleWardChange}
                  size="small" disabled={!selectedDistrict}
                >
                  <MenuItem value="">Chọn Phường/Xã</MenuItem>
                  {wards.map((w) => <MenuItem key={w.id} value={w.id}>{w.full_name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Địa chỉ cụ thể"
                  name="address" value={tenant.address} onChange={handleTenantChange}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          {/* Section: Dịch vụ sử dụng */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Dịch vụ sử dụng</Typography>
              <Typography variant="caption" color="text.secondary">Thêm dịch vụ sử dụng như: điện, nước, rác, wifi...</Typography>
            </Box>
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
              {motelServices.map((service) => {
                const isSelected = roomServices.some(s => s.motelServiceId === service.motelServiceId && s.isSelected);
                return (
                  <Box key={service.motelServiceId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, '&:last-child': { mb: 0 } }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setRoomServices(prev => {
                              const exists = prev.find(s => s.motelServiceId === service.motelServiceId);
                              if (checked) {
                                if (exists) return prev.map(s => s.motelServiceId === service.motelServiceId ? { ...s, isSelected: true, quantity: s.quantity || 1 } : s);
                                return [...prev, { ...service, isSelected: true, quantity: 1 }];
                              }
                              return prev.map(s => s.motelServiceId === service.motelServiceId ? { ...s, isSelected: false } : s);
                            });
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{service.nameService}</Typography>
                          <Typography variant="caption">{service.price.toLocaleString('vi-VN')}đ / {service.chargetype}</Typography>
                        </Box>
                      }
                    />
                    <TextField
                      size="small" type="number" sx={{ width: 100 }}
                      value={roomServices.find(s => s.motelServiceId === service.motelServiceId)?.quantity || 0}
                      disabled={!isSelected}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 0;
                        setRoomServices(prev => prev.map(s => s.motelServiceId === service.motelServiceId ? { ...s, quantity: qty } : s));
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          {/* Section: Giá trị hợp đồng */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoneyIcon sx={{ mr: 1, color: '#20a9e7' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Giá trị hợp đồng</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Giá thuê" name="price"
                  value={contract.price ? Number(contract.price).toLocaleString('vi-VN') : ''}
                  onChange={handleContractChange} size="small"
                  InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Tiền cọc" name="deposit"
                  value={contract.deposit ? Number(contract.deposit).toLocaleString('vi-VN') : ''}
                  onChange={handleContractChange} size="small"
                  InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select fullWidth label="Mẫu văn bản hợp đồng"
                  value={contract.contracttemplateId || ''}
                  onChange={(e) => setContract(prev => ({ ...prev, contracttemplateId: e.target.value }))}
                  size="small"
                >
                  <MenuItem value="">--Chọn mẫu--</MenuItem>
                  {contractTemplates.map((t) => <MenuItem key={t.contractTemplateId} value={t.contractTemplateId}>{t.templatename}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          {/* Section: Tài sản phòng */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Tài sản của phòng</Typography>
            </Box>
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
              {motelDevices.map((device) => {
                const isSelected = roomDevices.some(d => d.motel_device_id === device.motel_device_id && d.isSelected);
                return (
                  <Box key={device.motel_device_id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, '&:last-child': { mb: 0 } }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setRoomDevices(prev => {
                              const exists = prev.find(d => d.motel_device_id === device.motel_device_id);
                              if (checked) {
                                if (exists) return prev.map(d => d.motel_device_id === device.motel_device_id ? { ...d, isSelected: true, quantity: d.quantity || 1 } : d);
                                return [...prev, { ...device, isSelected: true, quantity: 1 }];
                              }
                              return prev.map(d => d.motel_device_id === device.motel_device_id ? { ...d, isSelected: false } : d);
                            });
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{device.deviceName}</Typography>
                          <Typography variant="caption">{device.value.toLocaleString('vi-VN')}đ / {device.unit}</Typography>
                        </Box>
                      }
                    />
                    <TextField
                      size="small" type="number" sx={{ width: 100 }}
                      value={roomDevices.find(d => d.motel_device_id === device.motel_device_id)?.quantity || 0}
                      disabled={!isSelected}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 0;
                        setRoomDevices(prev => prev.map(d => d.motel_device_id === device.motel_device_id ? { ...d, quantity: qty } : d));
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={toggleModal} sx={{ color: '#666', textTransform: 'none' }}>Đóng</Button>
        <Button
          onClick={handleSubmit} variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          sx={{ bgcolor: '#20a9e7', '&:hover': { bgcolor: '#1791c8' }, textTransform: 'none', px: 3 }}
          disabled={loading}
        >
          Thêm hợp đồng mới
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalCreateContract;
