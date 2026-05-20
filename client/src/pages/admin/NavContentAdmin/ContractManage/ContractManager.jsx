import { useEffect, useMemo, useState } from 'react'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import ContractHeader from './components/ContractHeader'
import ContractFilters from './components/ContractFilters'
import ContractListTable from './components/ContractListTable'

import { Modal, Button, Form } from 'react-bootstrap'
import { getPhuongXa, getQuanHuyen, getTinhThanh } from '~/apis/addressAPI'
import {
  getRoomByMotelIdYContract,
  getRoomById,
  getServiceRoombyRoomId,
  updateSerivceRoom,
  DeleteRoomServiceByid,
  createRoomService
} from '~/apis/roomAPI'
import { getMotelById } from '~/apis/motelAPI'
import {
  getAllMotelDevices,
  getAllDeviceByRomId,
  deleteRoomDevice,
  insertRoomDevice,
  changeQuantityRoomDevice
} from '~/apis/deviceAPT'
import {
  getContractTemplatesByMotelId,
  createTenant,
  createContract,
  getContractByIdMotel,
  getContractById
} from '~/apis/contractTemplateAPI'
import Swal from 'sweetalert2'
const ContractManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const username = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).username : null
  const { motelId } = useParams()
  const [show, setShow] = useState(false)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilters, setStatusFilters] = useState({
    ACTIVE: true,
    ReportEnd: true,
    IATExpire: true,
    ENDED: true
  })
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState(null)
  const [tenant, setTenant] = useState({
    fullName: '',
    phone: '',
    cccd: '',
    email: '',
    birthday: null,
    gender: 'OTHER', // 'MALE', 'FEMALE', hoặc 'OTHER'
    address: '',
    job: '',
    licenseDate: null,
    placeOfLicense: '',
    frontPhoto: '',
    backPhoto: '',
    role: true,
    temporaryResidence: false,
    informationVerify: false
  })

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
    language: 'Tiếng Việt',
    countTenant: 1,
    status: 'ACTIVE' // Giá trị có thể là 'ACTIVE', 'ENDED', hoặc 'IATExpire'
  })

  const [contracts, setContracts] = useState([])
  const [motelServices, setMotelServices] = useState([])
  const [motelDevices, setMotelSDevices] = useState([])
  const [motel, setMotel] = useState({})
  const [roomServices, setRoomServices] = useState([])
  const [roomDevices, setRoomDevices] = useState([])
  const [device, setdevice] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [contractTemplates, setcontractTemplates] = useState([])
  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    if (motelId) {
      fetchMotelServices(motelId)
      fetchMotelDevices(motelId)
      fetchMotelContractTemplate(motelId)
      setIsAdmin(true)
      fetchCity()
      fetchRooms()
    }
  }

  // Hàm xử lý nhấn ngoài menu
  const contractCounts = useMemo(() => {
    return contracts.reduce(
      (counts, currentContract) => {
        const statusKey = currentContract?.status
        if (statusKey && counts[statusKey] !== undefined) {
          counts[statusKey] += 1
        }
        return counts
      },
      {
        ACTIVE: 0,
        ReportEnd: 0,
        IATExpire: 0,
        ENDED: 0
      }
    )
  }, [contracts])

  const filteredContracts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const hasSelectedStatus = Object.values(statusFilters).some(Boolean)

    return contracts.filter((currentContract) => {
      const statusMatch = !hasSelectedStatus || Boolean(statusFilters[currentContract?.status])

      if (!normalizedSearchTerm) {
        return statusMatch
      }

      const searchableText = [
        currentContract?.room?.name,
        currentContract?.tenant?.fullName,
        currentContract?.tenant?.fullname,
        currentContract?.contractTemplate?.templatename,
        currentContract?.contracttemplate?.templatename
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return statusMatch && searchableText.includes(normalizedSearchTerm)
    })
  }, [contracts, searchTerm, statusFilters])

  const handleStatusFilterChange = (statusKey, checked) => {
    setStatusFilters((previousFilters) => ({
      ...previousFilters,
      [statusKey]: checked
    }))
  }

  const handleContractTableAction = async (action, selectedContract) => {
    const contractId = selectedContract?.contractId
    if (!contractId) {
      return
    }

    if (action === 'view') {
      window.open(`/quanlytro/${motelId}/Contract-Preview/${contractId}`, '_blank')
      return
    }

    if (action === 'assets') {
      await fetchDataRoomByContract(contractId)
      setTimeout(() => {
        document.getElementById('open-asset-select-trigger')?.click()
      }, 0)
      return
    }

    if (action === 'share') {
      const shareLink = `${window.location.origin}/quanlytro/${motelId}/Contract-Preview/${contractId}`

      navigator.clipboard
        .writeText(shareLink)
        .then(() => {
          Swal.fire({
            title: '<strong><u>ThÃ´ng bÃ¡o!</u></strong>',
            icon: 'info',
            html: `
            ÄÃ£ sao chÃ©p liÃªn káº¿t há»£p Ä‘á»“ng! Báº¡n cÃ³ thá»ƒ chia sáº» cho bÃªn thá»© ba.<br>
            <a href="${shareLink}" target="_blank">${shareLink}</a>
          `,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Äi Ä‘áº¿n Ä‘Æ°á»ng dáº«n',
            cancelButtonText: 'ÄÃ³ng'
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(shareLink, '_blank')
            }
          })
        })
        .catch((error) => {
          console.error('KhÃ´ng thá»ƒ sao chÃ©p liÃªn káº¿t:', error)
          Swal.fire({
            title: 'Lá»—i',
            text: 'KhÃ´ng thá»ƒ sao chÃ©p liÃªn káº¿t. Vui lÃ²ng thá»­ láº¡i.',
            icon: 'error'
          })
        })
      return
    }

    if (action === 'print') {
      handlePrintContract(contractId)
      return
    }

    if (action === 'shareCode') {
      navigator.clipboard
        .writeText(contractId)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'ThÃ nh cÃ´ng',
            text: 'ÄÃ£ sao chÃ©p mÃ£ káº¿t ná»‘i há»£p Ä‘á»“ng.'
          })
        })
        .catch((error) => {
          console.error('KhÃ´ng thá»ƒ sao chÃ©p mÃ£ káº¿t ná»‘i:', error)
        })
    }
  }

  // Hàm onChange để cập nhật các trường trong tenant
  const handleTenantChange = (event) => {
    const { name, value } = event.target
    setTenant((prevTenant) => ({
      ...prevTenant,
      [name]: value
    }))
  }

  const InsertTenant = async (roomId, tenant) => {
    try {
      const response = await createTenant(roomId, tenant)
      setTenant(response.result) // Lưu tenant vào state nếu cần
      return response.result // Trả về thông tin tenant
    } catch (error) {
      console.error('Error saving tenant:', error)
      throw error // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await getAllMotelDevices(motelId)
      setdevice(response.result)
    } catch (error) {
      console.error('Error fetching device services:', error)
      setdevice([])
    }
  }

  const applyRoomDevice = async (roomParam, motel_device_idParam) => {
    const data = {
      room: roomParam,
      motelDevice: {
        motel_device_id: motel_device_idParam
      },
      quantity: 1
    }
    const response = await insertRoomDevice(data)
    if (response.code == 200) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'RoomDevice apply successfully!'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'RoomDevice apply failed!'
      })
    }
  }

  const cancelRoomDevice = async (roomId, motel_device_id) => {
    const response = await deleteRoomDevice(roomId, motel_device_id)
    if (response.result == true) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'RoomDevice cancel successfully!'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'RoomDevice cancel failed!'
      })
    }
  }

  const [deviceByRoom, setdeviceByRoom] = useState([])
  const fetchDeviceByRoom = async (roomId) => {
    if (!roomId) {
      console.warn('Room ID is invalid')
      setdeviceByRoom([])
      return { result: [] }
    }
    const response = await getAllDeviceByRomId(roomId)
    console.log(response.result)

    if (response.result.length > 0) {
      setdeviceByRoom(response.result)
    } else {
      setdeviceByRoom([])
    }

    return response
  }

  const handleChangeQuantityRoomDevice = async (roomId, motel_device_id, quantity) => {
    const data = {
      roomId: roomId,
      motel_device_id: motel_device_id,
      quantity: quantity
    }
    const response = await changeQuantityRoomDevice(data)
    if (response.result == true) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'change quantity successfully!'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Thành công',
        text: 'change quantity failed!'
      })
    }
  }

  const InsertContract = async (contract) => {
    try {
      const response = await createContract(contract)
      return response // Trả về kết quả từ tạo hợp đồng
    } catch (error) {
      console.error('Error saving contract:', error)
      throw error // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
  }

  const fetchRooms = async () => {
    //neu co motelId tren URL
    if (motelId) {
      try {
        const dataRoom = await getRoomByMotelIdYContract(motelId)
        setRooms(dataRoom)
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const dataRoom = await getRoomByMotelIdYContract(motel[0].motelId)
        setRooms(dataRoom)
      } catch (error) {
        console.log(error)
      }
    }
  }

  //lay hop dong cua motel do
  const fetchMotelContract = async (id) => {
    try {
      const response = await getContractByIdMotel(id)
      console.log(response)

      if (response) {
        setContracts(response)
      } else {
        setContracts([])
      }
    } catch (error) {
      console.error('Error fetching motel services:', error)
      setContracts([])
    }
  }

  //lay dich vu cua motel va lay motel
  const fetchMotelServices = async (id) => {
    try {
      const response = await getMotelById(id)
      if (response.data && response.data.code === 200 && response.data.result && response.data.result.motelServices) {
        setMotelServices(response.data.result.motelServices)
        setMotel(response.data.result)
      } else {
        setMotelServices([])
      }
    } catch (error) {
      console.error('Error fetching motel services:', error)
      setMotelServices([])
    }
  }

  //lay tai san cua motel
  const fetchMotelDevices = async (id) => {
    try {
      const response = await getAllMotelDevices(id)
      if (response.code === 200) {
        setMotelSDevices(response.result)
      } else {
        setMotelSDevices([])
      }
    } catch (error) {
      console.error('Error fetching motel services:', error)
      setMotelServices([])
    }
  }

  //lay tempalte contract cua motel
  const fetchMotelContractTemplate = async (id) => {
    try {
      const response = await getContractTemplatesByMotelId(id)
      if (response) {
        setcontractTemplates(response)
      } else {
        setcontractTemplates([])
      }
    } catch (error) {
      console.error('Error fetching motel services:', error)
      setMotelServices([])
    }
  }

  // Hàm onChange để cập nhật các trường trong contract
  const handleContractChange = (e) => {
    const { name, value } = e.target

    setContract((prev) => {
      const newContract = { ...prev }

      if (name === 'price') {
        // Loại bỏ các ký tự không phải số và cập nhật giá trị thô
        const numericValue = value.replace(/[^0-9]/g, '') // Chỉ giữ lại số
        newContract.price = numericValue // Lưu giá trị thô vào state
      } else if (name === 'deposit') {
        // Loại bỏ các ký tự không phải số và cập nhật giá trị thô
        const numericValue = value.replace(/[^0-9]/g, '') // Chỉ giữ lại số
        newContract.deposit = numericValue // Lưu giá trị thô vào state
      } else if (name === 'leaseTerm' && prev.moveinDate) {
        // Nếu thay đổi leaseTerm, tính toán closeContract
        const monthsToAdd = parseInt(value, 10)
        if (!isNaN(monthsToAdd)) {
          const moveinDate = new Date(prev.moveinDate)
          moveinDate.setMonth(moveinDate.getMonth() + monthsToAdd)
          newContract.closeContract = moveinDate.toISOString().slice(0, 10)
        }
        newContract.leaseTerm = value // Cập nhật giá trị leaseTerm
      } else {
        newContract[name] = value // Cập nhật các trường khác
      }

      return newContract
    })
  }

  //ham lay dich vu phong
  const fetchDataServiceRooms = async (roomId) => {
    try {
      const roomServicesResponse = await getServiceRoombyRoomId(roomId) // Lấy danh sách dịch vụ mà phòng đang sử dụng

      const updatedServices = motelServices.map((service) => {
        // Tìm dịch vụ tương ứng trong roomServicesResponse
        const roomService = roomServicesResponse.find(
          (roomService) => roomService.service.motelServiceId === service.motelServiceId
        )
        return {
          ...service,
          isSelected: !!roomService, // Đánh dấu checked nếu dịch vụ có trong roomServicesResponse
          quantity: roomService ? roomService.quantity : 0,
          roomId: roomId,
          roomServiceId: roomService ? roomService.roomServiceId : null
          // Gắn quantity nếu tồn tại, nếu không thì mặc định là 0
        }
      })

      setRoomServices(updatedServices) // Cập nhật danh sách dịch vụ
    } catch (error) {
      console.log(error)
    }
  }

  //ham lay tai san phong
  const fetchDataDeviceRooms = async (roomId) => {
    try {
      const roomDevicesResponse = await getAllDeviceByRomId(roomId) // Lấy danh sách dịch vụ mà phòng đang sử dụng
      const updatedDevices = motelDevices.map((device) => {
        // Tìm dịch vụ tương ứng trong roomServicesResponse
        const roomDevice = roomDevicesResponse.result.find(
          (roomDevice) => roomDevice.motelDevice.motel_device_id === device.motel_device_id
        )
        return {
          ...device,
          isSelected: !!roomDevice, // Đánh dấu checked nếu dịch vụ có trong roomServicesResponse
          quantity: roomDevice ? roomDevice.quantity : 0,
          roomId: roomId,
          roomDeviceId: roomDevice ? roomDevice.roomDeviceId : null
        }
      })
      setRoomDevices(updatedDevices)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRoomClick = async (roomId) => {
    setSelectedRoomId(roomId === selectedRoomId ? null : roomId) // Nếu phòng đã chọn thì bỏ chọn, nếu không thì chọn phòng mới
    if (roomId === selectedRoomId) {
      setRoom(null)
      return
    }
    if (roomId) {
      try {
        const dataRoom = await getRoomById(roomId)
        setRoom(dataRoom)
        fetchDataServiceRooms(roomId)
        fetchDataDeviceRooms(roomId)
        setContract((prevContract) => ({
          ...prevContract,
          roomId: dataRoom.roomId, // Cập nhật dữ liệu phòng vào contract,
          price: dataRoom.price,
          deposit: dataRoom.price
        }))
      } catch (error) {
        console.log(error)
      }
    } else {
      // Nếu không chọn phòng nào, xóa thông tin phòng trong contract
      setRoom(null)
      setContract((prevContract) => ({
        ...prevContract,
        room: null
      }))
    }
  }

  //lay tinh thanh
  const fetchCity = async () => {
    getTinhThanh()
      .then((response) => {
        if (response.data.error === 0) {
          setProvinces(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching provinces:', error)
      })
  }

  // Hàm để lấy danh sách quận/huyện theo tỉnh/thành từ API
  const fetchDistricts = async (provinceId) => {
    getQuanHuyen(provinceId)
      .then((response) => {
        if (response.data.error === 0) {
          setDistricts(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching wards:', error)
      })
  }
  // Hàm để lấy danh sách xa/phuong theo quận/huyện từ API
  const fetchWards = async (districId) => {
    getPhuongXa(districId)
      .then((response) => {
        if (response.data.error === 0) {
          setWards(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching wards:', error)
      })
  }

  // Hàm xử lý khi chọn tỉnh/thành
  const handleProvinceChange = (event) => {
    const provinceId = Number(event.target.value)
    setSelectedProvince(provinceId)
    fetchDistricts(provinceId)
  }

  // Hàm xử lý khi chọn quận/huyện
  const handleDistrictChange = (event) => {
    const districtId = Number(event.target.value)
    setSelectedDistrict(districtId)
    console.log(districtId)
    fetchWards(districtId)
  }

  // Hàm xử lý khi chọn xa/phuong
  const handleWardChange = (event) => {
    setSelectedWard(Number(event.target.value))
  }

  // Hàm để xử lý khi người dùng nhấn nút "Áp dụng dịch vụ"
  const handleApplyServices = async () => {
    try {
      // Lọc các dịch vụ không được chọn (để xóa) và các dịch vụ được chọn (để thêm/cập nhật)
      const servicesToDelete = roomServices.filter((service) => !service.isSelected && service.roomServiceId)
      const servicesToUpdateOrAdd = roomServices.filter((service) => service.isSelected)
      console.log(servicesToDelete)

      // Xử lý xóa các dịch vụ không được chọn
      const deletePromises = servicesToDelete.map((service) => DeleteRoomServiceByid(service.roomServiceId))

      // Xử lý thêm hoặc cập nhật các dịch vụ được chọn
      const updateOrAddPromises = servicesToUpdateOrAdd.map((service) => {
        const serviceUpdateData = {
          roomServiceId: service.roomServiceId || null,
          roomId: room.roomId, // ID của phòng hiện tại
          serviceId: service.motelServiceId, // ID của dịch vụ
          quantity: service.quantity || 1 // Giá trị mặc định là 1 nếu quantity chưa có
        }

        return service.roomServiceId
          ? updateSerivceRoom(service.roomServiceId, serviceUpdateData) // Cập nhật nếu đã tồn tại
          : createRoomService(serviceUpdateData) // Thêm mới nếu chưa tồn tại
      })

      // Chờ tất cả các yêu cầu API hoàn tất
      await Promise.all([...deletePromises, ...updateOrAddPromises])

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Thông báo',
        text: 'Tất cả dịch vụ phòng đã được cập nhật thành công!'
      })

      // Đóng modal
      const modalElement = document.getElementById('priceItemSelect')
      const modal = Modal.getInstance(modalElement)
      if (modal) modal.hide()

      // Xóa backdrop dư thừa
      removeExtraModalBackdrops()

      // Cập nhật danh sách dịch vụ trong phòng
      fetchDataServiceRooms(room.roomId)
    } catch (error) {
      console.error('Lỗi khi cập nhật dịch vụ phòng:', error)
 
    }
  }

  // Hàm để xử lý khi người dùng nhấn nút "Áp dụng device"
  const handleApplyDevice = async () => {
    try {
      const DevicesToDelete = roomDevices.filter((device) => !device.isSelected && device.roomDeviceId)
      const DevicesToUpdateOrAdd = roomDevices.filter((device) => device.isSelected)
      // Xử lý xóa các dịch vụ không được chọn
      const deletePromises = DevicesToDelete.map((device) => deleteRoomDevice(device.roomId, device.motel_device_id))
      console.log(DevicesToDelete)
      console.log(DevicesToUpdateOrAdd)
      // Xử lý thêm hoặc cập nhật các dịch vụ được chọn
      const updateOrAddPromises = DevicesToUpdateOrAdd.map((device) => {
        const DeviceUpdateData = {
          roomDeviceId: device.roomDeviceId || null,
          room: {
            roomId: device.roomId
          }, // phòng hiện tại
          motelDevice: {
            motel_device_id: device.motel_device_id
          },
          quantity: device.quantity || 1 // Giá trị mặc định là 1 nếu quantity chưa có
        }
        console.log(DeviceUpdateData)

        return device.roomDeviceId ? console.log() : insertRoomDevice(DeviceUpdateData) // Thêm mới nếu chưa tồn tại
      })

      // Chờ tất cả các yêu cầu API hoàn tất
      await Promise.all([...deletePromises, ...updateOrAddPromises])

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Thông báo',
        text: 'Tất cả Device phòng đã được cập nhật thành công!'
      })

      // Đóng modal
      const modalElement = document.getElementById('priceItemSelect')
      const modal = Modal.getInstance(modalElement)
      if (modal) modal.hide()

      // Xóa backdrop dư thừa
      removeExtraModalBackdrops()

      // Cập nhật danh sách Device trong phòng
      fetchDataServiceRooms(room.roomId)
    } catch (error) {
      console.error('Lỗi khi cập nhật Device phòng:', error)
    
    }
  }

  const fetchDataRoomByContract = async (id) => {
    try {
      const response = await getContractById(id) // Lấy dữ liệu phòng từ API
      setRoom(response.room)
      fetchDeviceByRoom(response.room.roomId)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePrintContract = (contractId) => {
    if (!contractId) {
      return
    }

    const contractUrl = `/quanlytro/${motelId}/Contract-Preview/${contractId}`

    // Mở cửa sổ mới để in nội dung hợp đồng
    const printWindow = window.open(contractUrl, '_blank')

    // Đợi nội dung tải xong, sau đó gọi window.print
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  // Hàm xóa backdrop dư thừa
  const removeExtraModalBackdrops = () => {
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove())
  }

  // Hàm xử lý submit
  const handleSubmit = async () => {
    const form = document.getElementById('add-contract-form')

    if (!form.checkValidity()) {
      form.classList.add('was-validated')
    } else {
      if (!room) {
        Swal.fire({
          icon: 'error',
          title: 'Thông báo',
          text: 'Chưa chọn phòng nào!'
        })
      } else {
        try {
          // Hiển thị thông báo tạo hợp đồng
          Swal.fire({
            icon: 'info',
            title: 'Thông báo',
            text: 'Đang xử lý...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading()
            }
          })

          handleApplyServices()
          handleApplyDevice()
          //Thêm tenant và lấy tenantResponse
          const tenantResponse = await InsertTenant(room.roomId ? room.roomId : '', tenant)

          //Cập nhật contract với tenantId
          const updatedContract = {
            ...contract,
            tenantId: tenantResponse.tenantId
          }

          // Gửi yêu cầu tạo hợp đồng với dữ liệu đã cập nhật
          const contractResponse = await InsertContract(updatedContract)
          console.log(contractResponse)
          // Thông báo thành công
          Swal.fire({
            icon: 'success',
            title: 'Thông báo',
            text: 'Tạo hợp đồng thành công!'
          })

          if (motelId) {
            fetchMotelContract(motelId)
          }
          // Đóng modal
          handleClose()
        } catch (error) {
          // Thông báo lỗi
          Swal.fire({
            icon: 'error',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình xử lý!'
          })
          console.error(error)
        }
      }
    }
  }

  useEffect(() => {
    setContract((prev) => ({
      ...prev,
      username: username
    }))
  }, [username]) // Chỉ chạy khi username thay đổi


  const formatCurrencyValue = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return 'Chưa cập nhật'
    }

    return `${Number(value).toLocaleString('vi-VN')}đ`
  }

  // Run the initial motel contract bootstrap once when the page mounts.
  useEffect(() => {
    setIsAdmin(true)
    fetchDevices()
    fetchMotelDevices(motelId)
    if (motelId) {
      fetchMotelContract(motelId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', margin: '0 10px 10px 10px' }}>
        <ContractHeader onAddContract={handleShow} />
        <ContractFilters
          counts={contractCounts}
          statusFilters={statusFilters}
          onStatusFilterChange={handleStatusFilterChange}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      </div>

      <div style={{ marginLeft: '15px', marginRight: '10px' }}>
        <Box display="flex" justifyContent="flex-end">
          {/* Nút này được ẩn đi vì đã có trên ContractHeader, nhưng giữ lại Modal để không gãy logic */}

          <button
            id="open-asset-select-trigger"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#assetSelect"
            style={{ display: 'none' }}
            aria-hidden="true"
          />
          <Modal show={show} onHide={handleClose} dialogClassName="custom-modal" size="xl">
            {/* size modal*/}
            <Modal.Header closeButton>
              <Modal.Title>Thiết lập hợp đồng</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto', padding: '20px' }}>
              <form className="needs-validation" noValidate id="add-contract-form">
                <div className="row">
                  <div className="col-lg-7 col-sm-12" style={{marginTop:"-1880px"}}>
                    <div className="col-12 mb-2">
                      <div className="title-item-small">
                        <b>Danh sách phòng</b>
                        <i className="des">Danh sách phòng có thể lập hợp đồng</i>
                      </div>
                    </div>
                    <div style={{ position: 'sticky', top: '20px' }}>
                      <div className="room-list row g-2">
                        {rooms ? (
                          rooms.map((room) => (
                            <div
                              key={room.roomId}
                              className={`col-6 room-item ${selectedRoomId === room.roomId ? 'active' : ''}`}
                              onClick={() => handleRoomClick(room.roomId)} // Chọn phòng khi click
                            >
                              <div className="d-flex room-item-inner align-items-center">
                                <div className="flex-grow-0 icon-room">
                                  {selectedRoomId === room.roomId ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-check">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  ) : (
                                    <img
                                      width="20px"
                                      src="/room.png"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <div className="flex-grow-1">
                                  <div>
                                    <b>{room.name}</b>
                                    <span
                                      style={{
                                        backgroundColor: '#ED6004',
                                        display: 'table',
                                        fontSize: '12px',
                                        borderRadius: '5px',
                                        padding: '0 7px',
                                        color: '#fff'
                                      }}>
                                      Đang trống
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center mt-1">
                                    <div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-dollar-sign">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                      </svg>{' '}
                                      {room.price.toLocaleString()}₫
                                    </div>
                                    <div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-user">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                      </svg>{' '}
                                      0/1 người
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>Loading........</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-sm-12">
                    <Form.Group className="mb-3" controlId="thoihanhopdong">
                      <Form.Label>
                        <div className="title-item-small">
                          <b>Thời hạn hợp đồng:</b>
                        </div>
                      </Form.Label>
                      <Form.Select name="leaseTerm" value={contract.leaseTerm} onChange={handleContractChange} required>
                        <option value="">--Thời hạn hợp đồng--</option>
                        {[
                          { value: '1', label: '1 tháng' },
                          { value: '2', label: '2 tháng' },
                          { value: '3', label: '3 tháng' },
                          { value: '4', label: '4 tháng' },
                          { value: '5', label: '5 tháng' },
                          { value: '6', label: '6 tháng' },
                          { value: '7', label: '7 tháng' },
                          { value: '8', label: '8 tháng' },
                          { value: '9', label: '9 tháng' },
                          { value: '10', label: '10 tháng' },
                          { value: '11', label: '11 tháng' },
                          { value: '12', label: '1 năm' },
                          { value: '18', label: '1 năm, 6 tháng' },
                          { value: '24', label: '2 năm' },
                          { value: '32', label: '3 năm' },
                          { value: '48', label: '4 năm' },
                          { value: '60', label: '5 năm' }
                        ].map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="row">
                        <div className="col-6 mt-3">
                          <Form.Label>Ngày vào ở</Form.Label>
                          <Form.Control
                            type="date"
                            name="moveinDate"
                            placeholder="Ngày vào ở"
                            value={contract.moveinDate}
                            onChange={handleContractChange}
                            required
                          />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Label>Ngày kết thúc hợp đồng</Form.Label>
                          <Form.Control
                            type="date"
                            name="closeContract"
                            placeholder="Ngày vào ở"
                            value={contract.closeContract}
                            onChange={handleContractChange}
                            required
                          />
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="thongitnkhach">
                      <div className="title-item-small mb-2">
                        <b>Thông tin khách thuê:</b>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <Form.Control
                            type="number"
                            name="countTenant"
                            min={1}
                            placeholder="Số lượng thành viên"
                            value={contract.countTenant}
                            onChange={handleContractChange}
                            required
                          />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={tenant.fullName}
                            onChange={handleTenantChange}
                            placeholder="Tên người ở"
                            required
                          />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Control
                            type="text"
                            name="phone"
                            value={tenant.phone}
                            onChange={handleTenantChange}
                            placeholder="Số điện thoại"
                            required
                          />
                        </div>
                        <div className="col-12 mt-3">
                          <Form.Control type="text" name="cccd" placeholder="CMND/CCCD" />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Label>Ngày Sinh</Form.Label>
                          <Form.Control type="date" name="dateBth" />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Label>Giới Tính</Form.Label>
                          <Form.Select name="gioitinh">
                            <option value="">--Giới tính--</option>
                            <option value="nam">Nam</option>
                            <option value="nữ">Nữ</option>
                          </Form.Select>
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Select
                            name="tinhTP"
                            value={selectedProvince}
                            onChange={(e) => {
                              handleProvinceChange(e)
                            }}>
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {provinces.map((province, index) => (
                              <option key={index} value={province.id}>
                                {province.full_name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Select
                            name="quanHuyen"
                            value={selectedDistrict}
                            onChange={(e) => {
                              handleDistrictChange(e)
                            }}>
                            <option value="">Chọn quận/huyện</option>
                            {districts.map((district, index) => (
                              <option key={index} value={district.id}>
                                {district.full_name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                        <div className="col-12 mt-3">
                          <Form.Select
                            name="phuongXa"
                            value={selectedWard}
                            onChange={(e) => {
                              handleWardChange(e)
                            }}>
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map((ward, index) => (
                              <option key={index} value={ward.id}>
                                {ward.full_name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                        <div className="col-12 mt-3">
                          <Form.Control type="text" name="diachi" placeholder="Địa chỉ" />
                        </div>
                        <div className="col-12 mt-3">
                          <Form.Control type="text" name="congviec" placeholder="Công việc hiện tại" />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Label>Ngày cấp</Form.Label>
                          <Form.Control type="date" name="ngaycapCCCD" />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Label>Nơi cấp</Form.Label>
                          <Form.Control type="text" name="noicapCCCD" />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Label>Ảnh mặt trước CCCD/CMND</Form.Label>
                          <Form.Control type="file" accept="image/*" />
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Label>Ảnh mặt sau CCCD/CMND</Form.Label>
                          <Form.Control type="file" accept="image/*" />
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="dichvusudung">
                      <div className="title-item-small">
                        <b>Dịch vụ sử dụng</b>
                        <i className="des">Thêm dịch vụ sử dụng như: điện, nước, rác, wifi...</i>
                      </div>
                      <div className="price-items-checkout-layout">
                        {motelServices ? (
                          motelServices.map((service, index) => (
                            <div className="item" key={index}>
                              {/* Checkbox để chọn dịch vụ */}
                              <div className="item-check-name">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={roomServices.some(
                                    (s) => s.motelServiceId === service.motelServiceId && s.isSelected
                                  )} // Kiểm tra nếu dịch vụ đã tồn tại và isSelected = true
                                  onChange={(e) => {
                                    const isChecked = e.target.checked
                                    setRoomServices((prevServices) => {
                                      const existingService = prevServices.find(
                                        (s) => s.motelServiceId === service.motelServiceId
                                      )

                                      if (isChecked) {
                                        // Nếu checked, thêm/cập nhật dịch vụ với `isSelected = true`
                                        if (existingService) {
                                          // Dịch vụ đã tồn tại => cập nhật `isSelected = true`
                                          return prevServices.map((s) =>
                                            s.motelServiceId === service.motelServiceId
                                              ? { ...s, isSelected: true, quantity: s.quantity || 1 }
                                              : s
                                          )
                                        } else {
                                          // Thêm dịch vụ mới
                                          return [
                                            ...prevServices,
                                            { ...service, isSelected: true, quantity: 1 } // Mặc định quantity = 1
                                          ]
                                        }
                                      } else {
                                        // Nếu unchecked, chỉ cập nhật `isSelected = false` (không loại bỏ dịch vụ)
                                        if (existingService) {
                                          return prevServices.map((s) =>
                                            s.motelServiceId === service.motelServiceId
                                              ? { ...s, isSelected: false }
                                              : s
                                          )
                                        }
                                        return prevServices // Không làm gì nếu dịch vụ chưa tồn tại
                                      }
                                    })
                                  }}
                                />
                                <label>
                                  <b>{service.nameService}</b>
                                  <p>
                                    Giá: <b>{service.price.toLocaleString('vi-VN')}đ</b> /{' '}
                                    {service.chargetype === 'Theo người' ? 'người' : service.chargetype}
                                  </p>
                                </label>
                              </div>

                              {/* Nhập số lượng dịch vụ */}
                              <div className="item-value">
                                <div className="input-group">
                                  <input
                                    className="form-control"
                                    readOnly
                                    min="0"
                                    type="number"
                                    placeholder="Nhập giá trị"
                                    value={
                                      roomServices.find((s) => s.motelServiceId === service.motelServiceId)?.quantity ||
                                      0
                                    } // Lấy quantity từ roomServices nếu dịch vụ tồn tại
                                    disabled={
                                      !roomServices.some(
                                        (s) => s.motelServiceId === service.motelServiceId && s.isSelected
                                      )
                                    } // Vô hiệu hóa nếu dịch vụ chưa được chọn
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value, 10) || 0
                                      setRoomServices((prevServices) =>
                                        prevServices.map((s) =>
                                          s.motelServiceId === service.motelServiceId
                                            ? { ...s, quantity: newQuantity }
                                            : s
                                        )
                                      )
                                    }}
                                  />
                                  <label style={{ fontSize: '12px' }} className="input-group-text">
                                    {service.chargetype === 'Theo người' ? 'người' : service.chargetype}
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <></>
                        )}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="giatrihopdong">
                      <div className="title-item-small mb-2">
                        <b>Thông tin giá trị hợp đồng:</b>
                        <i className="des">Giá tiền phòng và tiền cọc</i>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <Form.Control
                            type="text"
                            name="price"
                            placeholder="Giá thuê"
                            value={contract.price ? Number(contract.price).toLocaleString('vi-VN') : ''}
                            onChange={handleContractChange}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <Form.Control
                            type="text"
                            name="deposit"
                            placeholder="Tiền cọc"
                            value={contract.deposit ? Number(contract.deposit).toLocaleString('vi-VN') : ''}
                            onChange={handleContractChange}
                            required
                          />
                        </div>
                        <div className="col-12 mt-3">
                          <Form.Select
                            name="collectioncycle"
                            value={contract.collectioncycle}
                            onChange={handleContractChange}
                            required>
                            <option value="">--Chu kỳ thu tiền--</option>
                            {[
                              { value: '0', label: 'Tùy chỉnh' },
                              { value: '1', label: '1 tháng' },
                              { value: '2', label: '2 tháng' },
                              { value: '3', label: '3 tháng' },
                              { value: '4', label: '4 tháng' },
                              { value: '5', label: '5 tháng' },
                              { value: '6', label: '6 tháng' },
                              { value: '7', label: '7 tháng' },
                              { value: '8', label: '8 tháng' },
                              { value: '9', label: '9 tháng' },
                              { value: '10', label: '10 tháng' },
                              { value: '11', label: '11 tháng' },
                              { value: '12', label: '1 năm' },
                              { value: '18', label: '1 năm, 6 tháng' },
                              { value: '24', label: '2 năm' },
                              { value: '32', label: '3 năm' },
                              { value: '48', label: '4 năm' },
                              { value: '60', label: '5 năm' }
                            ].map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mauvanban">
                      <div className="title-item-small  mb-2">
                        <b>Chọn mẫu văn bản hợp đồng</b>
                        <i className="des">Mẫu văn bản hợp đồng dùng khi in</i>
                      </div>
                      <Form.Select
                        name="mauhopdong"
                        required
                        onChange={(e) => {
                          const selectedTemplateId = e.target.value
                          console.log(selectedTemplateId)

                          setContract((prevContract) => ({
                            ...prevContract,
                            contracttemplateId: selectedTemplateId || null // Cập nhật giá trị hoặc để null nếu không chọn
                          }))
                        }}>
                        <option value="">--Mẫu văn bản hợp đồng--</option>
                        {contractTemplates ? (
                          contractTemplates.map((contractTemplate, index) => (
                            <option key={index} value={contractTemplate.contractTemplateId}>
                              {contractTemplate.templatename}
                            </option>
                          ))
                        ) : (
                          <></>
                        )}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                      <div className="title-item-small  mb-2">
                        <b>Ghi chú</b>
                        <i className="des">Những ghi chú lưu ý cho hợp đồng này</i>
                      </div>
                      <Form.Control as="textarea" rows={3} onChange={handleContractChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="device">
                      <div className="title-has-icon">
                        <div className="icon">
                          <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="css-i6dzq1">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                        </div>
                        <div className="title-item-small">
                          <b>Tài sản của phòng</b>
                          <i className="des">Các tài sản trong quá trình thuê phòng</i>
                        </div>
                      </div>
                      <div className="asset-checkout-layout">
                        {motelDevices ? (
                          motelDevices.map((motelDevice, index) => (
                            <div className="item" key={index}>
                              <div className="item-check-name">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={roomDevices.some(
                                    (d) => d.motel_device_id === motelDevice.motel_device_id && d.isSelected
                                  )} // Kiểm tra nếu dịch vụ đã tồn tại và isSelected = true
                                  onChange={(e) => {
                                    const isChecked = e.target.checked
                                    setRoomDevices((prevDevices) => {
                                      const existingService = prevDevices.find(
                                        (d) => d.motel_device_id === motelDevice.motel_device_id
                                      )

                                      if (isChecked) {
                                        // Nếu checked, thêm/cập nhật dịch vụ với `isSelected = true`
                                        if (existingService) {
                                          // Dịch vụ đã tồn tại => cập nhật `isSelected = true`
                                          return prevDevices.map((d) =>
                                            d.motel_device_id === motelDevice.motel_device_id
                                              ? { ...d, isSelected: true, quantity: d.quantity || 1 }
                                              : d
                                          )
                                        } else {
                                          // Thêm dịch vụ mới
                                          return [
                                            ...prevDevices,
                                            { ...motelDevice, isSelected: true, quantity: 1 } // Mặc định quantity = 1
                                          ]
                                        }
                                      } else {
                                        // Nếu unchecked, chỉ cập nhật `isSelected = false` (không loại bỏ dịch vụ)
                                        if (existingService) {
                                          return prevDevices.map((d) =>
                                            d.motel_device_id === motelDevice.motel_device_id
                                              ? { ...d, isSelected: false }
                                              : d
                                          )
                                        }
                                        return prevDevices // Không làm gì nếu dịch vụ chưa tồn tại
                                      }
                                    })
                                  }}
                                />
                                <label htmlFor="room_check_asset_344">
                                  <b>{motelDevice.deviceName}</b>
                                  <p>
                                    Giá trị: <b>{formatCurrencyValue(motelDevice.value)}</b> / {motelDevice.unit}
                                  </p>
                                </label>
                              </div>
                              <div className="item-value">
                                <div className="input-group">
                                  <input
                                    className="form-control"
                                    min="0"
                                    type="number"
                                    readOnly
                                    value={
                                      roomDevices.find((s) => s.motel_device_id === motelDevice.motel_device_id)
                                        ?.quantity || 0
                                    } // Lấy quantity từ roomDevices nếu dịch vụ tồn tại
                                    disabled={
                                      !roomDevices.some(
                                        (d) => d.motel_device_id === motelDevice.motel_device_id && d.isSelected
                                      )
                                    } // Vô hiệu hóa nếu dịch vụ chưa được chọn
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value, 10) || 0
                                      setRoomDevices((prevServices) =>
                                        prevServices.map((d) =>
                                          d.motel_device_id === motelDevice.motel_device_id
                                            ? { ...d, quantity: newQuantity }
                                            : d
                                        )
                                      )
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <></>
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="moigioi">
                      <div className="title-item-small mb-2">
                        <b>Môi giới</b>
                        <i className="des">Chọn người giới thiệu hợp đồng và phí môi giới</i>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <Form.Select name="dsmoigioi">
                            <option value="">--Danh sách môi giới--</option>
                          </Form.Select>
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Select name="hoahong">
                            <option value="">--Mức hoa hồng--</option>
                          </Form.Select>
                        </div>
                        <div className="col-6 mt-3">
                          <Form.Control type="number" name="tienhoahong" />
                        </div>
                        <div className="mt-3">
                          <Form.Check type="switch" id="custom-switch" label="Tạo phiếu chi" />
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="primary" type="submit" onClick={() => handleSubmit()}>
                  Thêm hợp đồng mới
                </Button>
              </Box>
            </Modal.Footer>
          </Modal>
        </Box>
      </div>
      <div className="mt-3" style={{ marginLeft: '15px', marginRight: '10px', position: 'relative' }}>
        <ContractListTable contracts={filteredContracts} onActionClick={handleContractTableAction} />
      </div>

      {/* Modal hiển thị tai san */}
      {room ? (
        <div
          className="modal fade"
          data-bs-backdrop="static"
          id="assetSelect"
          tabIndex={-1}
          aria-labelledby="assetSelect"
          aria-modal="true"
          role="dialog"
          style={{ display: 'none', paddingLeft: '0px' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div
                  style={{
                    marginRight: '15px',
                    outline: '0',
                    boxShadow: '0 0 0 .25rem rgb(112 175 237 / 16%)',
                    opacity: '1',
                    borderRadius: '100%',
                    width: '36px',
                    height: '36px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    backgroundColor: 'rgb(111 171 232)'
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-inbox">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>
                </div>
                <h5 className="modal-title" id="addRoomLabel">
                  Thông tin tài sản
                  <span className="room-name"> &quot;{room.name}&quot;</span>
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                  {' '}
                </button>
              </div>
              <div className="modal-body">
                {device.length > 0 ? (
                  <div className="row mt-4">
                    {device.map((item) => (
                      <div key={item.motel_device_id} className="col-12 border p-3 d-flex align-items-center mt-1">
                        <input
                          onChange={async (e) => {
                            if (e.target.checked) {
                              await applyRoomDevice(room, item.motel_device_id)
                            } else {
                              await cancelRoomDevice(room.roomId, item.motel_device_id)
                            }
                            const updatedDevices = await fetchDeviceByRoom(room.roomId)
                            setdeviceByRoom(updatedDevices.result)
                          }}
                          type="checkbox"
                          className="mx-3"
                          checked={deviceByRoom.some((it) => it.motelDevice.motel_device_id === item.motel_device_id)}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.deviceName}</h6>
                          <p className="mb-0">
                            Giá: <strong>{formatCurrencyValue(item.value)}</strong> /{' '}
                            {item.unit == 'CAI'
                              ? 'Cái'
                              : item.unit == 'CHIEC'
                              ? 'Chiếc'
                              : item.unit == 'BO'
                              ? 'Bộ'
                              : 'Cặp'}
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            onChange={() => {
                              handleChangeQuantityRoomDevice(room.roomId, item.motel_device_id, 200)
                            }}
                            className="form-control text-center"
                            value={
                              deviceByRoom.some((it) => it.motelDevice.motel_device_id === item.motel_device_id)
                                ? deviceByRoom.find((it) => it.motelDevice.motel_device_id === item.motel_device_id)
                                    .quantity
                                : 1
                            }
                            style={{ width: '100px' }}
                          />
                          <span className="mx-2">Số lượng</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-danger mt-2">Căn trọ chưa thiết lập tài sản nào, cần thêm tài sản !</p>
                  </div>
                )}
              </div>
              <div className="modal-footer modal-footer--sticky">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Đóng
                </button>
                {/* su kien onclick khi submit form cua thuan (nho thay doi)  */}
                {/* <button type="button" id="submit-room" className="btn btn-primary" onClick={handleApplyServices}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-plus">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Áp dụng tài sản
                </button> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ContractManager

