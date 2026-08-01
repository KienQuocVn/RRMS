/**
 * SoftwareContractPreview - Trang xem mẫu hợp đồng phần mềm
 * Hiển thị mẫu hợp đồng cho thuê phòng trọ với thông tin Bên A (chủ trọ)
 * được điền sẵn từ TRC hoặc profile tài khoản đang đăng nhập.
 * KHÔNG load thông tin phòng, khách thuê, dịch vụ cụ thể.
 */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Container,
  Link,
  CircularProgress
} from '@mui/material'
import { getTRCByMotelId } from '~/apis/TRCAPI'
import { getProfileByUsername } from '~/apis/accountAPI'
import { getMotelById } from '~/apis/motelAPI'

const SoftwareContractPreview = ({ setIsAdmin }) => {
  const { motelId } = useParams()
  const username = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).username
    : null

  const [trc, setTrc] = useState(null)
  const [profile, setProfile] = useState(null)
  const [motel, setMotel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsAdmin(true)
    const fetchData = async () => {
      try {
        const [trcRes, profileRes, motelRes] = await Promise.all([
          motelId ? getTRCByMotelId(motelId).catch(() => null) : Promise.resolve(null),
          username ? getProfileByUsername(username).catch(() => null) : Promise.resolve(null),
          motelId ? getMotelById(motelId).catch(() => null) : Promise.resolve(null)
        ])
        setTrc(trcRes?.data?.result || null)
        setProfile(profileRes || null)
        setMotel(motelRes?.data?.result || null)
      } catch (err) {
        console.error('Error fetching data for contract preview:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motelId])

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const formatDate = (dateString) => {
    if (!dateString) return '...............................'
    const date = new Date(dateString)
    if (isNaN(date)) return '...............................'
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Lấy thành phố từ cuối chuỗi địa chỉ (vd: "123 Đường ABC, Quận 1, TP. HCM" → "TP. HCM")
  const getCityFromAddress = (address) => {
    if (!address) return 'TP. Hồ Chí Minh'
    const parts = address.split(',')
    return parts[parts.length - 1]?.trim() || 'TP. Hồ Chí Minh'
  }

  const today = new Date()
  const todayStr = `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`

  // ── Resolved values: ưu tiên TRC, fallback sang Profile ──────────────────────

  const landlordName = trc?.representativename || profile?.fullName || '...............................'
  const landlordBirth = formatDate(trc?.birth || profile?.birthday)
  const landlordCCCD = trc?.identifier || profile?.cccd || '...............................'
  const landlordDateOfIssue = formatDate(trc?.dateofissue || profile?.dateOfIssue)
  const landlordPlaceOfIssue = trc?.placeofissue || profile?.placeOfIssue || '...............................'
  const landlordPhone = trc?.phone || profile?.phone || '...............................'
  const landlordAddress = trc?.permanentaddress || profile?.address || '...................................................'
  const motelAddress = motel?.address || '...................................................'
  const city = getCityFromAddress(motelAddress)

  // ── HTML content của mẫu hợp đồng thuê phòng trọ mới ───────────────────────
  const getContractHtml = () => {
    return `
      <div style="font-family:'Times New Roman',serif;font-size:14px;line-height:1.75;color:#111827;">
        <h3 style="text-align:center;margin:0;font-weight:700;font-size:16px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
        <p style="text-align:center;margin:4px 0 20px;font-weight:bold;">Độc lập – Tự do – Hạnh phúc</p>
        <h2 style="text-align:center;text-transform:uppercase;margin-bottom:24px;font-weight:bold;font-size:20px;">HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ</h2>
        
        <p>Hôm nay, ngày.........tháng …..năm 20…., tại căn nhà số..................Chúng tôi ký tên dưới đây gồm có:</p>
        
        <p><strong>BÊN CHO THUÊ PHÒNG TRỌ (gọi tắt là Bên A):</strong></p>
        <p>Ông/bà (tên chủ hợp đồng): <b>${landlordName}</b></p>
        <p>CMND/CCCD số: <b>${landlordCCCD}</b> &nbsp;&nbsp;&nbsp;&nbsp; cấp ngày: <b>${landlordDateOfIssue}</b> &nbsp;&nbsp;&nbsp;&nbsp; nơi cấp: <b>${landlordPlaceOfIssue}</b></p>
        <p>Thường trú tại: <b>${landlordAddress}</b></p>
        
        <p><strong>BÊN THUÊ PHÒNG TRỌ (gọi tắt là Bên B):</strong></p>
        <p>Ông/bà: <i>(Điền khi ký hợp đồng)</i></p>
        <p>CMND/CCCD số: ................................ cấp ngày: .......................... nơi cấp: ................................</p>
        <p>Thường trú tại: .................................................................................................</p>
        
        <p>Sau khi thỏa thuận, hai bên thống nhất như sau:</p>
        
        <p><strong>1. Nội dung thuê phòng trọ</strong></p>
        <p>Bên A cho Bên B thuê 01 phòng trọ số: ................ tại <b>${motel?.motelName || 'Nhà trọ'}</b>. Với thời hạn là:................ tháng, giá thuê: ................ đồng (Bằng chữ: ......................................). Chưa bao gồm chi phí: điện sinh hoạt, nước.</p>
        
        <p><strong>2. Trách nhiệm Bên A</strong></p>
        <ul>
          <li style="margin-bottom:4px;">Đảm bảo căn nhà cho thuê không có tranh chấp, khiếu kiện.</li>
          <li style="margin-bottom:4px;">Đăng ký với chính quyền địa phương về thủ tục cho thuê phòng trọ.</li>
        </ul>
        
        <p><strong>3. Trách nhiệm Bên B</strong></p>
        <ul>
          <li style="margin-bottom:4px;">Đặt cọc với số tiền là: ................ đồng (Bằng chữ: ......................................), thanh toán tiền thuê phòng hàng tháng vào ngày ……. + tiền điện + nước.</li>
          <li style="margin-bottom:4px;">Đảm bảo các thiết bị và sửa chữa các hư hỏng trong phòng trong khi sử dụng. Nếu không sửa chữa thì khi trả phòng, bên A sẽ trừ vào tiền đặt cọc, giá trị cụ thể được tính theo giá thị trường.</li>
          <li style="margin-bottom:4px;">Chỉ sử dụng phòng trọ vào mục đích ở, với số lượng tối đa không quá 04 người (kể cả trẻ em); không chứa các thiết bị gây cháy nổ, hàng cấm... cung cấp giấy tờ tùy thân để đăng ký tạm trú theo quy định, giữ gìn an ninh trật tự, nếp sống văn hóa đô thị; không tụ tập nhậu nhẹt, cờ bạc và các hành vi vi phạm pháp luật khác.</li>
          <li style="margin-bottom:4px;">Không được tự ý cải tạo kiến trúc phòng hoặc trang trí ảnh hưởng tới tường, cột, nền... Nếu có nhu cầu trên phải trao đổi với bên A để được thống nhất.</li>
        </ul>
        
        <p><strong>4. Điều khoản thực hiện</strong></p>
        <ul>
          <li style="margin-bottom:4px;">Hai bên nghiêm túc thực hiện những quy định trên trong thời hạn cho thuê, nếu bên A lấy phòng phải báo cho bên B ít nhất 01 tháng, hoặc ngược lại.</li>
          <li style="margin-bottom:4px;">Sau thời hạn cho thuê ….. tháng nếu bên B có nhu cầu hai bên tiếp tục thương lượng giá thuê để gia hạn hợp đồng bằng miệng hoặc thực hiện như sau.</li>
        </ul>
        
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background-color:#f2f2f2;">
              <th style="border:1px solid #111;padding:8px;text-align:center;font-weight:bold;">Số lần gia hạn</th>
              <th style="border:1px solid #111;padding:8px;text-align:center;font-weight:bold;">Thời gian gia hạn (tháng)</th>
              <th style="border:1px solid #111;padding:8px;text-align:center;font-weight:bold;">Từ ngày</th>
              <th style="border:1px solid #111;padding:8px;text-align:center;font-weight:bold;">Đến ngày</th>
              <th style="border:1px solid #111;padding:8px;text-align:center;font-weight:bold;">Giá thuê/ tháng (triệu đồng)</th>
              <th style="border:1px solid #111;padding:8px;text-align:center;font-weight:bold;">Ký tên</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #111;padding:8px;text-align:center;">1</td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
            </tr>
            <tr>
              <td style="border:1px solid #111;padding:8px;text-align:center;">2</td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
              <td style="border:1px solid #111;padding:8px;"></td>
            </tr>
          </tbody>
        </table>
        
        <p style="text-align:right;margin-top:20px;font-style:italic;">${city}, ${todayStr}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:24px;">
          <tbody>
            <tr>
              <td style="width:50%;text-align:center;border:none;vertical-align:top;">
                <strong>Bên B</strong><br/>
                <span style="font-style:italic;font-size:13px;color:#555;">(Ký, ghi rõ họ tên)</span><br/><br/><br/><br/>
                <span style="color:#888;font-style:italic;">(Ký khi có khách thuê)</span>
              </td>
              <td style="width:50%;text-align:center;border:none;vertical-align:top;">
                <strong>Bên A</strong><br/>
                <span style="font-style:italic;font-size:13px;color:#555;">(Ký, ghi rõ họ tên)</span><br/><br/><br/><br/>
                <strong>${landlordName}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p style="text-align:center;margin-top:30px;font-style:italic;color:#666;">(Hợp đồng này chỉ mang tính chất tham khảo)</p>
      </div>
    `
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#eee' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#eee', minHeight: '100vh', py: 5 }}>
      {/* Sticky Notice */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        bgcolor: '#feede8',
        color: '#FF5722',
        py: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        zIndex: 1100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Đây là bản xem thử mẫu hợp đồng. Vui lòng liên hệ{' '}
        <Link href="https://zalo.me/0919925302" sx={{ color: '#20a9e7', textDecoration: 'underline' }}>
          chuyên viên hỗ trợ
        </Link>{' '}
        nếu mẫu không phù hợp.
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{
          p: '2cm 1.5cm',
          mx: 'auto',
          width: '21cm',
          minHeight: '29.7cm',
          boxSizing: 'border-box',
          fontFamily: 'Times New Roman, serif',
          fontSize: '14px',
          lineHeight: 1.8
        }}>
          <div dangerouslySetInnerHTML={{ __html: getContractHtml() }} />
        </Paper>
      </Container>
    </Box>
  )
}

export default SoftwareContractPreview
