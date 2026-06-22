import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import AddIcon from '@mui/icons-material/Add'
import { useState, useEffect } from 'react'
import { getRoomById } from '~/apis/roomAPI'
import Flatpickr from 'react-flatpickr'
import { Vietnamese } from 'flatpickr/dist/l10n/vn'
import 'flatpickr/dist/themes/material_blue.css'
import Swal from 'sweetalert2'
import { createReserveAPlace } from '~/apis/ReserveAPlaceAPI'

const datePickerOptions = {
  allowInput: false,
  clickOpens: true,
  locale: Vietnamese,
  dateFormat: 'd/m/Y'
}

function ReserveAPlaceModal({ toggleModal, modalOpen, roomId }) {
  const [room, setRoom] = useState({})
  const [reserveAPlace, setReserveAPlaceData] = useState({
    createDate: new Date(), // Ngày cọc giữ chỗ
    moveInDate: null, // Ngày dự kiến vào ở
    nameTenant: '', // Tên người ở
    phoneTenant: '', // Số điện thoại người ở
    deposit: null, // Số tiền cọc giữ chỗ (đ)
    roomId: '', // Giá thuê hiện tại (đ)
    note: '', // Ghi chú
    status: 'Stake'
  })
  // Hàm lấy dữ liệu phòng từ server
  const fetchDataRoom = async (roomId) => {
    if (roomId) {
      try {
        const response = await getRoomById(roomId) // Lấy dữ liệu phòng từ API
        if (response) {
          setRoom(response)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  const handleDepositChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '') // Xóa ký tự không phải số
    setReserveAPlaceData((prev) => ({
      ...prev,
      deposit: value ? parseFloat(value) : 0
    }))
  }

  const formatDate = (date) => {
    if (!date) return null

    const d = date instanceof Date ? date : new Date(date)
    if (Number.isNaN(d.getTime())) return null

    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleDateChange = (field, selectedDates) => {
    if (selectedDates.length > 0) {
      setReserveAPlaceData((prev) => ({
        ...prev,
        [field]: selectedDates[0]
      }))
    }
  }

  const handleSubmit = async () => {
    const form = document.getElementById('add-deposit-temp-form')
    const formattedCreateDate = formatDate(reserveAPlace.createDate)
    const formattedMoveInDate = formatDate(reserveAPlace.moveInDate)

    if (!formattedCreateDate) {
      Swal.fire({
        icon: 'error',
        title: 'Thiếu thông tin',
        text: 'Vui lòng chọn ngày cọc giữ chỗ.',
        confirmButtonText: 'Đóng'
      })
      return
    }

    if (!formattedMoveInDate) {
      Swal.fire({
        icon: 'error',
        title: 'Thiếu thông tin',
        text: 'Vui lòng chọn ngày dự kiến vào ở.',
        confirmButtonText: 'Đóng'
      })
      return
    }

    if (!form.checkValidity()) {
      form.classList.add('was-validated')
    } else {
      try {
        if (roomId) {
          const newReserveAPlace = {
            ...reserveAPlace,
            roomId: room.roomId ? room.roomId : '',
            createDate: formattedCreateDate,
            moveInDate: formattedMoveInDate
          }

          await createReserveAPlace(newReserveAPlace)

          // Hiển thị thông báo thành công
          Swal.fire({
            icon: 'success',
            title: 'Tạo thành công!',
            text: 'Bạn đã tạo thành công một đơn đặt chỗ.',
            confirmButtonText: 'Đóng'
          })

          // Xử lý sau khi tạo thành công (ví dụ reset form hoặc chuyển hướng)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } catch (error) {
        // Nếu có lỗi trong quá trình tạo, hiển thị thông báo lỗi
        console.log(error)

        Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          text: 'Không thể tạo đơn đặt chỗ, vui lòng thử lại sau.',
          confirmButtonText: 'Đóng'
        })
      }
    }
  }
  useEffect(() => {
    const handlFristData = () => {
      if (roomId) {
        fetchDataRoom(roomId)
      }
    }

    handlFristData()
  }, [roomId]) // Chỉ chạy lại khi roomId hoặc motelId thay đổi0

  useEffect(() => {
    if (room?.roomId) {
      setReserveAPlaceData((prev) => ({
        ...prev,
        roomId: room.roomId
      }))
    }
  }, [room])

  return (
    <div>
      {room ? (
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  marginRight: '15px',
                  outline: '0',
                  boxShadow: '0 0 0 .25rem rgba(76, 175, 80, 0.16)',
                  opacity: '1',
                  borderRadius: '100%',
                  width: '36px',
                  height: '36px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  backgroundColor: 'rgb(32, 169, 231)'
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
                  className="feather feather-anchor">
                  <circle cx="12" cy="5" r="3"></circle>
                  <line x1="12" y1="22" x2="12" y2="8"></line>
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
                </svg>
              </div>
              <h5 style={{ marginLeft: '10px' }}>Cọc giữ chỗ - {room ? room.name : <>ko co </>}</h5>
            </div>
          </ModalHeader>

          <ModalBody>
            <form method="POST" className="needs-validation" id="add-deposit-temp-form" noValidate>
              <div className="row g-2">
                <div className="col-6">
                  <div className="input-group">
                    <div className="form-floating">
                      <Flatpickr
                        className="form-control date-flat-picker flatpickr-input"
                        name="createDate"
                        id="date_deposit_temp"
                        placeholder="Chọn ngày cọc giữ chỗ"
                        readOnly
                        required
                        value={reserveAPlace.createDate}
                        onChange={(selectedDates) => handleDateChange('createDate', selectedDates)}
                        options={datePickerOptions}
                      />
                      <label htmlFor="date_deposit_temp">
                        Ngày cọc giữ chỗ <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                    <label className="input-group-text" htmlFor="date_deposit_temp">
                      <i className="bi bi-calendar" style={{ fontSize: '25px' }}></i>
                    </label>
                  </div>
                </div>

                <div className="col-6">
                  <div className="input-group">
                    <div className="form-floating">
                      <Flatpickr
                        className="form-control date-flat-picker flatpickr-input"
                        name="moveInDate"
                        id="date_will_join"
                        placeholder="Chọn ngày dự kiến vào ở"
                        readOnly
                        required
                        value={reserveAPlace.moveInDate || ''}
                        onChange={(selectedDates) => handleDateChange('moveInDate', selectedDates)}
                        options={datePickerOptions}
                      />
                      <label htmlFor="date_will_join">
                        Ngày dự kiến vào ở <span style={{ color: 'red' }}>*</span>
                      </label>
                    </div>
                    <label className="input-group-text" htmlFor="date_will_join">
                      <i className="bi bi-calendar" style={{ fontSize: '25px' }}></i>
                    </label>
                  </div>
                </div>

                <div className="col-6 mt-2">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="nameTenant"
                      id="customer_name"
                      placeholder="Nhập tên người ở"
                      value={reserveAPlace.nameTenant}
                      onChange={(e) =>
                        setReserveAPlaceData((prev) => ({
                          ...prev,
                          nameTenant: e.target.value
                        }))
                      }
                      required
                    />
                    <label htmlFor="customer_name">Tên người ở</label>
                  </div>
                </div>

                <div className="col-6 mt-2">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="phoneTenant"
                      id="customer_phone"
                      placeholder="Nhập số điện thoại người ở"
                      value={reserveAPlace.phoneTenant}
                      onChange={(e) =>
                        setReserveAPlaceData((prev) => ({
                          ...prev,
                          phoneTenant: e.target.value
                        }))
                      }
                      required
                    />
                    <label htmlFor="customer_phone">Số điện thoại người ở</label>
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="deposit"
                      id="deposit_temp_amount"
                      placeholder="Nhập số tiền cọc"
                      value={reserveAPlace.deposit != null ? formatCurrency(reserveAPlace.deposit) : ''}
                      onChange={handleDepositChange}
                      required
                    />
                    <label htmlFor="deposit_temp_amount">Số tiền cọc giữ chỗ (đ)</label>
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <span>Giá thuê hiện tại</span>
                  <div
                    className="room_amount"
                    style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(104 175 232)' }}>
                    {room.price ? room.price.toLocaleString('vi-VN') : <></>}₫
                  </div>
                </div>
                <div className="col-12 mt-4">
                  <div className="form-floating">
                    <textarea
                      type="text"
                      rows="10"
                      style={{ minHeight: '100px' }}
                      className="form-control"
                      name="note"
                      id="note"
                      placeholder="Nhập ghi chú"
                      value={reserveAPlace.note}
                      onChange={(e) =>
                        setReserveAPlaceData((prev) => ({
                          ...prev,
                          note: e.target.value
                        }))
                      }></textarea>
                    <label htmlFor="note">Nhập ghi chú</label>
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Đóng
            </Button>
            <Button color="primary" onClick={() => handleSubmit()}>
              <AddIcon /> Thêm cọc giữ chỗ
            </Button>
          </ModalFooter>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ReserveAPlaceModal
