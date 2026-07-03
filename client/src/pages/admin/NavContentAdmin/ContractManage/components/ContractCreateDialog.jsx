import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import Swal from 'sweetalert2'
import { getPhuongXaByTinh, getTinhThanh } from '~/apis/addressAPI'
import AddressMapPicker from '~/pages/admin/ManagerHome/components/AddressMapPicker'
import { getBrokers } from '~/apis/brokerAPI'
import { createContract, createTenant, getContractTemplatesByMotelId } from '~/apis/contractTemplateAPI'
import { changeQuantityRoomDevice, deleteRoomDevice, getAllDeviceByRomId, getAllMotelDevices, insertRoomDevice } from '~/apis/deviceAPT'
import { getMotelById } from '~/apis/motelAPI'
import { createRoomService, DeleteRoomServiceByid, getServiceRoombyRoomId, getRoomById, updateSerivceRoom } from '~/apis/roomAPI'
import { getNonNegativeNumberFieldProps, isNegativeNumberValue } from '~/utils/numberInputUtils'
import { formatVndInput, parseVndInput } from '~/utils/currencyInputUtils'

const LEASE_TERM_OPTIONS = [
  { value: '0', label: 'Tùy chỉnh' },
  { value: '1', label: '1 tháng' },
  { value: '2', label: '2 tháng' },
  { value: '3', label: '3 tháng' },
  { value: '4', label: '4 tháng' },
  { value: '5', label: '5 tháng' },
  { value: '6', label: '6 tháng' },
  { value: '12', label: '1 năm' },
  { value: '18', label: '1 năm 6 tháng' },
  { value: '24', label: '2 năm' },
  { value: '36', label: '3 năm' },
  { value: '48', label: '4 năm' },
  { value: '60', label: '5 năm' }
]

const COLLECTION_CYCLE_OPTIONS = [
  { value: '1', label: '1 tháng' },
  { value: '2', label: '2 tháng' },
  { value: '3', label: '3 tháng' },
  { value: '6', label: '6 tháng' },
  { value: '12', label: '1 năm' }
]

const getInitialTenant = () => ({
  fullName: '',
  phone: '',
  cccd: '',
  email: '',
  birthday: null,
  gender: 'MALE',
  address: '',
  job: '',
  licenseDate: null,
  placeOfLicense: '',
  frontPhoto: '',
  backPhoto: '',
  role: true,
  relationship: '',
  typeOfTenant: false,
  temporaryResidence: false,
  informationVerify: false
})

const getInitialContract = (username) => ({
  roomId: null,
  tenantId: null,
  username,
  contractTemplateId: '',
  brokerId: '',
  moveInDate: new Date().toISOString().slice(0, 10),
  leaseTerm: '',
  closeContract: '',
  description: '',
  debt: 0,
  price: '',
  deposit: '',
  collectionCycle: '1',
  createDate: new Date().toISOString().slice(0, 10),
  signContract: 'Khach chua ky',
  language: 'Tieng Viet',
  countTenant: 1,
  status: 'ACTIVE'
})

const getUnitLabel = (unit) => {
  const map = { CAI: 'Cái', cai: 'Cái', CHIEC: 'Chiếc', chiec: 'Chiếc', BO: 'Bộ', bo: 'Bộ', CAP: 'Cặp', cap: 'Cặp' }
  return map[unit] || unit || 'Cái'
}

// Map chargeType → nhãn đơn vị hiển thị + nhãn input
const getServiceUnitInfo = (chargeType, nameService = '') => {
  if (!chargeType) return { unitLabel: 'tháng', inputLabel: 'Số lượng', isMeter: false }
  const normalized = String(chargeType).trim().toLowerCase()
  const name = String(nameService).trim().toLowerCase()

  if (normalized === 'meter' || normalized.includes('meter')) {
    // Phân biệt điện/nước dựa trên tên dịch vụ
    if (name.includes('điện') || name.includes('dien')) {
      return { unitLabel: 'kWh', inputLabel: 'Chỉ số điện hiện tại', isMeter: true }
    }
    if (name.includes('nước') || name.includes('nuoc')) {
      return { unitLabel: 'khối', inputLabel: 'Chỉ số nước hiện tại', isMeter: true }
    }
    return { unitLabel: 'số đo', inputLabel: 'Chỉ số hiện tại', isMeter: true }
  }
  if (normalized === 'fixed' || normalized.includes('fixed')) {
    return { unitLabel: 'tháng', inputLabel: 'Số lượng', isMeter: false }
  }
  if (normalized.includes('nguoi') || normalized.includes('người')) {
    return { unitLabel: 'người', inputLabel: 'Số người', isMeter: false }
  }
  if (normalized.includes('phong') || normalized.includes('phòng')) {
    return { unitLabel: 'phòng', inputLabel: 'Số phòng', isMeter: false }
  }
  if (normalized.includes('thang') || normalized.includes('tháng')) {
    return { unitLabel: 'tháng', inputLabel: 'Số tháng', isMeter: false }
  }
  return { unitLabel: chargeType, inputLabel: 'Số lượng', isMeter: false }
}

const calculateCloseDate = (moveInDate, leaseTerm) => {
  if (!moveInDate || !leaseTerm || leaseTerm === '0') {
    return ''
  }

  const parsedMonths = Number(leaseTerm)
  if (Number.isNaN(parsedMonths) || parsedMonths <= 0) {
    return ''
  }

  const calculatedDate = new Date(moveInDate)
  calculatedDate.setMonth(calculatedDate.getMonth() + parsedMonths)
  return calculatedDate.toISOString().slice(0, 10)
}

const SectionTitle = ({ icon, title, subtitle }) => (
  <Box sx={{ mb: 1.5 }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon ? (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#E9F7EF',
            color: '#20a9e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
          {icon}
        </Box>
      ) : null}
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 4, height: 20, borderRadius: 4, bgcolor: '#20a9e7', flexShrink: 0 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1F2937' }}>
            {title}
          </Typography>
        </Stack>
        {subtitle ? (
          <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic', ml: icon ? 0 : 2.5, mt: 0.25 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  </Box>
)

const UploadTile = ({ label, fileName, onChange }) => (
  <Box
    component="label"
    sx={{
      borderRadius: 2,
      border: '1px dashed #9CC2FF',
      bgcolor: '#EAF2FF',
      minHeight: 108,
      px: 2,
      py: 2.5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      cursor: 'pointer'
    }}>
    <input hidden type="file" accept="image/*,.pdf" onChange={onChange} />
    <CloudUploadOutlinedIcon sx={{ color: '#1C6CF3', fontSize: 34 }} />
    <Typography variant="body2" sx={{ color: '#1F2937', textDecoration: 'underline', textAlign: 'center' }}>
      {fileName || label}
    </Typography>
  </Box>
)

function ContractCreateDialog({ open, onClose, motelId, rooms = [], onCreated }) {
  const username = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).username : null
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [tenant, setTenant] = useState(getInitialTenant)
  const [contract, setContract] = useState(() => getInitialContract(username))
  const [identityDocumentType, setIdentityDocumentType] = useState('cccd')
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
  const [motelServices, setMotelServices] = useState([])
  const [motelDevices, setMotelDevices] = useState([])
  const [roomServices, setRoomServices] = useState([])
  const [roomDevices, setRoomDevices] = useState([])
  const [contractTemplates, setContractTemplates] = useState([])
  const [brokers, setBrokers] = useState([])
  const [documents, setDocuments] = useState({
    frontIdentity: '',
    backIdentity: '',
    contractAttachment: ''
  })
  const [brokerCommission, setBrokerCommission] = useState('')
  const [brokerPayment, setBrokerPayment] = useState('0')
  const [createBrokerExpense, setCreateBrokerExpense] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const roomCards = useMemo(() => {
    return Array.isArray(rooms) ? rooms : []
  }, [rooms])

  const getProvinceName = useCallback(
    (id) => provinces.find((p) => String(p.id) === String(id))?.full_name || '',
    [provinces]
  )

  const getWardName = useCallback(
    (id) => wards.find((w) => String(w.id) === String(id))?.full_name || '',
    [wards]
  )

  const resetDialogState = useCallback(() => {
    setSelectedRoomId(null)
    setSelectedRoom(null)
    setTenant(getInitialTenant())
    setContract(getInitialContract(username))
    setIdentityDocumentType('cccd')
    setSelectedProvince('')
    setSelectedWard('')
    setAddressDetail('')
    setFullAddress('')
    setLat(null)
    setLng(null)
    setGeocodeLoading(false)
    setGeocodeError('')
    setManualPickMode(false)
    setAutoGeocode(true)
    setWards([])
    setRoomServices([])
    setRoomDevices([])
    setDocuments({
      frontIdentity: '',
      backIdentity: '',
      contractAttachment: ''
    })
    setBrokerCommission('')
    setBrokerPayment('0')
    setCreateBrokerExpense(false)
  }, [username])

  // Khởi tạo roomServices từ motelServices (chưa chọn phòng) để checkbox hoạt động ngay
  const initRoomServicesFromCatalog = useCallback((serviceCatalog) => {
    const initialized = serviceCatalog.map((service) => ({
      ...service,
      roomServiceId: null,
      roomId: null,
      quantity: 1,
      isSelected: false
    }))
    setRoomServices(initialized)
  }, [])

  // Khởi tạo roomDevices từ motelDevices (chưa chọn phòng) để checkbox hoạt động ngay
  const initRoomDevicesFromCatalog = useCallback((deviceCatalog) => {
    const initialized = deviceCatalog.map((device) => ({
      ...device,
      roomDeviceId: null,
      roomId: null,
      quantity: 1,
      isSelected: false
    }))
    setRoomDevices(initialized)
  }, [])

  const bootstrapDialog = useCallback(async () => {
    if (!motelId) {
      return
    }

    const provinceRequest = getTinhThanh()
    const motelRequest = getMotelById(motelId)
    const motelDeviceRequest = getAllMotelDevices(motelId)
    const contractTemplateRequest = getContractTemplatesByMotelId(motelId)
    const brokerRequest = getBrokers(motelId)

    const [provinceResponse, motelResponse, motelDeviceResponse, contractTemplateResponse, brokerResponse] =
      await Promise.allSettled([
        provinceRequest,
        motelRequest,
        motelDeviceRequest,
        contractTemplateRequest,
        brokerRequest
      ])

    if (provinceResponse.status === 'fulfilled' && provinceResponse.value?.data?.error === 0) {
      setProvinces(provinceResponse.value.data.data)
    }

    if (
      motelResponse.status === 'fulfilled' &&
      motelResponse.value?.data?.code === 200 &&
      Array.isArray(motelResponse.value.data.result?.motelServices)
    ) {
      const services = motelResponse.value.data.result.motelServices
      setMotelServices(services)
      initRoomServicesFromCatalog(services)
    } else {
      setMotelServices([])
      setRoomServices([])
    }

    if (motelDeviceResponse.status === 'fulfilled' && motelDeviceResponse.value?.code === 200) {
      const devices = motelDeviceResponse.value.result ?? []
      setMotelDevices(devices)
      initRoomDevicesFromCatalog(devices)
    } else {
      setMotelDevices([])
      setRoomDevices([])
    }

    if (contractTemplateResponse.status === 'fulfilled') {
      setContractTemplates(Array.isArray(contractTemplateResponse.value) ? contractTemplateResponse.value : [])
    } else {
      setContractTemplates([])
    }

    if (brokerResponse.status === 'fulfilled') {
      setBrokers(brokerResponse.value?.data?.result ?? [])
    } else {
      setBrokers([])
    }
  }, [motelId, initRoomServicesFromCatalog, initRoomDevicesFromCatalog])

  // ── Geocode query (tự động khi address thay đổi) ──
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
          { headers: { Accept: 'application/json', 'Accept-Language': 'vi', 'User-Agent': 'RRMS/1.0 (contract-address-picker)' } }
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

  // ── Address handlers ──
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
    }).catch(console.error)
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

  const fetchRoomServices = async (roomId, serviceCatalog) => {
    const currentServices = Array.isArray(serviceCatalog) ? serviceCatalog : motelServices
    const response = await getServiceRoombyRoomId(roomId)

    const normalizedServices = currentServices.map((service) => {
      const matchedService = response.find((roomService) => roomService.service.motelServiceId === service.motelServiceId)
      return {
        ...service,
        roomServiceId: matchedService?.roomServiceId ?? null,
        roomId,
        quantity: matchedService?.quantity ?? 1,
        isSelected: Boolean(matchedService)
      }
    })

    setRoomServices(normalizedServices)
  }

  const fetchRoomDevices = async (roomId, deviceCatalog) => {
    const currentDevices = Array.isArray(deviceCatalog) ? deviceCatalog : motelDevices
    const response = await getAllDeviceByRomId(roomId)
    const roomDeviceList = response?.result ?? []

    const normalizedDevices = currentDevices.map((device) => {
      const matchedDevice = roomDeviceList.find(
        (roomDevice) => roomDevice.motelDevice.motel_device_id === device.motel_device_id
      )

      return {
        ...device,
        roomDeviceId: matchedDevice?.roomDeviceId ?? null,
        roomId,
        quantity: matchedDevice?.quantity ?? 1,
        isSelected: Boolean(matchedDevice)
      }
    })

    setRoomDevices(normalizedDevices)
  }

  const handleRoomSelect = async (roomId) => {
    setSelectedRoomId(roomId)

    try {
      const roomResponse = await getRoomById(roomId)
      setSelectedRoom(roomResponse)
      setContract((previousContract) => ({
        ...previousContract,
        roomId: roomResponse.roomId,
        price: roomResponse.price ?? '',
        deposit: roomResponse.deposit ?? roomResponse.price ?? ''
      }))

      await Promise.all([
        fetchRoomServices(roomResponse.roomId),
        fetchRoomDevices(roomResponse.roomId)
      ])
    } catch (error) {
      console.error('Error fetching room detail for contract dialog:', error)
      Swal.fire({
        icon: 'error',
        title: 'Thông báo',
        text: 'Không thể tải chi tiết phòng. Vui lòng thử lại sau.',
        customClass: { container: 'swal-on-top' }
      })
    }
  }

  const handleTenantChange = (field, value) => {
    setTenant((previousTenant) => ({
      ...previousTenant,
      [field]: value
    }))
  }

  const handleContractChange = (field, value) => {
    setContract((previousContract) => {
      const nextContract = {
        ...previousContract,
        [field]: value
      }

      if (field === 'leaseTerm' || field === 'moveInDate') {
        nextContract.closeContract = calculateCloseDate(
          field === 'moveInDate' ? value : previousContract.moveInDate,
          field === 'leaseTerm' ? value : previousContract.leaseTerm
        )
      }

      return nextContract
    })
  }

  const handleMoneyFieldChange = (field, value) => {
    handleContractChange(field, parseVndInput(value))
  }

  const handleServiceToggle = (serviceId, checked) => {
    setRoomServices((previousServices) =>
      previousServices.map((service) =>
        service.motelServiceId === serviceId
          ? { ...service, isSelected: checked, quantity: service.quantity || 1 }
          : service
      )
    )
  }

  const handleServiceQuantityChange = (serviceId, value) => {
    if (isNegativeNumberValue(value)) return
    setRoomServices((previousServices) =>
      previousServices.map((service) =>
        service.motelServiceId === serviceId ? { ...service, quantity: value } : service
      )
    )
  }

  const handleDeviceToggle = (deviceId, checked) => {
    setRoomDevices((previousDevices) =>
      previousDevices.map((device) =>
        device.motel_device_id === deviceId
          ? { ...device, isSelected: checked, quantity: device.quantity || 1 }
          : device
      )
    )
  }

  const handleDeviceQuantityChange = (deviceId, value) => {
    if (isNegativeNumberValue(value)) return
    setRoomDevices((previousDevices) =>
      previousDevices.map((device) =>
        device.motel_device_id === deviceId ? { ...device, quantity: value } : device
      )
    )
  }

  const buildAddress = () => {
    return [addressDetail, getWardName(selectedWard), getProvinceName(selectedProvince)]
      .map((part) => (part ? String(part).trim() : ''))
      .filter(Boolean)
      .join(', ')
  }

  const persistRoomServices = async () => {
    const servicesToDelete = roomServices.filter((service) => !service.isSelected && service.roomServiceId)
    const servicesToUpsert = roomServices.filter((service) => service.isSelected)

    const deleteRequests = servicesToDelete.map((service) => DeleteRoomServiceByid(service.roomServiceId))
    const upsertRequests = servicesToUpsert.map((service) => {
      const payload = {
        roomServiceId: service.roomServiceId || null,
        roomId: selectedRoom.roomId,
        serviceId: service.motelServiceId,
        quantity: service.quantity || 1
      }

      return service.roomServiceId
        ? updateSerivceRoom(service.roomServiceId, payload)
        : createRoomService(payload)
    })

    await Promise.all([...deleteRequests, ...upsertRequests])
  }

  const persistRoomDevices = async () => {
    const devicesToDelete = roomDevices.filter((device) => !device.isSelected && device.roomDeviceId)
    const devicesToCreate = roomDevices.filter((device) => device.isSelected && !device.roomDeviceId)
    const devicesToUpdate = roomDevices.filter((device) => device.isSelected && device.roomDeviceId)

    const deleteRequests = devicesToDelete.map((device) => deleteRoomDevice(device.roomId, device.motel_device_id))
    const createRequests = devicesToCreate.map((device) =>
      insertRoomDevice({
        room: { roomId: selectedRoom.roomId },
        motelDevice: { motel_device_id: device.motel_device_id },
        quantity: device.quantity || 1
      })
    )
    const updateRequests = devicesToUpdate.map((device) =>
      changeQuantityRoomDevice({
        roomId: selectedRoom.roomId,
        motel_device_id: device.motel_device_id,
        quantity: device.quantity || 1
      })
    )

    await Promise.all([...deleteRequests, ...createRequests, ...updateRequests])
  }

  const validateBeforeSubmit = () => {
    if (!selectedRoom?.roomId) {
      return 'Bạn chưa chọn phòng để tạo hợp đồng.'
    }

    if (!tenant.fullName?.trim()) {
      return 'Vui lòng nhập họ tên khách thuê.'
    }

    if (!tenant.phone?.trim()) {
      return 'Vui lòng nhập số điện thoại khách thuê.'
    }

    if (!contract.contractTemplateId) {
      return 'Vui lòng chọn mẫu hợp đồng.'
    }

    if (!contract.moveInDate) {
      return 'Vui lòng chọn ngày vào ở.'
    }

    if (!contract.price) {
      return 'Vui lòng nhập giá thuê.'
    }

    if (!contract.deposit) {
      return 'Vui lòng nhập mức tiền cọc.'
    }

    return null
  }

  const handleSubmit = async () => {
    const validationMessage = validateBeforeSubmit()
    if (validationMessage) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: validationMessage,
        customClass: { container: 'swal-on-top' }
      })
      return
    }

    try {
      setSubmitting(true)
      Swal.fire({
        icon: 'info',
        title: 'Đang xử lý...',
        text: 'Hệ thống đang tạo hợp đồng mới',
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: { container: 'swal-on-top' },
        didOpen: () => {
          Swal.showLoading()
        }
      })

      await persistRoomServices()
      await persistRoomDevices()

      const tenantResponse = await createTenant(selectedRoom.roomId, {
        ...tenant,
        address: buildAddress(),
        frontPhoto: documents.frontIdentity || tenant.frontPhoto,
        backPhoto: documents.backIdentity || tenant.backPhoto
      })

      const tenantId = tenantResponse?.result?.tenantId ?? tenantResponse?.tenantId
      if (!tenantId) {
        throw new Error('Không thể tạo khách thuê mới')
      }

      const contractResponse = await createContract({
        ...contract,
        roomId: selectedRoom.roomId,
        tenantId,
        brokerId: contract.brokerId || null,
        description: contract.description,
        countTenant: 1
      })

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã tạo hợp đồng mới thành công.',
        customClass: { container: 'swal-on-top' }
      })

      onCreated?.(contractResponse)
      resetDialogState()
      onClose?.()
    } catch (error) {
      console.error('Error creating contract from ContractCreateDialog:', error)
      const apiMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra trong quá trình tạo hợp đồng.'
      Swal.fire({
        icon: 'error',
        title: 'Khổng thể tạo hợp đồng',
        text: apiMessage,
        customClass: { container: 'swal-on-top' }
      })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!open) {
      return
    }

    bootstrapDialog().catch((error) => {
      console.error('Error bootstrapping contract dialog:', error)
    })
  }, [open, bootstrapDialog])

  useEffect(() => {
    if (!open) {
      resetDialogState()
    }
  }, [open, resetDialogState])

  // Tự động tính toán số tiền hoa hồng môi giới khi % hoa hồng hoặc giá thuê thay đổi
  useEffect(() => {
    if (brokerCommission && contract.price) {
      const priceNum = Number(contract.price) || 0
      const commissionPercent = Number(brokerCommission) || 0
      const calculatedPayment = Math.round((priceNum * commissionPercent) / 100)
      setBrokerPayment(String(calculatedPayment))
    } else if (!brokerCommission) {
      setBrokerPayment('0')
    }
  }, [brokerCommission, contract.price])

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          width: 'min(1140px, 96vw)',
          maxWidth: '1140px',
          borderRadius: 3
        }
      }}>
      <DialogTitle sx={{ px: 3, py: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#e5f6fd',
                color: '#20a9e7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <DescriptionOutlinedIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937' }}>
              Thêm hợp đồng mới
            </Typography>
          </Stack>
          <IconButton onClick={onClose} disabled={submitting} sx={{ border: '1px solid #F1D8CF', color: '#1F2937' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 0, py: 0 }}>
        <Grid container>
          <Grid item xs={12} md={5} sx={{ borderRight: { md: '1px solid #F1F5F9' }, p: 3 }}>
            <SectionTitle title="Danh sách phòng" subtitle="Danh sách phòng có thể lập hợp đồng" />
            <Stack spacing={1.5} sx={{ position: { md: 'sticky' }, top: 24 }}>
              {roomCards.length ? (
                roomCards.map((roomItem) => {
                  const isSelected = roomItem.roomId === selectedRoomId
                  return (
                    <Card
                      key={roomItem.roomId}
                      variant="outlined"
                      onClick={() => handleRoomSelect(roomItem.roomId)}
                      sx={{
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        borderColor: isSelected ? '#20a9e7' : '#D9E2EC',
                        boxShadow: isSelected ? '0 12px 30px rgba(30, 170, 201, 0.12)' : 'none'
                      }}>
                      <Box sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '50%',
                            bgcolor: isSelected ? '#20a9e7' : '#EEF2F7',
                            color: isSelected ? '#FFFFFF' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                          {isSelected ? <CheckCircleRoundedIcon /> : <ApartmentOutlinedIcon />}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1F2937' }}>
                            {roomItem.name}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              display: 'inline-flex',
                              mt: 0.5,
                              px: 1,
                              py: 0.25,
                              borderRadius: 999,
                              bgcolor: '#F97316',
                              color: '#FFFFFF',
                              fontSize: 12,
                              fontWeight: 700
                            }}>
                            Đang trong
                          </Typography>
                          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.25 }} spacing={1}>
                            <Typography variant="body1" sx={{ color: '#1F2937', fontWeight: 700 }}>
                              {formatVndInput(roomItem.price)} đ
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4B5563' }}>
                              0/1 người
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </Card>
                  )
                })
              ) : (
                <Alert severity="info">Không có phòng nào phù hợp để lập hợp đồng.</Alert>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={7} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <SectionTitle title="Thời hạn hợp đồng" subtitle="" />
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Thời hạn hợp đồng"
                      value={contract.leaseTerm}
                      onChange={(event) => handleContractChange('leaseTerm', event.target.value)}
                    >
                      {LEASE_TERM_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      label="Ngày vào ở"
                      value={contract.moveInDate}
                      onChange={(event) => handleContractChange('moveInDate', event.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiFormLabel-asterisk': { color: 'red' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Ngày đến hạn hợp đồng"
                      value={contract.closeContract}
                      onChange={(event) => handleContractChange('closeContract', event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <SectionTitle title="Thông tin khách thuê" subtitle="" />
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label="Tên người ở"
                      value={tenant.fullName}
                      onChange={(event) => handleTenantChange('fullName', event.target.value)}
                      sx={{
                        '& .MuiFormLabel-asterisk': { color: 'red' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label="Số điện thoại người ở"
                      value={tenant.phone}
                      onChange={(event) => handleTenantChange('phone', event.target.value)}
                      sx={{
                        '& .MuiFormLabel-asterisk': { color: 'red' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RadioGroup
                      row
                      value={identityDocumentType}
                      onChange={(event) => setIdentityDocumentType(event.target.value)}
                    >
                      <FormControlLabel value="cccd" control={<Radio />} label="Định dạng CCCD" />
                      <FormControlLabel value="passport" control={<Radio />} label="Định dạng Passport/Visa" />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={identityDocumentType === 'passport' ? 'Passport/Visa' : 'CMND/CCCD'}
                      value={tenant.cccd}
                      onChange={(event) => handleTenantChange('cccd', event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Ngày sinh"
                      value={tenant.birthday || ''}
                      onChange={(event) => handleTenantChange('birthday', event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Giới tính"
                      value={tenant.gender || 'MALE'}
                      onChange={(event) => handleTenantChange('gender', event.target.value)}
                    >
                      <MenuItem value="MALE">Nam</MenuItem>
                      <MenuItem value="FEMALE">Nu</MenuItem>
                      <MenuItem value="OTHER">Khac</MenuItem>
                    </TextField>
                  </Grid>
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
                    {lat != null && lng != null && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Tọa độ: Lat {lat.toFixed(6)}, Lng {lng.toFixed(6)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nhập công việc hiện tại của khách thuê (nếu có)"
                      value={tenant.job}
                      onChange={(event) => handleTenantChange('job', event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Ngày cấp CMND/CCCD"
                      value={tenant.licenseDate || ''}
                      onChange={(event) => handleTenantChange('licenseDate', event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Nơi cấp CMND/CCCD"
                      value={tenant.placeOfLicense}
                      onChange={(event) => handleTenantChange('placeOfLicense', event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <UploadTile
                      label="Ảnh mặt trước CMND/CCCD"
                      fileName={documents.frontIdentity}
                      onChange={(event) =>
                        setDocuments((previousDocuments) => ({
                          ...previousDocuments,
                          frontIdentity: event.target.files?.[0]?.name ?? ''
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <UploadTile
                      label="Ảnh mặt sau CMND/CCCD"
                      fileName={documents.backIdentity}
                      onChange={(event) =>
                        setDocuments((previousDocuments) => ({
                          ...previousDocuments,
                          backIdentity: event.target.files?.[0]?.name ?? ''
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <SectionTitle title="Dịch vụ sử dụng" subtitle="Thêm dịch vụ sử dụng như: điện, nước, rác, wifi..." />
                <Stack spacing={1.5}>
                  {roomServices.map((service) => {
                    const { unitLabel, inputLabel, isMeter } = getServiceUnitInfo(service.chargetype, service.nameService)

                    return (
                      <Card
                        key={service.motelServiceId}
                        variant="outlined"
                        sx={{ borderRadius: 2, borderColor: service.isSelected ? '#3B82F6' : '#D9E2EC' }}
                      >
                        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                            <Checkbox
                              checked={service.isSelected}
                              onChange={(event) => handleServiceToggle(service.motelServiceId, event.target.checked)}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {service.nameService}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#4B5563' }}>
                                Giá: <b>{formatVndInput(service.price)}đ</b> / {unitLabel}
                              </Typography>
                            </Box>
                          </Stack>
                          <TextField
                            size="small"
                            type="number"
                            label={inputLabel}
                            value={service.quantity}
                            disabled={!service.isSelected}
                            onChange={(event) => handleServiceQuantityChange(service.motelServiceId, event.target.value)}
                            sx={{ width: isMeter ? 190 : 150 }}
                            {...getNonNegativeNumberFieldProps(1)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">{unitLabel}</InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      </Card>
                    )
                  })}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <SectionTitle title="Thông tin giá trị hợp đồng" subtitle="Giá tiền phòng và tiền cọc" />
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label="Giá thuê"
                      value={formatVndInput(contract.price)}
                      onChange={(event) => handleMoneyFieldChange('price', event.target.value)}
                      sx={{
                        '& .MuiFormLabel-asterisk': { color: 'red' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label="Mức tiền cọc"
                      value={formatVndInput(contract.deposit)}
                      onChange={(event) => handleMoneyFieldChange('deposit', event.target.value)}
                      sx={{
                        '& .MuiFormLabel-asterisk': { color: 'red' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Alert
                      icon={<InfoOutlinedIcon fontSize="inherit" />}
                      severity="warning"
                      sx={{
                        border: '1px solid #F97316',
                        bgcolor: '#FFF7ED',
                        color: '#7C2D12',
                        '& .MuiAlert-icon': { color: '#F97316' }
                      }}>
                      Bạn cần tạo hóa đơn đầu tháng để hoàn tất việc thu tiền cọc. 
                    </Alert>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Chu kỳ thu tiền"
                      value={contract.collectionCycle}
                      onChange={(event) => handleContractChange('collectionCycle', event.target.value)}
                    >
                      {COLLECTION_CYCLE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <SectionTitle title="Chọn mẫu văn bản hợp đồng" subtitle="Mẫu văn bản hợp đồng dùng khi in" />
                <TextField
                  required
                  select
                  fullWidth
                  label="Danh sách mẫu văn bản hợp đồng đang có"
                  value={contract.contractTemplateId}
                  onChange={(event) => handleContractChange('contractTemplateId', event.target.value)}
                  sx={{
                    '& .MuiFormLabel-asterisk': { color: 'red' }
                  }}
                >
                  <MenuItem value="">Chọn mẫu văn bản hợp đồng</MenuItem>
                  {contractTemplates.map((contractTemplate) => (
                    <MenuItem key={contractTemplate.contractTemplateId} value={contractTemplate.contractTemplateId}>
                      {contractTemplate.templatename}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <SectionTitle title="Ghi chú" subtitle="Những ghi chú lưu ý cho hợp đồng này" />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Ghi chú"
                  value={contract.description}
                  onChange={(event) => handleContractChange('description', event.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <SectionTitle
                  icon={<Inventory2OutlinedIcon />}
                  title="Tài sản của phòng"
                  subtitle="Các tài sản trong quá trình thuê phòng"
                />
                <Stack spacing={1.5}>
                  {roomDevices.map((device) => {
                    const unitLabel = getUnitLabel(device.unit)
                    return (
                      <Card
                        key={device.motel_device_id}
                        variant="outlined"
                        sx={{ borderRadius: 2, borderColor: device.isSelected ? '#3B82F6' : '#D9E2EC' }}
                      >
                        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                            <Checkbox
                              checked={device.isSelected}
                              onChange={(event) => handleDeviceToggle(device.motel_device_id, event.target.checked)}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {device.deviceName}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#4B5563' }}>
                                Giá trị: <b>{formatVndInput(device.value)}đ</b> / {unitLabel}
                              </Typography>
                            </Box>
                          </Stack>
                          <TextField
                            size="small"
                            type="number"
                            label="Số lượng"
                            value={device.quantity}
                            disabled={!device.isSelected}
                            onChange={(event) => handleDeviceQuantityChange(device.motel_device_id, event.target.value)}
                            sx={{ width: 150 }}
                            {...getNonNegativeNumberFieldProps(1)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">{unitLabel}</InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      </Card>
                    )
                  })}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <SectionTitle title="Chứng từ" subtitle="Hình ảnh chứng từ" />
                <UploadTile
                  label="Hình ảnh chứng từ hợp đồng"
                  fileName={documents.contractAttachment}
                  onChange={(event) =>
                    setDocuments((previousDocuments) => ({
                      ...previousDocuments,
                      contractAttachment: event.target.files?.[0]?.name ?? ''
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <SectionTitle title="Môi giới" subtitle="Chọn người giới thiệu hợp đồng và phí môi giới" />
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Danh sách môi giới"
                      value={contract.brokerId}
                      onChange={(event) => handleContractChange('brokerId', event.target.value)}
                    >
                      <MenuItem value="">---- Chọn môi giới ----</MenuItem>
                      {brokers.map((broker) => (
                        <MenuItem key={broker.brokerId ?? broker.phone ?? broker.name} value={broker.brokerId ?? ''}>
                          {broker.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      label="Mức hoa hồng"
                      value={brokerCommission}
                      onChange={(event) => setBrokerCommission(event.target.value)}
                    >
                      <MenuItem value="">---- % hoa hồng ----</MenuItem>
                      <MenuItem value="3">3%</MenuItem>
                      <MenuItem value="5">5%</MenuItem>
                      <MenuItem value="7">7%</MenuItem>
                      <MenuItem value="10">10%</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      label="Số tiền nhận"
                      value={formatVndInput(brokerPayment)}
                      onChange={(event) => setBrokerPayment(parseVndInput(event.target.value))}
                      InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Switch checked={createBrokerExpense} onChange={(event) => setCreateBrokerExpense(event.target.checked)} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          Tạo phiếu chi
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          Tạo phiếu chi hoa hồng cho môi giới
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #E5E7EB', justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          variant="contained"
          disabled={submitting}
          sx={{
            textTransform: 'none',
            bgcolor: '#6B7280',
            '&:hover': { bgcolor: '#4B5563' }
          }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AddIcon />}
          disabled={submitting}
          sx={{
            textTransform: 'none',
            bgcolor: '#20a9e7',
            '&:hover': { bgcolor: '#2b7ed7' }
          }}>
          Thêm hợp đồng mới
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ContractCreateDialog
