import { useEffect, useState } from 'react'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import 'flatpickr/dist/themes/material_blue.css'
import AddIcon from '@mui/icons-material/Add'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'
const initialItems = [
  { id: '1', name: 'Tầng trệt 1' },
  { id: '2', name: 'Tầng trệt 2' },
  { id: '3', name: 'Tầng trệt 3' },
  { id: '4  ', name: 'Tầng trệt 4' }
]
const MotelSetting = ({ setIsAdmin, motels, setmotels }) => {
  useEffect(() => {
    setIsAdmin(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [items, setItems] = useState(initialItems)

  const handleDragEnd = (result) => {
    const { source, destination } = result

    // If the item was dropped outside the list
    if (!destination) {
      return
    }

    // If the item was dropped in the same position
    if (source.index === destination.index) {
      return
    }

    // Reorder the items
    const reorderedItems = Array.from(items)
    const [movedItem] = reorderedItems.splice(source.index, 1)
    reorderedItems.splice(destination.index, 0, movedItem)

    setItems(reorderedItems)
  }

  const addItem = () => {
    const newItem = {
      id: (items.length + 1).toString(),
      name: `Nhóm mới ${items.length + 1}`
    }
    setItems([...items, newItem])
  }
  return (
    <div>
      <NavAdmin setIsAdmin={setIsAdmin} setmotels={setmotels} motels={motels} />
      <div className="page-setting mb-4">
        <div className="container">
          <div className="header-item">
            <h4 className="title-item">
              Cài đặt nhà trọ
              <i style={{ fontSize: '14px', fontWeight: 'normal' }}>Các thiết lập cho nhà trọ</i>
            </h4>
            <div>
              <button type="button" className="btn btn-light border me-2">
                <i className="bi bi-arrow-left"></i>
                <b> Về trang quản lý</b>
              </button>
              <button type="button" className="btn btn-light border text-light" style={{ background: '#20a9e7' }}>
                <i className="bi bi-floppy"></i> <b> Lưu cài đặt</b>
              </button>
            </div>
          </div>
          <div className="card-feature2 overflow-hidden">
            <div className="d-flex">
              <div className="col-md-3" style={{ borderRight: '1px solid #eee', padding: '0' }}>
                {/* Nav tabs  */}
                <ul className="nav setting-tabs" role="tablist" style={{ display: 'unset' }}>
                  <li className="nav-item">
                    <Link className="nav-link active" data-bs-toggle="tab" to="#info">
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
                        className="feather feather-box">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      Nhóm phòng
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" data-bs-toggle="tab" to="#contract_template">
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
                        className="feather feather-clipboard">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      Tăng giá thuê
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" data-bs-toggle="tab" to="#on_off">
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
                        className="feather feather-settings">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      Bật tắt tính năng
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" data-bs-toggle="tab" to="#invoice_setting">
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
                        className="feather feather-bookmark">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      Cài đặt hóa đơn
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" data-bs-toggle="tab" to="#account_bank_setting">
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
                        className="feather feather-dollar-sign">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      Cài đặt tài khoản ngân hàng
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" data-bs-toggle="tab" to="#app_book">
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
                        className="feather feather-smartphone">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                      Thiết lập cho app khách thuê
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" data-bs-toggle="tab" to="#extension_setting">
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
                        className="feather feather-file-text">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      Nội quy, giờ giấc, tiện ích cho thuê
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-md-9">
                <div style={{ padding: '15px' }}>
                  {/* tab panes */}
                  <div className="tab-content">
                    <div className="container tab-pane fade show active" id="info">
                      <br />
                      <div className="header-item">
                        <div className="header-item">
                          <h4 className="title-item">
                            Gom nhóm phòng để dễ quản lý
                            <i style={{ fontSize: '14px', fontWeight: 'normal' }}>
                              Bạn có thể nhóm danh sách phòng theo nhóm để phân biệt Khu/Tầng/Dãy
                              <br />
                              <i className="text-danger">* Nhấp và kéo để xếp vị trí của nhóm</i>
                            </i>
                          </h4>
                        </div>
                        <div>
                          <AddIcon onClick={() => addItem()} className="iconadd" />
                        </div>
                      </div>
                      <div>
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="droppable">
                            {(provided) => (
                              <table
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead className="text-center">
                                  <tr>
                                    <th style={{ width: '50px' }}></th>
                                    <th>Tên nhóm</th>
                                    <th style={{ width: '50px' }}></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                      {(provided) => (
                                        <tr
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            ...provided.draggableProps.style,
                                            borderBottom: '1px solid #ddd'
                                          }}>
                                          <td style={{ textAlign: 'center' }}>☰</td>
                                          <td>{item.name}</td>
                                          <td style={{ textAlign: 'center' }}>
                                            <button
                                              style={{
                                                backgroundColor: 'red',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                padding: '5px'
                                              }}
                                              onClick={() => setItems(items.filter((i) => i.id !== item.id))}>
                                              🗑️
                                            </button>
                                          </td>
                                        </tr>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </tbody>
                              </table>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </div>
                    <div id="contract_template" className="container tab-pane fade show">
                      <div className="header-item">
                        <div className="container tab-pane">
                          <div className="header-item">
                            <h4 className="title-item">
                              Tăng giá thuê
                              <i style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                Tăng giá thuê cho tất cả các phòng hoặc chỉ 1 số phòng
                                <br />
                              </i>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div id="contract-template" className="row" style={{ padding: '10PX' }}>
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              data-format="string"
                              type="text"
                              className="form-control"
                              name="job"
                              value="2.222.222"
                              id="setting_info_job"
                              placeholder="Giá thuê mới"
                              required=""
                            />
                            <label htmlFor="setting_info_job">
                              Giá thuê mới <span className="text-danger">*</span>
                            </label>
                            <div className="invalid-feedback">Vui lòng nhập công việc của bạn</div>
                          </div>
                        </div>
                        <hr className="my-2" />
                        <div className="col-12">
                          <div className="header-item">
                            <div className="header-item">
                              <p className="title-item fw-bold">
                                Chọn phòng muốn áp dụng
                                <i style={{ fontSize: '14px', fontWeight: 'normal' }}>Danh sách phòng chọn áp dụng</i>
                              </p>
                            </div>
                            <div>
                              Chọn tất cả
                              <input className="form-check-input ms-2" type="checkbox" value="" />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-3 col-xs-12">
                            <div className="row border pt-2 pb-3 m-1">
                              <div className="col-md-3 col-sm-3 col-xs-12">
                                <input className="form-check-input" type="checkbox" />
                              </div>
                              <div className="col-md-9 col-sm-9 col-xs-12">
                                Phòng 1
                                <br />
                                <span className="fw-bold">2.222.222đ</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="on_off" className="container tab-pane fade show">
                      <br />
                      <div className="header-item">
                        <div className="container tab-pane">
                          <div className="header-item">
                            <h4 className="title-item">
                              Cài đặt tính năng
                              <i style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                Bật/Tắt các tính năng có thể áp dụng trong Nhà trọ của bạn
                                <br />
                              </i>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Quản lý tài sản</b>
                              <p>Quản lý tài sản khách thuê sử dụng</p>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Quản lý xe</b>
                              <p>Các thông tin xe của khách thuê</p>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Quản lý mô giới</b>
                              <p>Các thông tin về mô giới</p>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Quản lý tin đăng</b>
                              <p>Các thông tin về tin đăng</p>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Quản lý công việc cần làm</b>
                              <p>Các thông tin về việc cần làm</p>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Gửi tin nhắn tự động cho khách thuê</b>
                              <p>Giửi tin nhắn SMS tự động cho khách thuê sau khi lập phiếu</p>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Hình ảnh, file chứng từ hợp đồng</b>
                              <p>Bật/Tắt thêm hình ảnh, file chứng từ cho hợp đồng</p>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="invoice_setting" className="container tab-pane fade show">
                      <br />
                      <div className="header-item">
                        <div className="container tab-pane">
                          <div className="header-item">
                            <h4 className="title-item">
                              Cài đặt phiếu thu (hóa đơn)
                              <i style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                Thiết lập, tùy chỉnh cho hóa đơn của bạn
                                <br />
                              </i>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <div className="form-floating">
                            <input
                              data-format="string"
                              type="text"
                              className="form-control"
                              name="job"
                              value="12"
                              id="setting_info_job"
                              placeholder=" Ngày lập hóa đơn(trong khoảng 1 đến 31)"
                              required=""
                            />
                            <label htmlFor="setting_info_job">
                              Ngày lập hóa đơn(trong khoảng 1 đến 31) <span className="text-danger">*</span>
                            </label>
                            <div className="invalid-feedback">Vui lòng nhập công việc của bạn</div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <div className="form-floating">
                            <input
                              data-format="string"
                              type="text"
                              className="form-control"
                              name="job"
                              value="12"
                              id="setting_info_job"
                              placeholder="Hạn đóng tiền"
                              required=""
                            />
                            <label htmlFor="setting_info_job">
                              Hạn đóng tiền <span className="text-danger">*</span>
                            </label>
                            <div className="invalid-feedback">Vui lòng nhập công việc của bạn</div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <div className="alert alert-primary d-flex align-items-center mt-2" role="alert">
                            <svg
                              style={{ width: '20px' }}
                              xmlns="http://www.w3.org/2000/svg"
                              className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
                              viewBox="0 0 16 16"
                              role="img"
                              aria-label="Warning:">
                              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                            <div className="text-setting-invoice">
                              <b>Thông tin:</b> Khi đến ngày lập hóa đơn hệ thống sẽ nhắc nhở qua thông báo
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <div className="alert alert-primary d-flex align-items-center mt-2" role="alert">
                            <svg
                              style={{ width: '20px' }}
                              xmlns="http://www.w3.org/2000/svg"
                              className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
                              viewBox="0 0 16 16"
                              role="img"
                              aria-label="Warning:">
                              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                            <div className="text-setting-invoice">
                              <b>Thông tin:</b> Khi khách đóng tiền không đúng thời hạn hệ thống sẽ nhắc nhở
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <p className="text-setting-invoice">- Là ngày lập hóa đơn tiền điện, nước...</p>
                          <p className="text-setting-invoice">
                            - Nhập một ngày trong tháng. Nếu không nhập mặc định là cuối tháng.
                          </p>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <p className="text-setting-invoice">
                            <b> Ví dụ:</b> Bạn lập phiếu ngày 01 và hạn đóng tiền thuê trọ ở đây là 5 ngày thì ngày 05
                            sẽ là ngày hết hạn
                          </p>
                        </div>
                        <hr className="my-2" />
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Gửi hóa đơn tự động cho khách qua Zalo</b>
                            </label>
                            <p className="text-setting-invoice">
                              Tự động gửi hóa đơn qua zalo cho khách ngay khi tạo hóa đơn
                            </p>
                            <p className="text-setting-invoice text-danger">
                              * Tính năng chỉ hoạt động khi bạn đang sử dụng gói có phí
                            </p>
                            <p className="text-setting-invoice text-danger">
                              * Chỉ có thể gửi zalo cho khách thuê từ 6.00 đến 22.00 giờ
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-floating">
                            <select
                              id=""
                              data-format="numeric"
                              name="address_component[province_id]"
                              className="form-select form-control province"
                              value=""
                              required>
                              <option value="">Mẩu dạng bảng</option>
                            </select>
                            <label htmlFor="province">Mẩu hóa đơn gửi qua zalo</label>
                            <div className="invalid-feedback">Vui lòng chọn mẩu hóa đơn</div>
                            <b className="text-setting-invoice">* Xem hình gửi mẩu zalo</b>
                          </div>
                        </div>
                        <hr className="my-2" />
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Ẩn/Hiển mã QR trong hóa đơn</b>
                            </label>
                            <p className="text-setting-invoice">
                              Bạn muốn hiển thị thông tin tài khoản & số tiền hóa đơn bằng mã QR giúp khách hàng thanh
                              toán chuyển khoản nhanh hơn ?
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Phân loại thu/chi từ hóa đơn</b>
                            </label>
                            <p className="text-setting-invoice">
                              Khi thu tiền hóa đơn bạn muốn phân tách các phiếu thu chi rõ ràng như: Tiền phòng/phòng,
                              tiền dịch vụ, giảm trừ, cộng thêm
                            </p>
                          </div>
                        </div>
                        <hr className="my-2" />
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Làm tròn hóa đơn</b>
                            </label>
                            <p className="text-setting-invoice">
                              Làm tròn đơn vị 1.000 đ Ví dụ: 4.300 đ &rarr; 4.000đ, 4.500 đ &rarr; 4.000 đ, 4.600 đ
                              &rarr; 5.000đ, 4.800 đ &rarr; 5.000đ
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-floating">
                            <select
                              id=""
                              data-format="numeric"
                              name="address_component[province_id]"
                              className="form-select form-control province"
                              value=""
                              required>
                              <option value="">Tiền mặt</option>
                            </select>
                            <label htmlFor="province">
                              Hình thức thanh toán mặc định <span className="text-danger">*</span>
                            </label>
                            <div className="invalid-feedback">Vui lòng chọn hình thức thanh toán mặc định</div>
                          </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-xs-12 mt-2 hide-when-edit">
                          <label className="">
                            <b>Ghi chú thêm cho hóa đơn</b>
                          </label>
                          <div className="input-group">
                            <textarea
                              className="form-control"
                              aria-label="With textarea"
                              rows={5}
                              placeholder="Ví dụ: Các vi phạm khi đóng tiền trể hạn..."></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="account_bank_setting" className="container tab-pane fade show">
                      <br />
                      <div className="header-item">
                        <div className="container tab-pane">
                          <div className="header-item">
                            <h4 className="title-item">
                              Cài đặt ngân hàng
                              <i style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                Dùng để hiển thị trên hóa đơn, mã xóa mã QR giúp khách thuê thanh toán chuyển khoản cho
                                bạn dễ dàng hơn
                                <br />
                              </i>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12 mt-2 hide-when-edit">
                        <div className="form-floating">
                          <select
                            id=""
                            data-format="numeric"
                            name="address_component[province_id]"
                            className="form-select form-control province"
                            value=""
                            required>
                            <option value="">Ngân hàng ABC</option>
                          </select>
                          <label htmlFor="province">Tên ngân hàng</label>
                          <div className="invalid-feedback">Error</div>
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12 mt-2 hide-when-edit">
                        <div className="form-floating">
                          <input
                            data-format="string"
                            type="text"
                            className="form-control"
                            name="job"
                            id="setting_info_job"
                            placeholder="Chi nhánh ngân hàng"
                            required=""
                          />
                          <label htmlFor="setting_info_job">Chi nhánh ngân hàng</label>
                          <div className="invalid-feedback">Error</div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="header-item">
                          <div className="container tab-pane">
                            <div className="header-item">
                              <b className="title-item">Thông tin tài khoản</b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-floating">
                            <input
                              data-format="string"
                              type="text"
                              className="form-control"
                              name="job"
                              id="setting_info_job"
                              placeholder="Chi nhánh ngân hàng"
                              required=""
                            />
                            <label htmlFor="setting_info_job">
                              Tên chủ tài khoản <span className="text-danger">*</span>
                            </label>
                            <div className="invalid-feedback">Error</div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-floating">
                            <input
                              data-format="string"
                              type="text"
                              className="form-control"
                              name="job"
                              id="setting_info_job"
                              placeholder="Chi nhánh ngân hàng"
                              required=""
                            />
                            <label htmlFor="setting_info_job">
                              Số tài khoản <span className="text-danger">*</span>
                            </label>
                            <div className="invalid-feedback">Error</div>
                          </div>
                        </div>
                      </div>
                      <div className="row my-2">
                        <div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                              <b>Đồng bộ tất cả nhà trọ</b>
                            </label>
                          </div>
                        </div>
                        <div>
                          <p className="text-setting-invoice">
                            Đồng bộ thông tin ngân hàng nay cho tất cả các nhà trọ khác trong cùng hệ thống
                          </p>
                        </div>
                      </div>
                    </div>
                    <div id="app_book" className="container tab-pane fade show">
                      <br />
                      <div className="header-item">
                        <div className="container tab-pane">
                          <div className="header-item">
                            <h4 className="title-item">
                              Thiết lập cho App khách thuê/dân cư
                              <i style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                Những thiết lập cho khách thuê khi sử dụng App khách thuê kết nối với chủ nhà
                                <br />
                              </i>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Tự tạo tài khoản cho khách thuê</b>
                            </label>
                            <p className="text-setting-invoice">
                              Tự tạo tài khoản đăng nhập vào App khách thuê khi lập hợp đồng <br /> Tài khoản là số điện
                              thoại dùng cho lập hợp đồng <br /> Mật khẩu mặc định vui lòng nhập ở ô kê bên <br /> *Lưu
                              ý: Yêu cầu khách thuê cập nhật lại mật khẩu mới sau khi đăng nhập vào App
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-floating">
                            <input
                              data-format="string"
                              type="text"
                              className="form-control"
                              name="job"
                              value="123456789"
                              id="setting_info_job"
                              placeholder="Giá thuê mới"
                              required=""
                            />
                            <label htmlFor="setting_info_job">Mật khẩu cho khách thuê </label>
                            <div className="invalid-feedback">Vui lòng nhập công việc của bạn</div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Chốt đồng hồ điện nước</b>
                            </label>
                            <p className="text-setting-invoice">
                              Cho phép khách thuê gửi thông tin chốt điện nước để lập hóa đơn
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Nhập thông tin cá nhân</b>
                            </label>
                            <p className="text-setting-invoice">
                              Cho phép khách thuê cập nhật thông tin cá nhân qua App khách thuê
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Cập nhật thông tin xe</b>
                            </label>
                            <p className="text-setting-invoice">
                              Cho phép khách thuê cập nhật thông tin xe trong phòng
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value="1"
                              id="setting[asset_function]"
                              name="setting[asset_function]"
                              checked
                            />
                            <label className="form-check-label" htmlFor="setting[asset_function]">
                              <b>Báo kết thúc hợp đồng</b>
                            </label>
                            <p className="text-setting-invoice">Cho phép khách thuê báo kết thúc hợp đồng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="extension_setting" className="container tab-pane fade show">
                      <br />
                      <div className="header-item">
                        <div className="container tab-pane">
                          <div className="header-item">
                            <h4 className="title-item">
                              Nội quy, giờ giấc, tiện ích cho thuê
                              <i style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                Thiết lập thời gian, nội quy và tiện ích. Các thông tin này sẽ được sẽ dụng để đăng tin
                                trong khi tìm khách thuê.
                                <br />
                              </i>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12 my-2">
                          <div className="row">
                            <h4>Tiện ích của Nhà trọ</h4>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Có gác lửng</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Có chỗ giữ xe</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Toilet riêng</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Riêng với chủ</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Có wifi</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Có camera an ninh</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Được nuôi thú cưng</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Có ban công</b>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Có nơi sinh hoạt</b>
                              </label>
                            </div>
                          </div>
                          <div className="row my-2">
                            <h4>Nội dung giờ giấc của Nhà trọ</h4>
                            <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                              <div className="form-floating">
                                <select
                                  id=""
                                  data-format="numeric"
                                  name="address_component[province_id]"
                                  className="form-select form-control province"
                                  value=""
                                  required>
                                  <option value="">4h sáng</option>
                                </select>
                                <label htmlFor="province">Giờ mở cửa</label>
                                <div className="invalid-feedback">Error</div>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-xs-12 mt-2 hide-when-edit">
                              <div className="form-floating">
                                <select
                                  id=""
                                  data-format="numeric"
                                  name="address_component[province_id]"
                                  className="form-select form-control province"
                                  value=""
                                  required>
                                  <option value="">22h tối</option>
                                </select>
                                <label htmlFor="province">Giờ đóng cửa</label>
                                <div className="invalid-feedback">Error</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12 my-2">
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Nhà trọ có giờ giấc không về quá khuya</b>
                                <p>Không về sau 12h tối</p>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Đóng tiền trọ đúng ngày</b>
                                <p>Đóng tiền trọ đúng ngày, không thiếu thường xuyên...</p>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Không hút thuốc, say xỉn</b>
                                <p>Không tụ tập nhậu nhẹt, hát hò làm ảnh hưởng phòng xung quanh</p>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Không chứa chấp tội phạm</b>
                                <p>Không che giấu và chứa chấp tội phạm trong phòng</p>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Không hát karaoke, nhậu nhẹt ảnh hưởng tới phòng kế bên</b>
                                <p>Không gây ồn ào, mất trật tự, nhậu nhẹt, say xỉn...</p>
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" />
                              <label className="form-check-label">
                                <b>Cư xử văn hóa</b>
                                <p>
                                  Không gây gỗ chửi thề, gây hiềm khích với mọi người, tạo văn hóa phòng trọ yên bình,
                                  hòa đồng.
                                </p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MotelSetting
