import { useState, useEffect, useCallback, useMemo } from 'react'
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
  IconButton,
  Paper,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'

import { getPhuongXaByTinh, getTinhThanh } from '~/apis/addressAPI'
import { getAllTypeRoom } from '~/apis/typeRoomAPI'
import { createMotel, getMotelById, updateMotel } from '~/apis/motelAPI'
import { createSerivceMotel } from '~/apis/motelServiceAPI'
import { createRoom } from '~/apis/roomAPI'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import { isValidRouteParam } from '~/utils/apiAdapters'
import {
  getNonNegativeNumberFieldProps,
  isNegativeNumberValue,
  wrapNonNegativeNumberChange,
} from '~/utils/numberInputUtils'
import {
  formatVndInput,
  getVndInputFieldProps,
  parseVndInput,
  parseVndNumber,
} from '~/utils/currencyInputUtils'
import AddressMapPicker from './components/AddressMapPicker'

// Helper: Swal hiển thị trên Dialog MUI (zIndex Dialog mặc định là 1300)
const swal = (opts) => Swal.fire({
  ...opts,
  willOpen: () => {
    const container = Swal.getContainer()
    if (container) container.style.zIndex = '99999'
  },
})

const ModalCreateMotel = ({ username, MotelId, open, onClose }) => {
  const navigate = useNavigate()

  // Location State
  const [provinces, setProvinces] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [geocodeLoading, setGeocodeLoading] = useState(false)
  const [geocodeError, setGeocodeError] = useState('')
  const [manualPickMode, setManualPickMode] = useState(false)
  const [autoGeocode, setAutoGeocode] = useState(true)

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

  const resetForm = useCallback(() => {
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
    setSelectedWard('')
    setWards([])
    setAddressDetail('')
    setFullAddress('')
    setLat(null)
    setLng(null)
    setGeocodeLoading(false)
    setGeocodeError('')
    setManualPickMode(false)
    setAutoGeocode(true)
    setJsonData([])
    setFileName('')
  }, [])

  const getProvinceName = useCallback(
    (id) => provinces.find((p) => String(p.id) === String(id))?.full_name || '',
    [provinces]
  )

  const getWardName = useCallback(
    (id) => wards.find((w) => String(w.id) === String(id))?.full_name || '',
    [wards]
  )

  const geocodeQuery = useMemo(() => {
    const detail = addressDetail.trim()
    const wardName = getWardName(selectedWard)
    const provinceName = getProvinceName(selectedProvince)
    if (!detail || !wardName || !provinceName) return ''
    return `${detail}, ${wardName}, ${provinceName}, Việt Nam`
  }, [addressDetail, selectedWard, selectedProvince, getWardName, getProvinceName])

  useEffect(() => {
    if (!geocodeQuery) {
      setFullAddress('')
      setGeocodeError('')
      setManualPickMode(false)
      return undefined
    }

    setFullAddress(geocodeQuery.replace(/, Việt Nam$/, ''))

    if (!autoGeocode) return undefined

    const timer = setTimeout(async () => {
      setGeocodeLoading(true)
      setGeocodeError('')

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocodeQuery)}&format=json&limit=1&countrycodes=vn`,
          {
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'vi',
              'User-Agent': 'RRMS/1.0 (motel-address-picker)'
            }
          }
        )

        if (!res.ok) throw new Error('Geocoding failed')

        const data = await res.json()
        if (data?.length > 0) {
          setLat(parseFloat(data[0].lat))
          setLng(parseFloat(data[0].lon))
          setManualPickMode(false)
          setGeocodeError('')
        } else {
          setGeocodeError('Không tìm thấy địa chỉ trên bản đồ. Vui lòng click trên bản đồ để chọn vị trí thủ công.')
          setManualPickMode(true)
        }
      } catch {
        setGeocodeError('Lỗi khi tra cứu địa chỉ. Vui lòng click trên bản đồ để chọn vị trí thủ công.')
        setManualPickMode(true)
      } finally {
        setGeocodeLoading(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [geocodeQuery, autoGeocode])

  const handleMapPositionChange = useCallback(({ lat: newLat, lng: newLng }) => {
    setLat(newLat)
    setLng(newLng)
  }, [])

  const fetchDataTypeRoom = async () => {
    try {
      const res = await getAllTypeRoom()
      setTypeRooms(res.result || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDataWhenEdit = useCallback(async (id) => {
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
        const parts = data.address.split(', ').map((p) => p.trim())
        setAddressDetail(parts[0] || '')

        // Định dạng mới: chi tiết, phường/xã, tỉnh — hoặc cũ: chi tiết, phường/xã, quận/huyện, tỉnh
        const isLegacyFormat = parts.length >= 4
        const wardId = parts[1]
        const provinceId = isLegacyFormat ? parts[3] : parts[2]

        setSelectedProvince(provinceId)

        getPhuongXaByTinh(provinceId).then((res) => {
          if (res.data.error === 0) {
            setWards(res.data.data)
            setSelectedWard(wardId)
          }
        })
      }

      if (data.latitude != null && data.longitude != null) {
        setLat(data.latitude)
        setLng(data.longitude)
        setAutoGeocode(false)
      }
    } catch (error) {
      console.error(error)
    }
  }, [username])

  // Handle Edit Mode or Create Mode
  useEffect(() => {
    if (open) {
      if (isValidRouteParam(MotelId) && MotelId !== 'Create') {
        fetchDataWhenEdit(MotelId)
      } else {
        resetForm()
      }
    }
  }, [MotelId, open, fetchDataWhenEdit, resetForm])

  // Handle Inputs
  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'number' && isNegativeNumberValue(value)) return
    setMotel((prev) => ({
      ...prev,
      [name]: name === 'averagePrice' ? parseVndInput(value) : value,
    }))
  }

  const handleProvinceChange = (e) => {
    const id = e.target.value
    setSelectedProvince(id)
    setSelectedWard('')
    setWards([])
    setLat(null)
    setLng(null)
    setGeocodeError('')
    setManualPickMode(false)
    setAutoGeocode(true)
    getPhuongXaByTinh(id).then((res) => {
      if (res.data.error === 0) setWards(res.data.data)
    })
  }

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value)
    setLat(null)
    setLng(null)
    setGeocodeError('')
    setManualPickMode(false)
    setAutoGeocode(true)
  }

  const handleAddressDetailChange = (e) => {
    setAddressDetail(e.target.value)
    setLat(null)
    setLng(null)
    setGeocodeError('')
    setManualPickMode(false)
    setAutoGeocode(true)
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
    address: `${addressDetail}, ${selectedWard}, ${selectedProvince}`,
    latitude: lat,
    longitude: lng,
    area: Number(motel.area),
    averagePrice: parseVndNumber(motel.averagePrice),
    maxperson: Number(motel.maxperson),
    invoicedate: Number(motel.invoicedate),
    paymentdeadline: Number(motel.paymentdeadline)
  })

  const validateMotelArea = () => {
    const totalArea = Number(motel.area)
    if (!motel.area || Number.isNaN(totalArea) || totalArea <= 0) {
      swal({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập tổng diện tích nhà trọ (m²) theo sổ đỏ.'
      })
      return false
    }
    return true
  }

  const validateExcelRoomAreas = () => {
    const totalMotelArea = Number(motel.area)
    const excelTotalArea = jsonData.reduce((sum, item) => sum + (Number(item.area) || 0), 0)
    if (excelTotalArea > totalMotelArea) {
      swal({
        icon: 'error',
        title: 'Vượt quá diện tích',
        text: `Tổng diện tích các phòng trong Excel (${excelTotalArea} m²) lớn hơn diện tích căn nhà (${totalMotelArea} m²).`
      })
      return false
    }
    return true
  }

  const getApiErrorMessage = (error, fallback) =>
    error?.response?.data?.message || fallback

  const saveDisableMethod = async () => {
    const payload = buildMotelPayload()
    try {
      const res = await createMotel(payload)
      await handleCreateServices(res.data.result.motelId)
      swal({ icon: 'success', title: 'Thành công', text: 'Đã tạo nhà trọ thành công!' })
      setTimeout(() => window.location.reload(), 1400)
    } catch (error) {
      swal({ icon: 'error', title: 'Lỗi', text: getApiErrorMessage(error, 'Có lỗi xảy ra khi tạo nhà trọ') })
    }
  }

  const saveExcelMethod = async () => {
    if (!validateExcelRoomAreas()) return

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
      if (success) swal({ icon: 'success', title: 'Thành công', text: 'Tạo phòng từ Excel thành công!' })
      else swal({ icon: 'warning', title: 'Thông báo', text: 'Một số phòng bị lỗi khi tạo.' })
      navigate(`/quanlytro/${mId}`)
      onClose()
    } catch (error) {
      swal({ icon: 'error', title: 'Lỗi', text: getApiErrorMessage(error, 'Có lỗi xảy ra') })
    }
  }

  const saveEnableMethod = async () => {
    const totalRooms = parseInt(dataCreateAuto.totalRoomCreate, 10)
    const totalFloors = parseInt(dataCreateAuto.typeMotelCreate, 10)
    if (isNaN(totalRooms) || isNaN(totalFloors)) {
      swal({ icon: 'error', title: 'Lỗi', text: 'Vui lòng nhập đúng số lượng' })
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
      swal({ icon: 'success', title: 'Thành công', text: 'Tạo phòng thành công' })
      navigate(`/quanlytro/${mId}`)
      onClose()
    } catch (error) {
      swal({ icon: 'error', title: 'Lỗi', text: getApiErrorMessage(error, 'Có lỗi xảy ra') })
    }
  }

  const handleSave = () => {
    if (!motel.motelName || !motel.typeRoom || !selectedProvince || !selectedWard || !addressDetail.trim()) {
      swal({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng điền đủ các trường bắt buộc (*)' })
      return
    }

    if (lat == null || lng == null) {
      swal({
        icon: 'warning',
        title: 'Thiếu vị trí bản đồ',
        text: 'Vui lòng xác định vị trí trên bản đồ (kéo marker hoặc click trên bản đồ nếu không tìm thấy địa chỉ).'
      })
      return
    }

    if (!validateMotelArea()) return

    if (MotelId === 'Create') {
      if (motel.methodofcreation === 'disable') saveDisableMethod()
      else if (motel.methodofcreation === 'excel') saveExcelMethod()
      else saveEnableMethod()
    } else {
      updateMotel(MotelId, buildMotelPayload())
        .then(() => {
          swal({ icon: 'success', title: 'Thành công', text: 'Cập nhật thành công!' })
          setTimeout(() => window.location.reload(), 1400)
        })
        .catch((error) =>
          swal({ icon: 'error', title: 'Lỗi', text: getApiErrorMessage(error, 'Có lỗi xảy ra') })
        )
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
                <InputLabel>Danh mục nhà trọ</InputLabel>
                <Select name="typeRoom" value={motel.typeRoom} onChange={handleInputChange} label="Danh mục nhà trọ">
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required size="small">
                <InputLabel>Tỉnh/Thành</InputLabel>
                <Select value={selectedProvince} onChange={handleProvinceChange} label="Tỉnh/Thành">
                  {provinces.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required size="small" disabled={!selectedProvince}>
                <InputLabel>Phường/Xã</InputLabel>
                <Select value={selectedWard} onChange={handleWardChange} label="Phường/Xã">
                  {wards.map((w) => (
                    <MenuItem key={w.id} value={w.id}>{w.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                size="small"
                label="Số nhà, tên đường"
                value={addressDetail}
                onChange={handleAddressDetailChange}
                placeholder="VD: 123 Nguyễn Văn Linh"
              />
            </Grid>

            {fullAddress && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Địa chỉ đầy đủ: <strong>{fullAddress}</strong>
                </Typography>
              </Grid>
            )}

            {geocodeLoading && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">Đang tra cứu vị trí trên bản đồ...</Typography>
                </Box>
              </Grid>
            )}

            {geocodeError && (
              <Grid item xs={12}>
                <Alert severity="warning">{geocodeError}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {manualPickMode
                  ? 'Click trên bản đồ để chọn vị trí, hoặc kéo marker để điều chỉnh.'
                  : 'Kéo marker trên bản đồ để điều chỉnh vị trí chính xác hơn.'}
              </Typography>
              <AddressMapPicker
                active={open}
                lat={lat}
                lng={lng}
                onPositionChange={handleMapPositionChange}
                allowMapClick={manualPickMode || lat == null}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tọa độ:{' '}
                {lat != null && lng != null
                  ? `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`
                  : 'Chưa xác định'}
              </Typography>
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
                        <TextField fullWidth size="small" label="Số tầng" value={dataCreateAuto.typeMotelCreate} onChange={wrapNonNegativeNumberChange((e) => setDataCreateAuto({ ...dataCreateAuto, typeMotelCreate: e.target.value }))} type="number" {...getNonNegativeNumberFieldProps()} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth size="small" label="Tổng số phòng" value={dataCreateAuto.totalRoomCreate} onChange={wrapNonNegativeNumberChange((e) => setDataCreateAuto({ ...dataCreateAuto, totalRoomCreate: e.target.value }))} type="number" {...getNonNegativeNumberFieldProps()} />
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
              <TextField fullWidth size="small" label="Ngày chốt điện nước" name="invoicedate" type="number" value={motel.invoicedate} onChange={handleInputChange} {...getNonNegativeNumberFieldProps()} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth size="small" label="Hạn đóng tiền (ngày)" name="paymentdeadline" type="number" value={motel.paymentdeadline} onChange={handleInputChange} {...getNonNegativeNumberFieldProps()} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                required
                size="small"
                label="Tổng diện tích (m²)"
                name="area"
                type="number"
                value={motel.area}
                onChange={handleInputChange}
                helperText="Theo sổ đỏ - tổng diện tích sử dụng của căn nhà"
                {...getNonNegativeNumberFieldProps(0, { step: 0.01 })}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Giá thuê trung bình"
                name="averagePrice"
                value={formatVndInput(motel.averagePrice)}
                onChange={handleInputChange}
                {...getVndInputFieldProps()}
              />
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
