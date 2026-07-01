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
  Typography,
  Paper,
  Divider,
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
          {/* ── Quốc hiệu ─────────────────────────────────────────────────── */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </Typography>
            <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '15px' }}>
              Độc lập - Tự do - Hạnh phúc
            </Typography>
            <Typography sx={{ mt: 1, fontStyle: 'italic', fontSize: '13px' }}>
              --------o0o--------
            </Typography>
            <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase', letterSpacing: 1 }}>
              Hợp đồng cho thuê phòng trọ
            </Typography>
            <Typography sx={{ fontStyle: 'italic', fontSize: '13px', mt: 0.5 }}>
              (Số: ............/HĐTPT)
            </Typography>
          </Box>

          {/* ── Căn cứ pháp lý ─────────────────────────────────────────────── */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontStyle: 'italic', fontSize: '13px' }}>
              Căn cứ Bộ luật Dân sự năm 2015 và các quy định pháp luật hiện hành;<br />
              Căn cứ nhu cầu của các bên;
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Hôm nay, {todayStr}, tại {motelAddress}, chúng tôi gồm:
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          {/* ── Bên A ─────────────────────────────────────────────────────── */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
              BÊN A: BÊN CHO THUÊ (PHÒNG TRỌ)
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography>
                Họ và tên: <b>{landlordName}</b>
              </Typography>
              <Typography>
                Năm sinh: {landlordBirth}
              </Typography>
              <Typography>
                CMND/CCCD: {landlordCCCD}
              </Typography>
              <Box sx={{ display: 'flex', gap: 6 }}>
                <Typography>Ngày cấp: {landlordDateOfIssue}</Typography>
                <Typography>Nơi cấp: {landlordPlaceOfIssue}</Typography>
              </Box>
              <Typography>
                Số điện thoại: {landlordPhone}
              </Typography>
              <Typography>
                Địa chỉ thường trú: {landlordAddress}
              </Typography>
              <Typography>
                Địa chỉ cho thuê: {motelAddress}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          {/* ── Bên B ─────────────────────────────────────────────────────── */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
              BÊN B: BÊN THUÊ (PHÒNG TRỌ)
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography>Họ và tên: <i>(Điền khi ký hợp đồng)</i></Typography>
              <Typography>Năm sinh: .........................................................................................</Typography>
              <Typography>CMND/CCCD: .........................................................................................</Typography>
              <Box sx={{ display: 'flex', gap: 6 }}>
                <Typography>Ngày cấp: ..............................</Typography>
                <Typography>Nơi cấp: ...........................................................................</Typography>
              </Box>
              <Typography>Số điện thoại: .........................................................................................</Typography>
              <Typography>Địa chỉ thường trú: .........................................................................................</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <Typography sx={{ mb: 2 }}>
            Hai bên cùng thỏa thuận và đồng ý với nội dung sau:
          </Typography>

          {/* ── Điều 1 ────────────────────────────────────────────────────── */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Điều 1: Đối tượng hợp đồng</Typography>
            <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
              <li style={{ marginBottom: '6px' }}>
                Bên A đồng ý cho bên B thuê một phòng trọ thuộc địa chỉ:{' '}
                <b>{motelAddress}</b>
              </li>
              <li style={{ marginBottom: '6px' }}>
                Tên phòng: .............................................&emsp;
                Diện tích: ............. m²
              </li>
              <li style={{ marginBottom: '6px' }}>
                Thời hạn thuê: ............. tháng, kể từ ngày ....... / ....... / .........
                đến ngày ....... / ....... / .........
              </li>
              <li style={{ marginBottom: '6px' }}>
                Dịch vụ sử dụng (điện, nước, internet,...): theo thỏa thuận tại thời điểm ký hợp đồng.
              </li>
            </Box>
          </Box>

          {/* ── Điều 2 ────────────────────────────────────────────────────── */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Điều 2: Giá thuê và phương thức thanh toán</Typography>
            <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
              <li style={{ marginBottom: '6px' }}>
                Giá tiền thuê phòng trọ: ............................................đ/tháng
                (Bằng chữ: ..............................................................................)
              </li>
              <li style={{ marginBottom: '6px' }}>
                Tiền thuê phòng trọ bên B thanh toán cho bên A từ ngày ......... dương lịch hàng tháng.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Bên B đặt tiền thế chân trước: ............................................đ
                (Bằng chữ: ..............................................................................)
              </li>
              <li style={{ marginBottom: '6px' }}>
                Bên B ngưng hợp đồng trước thời hạn thì phải chịu mất tiền thế chân.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Bên A ngưng hợp đồng (lấy lại phòng trọ) trước thời hạn thì bồi thường gấp đôi số tiền bên B đã thế chân.
              </li>
            </Box>
          </Box>

          {/* ── Điều 3 ────────────────────────────────────────────────────── */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Điều 3: Trách nhiệm bên A</Typography>
            <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
              <li style={{ marginBottom: '6px' }}>
                Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng ngày ký hợp đồng.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Hướng dẫn bên B chấp hành đúng các quy định của địa phương, hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Không được tự ý vào phòng của bên B khi chưa có sự đồng ý.
              </li>
            </Box>
          </Box>

          {/* ── Điều 4 ────────────────────────────────────────────────────── */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Điều 4: Trách nhiệm bên B</Typography>
            <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
              <li style={{ marginBottom: '6px' }}>
                Trả tiền thuê phòng trọ hàng tháng theo hợp đồng.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo yêu cầu sử dụng riêng phải được sự đồng ý của bên A.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Đồ đạc, trang thiết bị trong phòng trọ phải có trách nhiệm bảo quản cẩn thận, không làm hư hỏng mất mát.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Không được tự ý cho người khác ở cùng khi chưa có sự đồng ý của bên A.
              </li>
            </Box>
          </Box>

          {/* ── Điều 5 ────────────────────────────────────────────────────── */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Điều 5: Điều khoản chung</Typography>
            <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
              <li style={{ marginBottom: '6px' }}>
                Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp đồng.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai bên cùng nhau bàn bạc giải quyết. Nếu không giải quyết được thì nhờ cơ quan có thẩm quyền giải quyết theo quy định pháp luật.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên giữ 01 bản.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Hợp đồng có hiệu lực kể từ ngày ký.
              </li>
            </Box>
          </Box>

          {/* ── Ngày ký & Chữ ký ──────────────────────────────────────────── */}
          <Box sx={{ textAlign: 'right', mt: 4, mb: 1 }}>
            <Typography sx={{ fontStyle: 'italic' }}>
              {city}, {todayStr}
            </Typography>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <Box sx={{ width: '45%' }}>
              <Typography sx={{ fontWeight: 'bold' }}>BÊN A (Bên cho thuê)</Typography>
              <Typography sx={{ fontStyle: 'italic', fontSize: '13px', mb: 8, color: 'text.secondary' }}>
                Ký và ghi rõ họ tên
              </Typography>
              <Divider sx={{ mb: 1, borderColor: '#333' }} />
              <Typography sx={{ fontWeight: 'bold' }}>{landlordName}</Typography>
            </Box>
            <Box sx={{ width: '45%' }}>
              <Typography sx={{ fontWeight: 'bold' }}>BÊN B (Bên thuê)</Typography>
              <Typography sx={{ fontStyle: 'italic', fontSize: '13px', mb: 8, color: 'text.secondary' }}>
                Ký và ghi rõ họ tên
              </Typography>
              <Divider sx={{ mb: 1, borderColor: '#333' }} />
              <Typography sx={{ color: 'text.disabled', fontStyle: 'italic' }}>(Ký khi có khách thuê)</Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default SoftwareContractPreview
