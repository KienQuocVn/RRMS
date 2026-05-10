import { useEffect, useState, useRef, useMemo } from 'react'
import { Box, Paper } from '@mui/material'
import NavAdmin from '~/layouts/admin/NavbarAdmin'
import YearMonthFilter from '../YearMonthFilter'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import { Vietnamese } from 'flatpickr/dist/l10n/vn'
import AdditionItem from './AdditionItem'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { env } from '~/configs/environment'
import ModalEditInvoice from './ModalEditInvoice'
import ModalCollectMoneyInvoice from './ModalCollectMoneyInvoice'
import Swal from 'sweetalert2'
import { isValidRouteParam } from '~/utils/apiAdapters'
import InvoiceHeader from './components/InvoiceHeader'
import InvoiceFilterBar from './components/InvoiceFilterBar'
import InvoiceTable from './components/InvoiceTable'
import InvoiceActionMenu from './components/InvoiceActionMenu'

const InvoiceManager = ({ setIsAdmin, setIsNavAdmin, motels, setmotels }) => {
  const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null
  const { motelId } = useParams()
  const [invoice, setInvoice] = useState({}) // Lưu 1 hóa đơn 
  const [invoices, setInvoices] = useState([]) // Lưu danh sách hóa đơn
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [showMenu, setShowMenu] = useState(null) // Trạng thái của menu hiện tại
  const [services, setServices] = useState([]); // Lưu danh sách dịch vụ từ API
  //2 thang nay la cho chon tu ngay --> den ngay (tu tinh den 1 thang sau)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  //them cai muc cong tru vi li do
  const [items, setItems] = useState([{}]) // Khởi tạo một mục
  // chuyen doi cac buoc
  const [step, setStep] = useState(1) // Bước mặc định là bước 1
  const menuRef = useRef(null) // Tham chiếu đến menu
  const [modalOpenInvoice, setModalOpenInvoice] = useState(false)
  const [modalOpenCollectMoney, setModalOpenCollectMoney] = useState(false)
  const [filterStatus, setFilterStatus] = useState({ done: false, new: false })
  const [sortValue, setSortValue] = useState('room-asc')
  const [searchText, setSearchText] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const toggleModalInvoice = () => {
    setModalOpenInvoice(!modalOpenInvoice)
  }
  const toggleModalCollectMoney = () => {
  setModalOpenCollectMoney(!modalOpenCollectMoney)
  }

  const fetchInvoices = async (motelId) => {
    try {  
      if (!isValidRouteParam(motelId)) {
        setInvoices([]);
        return;
      }

      const response = await axios.get(`${env.API_URL}/api/v1/invoices/motel/${motelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Invoices from API:", response.data);
      setInvoices(response.data?.result?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setIsAdmin(true)
    fetchInvoices(motelId)
  }, [motelId])

  const fetchMotelServices = async (motelId) => {
    try {
        if (!isValidRouteParam(motelId)) {
            setServices([]);
            return;
        }

        const response = await axios.get(`${env.API_URL}/api/v1/motels/${motelId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const motelData = response.data?.result;

        if (motelData?.motelServices) {
            const serviceNames = motelData.motelServices.map((service) => service.nameService);
            setServices(serviceNames);
        }
    } catch (error) {
        console.error("Error fetching motel services:", error);
    }
};

  
  useEffect(() => {
    fetchMotelServices(motelId);
  }, [motelId]);

  const dynamicServiceColumns = useMemo(() => {
    const serviceColumnWidth = services.length === 2 ? 177 : services.length === 3 ? 118 : 100; // Tùy chỉnh độ rộng
    return services.map((serviceName) => ({
        title: serviceName, // Tiêu đề cột là tên dịch vụ
        field: serviceName, // Tên trường trong dữ liệu
        hozAlign: "center", // Canh phải
        width: serviceColumnWidth, // Tính toán độ rộng
        formatter: (cell) => Number(cell.getValue()).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }) // Định dạng số tiền
    }));
  }, [services]);


  const StatusFormatter = (cell) => {
    const status = cell.getValue();
    let bgColor = "#7dc242"; // Mặc định: Đã thu
    if (status === "Chưa thu") bgColor = "#ED6004";
    if (status === "Đã bị hủy") bgColor = "#B0B0B0"; // Màu xám cho trạng thái hủy
  
    return `
      <span class="badge mt-2" style="background-color: ${bgColor};">
        ${status}
      </span>`;
  };
  


  const columns = [
    { title: 'Id Hoa Don', field: 'invoiceId', hozAlign: 'center', width: 165, visible: false },
    {
      title: '',
      field: 'drag',
      hozAlign: 'center',
      width: 50,
      rowHandle: true,
      formatter: () => {
        const element = document.createElement('div')
        element.innerHTML = `
          <div class="icon-first" style="background-color: #ED6004;">
            <img width="30px" src="/room.png">
          </div>
        `
        return element
      }
    },
    { title: 'Tên phòng', field: 'roomName', hozAlign: 'center', width: 163 },
    { title: 'Tiền phòng', field: 'roomPrice', formatter: (cell) => Number(cell.getValue()).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }) , hozAlign: 'center', width: 164 },
    ...dynamicServiceColumns, 
    { title: 'Thu/Trả cọc', field: 'deposit', formatter: (cell) => Number(cell.getValue()).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }) , hozAlign: 'center', width: 164 },
    { title: 'Cộng thêm/Giảm trừ', field: 'adjustments', formatter: (cell) => Number(cell.getValue()).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }) , hozAlign: 'center', width: 164 },
    { title: 'Tổng cộng', field: 'total', formatter: (cell) => Number(cell.getValue()).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }) , hozAlign: 'center', width: 164 },
    { title: 'Cần thu', field: 'total', formatter: (cell) => Number(cell.getValue()).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }) , hozAlign: 'center', width: 164 },
    { title: 'Trạng thái', field: 'status', hozAlign: 'center', width: 164,formatter: StatusFormatter },
    {
      title: 'Action',
      field: 'Action',
      width: 92,
      formatter: (cell) => {
        const rowId = cell.getRow().getData().invoiceId
        const element = document.createElement('div')
        element.classList.add('icon-menu-action')
        element.innerHTML = `
          <svg    xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-more-vertical">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        `
        element.addEventListener('click', (e) => handleActionClick(e, rowId))
        return element
      }
    }
  ]

  const options = {
    height: "400px", 
    movableColumns: true, 
    resizableRows: true,
    movableRows: true, 
    resizableColumns: true,
    layout: "fitColumns", 
    responsiveLayout: "collapse", 
    horizontalScroll: true, 
    frozenColumns: true, 
  };

  const fetchDataInvoice = async (id) => {
    try {
      const invoiceData = invoices.find((item) => item.invoiceId === id);
      if (invoiceData) {
        const serviceDetails = invoiceData.serviceDetails.map((service) => ({
          roomServiceId: service.roomServiceId,
          serviceName: service.serviceName,
          servicePrice: service.servicePrice,
          quantity: service.quantity,
          chargetype: service.chargetype,
          totalPrice: service.totalPrice,
          isSelected: true,
        }));
  
        const status = invoiceData.paymentStatus === "CANCELED" ? "Đã bị hủy" 
             : invoiceData.paymentStatus === "PAID" ? "Đã thu xong" 
             : "Chưa thu";
        setInvoice({ ...invoiceData, serviceDetails, status });
      } else {
        console.warn(`Invoice with ID ${id} not found in invoices list.`);
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };
  
  
  
  const data = useMemo(() => {
    return invoices.map((invoice) => {
        const serviceData = {};

        (services || []).forEach((serviceName) => {
            const serviceDetail = invoice.serviceDetails?.find((s) => s.serviceName === serviceName);
            serviceData[serviceName] = serviceDetail ? serviceDetail.totalPrice : 0;
        });

        return {
            invoiceId: invoice.invoiceId,
            roomId:invoice.roomId,
            roomName: invoice.roomName,
            roomPrice: invoice.roomPrice,
            invoiceCreateMonth:invoice.invoiceCreateMonth,
            invoiceCreateDate:invoice.invoiceCreateDate,
            dueDate: invoice.dueDate,
            moveinDate:invoice.moveinDate,
            dueDateofmoveinDate:invoice.dueDateofmoveinDate,
            deposit: invoice.deposit,
            ...serviceData, 
            adjustments: invoice.additionItems?.reduce(
                (sum, item) => (item.addition ? sum + item.amount : sum - item.amount),
                0
            ),
            total: invoice.totalAmount,
            status: invoice.paymentStatus === "PAID" ? "Đã thu xong" 
            : invoice.paymentStatus === "CANCELED" ? "Đã bị hủy" 
            : "Chưa thu",
        };
    });
  }, [invoices, services]);

  
  
  //nhan vao de set lay du lieu cua 1 hoa don do 
  const handleActionClick = (e, invoiceId) => {
    e.stopPropagation() // Ngừng sự kiện click để không bị bắt bởi sự kiện ngoài
    // In ra tọa độ
    // Sử dụng getBoundingClientRect để lấy vị trí chính xác của phần tử được nhấn
    const targetElement = e.currentTarget
    const rect = targetElement.getBoundingClientRect()

    // Cập nhật vị trí của menu sao cho hiển thị gần biểu tượng Action
    setMenuPosition({
      x: rect.left + window.scrollX + rect.width / 2, // Centered horizontally
      y: rect.top + window.scrollY + rect.height // Below the icon
    })
    fetchDataInvoice(invoiceId)
    setShowMenu(invoiceId) // Hiển thị menu cho hàng với roomId tương ứng
  }

  const updateInvoiceStatus = (updatedInvoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : invoice
      )
    );
  };

  const cancelInvoice = async (invoiceId) => {
    // Hiển thị hộp thoại xác nhận hủy hóa đơn
    const result = await Swal.fire({
      title: 'Xác nhận hủy hóa đơn?',
      text: 'Bạn có chắc chắn muốn hủy hóa đơn này không? Thao tác này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      reverseButtons: true, // Nút xác nhận và hủy đảo vị trí
    });
  
    // Nếu người dùng nhấn xác nhận
    if (result.isConfirmed) {
      try {
        await axios.put(
          `${env.API_URL}/api/v1/invoices/${invoiceId}/cancel`,
          {}, // API không yêu cầu body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Cập nhật trạng thái của hóa đơn
        setInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice.invoiceId === invoiceId
              ? { ...invoice, status: "Đã bị hủy" }
              : invoice
          )
        );
  
        // Thông báo thành công
        Swal.fire('Đã hủy!', 'Hóa đơn đã được hủy thành công.', 'success');
        await fetchInvoices(motelId);
      } catch (error) {
        console.error("Error canceling invoice:", error);
  
        // Thông báo lỗi
        Swal.fire('Thất bại!', 'Hủy hóa đơn thất bại. Vui lòng thử lại!', 'error');
      }
    }
  };
  
  const deleteInvoice = async (invoiceId) => {
    try {
      // Gọi API DELETE
      await axios.delete(`${env.API_URL}/api/v1/invoices/delete/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("Thành công!", "Hóa đơn đã được xóa.", "success");
  
      // Cập nhật danh sách hóa đơn
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice.invoiceId !== invoiceId)
      );
    } catch (error) {
      console.error("Error deleting invoice:", error);
      Swal.fire("Lỗi!", "Xóa hóa đơn thất bại.", "error");
    }
  };
  
  //Menu thu tien r 
  const menuItems = [
    { id: 1, label: 'Xem chi tiết hóa đơn', icon: 'arrow-right-circle' },
    { id: 2, label: 'Gửi hóa đơn qua App', icon: 'share-2' },
    { id: 3, label: 'In hóa đơn', icon: 'printer' },
    { id: 4, label: 'Chia sẻ hóa đơn', icon: 'share' },
    { id: 5, label: 'Gửi hóa đơn qua Zalo', icon: 'share-2' },
    { id: 6, label: 'Xóa hóa đơn', icon: 'trash-2', textClass: 'text-danger' }
  ]
  //Menu chua thu tien 
  const menuItemsThu = [
    {
      id: 1,
      label: 'Xem chi tiết hóa đơn',
      icon: 'arrow-right-circle' 
    },
    {
      id: 2,
      label: 'Thu tiền',
      icon: 'dollar-sign', 
      textClass: 'text-success'
    },
    {
      id: 3,
      label: 'Chỉnh sửa',
      icon: 'edit-3' 
    },
    {
      id: 4,
      label: 'In hóa đơn',
      icon: 'printer' 
    },
    {
      id: 5,
      label: 'Chia sẻ hóa đơn',
      icon: 'share' 
    },
    {
      id: 6,
      label: 'Gửi hóa đơn qua App',
      icon: 'share-2' 
    },
    {
      id: 7,
      label: 'Gửi hóa đơn qua Zalo',
      icon: 'share-2',
      isImage: true
    },
    {
      id: 8,
      label: 'Hủy hóa đơn',
      icon: 'trash-2', 
      textClass: 'text-danger'
    }
  ]

  //khi nhan vao may cai muc tren menu 
  const handleItemClick = (label) => {
    //showMenu no la cai Id cua hoa don set tu khi nhan vao mo menu
    if (label === 'Xem chi tiết hóa đơn') {
      alert(`Xem chi tiet hoa don cua hoa don ${showMenu}`)
      //phai co ham o duoi trong moi khi nhan vao menu
      fetchDataInvoice(showMenu)
      setShowMenu(null) // Đóng menu
    } else if (label === 'Gửi hóa đơn qua App') {
      alert(`gui hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null) // Đóng menu
    } else if (label === 'In hóa đơn') {
      alert(`in hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null) // Đóng menu
    } else if (label === 'Chia sẻ hóa đơn') {
      alert(`chia se hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null) // Đóng menu
    } else if (label === 'Gửi hóa đơn qua Zalo') {
      alert(`gui hoa don cua hoa don ${showMenu}`)
      fetchDataInvoice(showMenu)
      setShowMenu(null) // Đóng menu
    } else if (label === 'Xóa hóa đơn') {
      Swal.fire({
        title: 'Xác nhận xóa hóa đơn?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteInvoice(showMenu); // Gọi hàm xóa hóa đơn
        }
      });
      setShowMenu(null); // Đóng menu
    } else if (label === 'Thu tiền') {
      toggleModalCollectMoney(!toggleModalCollectMoney)
      fetchDataInvoice(showMenu)
      setShowMenu(null) // Đóng menu
    } else if (label === 'Hủy hóa đơn') {
      cancelInvoice(showMenu);
      setShowMenu(null); // Đóng menu
    } else if (label === 'Chỉnh sửa') {
      toggleModalInvoice(!modalOpenInvoice)
      fetchDataInvoice(showMenu)
      setShowMenu(null) // Đóng menu
    } else {
      setShowMenu(null) // Đóng menu
      alert(`Action: ${label} on room ${showMenu}`)
    }
  }

  useEffect(() => {
    setIsAdmin(true)
  }, [])
  
  //xoa muc
  const handleRemove = (index) => {
    setItems(items.filter((_, i) => i !== index)) 
  }

  //them
  const handleAddItem = () => {
    setItems([...items, {}]) 
  }

  const handleFromDateChange = (selectedDates) => {
    const selectedDate = selectedDates[0]
    setFromDate(selectedDate)

    // Tính ngày "Đến ngày" là 1 tháng sau
    const nextMonthDate = new Date(selectedDate)
    nextMonthDate.setMonth(selectedDate.getMonth() + 1)

    // Chuyển thành chuỗi định dạng YYYY-MM-DD cho input
    const formattedDate = nextMonthDate.toISOString().split('T')[0]
    setToDate(formattedDate)
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    alert('Hóa đơn đã được lập thành công!')
  }
  const handleFilterChange = (e) => {
    const { id, checked } = e.target;
    setFilterStatus((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };
  
  const filteredData = useMemo(() => {
    // Lọc danh sách hóa đơn dựa trên bộ lọc trạng thái
    return invoices.filter((invoice) => {
      if (filterStatus.done && invoice.paymentStatus === "PAID") return true;
      if (filterStatus.new && invoice.paymentStatus !== "PAID") return true;
      return !filterStatus.done && !filterStatus.new; // Hiển thị tất cả nếu không có bộ lọc
    }).map((invoice) => {
      const serviceData = {};
  
      (services || []).forEach((serviceName) => {
        const serviceDetail = invoice.serviceDetails?.find((s) => s.serviceName === serviceName);
        serviceData[serviceName] = serviceDetail ? serviceDetail.totalPrice : 0;
      });
  
      return {
        invoiceId: invoice.invoiceId,
        roomId: invoice.roomId,
        roomName: invoice.roomName,
        roomPrice: invoice.roomPrice,
        invoiceCreateMonth: invoice.invoiceCreateMonth,
        invoiceCreateDate: invoice.invoiceCreateDate,
        dueDate: invoice.dueDate,
        moveinDate: invoice.moveinDate,
        dueDateofmoveinDate: invoice.dueDateofmoveinDate,
        deposit: invoice.deposit,
        ...serviceData,
        adjustments: invoice.additionItems?.reduce(
          (sum, item) => (item.addition ? sum + item.amount : sum - item.amount),
          0
        ),
        total: invoice.totalAmount,
        status: invoice.paymentStatus === "PAID" ? "Đã thu xong" : "Chưa thu",
      };
    });
  }, [invoices, services, filterStatus]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <NavAdmin
        setmotels={setmotels}
        motels={motels}
        setIsAdmin={setIsAdmin}
        setIsNavAdmin={setIsNavAdmin}
        isNavAdmin={true}
      />

      {/* Main content card */}
      <Paper
        elevation={0}
        sx={{
          mx: '10px',
          mb: '10px',
          borderRadius: '12px',
          border: '1px solid #e8f4fd',
          overflow: 'hidden',
        }}
      >
        {/* Year/Month filter bar */}
        <Box sx={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
          <YearMonthFilter
            onMonthChange={(month, year) => {
              setSelectedMonth(month)
              setSelectedYear(year)
            }}
          />
        </Box>

        {/* Header + filter section */}
        <Box sx={{ p: '14px 16px 10px' }}>
          <InvoiceHeader
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onCreateInvoice={() => {
              const el = document.getElementById('billSeries')
              if (el) {
                el.style.display = 'block'
                el.classList.add('show')
              }
            }}
          />
          <InvoiceFilterBar
            invoices={invoices}
            filterStatus={filterStatus}
            handleFilterChange={handleFilterChange}
            filteredData={filteredData}
            sortValue={sortValue}
            onSortChange={setSortValue}
            searchText={searchText}
            onSearchChange={setSearchText}
          />
        </Box>

        {/* Table */}
        <Box sx={{ px: '10px', pb: '16px', position: 'relative' }}>
          <InvoiceTable
            columns={columns}
            data={filteredData}
            options={options}
          />
          {showMenu && invoice && invoice.status && (
            <InvoiceActionMenu
              menuRef={menuRef}
              menuPosition={menuPosition}
              invoice={invoice}
              onItemClick={handleItemClick}
            />
          )}
        </Box>
      </Paper>

      {/* Modal lập hóa đơn nhanh */}
      <div
        className="modal fade"
        data-bs-backdrop="static"
        id="billSeries"
        tabIndex="-1"
        style={{ display: 'none' }}
        aria-modal="true"
        role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg ">
          <form method="POST" className="needs-validation" id="bill-series-form" noValidate>
            <div className="modal-content">
              <div className="modal-header--sticky">
                <div className="modal-header">
                  <div
                    style={{
                      marginRight: '15px',
                      outline: 0,
                      boxShadow: 'rgba(112, 175, 237, 0.16) 0px 0px 0px 0.25rem;',
                      opacity: 1,
                      borderRadius: '100%',
                      width: '36px',
                      height: '36px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      backgroundColor: 'rgb(111, 171, 232)'
                    }}>
                    <i className="bi bi-currency-dollar" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h5 className="modal-title">
                    Lập hóa đơn nhiều phòng (Lập hóa đơn nhanh)
                    <p style={{ fontSize: '14px', fontWeight: 'normal', fontStyle: 'italic', margin: '0' }}>
                      Chốt dịch vụ &amp; lập hóa đớn cho phòng
                    </p>
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="tab" id="bill-series-tab" style={{ display: 'flex', justifyContent: 'center' }}>
                  <ul className="nav nav-tabs progressbar" role="tablist">
                    <li className="nav-item">
                      <Link
                        className={`nav-link-item ${step === 1 ? 'active' : ''}`}
                        data-bs-toggle="tab"
                        to="#list-room"
                        id="tab-list-room"
                        aria-disabled>
                        Bước 1: Chốt dịch vụ
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link-item ${step === 2 ? 'active' : ''}`}
                        data-bs-toggle="tab"
                        to="#create-bill"
                        id="tab-create-bill">
                        Bước 2: Lập hóa đơn
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="modal-body">
                <div className="step-content">
                  {step === 1 && (
                    <div>
                      {' '}
                      <div id="list-room" className="">
                        <div className="row g-3">
                          <div className=" col-7">
                            <div className="room-list row g-2">Không có phòng nào để lập hóa đơn</div>
                          </div>
                          <div className="price-items-layout-container col-5">
                            <h5 className="text-center room-name-lock-price-item" style={{ display: 'none' }}></h5>
                            <div
                              className="price-item-content"
                              style={{
                                backgroundColor: '#e8f8ff',
                                border: '1px solid #e8f8ff',
                                padding: '0 10px',
                                borderradius: '10px'
                              }}>
                              <div className="text-center" style={{ margin: '20px 0' }}>
                                <i className="bi bi-inbox" style={{ fontSize: '24px' }}></i>
                                <h6>Thực hiện chốt dịch vụ</h6>
                                Vui lòng chọn một Chốt dịch vụ từ danh sách phòng để thực hiện chốt dịch vụ
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="container" id="create-bill">
                      <div className="row">
                        <div
                          className="col-5 text-center"
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f2fffe',
                            border: '1px solid #dff8e0',
                            borderRadius: '10px'
                          }}>
                          <div>
                            <div style={{ color: 'rgb(78, 188, 237)' }}>
                              <i className="bi bi-check" style={{ fontSize: '50px' }}></i>
                            </div>
                            <div style={{ color: 'rgb(78, 188, 237)', fontWeight: '700', fontSize: '18px' }}>
                              Đã chốt <span className="count-deal-price-item">0</span> phòng
                            </div>
                            <div>Nhập các thông tin bên phải để thực hiện tạo hóa đơn!</div>
                          </div>
                        </div>
                        <div className="col-7">
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="input-group">
                                <div className="form-floating">
                                  <Flatpickr
                                    className="form-control "
                                    name="date"
                                    data-format="date"
                                    id="date-add-bill"
                                    placeholder="Ngày lập hóa đơn"
                                    pattern="\d{1,2}\/\d{1,2}\/\d{4}"
                                    options={{
                                      locale: Vietnamese,
                                      plugins: [
                                        new monthSelectPlugin({
                                          shorthand: true,
                                          dateFormat: 'm.y'
                                        })
                                      ]
                                    }}
                                  />
                                  <label htmlFor="month-series">Tháng lập phiếu</label>
                                </div>
                                <label className="input-group-text" htmlFor="month">
                                  <i className="bi bi-calendar" style={{ fontSize: '24px' }}></i>
                                </label>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-floating">
                                <select
                                  id="reason_id"
                                  name="reason_id"
                                  className="form-select form-control"
                                  data-format="numeric"
                                  aria-readonly
                                  required>
                                  <option value="1">Thu tiền hàng tháng </option>
                                </select>
                                <label htmlFor="reason_id">Lý do thu tiền</label>
                              </div>
                            </div>
                          </div>
                          <div className="row g-2 mt-2">
                            <div className="col-6">
                              <div className="input-group">
                                <div className="form-floating">
                                  <Flatpickr
                                    className="form-control date-flat-picker flatpickr-input active"
                                    name="date"
                                    data-format="date"
                                    id="date-add-bill-2"
                                    placeholder="Ngày lập hóa đơn"
                                    pattern="\d{1,2}\/\d{1,2}\/\d{4}"
                                    options={{ locale: Vietnamese }}
                                  />
                                  <label htmlFor="date-add-bill-2">Ngày lập hóa đơn</label>
                                </div>
                                <label className="input-group-text" htmlFor="date-add-bill-2">
                                  <i className="bi bi-calendar" style={{ fontSize: '24px' }}></i>
                                </label>
                              </div>
                              <div className="invalid-feedback">Vui lòng nhập Ngày lập hóa đơn</div>
                            </div>
                            <div className="col-6">
                              <div className="input-group">
                                <div className="form-floating">
                                  <Flatpickr
                                    className="form-control date-flat-picker flatpickr-input"
                                    name="deadline_bill_date"
                                    id="deadline_bill_date"
                                    data-format="date"
                                    placeholder="Nhập hạn đóng tiền cho hóa đơn"
                                    pattern="\d{1,2}\/\d{1,2}\/\d{4}"
                                    options={{ locale: Vietnamese }}
                                  />
                                  <label htmlFor="deadline_bill_date">Hạn đóng tiền</label>
                                </div>
                                <label className="input-group-text" htmlFor="deadline_bill_date">
                                  <i className="bi bi-calendar" style={{ fontSize: '24px' }}></i>
                                </label>
                              </div>
                              <div className="invalid-feedback">Vui lòng nhập hạn đóng tiền hóa đơn</div>
                            </div>
                          </div>
                          <div className="col-12 calculate-spent-time-layout">
                            <div className="col-12 mb-2">
                              <div className="title-item-small">
                                <b>Thông tin ngày ở</b>
                                <i className="des">Nhập thông tin từ ngày đến ngày</i>
                              </div>
                            </div>
                            <div className="row g-2 circle-month-layout" style={{ marginTop: '5px' }}>
                              <div className="col-6 mt-2">
                                <div className="form-floating">
                                  <Flatpickr
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                    options={{ locale: Vietnamese, dateFormat: 'd/m/Y' }}
                                    className="form-control date-flat-picker flatpickr-input"
                                    name="date_from"
                                    id="date_from"
                                    data-format="date"
                                    placeholder="Từ ngày"
                                    pattern="\d{1,2}\/\d{1,2}\/\d{4}"
                                  />
                                  <label htmlFor="date_from">Từ ngày</label>
                                </div>
                              </div>
                              <div className="col-6 mt-2">
                                <div className="form-floating">
                                  <input
                                    type="date"
                                    className="form-control date-flat-picker"
                                    name="date_to"
                                    id="date_to"
                                    value={toDate}
                                    readOnly
                                  />
                                  <label htmlFor="date_to">Đến ngày</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="loz-alert info mt-2 mb-2">
                            <div className="icon flex-0">
                              <i className="bi bi-info-circle" style={{ fontSize: '24px' }}></i>
                            </div>
                            <div className="des flex-1">
                              <b>Thông tin:</b> Các phòng/giường lập hóa đơn mặc định tính <strong>tròn 1 tháng</strong>
                            </div>
                          </div>
                          <div className="addition-layount">
                            <div className="col-12 mt-2 mb-2">
                              <div className="title-item-small">
                                <b>Cộng thêm / Giảm trừ:</b>
                                <i className="des">Ví dụ cộng thêm ngày tết, giảm trừ covid...</i>
                              </div>
                            </div>
                            <div className="addition-item" id="addition-item">
                              <div className="loz-alert warning" style={{ marginBottom: '10px', marginTop: '10px' }}>
                                <div className="icon flex-0">
                                  <i className="bi bi-info-circle" style={{ fontSize: '24px' }}></i>
                                </div>
                                <div className="des flex-1">
                                  Chú ý: Cộng thêm / giảm trừ không nên là tiền cọc. Hãy chọn lý do có tiền cọc để nếu cần
                                </div>
                              </div>
                              {items.map((_, index) => (
                                <AdditionItem key={index} index={index} onRemove={handleRemove} />
                              ))}
                            </div>
                            <div className="col-12">
                              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', textAlign: 'end' }}>
                                <button
                                  type="button"
                                  id="addition-add"
                                  className="btn btn-secondary"
                                  onClick={handleAddItem}
                                  style={{ width: '100%' }}>
                                  <i className="bi bi-plus" style={{ fontSize: '24px' }}></i>
                                  Thêm mục cộng thêm / giảm trừ
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer--sticky mt-3">
                <div className="modal-footer">
                  <div className="row g-0" style={{ width: '100%' }}>
                    <div className="col-12">
                      <div className="loz-alert warning" style={{ marginBottom: '10px', marginTop: '0px' }}>
                        <div className="icon flex-0">
                          <i className="bi bi-info-circle" style={{ fontSize: '24px' }}></i>
                        </div>
                        <div className="des flex-1">
                          Để gửi hóa đơn tự đơn qua Zalo cho khách bạn phải tạo từng hóa đơn một.
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <span style={{ fontSize: '16px', color: '#4ebced' }}>
                        <b className="count-deal-price-item badge " style={{ backgroundColor: '#4ebced' }}>0</b>{' '}
                        phòng đã được chốt dịch vụ và sẵn sàng lập hóa đơn
                      </span>
                    </div>
                    <div className="col-6 text-end">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                        <i className="bi bi-x" style={{ fontSize: '17px' }}></i> Đóng
                      </button>
                      {step === 2 && (
                        <button type="button" className="btn btn-primary m-1" onClick={handlePreviousStep}>
                          <i className="bi bi-arrow-left" style={{ fontSize: '17px' }}></i> Bước 1: Chốt dịch vụ
                        </button>
                      )}
                      {step === 1 ? (
                        <button type="button" className="btn btn-primary m-1" onClick={handleNextStep}>
                          Bước 2: Lập hóa đơn <i className="bi bi-arrow-right" style={{ fontSize: '17px' }}></i>
                        </button>
                      ) : (
                        <button type="button" className="btn btn-primary m-1" onClick={handleSubmit}>
                          Lập hóa đơn <i className="bi bi-plus" style={{ fontSize: '17px' }}></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ModalEditInvoice
        modalOpen={modalOpenInvoice}
        toggleModal={toggleModalInvoice}
        invoice={invoice}
        onUpdateInvoice={(updatedInvoice) => {
          setInvoices((prevInvoices) => prevInvoices.map(inv =>
            inv.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : inv
          ))
        }}
      />
      <ModalCollectMoneyInvoice
        modalOpen={modalOpenCollectMoney}
        toggleModal={toggleModalCollectMoney}
        invoice={invoice}
        fetchInvoices={() => fetchInvoices(motelId)}
        updateInvoiceStatus={updateInvoiceStatus}
      />
    </Box>
  )
}

export default InvoiceManager
