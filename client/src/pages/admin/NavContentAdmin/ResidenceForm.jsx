import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { env } from '~/configs/environment'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PrintIcon from '@mui/icons-material/Print'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography
} from '@mui/material'

const ResidenceForm = ({ setIsAdmin }) => {
  const { tenantId } = useParams()
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (setIsAdmin) {
      setIsAdmin(true)
    }
  }, [setIsAdmin])

  // Các trường cho phép chỉnh sửa trực tiếp trên form trước khi in
  const [kinhGui, setKinhGui] = useState('')
  const [noiDungDeNghi, setNoiDungDeNghi] = useState('')
  const [ngayLapText, setNgayLapText] = useState('')
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: '', dob: '', gender: '', cccd: '', relationship: '' },
    { id: 2, name: '', dob: '', gender: '', cccd: '', relationship: '' },
    { id: 3, name: '', dob: '', gender: '', cccd: '', relationship: '' },
    { id: 4, name: '', dob: '', gender: '', cccd: '', relationship: '' },
    { id: 5, name: '', dob: '', gender: '', cccd: '', relationship: '' }
  ])

  useEffect(() => {
    const fetchTenantData = async () => {
      const token = sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user')).token
        : null

      if (!token) {
        setError('Không tìm thấy mã đăng nhập. Vui lòng đăng nhập lại.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${env.API_URL}/tenant/tenant-id?id=${tenantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setTenant(data.result)
        } else if (response.status === 404) {
          setError('Không tìm thấy thông tin khách thuê này.')
        } else {
          setError('Không thể tải dữ liệu khách thuê. Vui lòng thử lại sau.')
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      fetchTenantData()
    } else {
      setError('Không có ID khách thuê.')
      setLoading(false)
    }
  }, [tenantId])

  // Tự động thiết lập các giá trị mặc định sau khi load xong tenant
  useEffect(() => {
    if (tenant) {
      // 1. Tự động gợi ý Công an Phường/Xã từ địa chỉ nhà trọ
      let suggestedKinhGui = ''
      if (tenant.motelAddress) {
        const addressParts = tenant.motelAddress.split(',')
        let ward = ''
        let district = ''
        let province = ''

        for (const part of addressParts) {
          const p = part.trim()
          const pl = p.toLowerCase()
          if (pl.includes('phường') || pl.includes('xã') || pl.includes('thị trấn')) {
            ward = p
          }
          if (pl.includes('quận') || pl.includes('huyện') || pl.includes('thị xã') || pl.includes('thành phố')) {
            if (!province && pl.includes('thành phố') && addressParts.indexOf(part) === addressParts.length - 1) {
              province = p
            } else {
              district = p
            }
          }
        }
        if (!province && addressParts.length > 0) {
          province = addressParts[addressParts.length - 1].trim()
        }

        if (ward) {
          suggestedKinhGui = `Công an ${ward}`
          if (district) suggestedKinhGui += `, ${district}`
          if (province) suggestedKinhGui += `, ${province}`
        } else {
          suggestedKinhGui = `Công an phường/xã nơi có nhà trọ: ${tenant.motelAddress}`
        }
      }
      setKinhGui(suggestedKinhGui || '......................................................................................................................')

      // 2. Nội dung đề nghị mặc định
      const defaultProposal = tenant.roomName && tenant.motelAddress
        ? `Đăng ký tạm trú tại Phòng ${tenant.roomName}, địa chỉ: ${tenant.motelAddress}`
        : 'Đăng ký tạm trú'
      setNoiDungDeNghi(defaultProposal)

      // 3. Địa danh và ngày tháng năm lập
      const today = new Date()
      const day = String(today.getDate()).padStart(2, '0')
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const year = today.getFullYear()
      let provinceName = '......'

      if (tenant.motelAddress) {
        const addressParts = tenant.motelAddress.split(',')
        provinceName = addressParts[addressParts.length - 1].trim()
        // Xóa chữ "Thành phố" hay "Tỉnh" nếu có để ghi theo kiểu "Hồ Chí Minh, ngày..." hoặc "Hà Nội, ngày..."
        provinceName = provinceName.replace(/^(Thành phố|Tỉnh)\s+/i, '')
      }
      setNgayLapText(`${provinceName}, ngày ${day} tháng ${month} năm ${year}`)
    }
  }, [tenant])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const getGenderLabel = (gender) => {
    if (gender === 'MALE') return 'Nam'
    if (gender === 'FEMALE') return 'Nữ'
    if (gender === 'OTHER') return 'Khác'
    return gender || ''
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const d = String(date.getDate()).padStart(2, '0')
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const y = date.getFullYear()
    return `${d}/${m}/${y}`
  }

  const handleFamilyMemberChange = (index, field, value) => {
    const updated = [...familyMembers]
    updated[index][field] = value
    setFamilyMembers(updated)
  }

  return (
    <Box sx={{ bgcolor: '#eaeaea', minHeight: '100vh', pb: 4 }}>
      {/* CSS Nhúng cho In Ấn */}
      <style>{`
        .form-input {
          border: none;
          border-bottom: 1px dotted #666;
          outline: none;
          font-family: "Times New Roman", Times, serif;
          font-size: 12pt;
          background: transparent;
          width: 100%;
          padding: 2px 4px;
        }
        .form-input:focus {
          border-bottom: 1px double #000;
          background-color: #fcfcfc;
        }
        .table-input {
          border: none;
          outline: none;
          font-family: "Times New Roman", Times, serif;
          font-size: 11pt;
          background: transparent;
          width: 100%;
          text-align: center;
          padding: 4px;
        }
        .table-input:focus {
          background-color: #f0f4f9;
        }
        .residence-form-container {
          font-family: "Times New Roman", Times, serif;
          color: #000;
          line-height: 1.45;
        }
        @media print {
          body, .residence-form-bg {
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-paper {
            box-shadow: none !important;
            margin: 0 auto !important;
            padding: 1.5cm 1.5cm 1.5cm 2cm !important; /* Lề chuẩn in */
            width: 21cm !important;
            min-height: 29.7cm !important;
          }
          .form-input {
            border-bottom: none !important;
          }
          input::placeholder {
            color: transparent;
          }
        }
      `}</style>

      {/* Thanh công cụ ở trên (ẩn khi in) */}
      <Box
        className="no-print"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#fff',
          px: 3,
          py: 1.5,
          borderBottom: '1px solid #dcdcdc',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.close()}
          sx={{ color: '#475569', fontWeight: 600 }}
        >
          Đóng tab
        </Button>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Xem và In Mẫu Văn Bản Tạm Trú (CT01)
        </Typography>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            bgcolor: '#1f9cf0',
            fontWeight: 700,
            '&:hover': { bgcolor: '#0f87d8' }
          }}
        >
          In tờ khai
        </Button>
      </Box>

      {/* Nội dung tờ khai */}
      <Container className="residence-form-bg" sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
        <Paper
          className="print-paper"
          elevation={4}
          sx={{
            width: '21cm',
            minHeight: '29.7cm',
            bgcolor: '#fff',
            p: '2cm 2cm 2cm 2.5cm', // Căn lề chuẩn văn bản hành chính A4
            boxSizing: 'border-box'
          }}
        >
          <Box className="residence-form-container" sx={{ fontSize: '12pt' }}>
            
            {/* Header: Số hiệu mẫu */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '11pt', fontFamily: 'inherit' }}>
                Mẫu CT01
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '9.5pt', fontStyle: 'italic', fontFamily: 'inherit', textAlign: 'right', maxWidth: '300px' }}>
                Ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an
              </Typography>
            </Box>

            {/* Quốc hiệu - Tiêu ngữ */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '12pt', fontFamily: 'inherit', letterSpacing: '0.5px' }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '12.5pt', fontFamily: 'inherit', textDecoration: 'underline', mt: 0.2 }}>
                Độc lập – Tự do – Hạnh phúc
              </Typography>
            </Box>

            {/* Tên tờ khai */}
            <Box sx={{ textAlign: 'center', mb: 3, mt: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '15pt', fontFamily: 'inherit' }}>
                TỜ KHAI THAY ĐỔI THÔNG TIN CƯ TRÚ
              </Typography>
            </Box>

            {/* Kính gửi */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                Kính gửi(1):
              </Typography>
              <input
                type="text"
                className="form-input"
                value={kinhGui}
                onChange={(e) => setKinhGui(e.target.value)}
                style={{ fontWeight: 'bold' }}
              />
            </Box>

            {/* Các trường thông tin */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              
              {/* 1. Họ và tên */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                  1. Họ, chữ đệm và tên:
                </Typography>
                <input
                  type="text"
                  className="form-input"
                  value={tenant?.fullName || ''}
                  readOnly
                  style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                />
              </Box>

              {/* 2 & 3. Ngày sinh & Giới tính */}
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'flex-end' }}>
                  <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                    2. Ngày, tháng, năm sinh:
                  </Typography>
                  <input
                    type="text"
                    className="form-input"
                    value={formatDate(tenant?.birthday)}
                    readOnly
                    style={{ textAlign: 'center' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', width: '220px', alignItems: 'flex-end' }}>
                  <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                    3. Giới tính:
                  </Typography>
                  <input
                    type="text"
                    className="form-input"
                    value={getGenderLabel(tenant?.gender)}
                    readOnly
                    style={{ textAlign: 'center' }}
                  />
                </Box>
              </Box>

              {/* 4. Số định danh cá nhân */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                  4. Số định danh cá nhân:
                </Typography>
                <input
                  type="text"
                  className="form-input"
                  value={tenant?.cccd || ''}
                  readOnly
                  style={{ letterSpacing: '1px' }}
                />
              </Box>

              {/* 5 & 6. Số điện thoại & Email */}
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'flex-end' }}>
                  <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                    5. Số điện thoại liên hệ:
                  </Typography>
                  <input
                    type="text"
                    className="form-input"
                    value={tenant?.phone || ''}
                    readOnly
                  />
                </Box>
                <Box sx={{ display: 'flex', flexGrow: 1.2, alignItems: 'flex-end' }}>
                  <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                    6. Email:
                  </Typography>
                  <input
                    type="text"
                    className="form-input"
                    value={tenant?.email || ''}
                    readOnly
                  />
                </Box>
              </Box>

              {/* 7 & 8. Họ tên chủ hộ & Mối quan hệ */}
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ display: 'flex', flexGrow: 1.5, alignItems: 'flex-end' }}>
                  <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                    7. Họ, chữ đệm và tên chủ hộ:
                  </Typography>
                  <input
                    type="text"
                    className="form-input"
                    value={tenant?.hostName || ''}
                    readOnly
                    style={{ fontWeight: 'bold' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'flex-end' }}>
                  <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                    8. Mối quan hệ với chủ hộ:
                  </Typography>
                  <input
                    type="text"
                    className="form-input"
                    value={tenant?.relationship || 'Khách thuê'}
                    readOnly
                  />
                </Box>
              </Box>

              {/* 9. Số định danh cá nhân của chủ hộ */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit' }}>
                  9. Số định danh cá nhân của chủ hộ:
                </Typography>
                <input
                  type="text"
                  className="form-input"
                  value={tenant?.hostCccd || ''}
                  readOnly
                  style={{ letterSpacing: '1px' }}
                />
              </Box>

              {/* 10. Nội dung đề nghị */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 0.5 }}>
                <Typography sx={{ whiteSpace: 'nowrap', mr: 1, fontFamily: 'inherit', mt: 0.2 }}>
                  10. Nội dung đề nghị(2):
                </Typography>
                <textarea
                  className="form-input"
                  rows={2}
                  value={noiDungDeNghi}
                  onChange={(e) => setNoiDungDeNghi(e.target.value)}
                  style={{
                    resize: 'none',
                    lineHeight: '1.5',
                    borderBottom: '1px dotted #666',
                    height: 'auto',
                    fontFamily: 'inherit'
                  }}
                />
              </Box>

              {/* 11. Những thành viên trong hộ gia đình cùng thay đổi */}
              <Box sx={{ mt: 1.5 }}>
                <Typography sx={{ mb: 1, fontFamily: 'inherit' }}>
                  11. Những thành viên trong hộ gia đình cùng thay đổi:
                </Typography>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #000', padding: '6px', fontSize: '10.5pt', width: '5%' }}>TT</th>
                      <th style={{ border: '1px solid #000', padding: '6px', fontSize: '10.5pt', width: '30%' }}>Họ, chữ đệm và tên</th>
                      <th style={{ border: '1px solid #000', padding: '6px', fontSize: '10.5pt', width: '18%' }}>Ngày, tháng, năm sinh</th>
                      <th style={{ border: '1px solid #000', padding: '6px', fontSize: '10.5pt', width: '10%' }}>Giới tính</th>
                      <th style={{ border: '1px solid #000', padding: '6px', fontSize: '10.5pt', width: '22%' }}>Số định danh cá nhân</th>
                      <th style={{ border: '1px solid #000', padding: '6px', fontSize: '10.5pt', width: '15%' }}>Quan hệ với chủ hộ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyMembers.map((row, idx) => (
                      <tr key={row.id}>
                        <td style={{ border: '1px solid #000', textAlign: 'center', fontSize: '11pt', padding: 0 }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #000', padding: 0 }}>
                          <input
                            type="text"
                            className="table-input"
                            value={row.name}
                            onChange={(e) => handleFamilyMemberChange(idx, 'name', e.target.value)}
                            placeholder="..."
                          />
                        </td>
                        <td style={{ border: '1px solid #000', padding: 0 }}>
                          <input
                            type="text"
                            className="table-input"
                            value={row.dob}
                            onChange={(e) => handleFamilyMemberChange(idx, 'dob', e.target.value)}
                            placeholder="..."
                          />
                        </td>
                        <td style={{ border: '1px solid #000', padding: 0 }}>
                          <input
                            type="text"
                            className="table-input"
                            value={row.gender}
                            onChange={(e) => handleFamilyMemberChange(idx, 'gender', e.target.value)}
                            placeholder="..."
                          />
                        </td>
                        <td style={{ border: '1px solid #000', padding: 0 }}>
                          <input
                            type="text"
                            className="table-input"
                            value={row.cccd}
                            onChange={(e) => handleFamilyMemberChange(idx, 'cccd', e.target.value)}
                            placeholder="..."
                          />
                        </td>
                        <td style={{ border: '1px solid #000', padding: 0 }}>
                          <input
                            type="text"
                            className="table-input"
                            value={row.relationship}
                            onChange={(e) => handleFamilyMemberChange(idx, 'relationship', e.target.value)}
                            placeholder="..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

            </Box>

            {/* Ý kiến các bên liên quan */}
            <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, textAlign: 'center', fontSize: '10.5pt' }}>
              
              {/* Ý kiến chủ hộ */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                <Box>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '11pt', fontFamily: 'inherit' }}>
                    Ý KIẾN CỦA CHỦ HỘ(3)
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic', fontSize: '9.5pt', fontFamily: 'inherit' }}>
                    (Ngày.....tháng....năm...)
                  </Typography>
                </Box>
              </Box>

              {/* Ý kiến chủ sở hữu */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                <Box>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '11pt', fontFamily: 'inherit' }}>
                    Ý KIẾN CỦA CHỦ SỞ HỮU<br />CHỖ Ở HỢP PHÁP(4)
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic', fontSize: '9.5pt', fontFamily: 'inherit' }}>
                    (Ngày.....tháng....năm...)
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'left', pl: 1, fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontFamily: 'inherit' }}>(7) Họ và tên: .........................</Typography>
                  <Typography sx={{ fontFamily: 'inherit' }}>(7) Số định danh: .....................</Typography>
                </Box>
              </Box>

              {/* Ý kiến cha mẹ / giám hộ */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
                <Box>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '11pt', fontFamily: 'inherit' }}>
                    Ý KIẾN CỦA CHA, MẸ<br />HOẶC NGƯỜI GIÁM HỘ(5)
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic', fontSize: '9.5pt', fontFamily: 'inherit' }}>
                    (Ngày.....tháng....năm...)
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'left', pl: 1, fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontFamily: 'inherit' }}>(7) Họ và tên: .........................</Typography>
                  <Typography sx={{ fontFamily: 'inherit' }}>(7) Số định danh: .....................</Typography>
                </Box>
              </Box>

            </Box>

            {/* Ngày ký & Chữ ký người kê khai */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'center', width: '320px', pr: 2 }}>
                
                {/* Dòng ngày tháng năm lập có thể sửa được */}
                <input
                  type="text"
                  className="form-input"
                  value={ngayLapText}
                  onChange={(e) => setNgayLapText(e.target.value)}
                  style={{ textAlign: 'center', fontStyle: 'italic', borderBottom: '1px dotted #666', marginBottom: '4px' }}
                />
                
                <Typography sx={{ fontWeight: 'bold', fontSize: '11pt', fontFamily: 'inherit', mt: 1 }}>
                  NGƯỜI KÊ KHAI(6)
                </Typography>
                <Typography sx={{ fontStyle: 'italic', fontSize: '9.5pt', fontFamily: 'inherit' }}>
                  (Ký, ghi rõ họ tên)
                </Typography>
                
                {/* Khoảng trống để ký */}
                <Box sx={{ height: '70px' }} />
                
                {/* Họ tên người kê khai */}
                <Typography sx={{ fontWeight: 'bold', fontSize: '12.5pt', fontFamily: 'inherit' }}>
                  {tenant?.fullName || ''}
                </Typography>
              </Box>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ResidenceForm

