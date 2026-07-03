import { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import { getContractByIdMotel, getContractById } from '~/apis/contractTemplateAPI'
import {
  changeQuantityRoomDevice,
  deleteRoomDevice,
  getAllDeviceByRomId,
  getAllMotelDevices,
  insertRoomDevice
} from '~/apis/deviceAPT'
import { getRoomByMotelIdYContract } from '~/apis/roomAPI'
import ContractFilters from './components/ContractFilters'
import ContractHeader from './components/ContractHeader'
import ContractListTable from './components/ContractListTable'
import ContractCreateDialog from './components/ContractCreateDialog'

const ContractManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const { motelId } = useParams()
  const [show, setShow] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilters, setStatusFilters] = useState({
    ACTIVE: false,
    ReportEnd: false,
    IATExpire: false,
    ENDED: false
  })
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState(null)
  const [contracts, setContracts] = useState([])
  const [device, setdevice] = useState([])
  const [deviceByRoom, setdeviceByRoom] = useState([])

  const handleClose = () => setShow(false)

  const handleShow = () => {
    setShow(true)
    setIsAdmin(true)
    fetchRooms()
  }

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

  const fetchRooms = async () => {
    const activeMotelId = motelId || motels?.[0]?.motelId
    if (!activeMotelId) {
      setRooms([])
      return
    }

    try {
      const dataRoom = await getRoomByMotelIdYContract(activeMotelId)
      setRooms(dataRoom)
    } catch (error) {
      console.error('Lỗi khi truy xuất phòng:', error)
      setRooms([])
    }
  }

  const fetchMotelContract = async (id) => {
    try {
      const response = await getContractByIdMotel(id)
      setContracts(response || [])
    } catch (error) {
      console.error('Lỗi khi truy xuất hợp đồng khách sạn:', error)
      setContracts([])
    }
  }

  const fetchDevices = async () => {
    if (!motelId) {
      setdevice([])
      return
    }

    try {
      const response = await getAllMotelDevices(motelId)
      setdevice(response?.result ?? [])
    } catch (error) {
      console.error('Lỗi khi truy xuất thiết bị khách sạn:', error)
      setdevice([])
    }
  }

  const fetchDeviceByRoom = async (roomId) => {
    if (!roomId) {
      setdeviceByRoom([])
      return { result: [] }
    }

    try {
      const response = await getAllDeviceByRomId(roomId)
      setdeviceByRoom(response?.result ?? [])
      return response
    } catch (error) {
      console.error('Lỗi khi truy xuất thiết bị phòng:', error)
      setdeviceByRoom([])
      return { result: [] }
    }
  }

  const applyRoomDevice = async (roomParam, motelDeviceId) => {
    const data = {
      room: roomParam,
      motelDevice: {
        motel_device_id: motelDeviceId
      },
      quantity: 1
    }

    const response = await insertRoomDevice(data)
    if (response?.code === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã áp dụng tài sản cho phòng.'
      })
      return
    }

    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Không thể áp dụng tài sản cho phòng.'
    })
  }

  const cancelRoomDevice = async (roomId, motelDeviceId) => {
    const response = await deleteRoomDevice(roomId, motelDeviceId)
    if (response?.result === true) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã bỏ tài sản khỏi phòng.'
      })
      return
    }

    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Không thể bỏ tài sản khỏi phòng.'
    })
  }

  const handleChangeQuantityRoomDevice = async (roomId, motelDeviceId, quantity) => {
    const data = {
      roomId,
      motel_device_id: motelDeviceId,
      quantity
    }

    const response = await changeQuantityRoomDevice(data)
    if (response?.result === true) {
      return
    }

    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Không thể cập nhật số lượng tài sản.'
    })
  }

  const fetchDataRoomByContract = async (contractId) => {
    try {
      const response = await getContractById(contractId)
      setRoom(response?.room ?? null)
      if (response?.room?.roomId) {
        await fetchDeviceByRoom(response.room.roomId)
      } else {
        setdeviceByRoom([])
      }
    } catch (error) {
      console.error('Lỗi khi truy xuất dữ liệu phòng hợp đồng:', error)
    }
  }

  const handlePrintContract = (contractId) => {
    if (!contractId) {
      return
    }

    const contractUrl = `/quanlytro/${motelId}/Contract-Preview/${contractId}`
    const printWindow = window.open(contractUrl, '_blank')

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
      }
    }
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
            title: '<strong><u>Thông báo</u></strong>',
            icon: 'info',
            html: `Đã sao chép liên kết hợp đồng.<br><a href="${shareLink}" target="_blank">${shareLink}</a>`,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Mở liên kết',
            cancelButtonText: 'Đóng'
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(shareLink, '_blank')
            }
          })
        })
        .catch((error) => {
          console.error('Không thể sao chép liên kết:', error)
          Swal.fire({
            title: 'Lỗi',
            text: 'Không thể sao chép liên kết. Vui lòng thử lại.',
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
            title: 'Thành công',
            text: 'Đã sao chép mã kết nối hợp đồng.'
          })
        })
        .catch((error) => {
          console.error('Không thể sao chép mã kết nối:', error)
        })
    }
  }

  const formatCurrencyValue = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return 'Chưa cập nhật'
    }

    return `${Number(value).toLocaleString('vi-VN')} đ`
  }

  const formatUnitLabel = (unit) => {
    if (unit === 'CAI') return 'Cai'
    if (unit === 'CHIEC') return 'Chiec'
    if (unit === 'BO') return 'Bo'
    return 'Cap'
  }

  useEffect(() => {
    setIsAdmin(true)
    fetchDevices()
    if (motelId) {
      fetchMotelContract(motelId)
    }
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

      <div style={{ padding: '20px 20px 12px 20px', backgroundColor: '#f8f9fa', borderRadius: '10px 10px 0 0', margin: '0 10px 0 10px' }}>
        <ContractHeader onAddContract={handleShow} />
      </div>

      <div style={{ padding: '10px 20px', backgroundColor: '#ffffff', border: '1px solid #e8e8e8', margin: '0 10px 10px 10px', borderRadius: '0 0 10px 10px' }}>
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
          <button
            id="open-asset-select-trigger"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#assetSelect"
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          <ContractCreateDialog
            open={show}
            onClose={handleClose}
            motelId={motelId}
            rooms={rooms}
            onCreated={() => {
              if (motelId) {
                fetchMotelContract(motelId)
              }
              fetchRooms()
            }}
          />
        </Box>
      </div>

      <div className="mt-3" style={{ marginLeft: '15px', marginRight: '10px', position: 'relative' }}>
        <ContractListTable contracts={filteredContracts} onActionClick={handleContractTableAction} />
      </div>

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
                          onChange={async (event) => {
                            if (event.target.checked) {
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
                            Giá: <strong>{formatCurrencyValue(item.value)}</strong> / {formatUnitLabel(item.unit)}
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            min="1"
                            onChange={(event) => {
                              const nextQuantity = Math.max(1, Number(event.target.value) || 1)
                              handleChangeQuantityRoomDevice(room.roomId, item.motel_device_id, nextQuantity)
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
                    <p className="text-danger mt-2">Căn phòng chưa thiết lập tài sản nào, cần thêm tài sản.</p>
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
                  Dong
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ContractManager
