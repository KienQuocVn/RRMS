/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  styled,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import CloseIcon from '@mui/icons-material/Close'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { getPhuongXaByTinh, getTinhThanh } from '~/apis/addressAPI'
import AddressMapPicker from '~/pages/admin/ManagerHome/components/AddressMapPicker'

import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import TitleAttribute from './TitleAttribute'
import { processImage } from '~/utils/processImage'
import { getNonNegativeNumberFieldProps, isNegativeNumberValue } from '~/utils/numberInputUtils'
import { formatVndInput, getVndInputFieldProps, parseVndInput } from '~/utils/currencyInputUtils'
import { getProfileByUsername, introspect } from '~/apis/accountAPI'
import { getBulletinBoard, postBulletinBoard, updateBulletinBoard } from '~/apis/bulletinBoardAPI'
import { deleteImageFromApi } from '~/apis/bulletinBoardImageAPI'
import { getMotelById } from '~/apis/motelAPI'
import { getAllTypeRoom } from '~/apis/typeRoomAPI'
import { normalizeProfileResponse } from '~/apis/profileAPI'
import { useMotel } from '~/hooks/useMotel'
import { isValidRouteParam } from '~/utils/apiAdapters'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  maxHeight: '90vh',
  overflowY: 'scroll',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollBehavior: 'smooth',
  '.MuiSelect-select': { bgcolor: 'white', border: '0.5px solid #dcdcdc', borderRadius: '5px' },
  '.MuiInputBase-input': { bgcolor: 'white', border: '0.5px solid #dcdcdc', borderRadius: '5px' }
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const validationSchema = Yup.object({
  title: Yup.string().required('Tiêu đề là bắt buộc.').max(100, 'Tiêu đề không được vượt quá 100 ký tự.'),
  rentalCategory: Yup.string().required('Danh mục cho thuê là bắt buộc.'),
  description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự.'),
  rentPrice: Yup.number().required('Giá thuê là bắt buộc.').min(0, 'Giá thuê phải lớn hơn hoặc bằng 0.'),
  promotionalRentalPrice: Yup.number()
    .nullable()
    .min(0, 'Giá khuyến mãi phải lớn hơn hoặc bằng 0.')
    .max(Yup.ref('rentPrice'), 'Giá khuyến mãi phải nhỏ hơn hoặc bằng giá thuê.'),
  deposit: Yup.number().required('Tiền cọc là bắt buộc.').min(0, 'Tiền cọc phải lớn hơn hoặc bằng 0.'),
  area: Yup.number().required('Diện tích là bắt buộc.').min(0, 'Diện tích phải lớn hơn hoặc bằng 0.'),
  electricityPrice: Yup.number().required('Giá điện là bắt buộc.').min(0, 'Giá điện phải lớn hơn hoặc bằng 0.'),
  waterPrice: Yup.number().required('Giá nước là bắt buộc.').min(0, 'Giá nước phải lớn hơn hoặc bằng 0.'),
  maxPerson: Yup.string().required('Số người ở là bắt buộc.'),
  moveInDate: Yup.date()
    .nullable()
    .required('Ngày chuyển vào là bắt buộc.')
    .min(new Date(), 'Ngày chuyển vào không được ở quá khứ.'),
  openingHours: Yup.string().required('Giờ mở cửa là bắt buộc.'),
  closeHours: Yup.string().required('Giờ đóng cửa là bắt buộc.'),
  address: Yup.string().required('Địa chỉ là bắt buộc.').max(200, 'Địa chỉ không được vượt quá 200 ký tự.')
})

const DEFAULT_FREE_HOURS = 'Giờ giấc tự do'

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const mapMaxPersonLabel = (maxperson) => {
  const n = Number(maxperson)
  if (!Number.isFinite(n) || n <= 0) return ''
  if (n === 1) return '1 người ở'
  if (n === 2) return '2 người ở'
  if (n === 3) return '3 người ở'
  if (n === 4) return '4 người ở'
  if (n >= 5 && n <= 6) return '5-6 người ở'
  if (n >= 7) return '7-10 người ở'
  return 'Không giới hạn'
}

const findMotelServicePrice = (services, keyword) => {
  if (!Array.isArray(services)) return ''
  const service = services.find((s) => s.nameService?.toLowerCase().includes(keyword.toLowerCase()))
  return service?.price ?? ''
}

const buildDefaultsFromMotel = (motelData = {}) => ({
  rentalCategory: motelData?.typeRoom?.name || '',
  area: motelData?.area ?? '',
  rentPrice: motelData?.averagePrice ?? '',
  electricityPrice: findMotelServicePrice(motelData?.motelServices, 'điện'),
  waterPrice: findMotelServicePrice(motelData?.motelServices, 'nước'),
  maxPerson: mapMaxPersonLabel(motelData?.maxperson),
  address: motelData?.address || '',
  latitude: motelData?.latitude ?? '',
  longitude: motelData?.longitude ?? '',
  openingHours: DEFAULT_FREE_HOURS,
  closeHours: DEFAULT_FREE_HOURS,
})

const createDefaultBulletinBoard = () => ({
  username: '',
  title: '',
  rentalCategory: '',
  description: '',
  rentPrice: '',
  promotionalRentalPrice: '',
  deposit: '',
  area: '',
  electricityPrice: '',
  waterPrice: '',
  maxPerson: '',
  moveInDate: null,
  openingHours: DEFAULT_FREE_HOURS,
  closeHours: DEFAULT_FREE_HOURS,
  address: '',
  longitude: '',
  latitude: '',
  status: false,
  isActive: false,
  bulletinBoardImages: [],
  bulletinBoardRules: [],
  bulletinBoards_RentalAm: [],
})

const normalizeBulletinBoard = (data = {}) => {
  const defaults = createDefaultBulletinBoard()
  const {
    account,
    motel: _motel,
    room: _room,
    bulletinBoardReviews: _reviews,
    bulletinBoardRentalAmenities,
    ...boardFields
  } = data

  return {
    ...defaults,
    ...boardFields,
    username: boardFields.username ?? account?.username ?? '',
    bulletinBoardImages: data.bulletinBoardImages ?? defaults.bulletinBoardImages,
    bulletinBoardRules: data.bulletinBoardRules ?? defaults.bulletinBoardRules,
    bulletinBoards_RentalAm:
      data.bulletinBoards_RentalAm ??
      bulletinBoardRentalAmenities ??
      defaults.bulletinBoards_RentalAm
  }
}

const PostModal = ({ open, handleClose, refreshBulletinBoards, bulletinBoardId }) => {
  const isEditMode = Boolean(bulletinBoardId)
  const { motelId: routeMotelId } = useParams()
  const { motels } = useMotel()
  const label = { inputProps: { 'aria-label': 'Switch demo' } }
  const [selectedImages, setSelectedImages] = useState([])
  const [account, setAccount] = useState()
  const [typeRooms, setTypeRooms] = useState([])
  const defaultBulletinBoard = createDefaultBulletinBoard()

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

  const [bulletinBoard, setBulletinBoard] = useState(defaultBulletinBoard)
  const rentalAmenities = bulletinBoard.bulletinBoards_RentalAm ?? []
  const boardRules = bulletinBoard.bulletinBoardRules ?? []
  const boardImages = bulletinBoard.bulletinBoardImages ?? []

  const selectedImagePreviews = useMemo(
    () => selectedImages.map((image) => URL.createObjectURL(image)),
    [selectedImages]
  )

  useEffect(() => {
    return () => {
      selectedImagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [selectedImagePreviews])

  const resetAddressState = useCallback(() => {
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

  const applyAddressFromBoard = useCallback((data) => {
    if (!data?.address) return

    const parts = data.address.split(', ').map((p) => p.trim())
    setAddressDetail(parts[0] || '')

    const isLegacyFormat = parts.length >= 4
    const wardId = parts[1]
    const provinceId = isLegacyFormat ? parts[3] : parts[2]

    if (provinceId) {
      setSelectedProvince(provinceId)
      getPhuongXaByTinh(provinceId).then((res) => {
        if (res.data.error === 0) {
          setWards(res.data.data)
          if (wardId) setSelectedWard(wardId)
        }
      })
    }

    if (data.latitude != null && data.longitude != null) {
      setLat(data.latitude)
      setLng(data.longitude)
      setAutoGeocode(false)
    }
  }, [])

  useEffect(() => {
    getTinhThanh()
      .then((res) => {
        if (res.data.error === 0) setProvinces(res.data.data)
      })
      .catch(console.error)

    getAllTypeRoom()
      .then((res) => setTypeRooms(res?.result || []))
      .catch(console.error)
  }, [])

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
              'User-Agent': 'RRMS/1.0 (bulletin-board-address-picker)'
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

  useEffect(() => {
    if (lat == null || lng == null) return
    setBulletinBoard((prev) => ({ ...prev, latitude: lat, longitude: lng }))
  }, [lat, lng])

  const loadAccountProfile = useCallback(async (username) => {
    if (!username) return

    try {
      const accountRes = await getProfileByUsername(username)
      const normalizedAccount = normalizeProfileResponse(accountRes ?? {})
      setAccount(normalizedAccount)
      setBulletinBoard((prev) => ({
        ...prev,
        username: normalizedAccount?.username || username,
      }))
    } catch {
      setBulletinBoard((prev) => ({
        ...prev,
        username: username || '',
      }))
    }
  }, [])

  useEffect(() => {
    if (!open) return

    if (bulletinBoardId) {
      setSelectedImages([])
      getBulletinBoard(bulletinBoardId)
        .then(async (res) => {
          const raw = res?.result ?? {}
          const boardAccount = raw.account
          const data = normalizeBulletinBoard(raw)
          setBulletinBoard(data)
          applyAddressFromBoard(data)

          if (boardAccount) {
            setAccount(normalizeProfileResponse(boardAccount))
          } else if (data.username) {
            await loadAccountProfile(data.username)
          } else {
            setAccount(undefined)
          }
        })
        .catch(() => {
          toast.error('Không thể tải thông tin tin đăng.')
        })
      return
    }

    resetAddressState()
    setBulletinBoard(createDefaultBulletinBoard())
    setAccount(undefined)

    const loadNewPostDefaults = async () => {
      try {
        const introspectRes = await introspect()
        if (!introspectRes?.issuer) return

        await loadAccountProfile(introspectRes.issuer)

        const activeMotelId = isValidRouteParam(routeMotelId)
          ? routeMotelId
          : motels?.[0]?.motelId

        if (!activeMotelId) return

        const motelRes = await getMotelById(activeMotelId)
        const motelData = motelRes?.data?.result
        if (!motelData) return

        const motelDefaults = buildDefaultsFromMotel(motelData)
        setBulletinBoard((prev) => ({
          ...prev,
          ...motelDefaults,
          username: introspectRes.issuer,
        }))
        applyAddressFromBoard({
          address: motelData.address,
          latitude: motelData.latitude,
          longitude: motelData.longitude,
        })
      } catch (error) {
        console.error(error)
      }
    }

    loadNewPostDefaults()
  }, [bulletinBoardId, open, resetAddressState, applyAddressFromBoard, loadAccountProfile, routeMotelId, motels])

  const handleMapPositionChange = useCallback(({ lat: newLat, lng: newLng }) => {
    setLat(newLat)
    setLng(newLng)
  }, [])

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

  const formik = useFormik({
    initialValues: {
      title: '',
      rentalCategory: '',
      description: '',
      rentPrice: '',
      promotionalRentalPrice: '',
      deposit: '',
      area: '',
      electricityPrice: '',
      waterPrice: '',
      maxPerson: '',
      moveInDate: null,
      openingHours: DEFAULT_FREE_HOURS,
      closeHours: DEFAULT_FREE_HOURS,
      address: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values)
    }
  })

  const rentalCategorySelectValue = useMemo(() => {
    const category = formik.values.rentalCategory
    if (!category || !typeRooms.length) return ''
    const byName = typeRooms.find((t) => t.name === category)
    if (byName) return byName.typeRoomId
    const byId = typeRooms.find((t) => String(t.typeRoomId) === String(category))
    return byId?.typeRoomId || ''
  }, [formik.values.rentalCategory, typeRooms])

  useEffect(() => {
    if (!selectedProvince || !selectedWard || !addressDetail.trim()) return

    const address = `${addressDetail}, ${selectedWard}, ${selectedProvince}`
    setBulletinBoard((prev) => ({ ...prev, address }))
    formik.setFieldValue('address', address)
  }, [addressDetail, selectedWard, selectedProvince])

  useEffect(() => {
    if (bulletinBoard) {
      formik.setValues({
        title: bulletinBoard.title || '',
        rentalCategory: bulletinBoard.rentalCategory || '',
        description: bulletinBoard.description || '',
        rentPrice: bulletinBoard.rentPrice || '',
        promotionalRentalPrice: bulletinBoard.promotionalRentalPrice || '',
        deposit: bulletinBoard.deposit || '',
        area: bulletinBoard.area || '',
        electricityPrice: bulletinBoard.electricityPrice || '',
        waterPrice: bulletinBoard.waterPrice || '',
        maxPerson: bulletinBoard.maxPerson || '',
        moveInDate: bulletinBoard.moveInDate || null,
        openingHours: bulletinBoard.openingHours || '',
        closeHours: bulletinBoard.closeHours || '',
        address: bulletinBoard.address || ''
      })
    }
  }, [bulletinBoard])

  const handleImageChange = async (event) => {
    const images = Array.from(event.target.files)

    if (selectedImages.length + boardImages.length + images.length > 5) {
      toast.info('Chỉ được chọn tối đa 5 ảnh')
      return
    }

    const processedImagesPromises = images.map(async (image) => {
      if (image) {
        try {
          return await processImage(image, 16 / 9, 0.4)
        } catch (error) {
          console.log('Error processing image:', error)
          return null
        }
      }
      return null
    })

    const processedImages = await Promise.all(processedImagesPromises)
    setSelectedImages((prevImages) => [...prevImages, ...processedImages.filter((img) => img !== null)])
  }

  const handlePost = async () => {
    if (!selectedProvince || !selectedWard || !addressDetail.trim()) {
      toast.warning('Vui lòng điền đủ thông tin địa chỉ (Tỉnh/Thành, Phường/Xã, Số nhà/tên đường).')
      return
    }

    if (lat == null || lng == null) {
      toast.warning('Vui lòng xác định vị trí trên bản đồ (kéo marker hoặc click trên bản đồ nếu không tìm thấy địa chỉ).')
      return
    }

    if (selectedImages.length + boardImages.length < 2) {
      toast.info('Chọn tối thiểu 2 ảnh')
      return
    }

    try {
      const newImageLinks = await Promise.all(selectedImages.map((image) => fileToDataUrl(image)))
      const formattedNewImages = newImageLinks.map((imageLink) => ({ imageLink }))
      const existingImages = boardImages.map(({ bulletinBoardImageId, imageLink }) => ({
        ...(bulletinBoardImageId ? { bulletinBoardImageId } : {}),
        imageLink,
      }))
      const updatedRoom = {
        ...bulletinBoard,
        bulletinBoardImages: [...existingImages, ...formattedNewImages],
      }

      const res = bulletinBoardId
        ? await updateBulletinBoard(bulletinBoardId, updatedRoom)
        : await postBulletinBoard(updatedRoom)

      refreshBulletinBoards()
      if (res.code === 400) {
        toast.error(res.message)
      } else {
        toast.success(isEditMode ? 'Cập nhật tin đăng thành công!' : 'Đăng tin thành công!')
        handleClose(true)
        setSelectedImages([])
        setBulletinBoard(defaultBulletinBoard)
      }
    } catch (error) {
      console.error('Error saving bulletin board images:', error)
      toast.error('Có lỗi xảy ra khi lưu hình ảnh.')
    }
  }

  // Sử dụng `handleImageRemove` trong JSX
  // Hàm xử lý xóa ảnh
  const handleImageRemove = (index, isFromApi) => {
    if (isFromApi) {
      // Nếu ảnh đến từ API, gọi API để xóa ảnh
      const imageToRemove = boardImages[index]
      // Gọi API để xóa ảnh (giả sử có hàm xóa ảnh API là `deleteImageFromApi`)
      deleteImageFromApi(imageToRemove.bulletinBoardImageId)
        .then(() => {
          // Sau khi xóa thành công, cập nhật lại danh sách ảnh
          const updatedImages = boardImages.filter((image, i) => i !== index)
          setBulletinBoard((prevBoard) => ({
            ...prevBoard,
            bulletinBoardImages: updatedImages
          }))
        })
        .catch((error) => console.error('Error deleting image:', error))
    } else {
      // Nếu ảnh đến từ selectedImages, chỉ cần xóa khỏi selectedImages
      const updatedImages = selectedImages.filter((_, i) => i !== index)
      setSelectedImages(updatedImages)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ViewInArIcon />
              <Typography id="modal-modal-title" variant="h6" component={'h2'}>
                {isEditMode ? 'Chỉnh sửa tin đăng' : 'Thêm tin đăng'}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ border: '1px solid #e0e0e0', p: 0.5 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ bgcolor: '#333' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, mt: 1 }}>
            <Switch
              {...label}
              checked={bulletinBoard.status === true}
              onChange={(event) => setBulletinBoard({ ...bulletinBoard, status: event.target.checked })}
            />
            <Box>
              <Typography variant="inherit" component="h2">
                Cho thuê
              </Typography>
              <Typography>Khi bật cho thuê, khách thuê có thể tiếp cận tin của bạn</Typography>
            </Box>
          </Box>
          <Box sx={{ fontStyle: 'italic' }}>
            <TitleAttribute title="Thông tin chủ nhà" description="Nhập các thông tin về người cho thuê" />
            <Typography>
              *Tiêu đề tốt:{' '}
              <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                Cho thuê + loại hình phòng trọ + diện tích + giá + tên đường/quận
              </Typography>
            </Typography>
            <Typography>Ví dụ: </Typography>
            <Typography>Cho thuê phòng trọ 18m2 giá rẻ tại Bình Thạnh</Typography>
          </Box>
          <Grid container>
            <Grid item xs={12} sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                onChange={(event) => {
                  formik.handleChange(event)
                  setBulletinBoard({ ...bulletinBoard, title: event.target.value })
                }}
                value={formik.values.title}
                name="nameRoom"
                required
                variant="filled"
                id="outlined-basic"
                label="Tiêu đề"
                InputLabelProps={{
                  shrink: !!bulletinBoard.title
                }}
                error={Boolean(formik.errors.title)}
                helperText={formik.errors.title}
                sx={{ minWidth: 350 }}
              />
              <FormControl
                required
                variant="filled"
                sx={{ minWidth: 350 }}
                error={Boolean(formik.errors.rentalCategory)}>
                <InputLabel id="demo-simple-select-filled-label">Danh mục nhà trọ</InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="rentalCategory"
                  value={rentalCategorySelectValue}
                  onChange={(event) => {
                    const typeRoomId = event.target.value
                    const selectedTypeRoom = typeRooms.find(
                      (t) => String(t.typeRoomId) === String(typeRoomId)
                    )
                    const rentalCategory = selectedTypeRoom?.name || typeRoomId
                    setBulletinBoard({ ...bulletinBoard, rentalCategory })
                    formik.setFieldValue('rentalCategory', rentalCategory)
                  }}>
                  <MenuItem value="">
                    <em>Chọn danh mục</em>
                  </MenuItem>
                  {typeRooms.map((t) => (
                    <MenuItem key={t.typeRoomId} value={t.typeRoomId}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.errors.rentalCategory}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                name="owner"
                id="outlined-basic"
                label="Tên người liên hệ"
                variant="filled"
                value={account?.fullname || account?.fullName || ''}
                sx={{ minWidth: 350 }}
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
              />

              <TextField
                id="outlined-basic"
                label="SĐT"
                variant="filled"
                name="phone"
                value={account?.phone || ''}
                sx={{ minWidth: 350 }}
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
              />
            </Grid>
          </Grid>
          <TitleAttribute title="Mô tả" description="Nhập mô tả về nhà cho thuê" />
          <TextareaAutosize
            required
            minRows={4}
            onChange={(event) => {
              setBulletinBoard({ ...bulletinBoard, description: event.target.value })
              formik.handleChange(event)
            }}
            value={formik.values.description}
            name="description"
            style={{
              borderRadius: '10px',
              border: '1px solid #ccc',
              padding: '10px',
              overflow: 'hidden',
              resize: 'none',
              width: '715px'
            }}
            placeholder="Nhập mô tả"
          />
          {formik.errors.description && (
            <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.description}</div>
          )}
          <TitleAttribute title="Thông tin cơ bản & giá" description="Nhập các thông tin về phòng cho thuê" />
          <Grid container spacing={1} sx={{ my: 1 }}>
            <Grid item xs={4}>
              <TextField
                onChange={(event) => {
                  const raw = parseVndInput(event.target.value)
                  const numericValue = raw === '' ? '' : Number(raw)
                  setBulletinBoard({ ...bulletinBoard, rentPrice: numericValue })
                  formik.setFieldValue('rentPrice', numericValue)
                }}
                value={formatVndInput(formik.values.rentPrice)}
                name="rentPrice"
                required
                id="outlined-basic"
                label="Giá thuê"
                variant="filled"
                sx={{ width: '100%' }}
                {...getVndInputFieldProps()}
                InputLabelProps={{
                  shrink: !!bulletinBoard.rentPrice
                }}
                error={Boolean(formik.errors.rentPrice)}
                helperText={formik.errors.rentPrice}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                onChange={(event) => {
                  const raw = parseVndInput(event.target.value)
                  const numericValue = raw === '' ? '' : Number(raw)
                  setBulletinBoard({ ...bulletinBoard, promotionalRentalPrice: numericValue })
                  formik.setFieldValue('promotionalRentalPrice', numericValue)
                }}
                name="promotionalRentalPrice"
                id="outlined-basic"
                label="Giá thuê khuyến mãi"
                variant="filled"
                sx={{ width: '100%' }}
                value={formatVndInput(formik.values.promotionalRentalPrice)}
                {...getVndInputFieldProps()}
                InputLabelProps={{
                  shrink: !!bulletinBoard.promotionalRentalPrice
                }}
                error={Boolean(formik.errors.promotionalRentalPrice)}
                helperText={formik.errors.promotionalRentalPrice}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                onChange={(event) => {
                  if (isNegativeNumberValue(event.target.value)) return
                  setBulletinBoard({ ...bulletinBoard, deposit: event.target.value })
                  formik.handleChange
                }}
                name="deposit"
                required
                id="outlined-basic"
                label="Tiền cọc"
                variant="filled"
                type="number"
                sx={{ width: '100%' }}
                {...getNonNegativeNumberFieldProps()}
                value={formik.values.deposit}
                InputLabelProps={{
                  shrink: !!bulletinBoard.deposit
                }}
                error={Boolean(formik.errors.deposit)}
                helperText={formik.errors.deposit}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                onChange={(event) => {
                  if (isNegativeNumberValue(event.target.value)) return
                  setBulletinBoard({ ...bulletinBoard, area: event.target.value })
                  formik.handleChange
                }}
                name="area"
                required
                id="outlined-basic"
                label="Diện tích"
                variant="filled"
                type="number"
                sx={{ width: '100%' }}
                {...getNonNegativeNumberFieldProps()}
                value={formik.values.area}
                InputLabelProps={{
                  shrink: !!bulletinBoard.area
                }}
                error={Boolean(formik.errors.area)}
                helperText={formik.errors.area}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                onChange={(event) => {
                  if (isNegativeNumberValue(event.target.value)) return
                  setBulletinBoard({ ...bulletinBoard, electricityPrice: event.target.value })
                  formik.handleChange
                }}
                name="priceElectric"
                required
                id="outlined-basic"
                label="Giá điện"
                variant="filled"
                type="number"
                sx={{ width: '100%' }}
                {...getNonNegativeNumberFieldProps()}
                value={formik.values.electricityPrice}
                InputLabelProps={{
                  shrink: !!bulletinBoard.electricityPrice
                }}
                error={Boolean(formik.errors.electricityPrice)}
                helperText={formik.errors.electricityPrice}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                onChange={(event) => {
                  if (isNegativeNumberValue(event.target.value)) return
                  setBulletinBoard({ ...bulletinBoard, waterPrice: event.target.value })
                  formik.handleChange
                }}
                name="priceWater"
                required
                id="outlined-basic"
                label="Giá nước"
                variant="filled"
                type="number"
                sx={{ width: '100%' }}
                {...getNonNegativeNumberFieldProps()}
                value={formik.values.waterPrice}
                InputLabelProps={{
                  shrink: !!bulletinBoard.waterPrice
                }}
                error={Boolean(formik.errors.waterPrice)}
                helperText={formik.errors.waterPrice}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl required variant="filled" sx={{ minWidth: 350 }} error={Boolean(formik.errors.maxPerson)}>
                <InputLabel id="demo-simple-select-filled-label">Tối đa người ở / phòng</InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="maxPerson"
                  value={formik.values.maxPerson}
                  onChange={(event) => {
                    setBulletinBoard({ ...bulletinBoard, maxPerson: event.target.value })
                    formik.handleChange
                  }}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'1 người ở'}>1 người ở</MenuItem>
                  <MenuItem value={'2 người ở'}>2 người ở</MenuItem>
                  <MenuItem value={'3 người ở'}>3 người ở</MenuItem>
                  <MenuItem value={'4 người ở'}>4 người ở</MenuItem>
                  <MenuItem value={'5-6 người ở'}>5-6 người ở</MenuItem>
                  <MenuItem value={'7-10 người ở'}>7-10 người ở</MenuItem>
                  <MenuItem value={'Không giới hạn'}>Không giới hạn</MenuItem>
                </Select>
                <FormHelperText>{formik.errors.maxPerson}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                onChange={(event) => {
                  setBulletinBoard({ ...bulletinBoard, moveInDate: event.target.value })
                  formik.handleChange
                }}
                name="moveInDate"
                required
                variant="filled"
                label="Ngày có thể vào ở"
                fullWidth
                type="date"
                value={formik.values.moveInDate ? formik.values.moveInDate.split('T')[0] : ''}
                InputLabelProps={{
                  shrink: true
                }}
                error={Boolean(formik.errors.moveInDate)}
                helperText={formik.errors.moveInDate}
              />
            </Grid>
          </Grid>
          <Box>
            <TitleAttribute title="Tiện ích cho thuê" description="Tùy chọn tiện ích của nhà cho thuê" />
          </Box>
          <Grid container>
            {[
              'Có gác lửng',
              'Có chỗ giữ xe',
              'Toilet riêng',
              'Riêng với chủ',
              'Có wifi',
              'Có camera an ninh',
              'Được nuôi thú cưng',
              'Có ban công',
              'Có nơi sinh hoạt'
            ].map((service) => (
              <Grid item xs={4} key={service}>
                <FormControlLabel
                  checked={rentalAmenities.some((s) => s.rentalAmenities?.name === service)}
                  onChange={() => {
                    const serviceObject = { rentalAmenities: { name: service } }

                    const newServices = rentalAmenities.some((s) => s.rentalAmenities?.name === service)
                      ? rentalAmenities.filter((s) => s.rentalAmenities?.name !== service)
                      : [...rentalAmenities, serviceObject]
                    setBulletinBoard({ ...bulletinBoard, bulletinBoards_RentalAm: newServices })
                  }}
                  control={
                    <Checkbox checked={rentalAmenities.some((s) => s.rentalAmenities?.name === service)} />
                  }
                  label={service}
                />
              </Grid>
            ))}
          </Grid>
          <TitleAttribute title=" Quy định giờ giấc" description="Tùy chọn thời gian hoạt động của nhà cho thuê" />
          <Box sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControl
              variant="filled"
              name="openingHours"
              sx={{ minWidth: 350 }}
              error={Boolean(formik.errors.openingHours)}>
              <InputLabel id="demo-simple-select-filled-label">Giờ mở cửa</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                name="openingHours"
                value={formik.values.openingHours}
                onChange={(event) => {
                  setBulletinBoard({ ...bulletinBoard, openingHours: event.target.value })
                  formik.setFieldValue('openingHours', event.target.value)
                }}>
                <MenuItem value={DEFAULT_FREE_HOURS}>{DEFAULT_FREE_HOURS}</MenuItem>
                <MenuItem value={'4 SA'}>4 AM</MenuItem>
                <MenuItem value={'5 SA'}>5 AM</MenuItem>
                <MenuItem value={'6 SA'}>6 AM</MenuItem>
              </Select>
              <FormHelperText>{formik.errors.openingHours}</FormHelperText>
            </FormControl>
            <FormControl variant="filled" sx={{ minWidth: 350 }} error={Boolean(formik.errors.closeHours)}>
              <InputLabel id="demo-simple-select-filled-label">Giờ đóng cửa</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                name="closeHours"
                value={formik.values.closeHours}
                onChange={(event) => {
                  setBulletinBoard({ ...bulletinBoard, closeHours: event.target.value })
                  formik.setFieldValue('closeHours', event.target.value)
                }}>
                <MenuItem value={DEFAULT_FREE_HOURS}>{DEFAULT_FREE_HOURS}</MenuItem>
                <MenuItem value={'22 CH'}>10 PM</MenuItem>
                <MenuItem value={'23 CH'}>11 PM</MenuItem>
                <MenuItem value={'00 SA'}>12 AM</MenuItem>
              </Select>
              <FormHelperText>{formik.errors.closeHours}</FormHelperText>
            </FormControl>
          </Box>
          <Box>
            <TitleAttribute title="Nội quy" description="Tùy chọn nội quy của nhà cho thuê" />
          </Box>
          <Grid container>
            {[
              {
                title: 'Nhà trọ có giờ giấc không về quá khuya',
                desciption: 'Không về sau 12h tối'
              },
              {
                title: 'Đóng tiền trọ đúng ngày',
                desciption: 'Đóng tiền trọ đúng ngày'
              },
              {
                title: 'Không hút thuốc, say xỉn',
                desciption: 'Không tụ tập nhậu nhặt hát hò làm ảnh hưởng phòng xung quanh'
              },
              {
                title: 'Không chứa chấp tội phạm',
                desciption: 'Không che dấu và chứa chấp tội phạm trong phòng'
              },
              {
                title: 'Không hát karaoke, nhậu nhặt ảnh hưởng tới phòng kế bên',
                desciption: 'Không gây ồn ào, mất trật tự, nhậu nhặt, say xỉn...'
              },
              {
                title: 'Cư xử văn hóa',
                desciption:
                  'Không gây gỗ chữi thề, gây hiềm khích với mọi người, tạo văn hóa phòng trọ yên bình hòa đồng.'
              }
            ].map((rule) => (
              <Grid item xs={6} key={rule.title}>
                <FormControlLabel
                  checked={boardRules.some((s) => s.rule?.ruleName === rule.title)}
                  onChange={() => {
                    const serviceObject = { rule: { ruleName: rule.title } }
                    const newServices = boardRules.some((s) => s.rule?.ruleName === rule.title)
                      ? boardRules.filter((s) => s.rule?.ruleName !== rule.title)
                      : [...boardRules, serviceObject]

                    const uniqueServices = newServices.filter(
                      (value, index, self) => index === self.findIndex((t) => t.rule?.ruleName === value.rule?.ruleName)
                    )

                    setBulletinBoard({ ...bulletinBoard, bulletinBoardRules: uniqueServices })
                  }}
                  control={
                    <Checkbox checked={boardRules.some((s) => s.rule?.ruleName === rule.title)} />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{rule.title}</Typography>
                      <Typography sx={{ fontSize: '12px' }}>{rule.desciption}</Typography>
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <TitleAttribute
              title="Địa chỉ"
              description="Vui lòng nhập địa chỉ chính xác để có thể tìm đến nhà cho thuê của bạn"
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required variant="filled">
                  <InputLabel>Tỉnh/Thành</InputLabel>
                  <Select value={selectedProvince} onChange={handleProvinceChange} label="Tỉnh/Thành">
                    {provinces.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.full_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required variant="filled" disabled={!selectedProvince}>
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
                  variant="filled"
                  label="Số nhà, tên đường"
                  value={addressDetail}
                  onChange={handleAddressDetailChange}
                  placeholder="VD: 123 Nguyễn Văn Linh"
                  name="address"
                  error={Boolean(formik.errors.address)}
                  helperText={formik.errors.address}
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
          <Box>
            <TitleAttribute title="Hình ảnh" description="Hình ảnh về phòng cho thuê" />
            <Box
              sx={{
                bgcolor: '#eeeeee',
                p: 1,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <IconButton
                component="label"
                sx={{
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  border: '2px solid #f0f0f0',
                  width: 30,
                  height: 30,
                  padding: 0,
                  '&:hover': { backgroundColor: '#f0f0f0' }
                }}>
                <CloudUploadIcon fontSize="medium" />
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    handleImageChange(event)
                  }}
                />
              </IconButton>
              <Box
                sx={{
                  display: selectedImages.length > 0 || boardImages.length === 0 ? 'none' : 'block',
                  textAlign: 'center'
                }}>
                <Typography>Chọn tối đa 5 ảnh</Typography>
                <Typography variant="body2">
                  Lưu ý ảnh sẽ được cắt theo tỉ lệ 16:9 để phù hợp với trang web, vui lòng chọn ảnh có tỉ lệ gần giống
                  để không làm mất thông tin quan trọng !
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  maxWidth: '100%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                {selectedImagePreviews.map((previewUrl, i) => (
                    <Box
                      key={`selected-${i}`}
                      component="img"
                      src={previewUrl}
                      alt={`Hình ảnh ${i + 1}`}
                      width={200}
                      height="auto"
                      sx={{ borderRadius: 1, boxShadow: 2, cursor: 'pointer' }}
                      onClick={() => handleImageRemove(i)}
                    />
                  ))}

                {boardImages.map((image, i) => (
                    <Box
                      key={image.bulletinBoardImageId || i} // Sử dụng bulletinBoardImageId làm key
                      component="img"
                      src={image.imageLink} // Sử dụng imageLink từ API
                      alt={`Hình ảnh ${i + 1}`}
                      width={200}
                      height="auto"
                      onError={() => console.log('Lỗi tải hình ảnh')} // Log lỗi khi không tải được ảnh
                      sx={{ borderRadius: 1, boxShadow: 2 }}
                      onClick={() => handleImageRemove(i, true)} // Hàm này để xóa hình ảnh nếu cần
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            display: 'flex',
            mt: 1,
            justifyContent: 'end',
            bgcolor: 'white',
            gap: 1,
            p: 2,
            zIndex: 9999
          }}>
          <Button variant="contained" sx={{ bgcolor: '#7f8c8d', color: 'white', '&:hover': { bgcolor: '#636e72' } }} onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="contained"
            disabled={!formik.isValid || (!isEditMode && !formik.dirty)}
            sx={{ bgcolor: '#20a9e7', color: 'white', '&:hover': { bgcolor: '2b7ed7' } }}
            onClick={handlePost}>
            {isEditMode ? 'Cập nhật tin đăng' : 'Thêm tin đăng'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default PostModal
