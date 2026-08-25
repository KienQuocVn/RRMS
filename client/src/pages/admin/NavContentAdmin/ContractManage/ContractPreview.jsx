import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Divider,
  Container
} from '@mui/material';
import { getContractById } from '~/apis/contractTemplateAPI';
import { getServiceRoombyRoomId } from '~/apis/roomAPI';
import { getAllDeviceByRomId } from '~/apis/deviceAPT';
import { getTRCByusername, getTRCByMotelId } from '~/apis/TRCAPI';
import { getMotelById } from '~/apis/motelAPI';
import { getProfileByUsername } from '~/apis/accountAPI';
import { getDefaultContractContent, DEFAULT_CONTRACT_NAME } from '~/utils/templateDefaults';
import { resolveAddress } from '~/utils/addressResolver';

const getUnitLabel = (unit) => {
  const map = { CAI: 'Cái', cai: 'Cái', CHIEC: 'Chiếc', chiec: 'Chiếc', BO: 'Bộ', bo: 'Bộ', CAP: 'Cặp', cap: 'Cặp' };
  return map[unit] || unit || 'Cái';
};

const getServiceUnitLabel = (chargeType, nameService = '') => {
  if (!chargeType) return 'tháng';
  const normalized = String(chargeType).trim().toLowerCase();
  const name = String(nameService).trim().toLowerCase();

  if (normalized === 'meter' || normalized.includes('meter')) {
    if (name.includes('điện') || name.includes('dien')) return 'kWh';
    if (name.includes('nước') || name.includes('nuoc')) return 'khối';
    return 'số đo';
  }
  if (normalized === 'fixed' || normalized.includes('fixed')) return 'tháng';
  if (normalized.includes('nguoi') || normalized.includes('người')) return 'người';
  if (normalized.includes('phong') || normalized.includes('phòng')) return 'phòng';
  if (normalized.includes('thang') || normalized.includes('tháng')) return 'tháng';
  return chargeType;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '...............................';
  return `${Number(value).toLocaleString('vi-VN')}đ`;
};

const extractTRC = (res) => {
  if (!res) return null;
  const resData = res?.data?.result || res?.result || res;
  if (Array.isArray(resData)) return resData[0] || null;
  if (resData && typeof resData === 'object') return resData;
  return null;
};

const replaceContractMergeTags = ({ html, contract, motel, trc, profile, formatDate, convertToWords }) => {
  let template = html || '';
  const contentCleaned = template.replace(/<[^>]*>/g, '').trim();
  if (contentCleaned === 'Nội dung hợp đồng mẫu...' || contentCleaned === 'Mẫu mặc định' || !contentCleaned || contentCleaned.length < 50) {
    template = getDefaultContractContent(contract?.contractTemplate?.namecontract || contract?.contracttemplate?.namecontract || DEFAULT_CONTRACT_NAME);
  }

  // Ngày lập hợp đồng
  const createDateObj = contract?.createdate ? new Date(contract.createdate) : (contract?.createdAt ? new Date(contract.createdAt) : (contract?.moveinDate ? new Date(contract.moveinDate) : new Date()));
  const dayLap = createDateObj.getDate().toString().padStart(2, '0');
  const monthLap = (createDateObj.getMonth() + 1).toString().padStart(2, '0');
  const yearLap = createDateObj.getFullYear();

  // Đơn vị hành chính / Tỉnh thành
  const motelAddr = motel?.address || contract?.room?.motel?.address || '';
  const addressParts = motelAddr.split(',');
  const city = addressParts.length > 0 ? addressParts[addressParts.length - 1].trim() : 'TP. Hồ Chí Minh';

  // Thời hạn hợp đồng (bỏ chữ "tháng" thừa nếu có)
  let rawTerm = String(contract?.leaseTerm || contract?.leaseterm || '').trim();
  if (rawTerm.endsWith('tháng')) {
    rawTerm = rawTerm.replace(/tháng/gi, '').trim();
  }

  // Chu kỳ thanh toán
  let cycle = String(contract?.room?.invoiceDate || contract?.collectionCycle || contract?.collectioncycle || '').trim();
  if (!cycle || cycle === 'Hàng tháng' || cycle === 'hang thang' || cycle === 'HANG_THANG') {
    cycle = '01 hàng tháng';
  }

  // Địa chỉ thường trú bên B (tránh biến boolean temporaryResidence)
  const tenantAddress = (typeof contract?.tenant?.permanentAddress === 'string' && contract?.tenant?.permanentAddress)
    || (typeof contract?.tenant?.permanentaddress === 'string' && contract?.tenant?.permanentaddress)
    || (typeof contract?.tenant?.address === 'string' && contract?.tenant?.address)
    || (typeof contract?.tenant?.hometown === 'string' && contract?.tenant?.hometown)
    || '...............................';

  const values = {
    tenHopDong: contract?.contractTemplate?.namecontract || contract?.contracttemplate?.namecontract || DEFAULT_CONTRACT_NAME,
    tenNhaTro: motel?.motelName || contract?.room?.motel?.motelName || '...............................',
    diaChiNhaTro: motelAddr || '...............................',

    // Bên A (Chủ trọ)
    benChoThue: trc?.representativename || trc?.representativeName || profile?.fullName || '...............................',
    sdtBenChoThue: trc?.phone || profile?.phone || '...............................',
    cccdBenChoThue: trc?.identifier || profile?.cccd || '...............................',
    ngayCapBenChoThue: formatDate(trc?.dateofissue || trc?.dateOfIssue || profile?.dateOfIssue),
    noiCapBenChoThue: trc?.placeofissue || trc?.placeOfIssue || profile?.placeOfIssue || '...............................',
    thuongTruBenChoThue: trc?.permanentaddress || trc?.permanentAddress || profile?.address || '...............................',

    // Bên B (Khách thuê)
    benThue: contract?.tenant?.fullname || contract?.tenant?.fullName || '...............................',
    sdtBenThue: contract?.tenant?.phone || '...............................',
    cccdBenThue: contract?.tenant?.cccd || '...............................',
    ngayCapBenThue: formatDate(contract?.tenant?.licenseDate || contract?.tenant?.dateOfIssue || contract?.tenant?.dateofissue),
    noiCapBenThue: contract?.tenant?.placeOfLicense || contract?.tenant?.placeOfIssue || contract?.tenant?.placeofissue || '...............................',
    thuongTruBenThue: tenantAddress,

    // Phòng & Hợp đồng
    phongThue: contract?.room?.name || contract?.room?.roomName || '...............................',
    thoiHanThue: rawTerm || '................',
    giaThue: formatCurrency(contract?.price),
    giaThueBangChu: contract?.price ? convertToWords(contract.price) : '...............................',
    tienCoc: formatCurrency(contract?.deposit),
    tienCocBangChu: contract?.deposit ? convertToWords(contract.deposit) : '...............................',
    ngayDongTien: cycle,

    // Ngày tháng
    tinhThanh: city || 'TP. Hồ Chí Minh',
    ngayLap: dayLap,
    thangLap: monthLap,
    namLap: yearLap,
    ngayLapFull: formatDate(contract?.createdate || contract?.createdAt || contract?.moveinDate)
  };

  return Object.entries(values).reduce((content, [key, value]) => {
    return content.replaceAll(`{{${key}}}`, value);
  }, template);
};

const ContractPreview = ({ setIsAdmin }) => {
  const { contractId, motelId } = useParams();
  const [contract, setContract] = useState({});
  const [TRC, setTRC] = useState({});
  const [profile, setProfile] = useState({});
  const [motel, setMotel] = useState({});
  const [roomService, setRoomService] = useState([]);
  const [roomDevice, setRoomDevice] = useState([]);

  const fetchContracts = async (id, currentMotelId) => {
    if (id) {
      try {
        const dataContract = await getContractById(id);
        
        if (dataContract?.tenant) {
          if (dataContract.tenant.address) dataContract.tenant.address = await resolveAddress(dataContract.tenant.address);
          if (dataContract.tenant.permanentAddress) dataContract.tenant.permanentAddress = await resolveAddress(dataContract.tenant.permanentAddress);
          if (dataContract.tenant.permanentaddress) dataContract.tenant.permanentaddress = await resolveAddress(dataContract.tenant.permanentaddress);
        }

        setContract(dataContract);

        const roomId = dataContract?.room?.roomId;
        const username = dataContract?.username?.username || (typeof dataContract?.username === 'string' ? dataContract.username : '');
        const effectiveMotelId = currentMotelId || dataContract?.room?.motel?.motelId;

        const [dataRoomService, dataRoomDevice, dataTRCUser, dataTRCMotel, dataProfile] = await Promise.all([
          roomId ? getServiceRoombyRoomId(roomId).catch(() => []) : Promise.resolve([]),
          roomId ? getAllDeviceByRomId(roomId).catch(() => ({ result: [] })) : Promise.resolve({ result: [] }),
          username ? getTRCByusername(username).catch(() => null) : Promise.resolve(null),
          effectiveMotelId ? getTRCByMotelId(effectiveMotelId).catch(() => null) : Promise.resolve(null),
          username ? getProfileByUsername(username).catch(() => null) : Promise.resolve(null)
        ]);
        
        setRoomService(dataRoomService || []);
        setRoomDevice(dataRoomDevice?.result || []);
        
        let trcObj = extractTRC(dataTRCMotel) || extractTRC(dataTRCUser);
        if (trcObj) {
          if (trcObj.permanentaddress) trcObj.permanentaddress = await resolveAddress(trcObj.permanentaddress);
          if (trcObj.permanentAddress) trcObj.permanentAddress = await resolveAddress(trcObj.permanentAddress);
        }
        setTRC(trcObj || null);
        setProfile(dataProfile || null);
      } catch (error) {
        console.error('Error fetching contract details:', error);
      }
    }
  };

  const fetchMotel = async (id) => {
    if (id) {
      try {
        const dataMotel = await getMotelById(id);
        const motelResult = dataMotel?.data?.result || dataMotel?.result || dataMotel;
        if (motelResult && motelResult.address) {
          motelResult.address = await resolveAddress(motelResult.address);
        }
        setMotel(motelResult || {});
      } catch (error) {
        console.error('Error fetching motel:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '...............................';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = Math.abs(end - start);
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
  };

  const convertToWords = (number) => {
    if (!number) return '';
    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const places = ['', 'nghìn', 'triệu', 'tỷ'];
    
    const readGroup = (group) => {
      let read = '';
      const hundreds = Math.floor(group / 100);
      const tens = Math.floor((group % 100) / 10);
      const ones = group % 10;
      
      if (hundreds > 0) {
        read += units[hundreds] + ' trăm ';
      }
      
      if (tens > 1) {
        read += units[tens] + ' mươi ';
      } else if (tens === 1) {
        read += 'mười ';
      } else if (hundreds > 0 && ones > 0) {
        read += 'lẻ ';
      }
      
      if (ones === 5 && tens > 0) {
        read += 'lăm ';
      } else if (ones === 1 && tens > 1) {
        read += 'mốt ';
      } else if (ones > 0) {
        read += units[ones] + ' ';
      }
      
      return read;
    };
    
    let str = '';
    let i = 0;
    let temp = Math.floor(number);
    
    if (temp === 0) return 'không đồng';
    
    while (temp > 0) {
      const group = temp % 1000;
      if (group > 0) {
        const groupStr = readGroup(group);
        str = groupStr + places[i] + ' ' + str;
      }
      temp = Math.floor(temp / 1000);
      i++;
    }
    
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1) + ' đồng';
  };

  useEffect(() => {
    setIsAdmin(true);
    fetchContracts(contractId, motelId);
    fetchMotel(motelId);
  }, [contractId, motelId]);

  const contractTemplateContent = contract?.contractTemplate?.content || contract?.contracttemplate?.content || '';
  const renderedTemplateContent = contractTemplateContent
    ? replaceContractMergeTags({ html: contractTemplateContent, contract, motel, trc: TRC, profile, formatDate, convertToWords })
    : '';

  return (
    <Box sx={{ bgcolor: '#eee', minHeight: '100vh', py: 5 }}>
      {/* Sticky Header Notice */}
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
        Vui lòng liên hệ{' '}
        <Link href="https://zalo.me/0919925302" sx={{ color: '#20a9e7', textDecoration: 'underline' }}>
          chuyên viên hỗ trợ
        </Link>{' '}
        nếu mẫu không phù hợp hoặc vào phần cấu hình trên máy tính để sửa mẫu.
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ 
          p: '2cm 1.5cm', 
          mx: 'auto', 
          width: '21cm', 
          minHeight: '29.7cm',
          boxSizing: 'border-box'
        }}>
          {renderedTemplateContent ? (
            <Box
              sx={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 16,
                lineHeight: 1.65,
                color: '#111',
                '& table': { borderCollapse: 'collapse' },
                '& td, & th': { minWidth: 80 }
              }}
              dangerouslySetInnerHTML={{ __html: renderedTemplateContent }}
            />
          ) : (
          <>
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
              Độc lập - Tự do - Hạnh phúc
            </Typography>
            <Typography variant="h5" sx={{ mt: 5, fontWeight: 'bold', textTransform: 'uppercase' }}>
              HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ
            </Typography>
          </Box>

          {/* Party A Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              BÊN A : BÊN CHO THUÊ (PHÒNG TRỌ)
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography>Họ và tên: {TRC?.representativename || TRC?.representativeName || profile?.fullName || '...............................'}</Typography>
              <Typography>Năm sinh: {formatDate(TRC?.birth || profile?.birthday)}</Typography>
              <Typography>CMND/CCCD: {TRC?.identifier || profile?.cccd || '...............................'}</Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Typography>Ngày cấp: {formatDate(TRC?.dateofissue || TRC?.dateOfIssue || profile?.dateOfIssue)}</Typography>
                <Typography>Nơi cấp: {TRC?.placeofissue || TRC?.placeOfIssue || profile?.placeOfIssue || '...............................'}</Typography>
              </Box>
              <Typography>Số điện thoại: {TRC?.phone || profile?.phone || '...............................'}</Typography>
              <Typography>Địa chỉ tòa nhà: {motel?.address || contract?.room?.motel?.address || '...................................................'}</Typography>
              <Typography>Thường trú: {TRC?.permanentaddress || TRC?.permanentAddress || profile?.address || '...................................................'}</Typography>
            </Box>
          </Box>

          {/* Party B Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              BÊN B : BÊN THUÊ (PHÒNG TRỌ)
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography>Họ và tên: {contract?.tenant?.fullname || contract?.tenant?.fullName || '...............................'}</Typography>
              <Typography>Năm sinh: {formatDate(contract?.tenant?.birthday)}</Typography>
              <Typography>CMND/CCCD: {contract?.tenant?.cccd || '...............................'}</Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Typography>Ngày cấp: {formatDate(contract?.tenant?.licenseDate || contract?.tenant?.dateOfIssue || contract?.tenant?.dateofissue)}</Typography>
                <Typography>Nơi cấp: {contract?.tenant?.placeOfLicense || contract?.tenant?.placeOfIssue || contract?.tenant?.placeofissue || '...............................'}</Typography>
              </Box>
              <Typography>Thường trú: {contract?.tenant?.temporaryResidence || contract?.tenant?.permanentAddress || contract?.tenant?.permanentaddress || contract?.tenant?.address || '...................................................'}</Typography>
            </Box>
          </Box>

          <Typography sx={{ mb: 2 }}>Hai bên cùng thỏa thuận và đồng ý với nội dung sau :</Typography>

          {/* Clauses */}
          <Box sx={{ pl: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Điều 1:</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li style={{ marginBottom: '8px' }}>
                Bên A đồng ý cho bên B thuê một phòng trọ
                {contract?.room?.roomName ? <b> {contract.room.roomName} </b> : ' '}
                thuộc địa chỉ: {motel?.address || contract?.room?.motel?.address || '....'}
              </li>
              <li style={{ marginBottom: '8px' }}>
                Dịch vụ sử dụng
                <TableContainer component={Box} sx={{ my: 2 }}>
                  <Table size="small" sx={{ border: '1px solid black', '& td, & th': { border: '1px solid black' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center"><b>Tên dịch vụ</b></TableCell>
                        <TableCell align="center"><b>Giá Tiền</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roomService?.map((service, i) => (
                        <TableRow key={i}>
                          <TableCell align="center">{service.service.nameService}</TableCell>
                          <TableCell align="center">
                            {service.service.price.toLocaleString('vi-VN')}đ/{getServiceUnitLabel(service.service.chargetype, service.service.nameService)}
                            {String(service.service.chargetype).toLowerCase().includes('meter') && (
                              <Typography variant="caption" display="block">(Chỉ số hiện tại: {service.quantity})</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </li>
              <li style={{ marginBottom: '8px' }}>
                Tài sản phòng sử dụng
                <TableContainer component={Box} sx={{ my: 2 }}>
                  <Table size="small" sx={{ border: '1px solid black', '& td, & th': { border: '1px solid black' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center"><b>Tên tài sản</b></TableCell>
                        <TableCell align="center"><b>Số lượng</b></TableCell>
                        <TableCell align="center"><b>Giá trị</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roomDevice?.map((device, i) => (
                        <TableRow key={i}>
                          <TableCell align="center">{device.motelDevice.deviceName}</TableCell>
                          <TableCell align="center">{device.quantity}</TableCell>
                          <TableCell align="center">
                            {device.motelDevice.value.toLocaleString('vi-VN')}đ/{getUnitLabel(device.motelDevice.unit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </li>
              <li>
                Thời hạn thuê phòng trọ là{' '}
                {contract?.closeContract && contract?.moveinDate ? (
                  <b>{calculateDaysDifference(contract.moveinDate, contract.closeContract)} ngày </b>
                ) : (
                  'không xác định '
                )}
                kể từ ngày {contract?.createdate ? formatDate(addDays(contract.createdate, 1)) : ''}
              </li>
            </Box>

            <Typography sx={{ fontWeight: 'bold', mt: 2 }}>Điều 2:</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Giá tiền thuê phòng trọ là {contract.price?.toLocaleString('vi-VN')}đ (Bằng chữ: {contract.price ? convertToWords(contract.price) : ''})</li>
              <li>Tiền thuê phòng trọ bên B thanh toán cho bên A từ ngày {contract.room?.invoiceDate || ''} dương lịch hàng tháng.</li>
              <li>Bên B đặt tiền thế chân trước {contract.deposit?.toLocaleString('vi-VN')}đ (Bằng chữ: {contract.deposit ? convertToWords(contract.deposit) : ''}) cho bên A.</li>
              <li>Bên B ngưng hợp đồng trước thời hạn thì phải chịu mất tiền thế chân.</li>
              <li>Bên A ngưng hợp đồng (lấy lại phòng trọ) trước thời hạn thì bồi thường gấp đôi số tiền bên B đã thế chân.</li>
            </Box>

            <Typography sx={{ fontWeight: 'bold', mt: 2 }}>Điều 3: Trách nhiệm bên A.</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng ngày ký hợp đồng.</li>
              <li>Hướng dẫn bên B chấp hành đúng các quy định của địa phương, hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B.</li>
            </Box>

            <Typography sx={{ fontWeight: 'bold', mt: 2 }}>Điều 4: Trách nhiệm bên B.</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Trả tiền thuê phòng trọ hàng tháng theo hợp đồng.</li>
              <li>Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo yêu cầu sử dụng riêng phải được sự đồng ý của bên A.</li>
              <li>Đồ đạt trang thiết bị trong phòng trọ phải có trách nhiệm bảo quản cẩn thận không làm hư hỏng mất mát.</li>
            </Box>

            <Typography sx={{ fontWeight: 'bold', mt: 2 }}>Điều 5: Điều khoản chung.</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp đồng.</li>
              <li>Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai bên cùng nhau bàn bạc giải quyết.</li>
              <li>Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên giữ 01 bản.</li>
            </Box>
          </Box>

          {/* Ngày ký */}
          <Box sx={{ textAlign: 'right', mt: 4, mb: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {motel?.address ? motel.address.split(',').pop()?.trim() || 'TP. Hồ Chí Minh' : 'TP. Hồ Chí Minh'}, ngày {contract?.createdate ? new Date(contract.createdate).getDate() : '...'} tháng {contract?.createdate ? new Date(contract.createdate).getMonth() + 1 : '...'} năm {contract?.createdate ? new Date(contract.createdate).getFullYear() : '......'}
            </Typography>
          </Box>

          {/* Signatures */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <Box sx={{ width: '45%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>BÊN A</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 10 }}>Ký và ghi rõ họ tên</Typography>
              <Divider sx={{ mb: 1, borderColor: '#333' }} />
              <Typography>{TRC?.representativename || profile?.fullName || '...............................'}</Typography>
            </Box>
            <Box sx={{ width: '45%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>BÊN B</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 10 }}>Ký và ghi rõ họ tên</Typography>
              <Divider sx={{ mb: 1, borderColor: '#333' }} />
              <Typography>{contract.tenant?.fullname || ''}</Typography>
            </Box>
          </Box>
          </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ContractPreview;
