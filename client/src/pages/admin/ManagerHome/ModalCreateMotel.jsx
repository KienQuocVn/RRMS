import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Grid,
  Divider,
  Alert,
  IconButton,
  Paper,
  Chip
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'

import { getPhuongXa, getQuanHuyen, getTinhThanh } from '~/apis/addressAPI'
import { getAllTypeRoom } from '~/apis/typeRoomAPI'
import { createMotel, getMotelById, updateMotel } from '~/apis/motelAPI'
import { createSerivceMotel } from '~/apis/motelServiceAPI'
import { createRoom } from '~/apis/roomAPI'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import { isValidRouteParam } from '~/utils/apiAdapters'

const ModalCreateMotel = ({ username, MotelId, open, onClose }) => {
  const navigate = useNavigate()

  // Location State
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [addressDetail, setAddressDetail] = useState('')

  // Data State
  const [typeRooms, setTypeRooms] = useState([])
  const [jsonData, setJsonData] = useState([])
  const [fileName, setFileName] = useState('')

  const [dataCreateAuto, setDataCreateAuto] = useState({
    typeMotelCreate: '',
    totalRoomCreate: ''
  })

  // Services State
  const [priceItemEle, setPriceItemEle] = useState('3')
  const [priceItemWater, setPriceItemWater] = useState('3')
  const [priceItemTrash, setPriceItemTrash] = useState('0')
  const [priceItemWifi, setPriceItemWifi] = useState('0')

  // Motel State
  const [motel, setMotel] = useState({
    typeRoom: '',
    motelName: '',
    methodofcreation: 'disable',
    area: '',
    averagePrice: '',
    maxperson: 4,
    invoicedate: 1,
    paymentdeadline: 5
  })

  // Fetch initial data
  useEffect(() => {
    fetchDataTypeRoom()
    getTinhThanh()
      .then((res) => {
        if (res.data.error === 0) setProvinces(res.data.data)
      })
      .catch(console.error)
  }, [])

  // Handle Edit Mode or Create Mode
  useEffect(() => {
    if (open) {
      if (isValidRouteParam(MotelId) && MotelId !== 'Create') {
        fetchDataWhenEdit(MotelId)
      } else {
        resetForm()
      }
    }
  }, [MotelId, open])

  const resetForm = () => {
    setMotel({
      typeRoom: '',
      motelName: '',
      methodofcreation: 'disable',
      area: '',
      averagePrice: '',
      maxperson: 4,
      invoicedate: 1,
      paymentdeadline: 5
    })
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setAddressDetail('')
    setJsonData([])
    setFileName('')
  }

  const fetchDataTypeRoom = async () => {
    try {
      const res = await getAllTypeRoom()
      setTypeRooms(res.result || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDataWhenEdit = async (id) => {
    if (!username || !isValidRouteParam(id)) return
    try {
      const res = await getMotelById(id)
      const data = res.data.result
      setMotel({
        typeRoom: data.typeRoom.typeRoomId,
        motelName: data.motelName,
        methodofcreation: data.methodofcreation,
        area: data.area,
        averagePrice: data.averagePrice,
        maxperson: data.maxperson,
        invoicedate: data.invoicedate,
        paymentdeadline: data.paymentdeadline
      })
      
      if (data.address) {
        const [detail, ward, dist, prov] = data.address.split(', ')
        setAddressDetail(detail || '')
        
        // Wait for provinces to load if needed, then districts, then wards
        const pId = Number(prov)
        const dId = Number(dist)
        setSelectedProvince(pId)
        
        getQuanHuyen(pId).then(r => {
          if (r.data.error === 0) {
            setDistricts(r.data.data)
            setSelectedDistrict(dId)
            getPhuongXa(dId).then(rw => {
              if (rw.data.error === 0) {
                setWards(rw.data.data)
                setSelectedWard(Number(ward))
              }
            })
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Handle Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setMotel((prev) => ({ ...prev, [name]: value }))
  }

  const handleProvinceChange = (e) => {
    const id = Number(e.target.value)
    setSelectedProvince(id)
    setSelectedDistrict('')
    setSelectedWard('')
    getQuanHuyen(id).then((res) => setDistricts(res.data.data))
  }

  const handleDistrictChange = (e) => {
    const id = Number(e.target.value)
    setSelectedDistrict(id)
    setSelectedWard('')
    getPhuongXa(id).then((res) => setWards(res.data.data))
  }

  const handleCreateServices = async (motelId) => {
    const services = [
      priceItemEle !== '0' && { motelId, nameService: 'Dịch vụ điện', price: 1700, chargetype: priceItemEle === '1' ? 'Theo người' : priceItemEle === '2' ? 'Theo tháng' : 'Theo đồng hồ' },
      priceItemWater !== '0' && { motelId, nameService: 'Dịch vụ nước', price: 18000, chargetype: priceItemWater === '1' ? 'Theo người' : priceItemWater === '2' ? 'Theo tháng' : 'Theo đồng hồ' },
      priceItemTrash !== '0' && { motelId, nameService: 'Dịch vụ rác', price: 15000, chargetype: priceItemTrash === '1' ? 'Theo người' : 'Theo tháng' },
      priceItemWifi !== '0' && { motelId, nameService: 'Dịch vụ wifi/internet', price: 50000, chargetype: priceItemWifi === '1' ? 'Theo người' : 'Theo tháng' }
    ].filter(Boolean)

    try {
      await Promise.all(services.map((s) => createSerivceMotel(s)))
    } catch (error) {
      console.error(error)
    }
  }

  // Excel handlers
  const downloadExcel = () => {
    const rows = [{ Nhóm: '', Tên: '', 'Giá thuê': '', 'Ưu tiên': '', 'Diện tích': '', 'Mức giá tiền cọc': '', 'Số tiền cọc đã thu': '', 'Số lượng thành viên': '', 'Chu kỳ đóng tiền': '', 'Ngày vào ở': '', 'Ngày hợp đồng': '', 'Ngày kết thúc hợp đồng': '', 'Trạng thái': '', 'Tài chính': '' }]
    const worksheet = XLSX.utils.json_to_sheet(rows)
    worksheet['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 12 }]
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KhachThue')
    XLSX.writeFile(workbook, 'DanhSachPhong.xlsx')
  }

  const handleFileExcelUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' })
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })
      const formatted = data.slice(1).map(row => ({
        group: row[0] || '', name: row[1] || '', price: row[2] || '', prioritize: row[3] || '',
        area: row[4] || '', deposit: row[5] || '', debt: row[6] || '', countTenant: row[7] || '',
        invoiceDate: row[8] || '', paymentCircle: row[9] || '', moveInDate: row[10] || '',
        contractDuration: row[11] || '', status: row[12] || '', finance: row[13] || ''
      }))
      setJsonData(formatted)
    }
    reader.readAsBinaryString(file)
  }

  const buildMotelPayload = () => ({
    typeRoom: { typeRoomId: motel.typeRoom },
    account: { username },
    motelName: motel.motelName,
    methodofcreation: motel.methodofcreation,
    address: `${addressDetail}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
    area: Number(motel.area),
    averagePrice: parseFloat(motel.averagePrice),
    maxperson: Number(motel.maxperson),
    invoicedate: Number(motel.invoicedate),
    paymentdeadline: Number(motel.paymentdeadline)
  })

  const saveDisableMethod = async () => {
    const payload = buildMotelPayload()
    try {
      const res = await createMotel(payload)
      await handleCreateServices(res.data.result.motelId)
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã tạo nhà trọ thành công!' })
      setTimeout(() => window.location.reload(), 1400)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra khi tạo nhà trọ' })
    }
  }

  const saveExcelMethod = async () => {
    try {
      const res = await createMotel(buildMotelPayload())
      const mId = res.data.result.motelId
      await handleCreateServices(mId)
      
      let success = true
      for (const [i, item] of jsonData.entries()) {
        try {
          await createRoom({ ...item, motelId: mId })
        } catch (error) {
          success = false
          console.error('Lỗi tại dòng', i + 2, error)
        }
      }
      if (success) Swal.fire({ icon: 'success', title: 'Thành công', text: 'Tạo phòng từ Excel thành công!' })
      else Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Một số phòng bị lỗi khi tạo.' })
      navigate(`/quanlytro/${mId}`)
      onClose()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra' })
    }
  }

  const saveEnableMethod = async () => {
    const totalRooms = parseInt(dataCreateAuto.totalRoomCreate, 10)
    const totalFloors = parseInt(dataCreateAuto.typeMotelCreate, 10)
    if (isNaN(totalRooms) || isNaN(totalFloors)) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng nhập đúng số lượng' })
      return
    }

    try {
      const res = await createMotel(buildMotelPayload())
      const mId = res.data.result.motelId
      await handleCreateServices(mId)

      const rooms = Array.from({ length: totalRooms }, (_, i) => ({
        motelId: mId,
        group: `Tầng ${(i % totalFloors) + 1}`,
        name: `Phòng ${i + 1}`,
        price: '', prioritize: '', area: '', deposit: '', debt: '', countTenant: '',
        invoiceDate: '', paymentCircle: '', moveInDate: '', contractDuration: '', status: '', finance: ''
      }))
      
      toast.info('Đang tạo phòng tự động...')
      await Promise.all(rooms.map(r => createRoom(r)))
      Swal.fire({ icon: 'success', title: 'Thành công', text: 'Tạo phòng thành công' })
      navigate(`/quanlytro/${mId}`)
      onClose()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra' })
    }
  }

  const handleSave = () => {
    if (!motel.motelName || !motel.typeRoom || !selectedProvince || !selectedDistrict || !selectedWard) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng điền đủ các trường bắt buộc (*)' })
      return
    }

    if (MotelId === 'Create') {
      if (motel.methodofcreation === 'disable') saveDisableMethod()
      else if (motel.methodofcreation === 'excel') saveExcelMethod()
      else saveEnableMethod()
    } else {
      updateMotel(MotelId, buildMotelPayload())
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Thành công', text: 'Cập nhật thành công!' })
          setTimeout(() => window.location.reload(), 1400)
        })
        .catch(() => Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra' }))
    }
  }

  const isEdit = MotelId !== 'Create'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: '50%', display: 'flex' }}>
            <HomeIcon sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {isEdit ? 'Chỉnh sửa nhà trọ' : 'Thêm nhà trọ'}
          </Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Section 1: Basic Info */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>1. Thông tin cơ bản</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required size="small">
                <InputLabel>Loại nhà trọ</InputLabel>
                <Select name="typeRoom" value={motel.typeRoom} onChange={handleInputChange} label="Loại nhà trọ">
                  {typeRooms.map(t => <MenuItem key={t.typeRoomId} value={t.typeRoomId}>{t.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required size="small" label="Tên nhà trọ" name="motelName" value={motel.motelName} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </Box>

        {/* Section 2: Address */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>2. Địa chỉ</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required size="small">
                <InputLabel>Tỉnh/Thành</InputLabel>
                <Select value={selectedProvince} onChange={handleProvinceChange} label="Tỉnh/Thành">
                  {provinces.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required size="small" disabled={!selectedProvince}>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select value={selectedDistrict} onChange={handleDistrictChange} label="Quận/Huyện">
                  {districts.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required size="small" disabled={!selectedDistrict}>
                <InputLabel>Phường/Xã</InputLabel>
                <Select value={selectedWard} onChange={(e) => setSelectedWard(Number(e.target.value))} label="Phường/Xã">
                  {wards.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required size="small" label="Số nhà, tên đường" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
            </Grid>
          </Grid>
        </Box>

        {/* Section 3: Creation Method (Create Only) */}
        {!isEdit && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>3. Phương thức khởi tạo dữ liệu</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                row
                name="methodofcreation"
                value={motel.methodofcreation}
                onChange={handleInputChange}
                sx={{ justifyContent: 'center', gap: 2 }}
              >
                <FormControlLabel value="enable" control={<Radio />} label="Tạo tự động" />
                <FormControlLabel value="excel" control={<Radio />} label="Tạo từ Excel" />
                <FormControlLabel value="disable" control={<Radio />} label="Tạo thủ công" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              {motel.methodofcreation === 'enable' && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.light', display: 'flex', gap: 2, alignItems: 'center' }}>
                  <InfoIcon color="info" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">Ghi chú:</Typography>
                    <Typography variant="body2">Hệ thống sẽ tự động tạo danh sách phòng theo tầng. Vui lòng nhập thông tin bên dưới.</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TextField fullWidth size="small" label="Số tầng" value={dataCreateAuto.typeMotelCreate} onChange={e => setDataCreateAuto({...dataCreateAuto, typeMotelCreate: e.target.value})} type="number" />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth size="small" label="Tổng số phòng" value={dataCreateAuto.totalRoomCreate} onChange={e => setDataCreateAuto({...dataCreateAuto, totalRoomCreate: e.target.value})} type="number" />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              )}
              {motel.methodofcreation === 'excel' && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.light', display: 'flex', gap: 2, alignItems: 'center' }}>
                  <InfoIcon color="warning" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Ghi chú:</Typography>
                    <Typography variant="body2" paragraph>Bạn cần tải file mẫu về, nhập dữ liệu và upload lên.</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={downloadExcel}>
                        Tải File Mẫu
                      </Button>
                      <Button variant="contained" component="label" size="small" startIcon={<UploadFileIcon />}>
                        Upload Excel
                        <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileExcelUpload} />
                      </Button>
                      {fileName && <Chip label={fileName} size="small" color="success" />}
                    </Box>
                  </Box>
                </Paper>
              )}
              {motel.methodofcreation === 'disable' && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.light', display: 'flex', gap: 2, alignItems: 'center' }}>
                  <InfoIcon color="info" />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Ghi chú:</Typography>
                    <Typography variant="body2">Bạn sẽ tạo từng phòng thủ công sau khi thêm nhà trọ.</Typography>
                  </Box>
                </Paper>
              )}
            </Box>
          </Box>
        )}

        {/* Section 4: Operational Config */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{isEdit ? '3' : '4'}. Thông tin vận hành</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <TextField fullWidth size="small" label="Ngày chốt điện nước" name="invoicedate" type="number" value={motel.invoicedate} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth size="small" label="Hạn đóng tiền (ngày)" name="paymentdeadline" type="number" value={motel.paymentdeadline} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth size="small" label="Diện tích trung bình" name="area" type="number" value={motel.area} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth size="small" label="Giá thuê trung bình" name="averagePrice" type="number" value={motel.averagePrice} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </Box>

        {/* Section 5: Default Services (Create Only) */}
        {!isEdit && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>5. Thiết lập dịch vụ mặc định</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Dịch vụ điện</InputLabel>
                  <Select value={priceItemEle} onChange={e => setPriceItemEle(e.target.value)} label="Dịch vụ điện">
                    <MenuItem value="0">Miễn phí/Không sử dụng</MenuItem>
                    <MenuItem value="1">Theo người</MenuItem>
                    <MenuItem value="2">Theo phòng</MenuItem>
                    <MenuItem value="3">Theo đồng hồ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Dịch vụ nước</InputLabel>
                  <Select value={priceItemWater} onChange={e => setPriceItemWater(e.target.value)} label="Dịch vụ nước">
                    <MenuItem value="0">Miễn phí/Không sử dụng</MenuItem>
                    <MenuItem value="1">Theo người</MenuItem>
                    <MenuItem value="2">Theo phòng</MenuItem>
                    <MenuItem value="3">Theo đồng hồ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Dịch vụ rác</InputLabel>
                  <Select value={priceItemTrash} onChange={e => setPriceItemTrash(e.target.value)} label="Dịch vụ rác">
                    <MenuItem value="0">Miễn phí/Không sử dụng</MenuItem>
                    <MenuItem value="1">Theo người</MenuItem>
                    <MenuItem value="2">Theo phòng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Dịch vụ Wifi</InputLabel>
                  <Select value={priceItemWifi} onChange={e => setPriceItemWifi(e.target.value)} label="Dịch vụ Wifi">
                    <MenuItem value="0">Miễn phí/Không sử dụng</MenuItem>
                    <MenuItem value="1">Theo người</MenuItem>
                    <MenuItem value="2">Theo phòng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">Hủy</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEdit ? 'Lưu thay đổi' : motel.methodofcreation === 'excel' ? 'Tạo từ File' : motel.methodofcreation === 'enable' ? 'Tạo Tự Động' : 'Thêm nhà trọ'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalCreateMotel
