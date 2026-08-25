/**
 * templateDefaults.js
 * Nội dung mặc định cho mẫu hợp đồng và mẫu tờ khai tạm trú
 * Được dùng chung bởi ManagerSettings, ModelDeposit, ModelResidenceTemplate
 */

// ==================== HỢP ĐỒNG THUÊ PHÒNG TRỌ ====================
export const DEFAULT_CONTRACT_NAME = 'HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ'

export const getDefaultContractContent = (namecontract = DEFAULT_CONTRACT_NAME) => `
  <h3 style="text-align:center;margin:0;font-weight:700;font-family:'Times New Roman',serif;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
  <p style="text-align:center;margin:4px 0 20px;font-family:'Times New Roman',serif;"><strong>Độc lập – Tự do – Hạnh phúc</strong></p>
  <h2 style="text-align:center;text-transform:uppercase;margin-bottom:24px;font-family:'Times New Roman',serif;">${namecontract}</h2>

  <p style="font-family:'Times New Roman',serif;">Hôm nay, ngày <b>{{ngayLap}}</b> tháng <b>{{thangLap}}</b> năm <b>{{namLap}}</b>, tại căn nhà số <b>{{diaChiNhaTro}}</b>. Chúng tôi ký tên dưới đây gồm có:</p>

  <p style="font-family:'Times New Roman',serif;"><strong>BÊN CHO THUÊ PHÒNG TRỌ (gọi tắt là Bên A):</strong></p>
  <p style="font-family:'Times New Roman',serif;">Ông/bà (tên chủ hợp đồng): <b>{{benChoThue}}</b></p>
  <p style="font-family:'Times New Roman',serif;">CMND/CCCD số: <b>{{cccdBenChoThue}}</b> &nbsp;&nbsp;&nbsp;&nbsp; cấp ngày: <b>{{ngayCapBenChoThue}}</b> &nbsp;&nbsp;&nbsp;&nbsp; nơi cấp: <b>{{noiCapBenChoThue}}</b></p>
  <p style="font-family:'Times New Roman',serif;">Thường trú tại: <b>{{thuongTruBenChoThue}}</b></p>

  <p style="font-family:'Times New Roman',serif;"><strong>BÊN THUÊ PHÒNG TRỌ (gọi tắt là Bên B):</strong></p>
  <p style="font-family:'Times New Roman',serif;">Ông/bà: <b>{{benThue}}</b></p>
  <p style="font-family:'Times New Roman',serif;">CMND/CCCD số: <b>{{cccdBenThue}}</b> &nbsp;&nbsp;&nbsp;&nbsp; cấp ngày: <b>{{ngayCapBenThue}}</b> &nbsp;&nbsp;&nbsp;&nbsp; nơi cấp: <b>{{noiCapBenThue}}</b></p>
  <p style="font-family:'Times New Roman',serif;">Thường trú tại: <b>{{thuongTruBenThue}}</b></p>

  <p style="font-family:'Times New Roman',serif;">Sau khi thỏa thuận, hai bên thống nhất như sau:</p>

  <p style="font-family:'Times New Roman',serif;"><strong>1. Nội dung thuê phòng trọ</strong></p>
  <p style="font-family:'Times New Roman',serif;">Bên A cho Bên B thuê 01 phòng trọ số: <b>{{phongThue}}</b> tại <b>{{tenNhaTro}}</b>. Với thời hạn là: <b>{{thoiHanThue}}</b> tháng, giá thuê: <b>{{giaThue}}</b> (Bằng chữ: <i>{{giaThueBangChu}}</i>). Chưa bao gồm chi phí: điện sinh hoạt, nước.</p>

  <p style="font-family:'Times New Roman',serif;"><strong>2. Trách nhiệm Bên A</strong></p>
  <ul style="font-family:'Times New Roman',serif;">
    <li>Đảm bảo căn nhà cho thuê không có tranh chấp, khiếu kiện.</li>
    <li>Đăng ký với chính quyền địa phương về thủ tục cho thuê phòng trọ.</li>
  </ul>

  <p style="font-family:'Times New Roman',serif;"><strong>3. Trách nhiệm Bên B</strong></p>
  <ul style="font-family:'Times New Roman',serif;">
    <li>Đặt cọc với số tiền là: <b>{{tienCoc}}</b> (Bằng chữ: <i>{{tienCocBangChu}}</i>), thanh toán tiền thuê phòng hàng tháng vào ngày {{ngayDongTien}} + tiền điện + nước.</li>
    <li>Đảm bảo các thiết bị và sửa chữa các hư hỏng trong phòng trong khi sử dụng. Nếu không sửa chữa thì khi trả phòng, bên A sẽ trừ vào tiền đặt cọc, giá trị cụ thể được tính theo giá thị trường.</li>
    <li>Chỉ sử dụng phòng trọ vào mục đích ở, với số lượng tối đa không quá 04 người (kể cả trẻ em); không chứa các thiết bị gây cháy nổ, hàng cấm... cung cấp giấy tờ tùy thân để đăng ký tạm trú theo quy định, giữ gìn an ninh trật tự, nếp sống văn hóa đô thị; không tụ tập nhậu nhẹt, cờ bạc và các hành vi vi phạm pháp luật khác.</li>
    <li>Không được tự ý cải tạo kiến trúc phòng hoặc trang trí ảnh hưởng tới tường, cột, nền... Nếu có nhu cầu trên phải trao đổi với bên A để được thống nhất.</li>
  </ul>

  <p style="font-family:'Times New Roman',serif;"><strong>4. Điều khoản thực hiện</strong></p>
  <ul style="font-family:'Times New Roman',serif;">
    <li>Hai bên nghiêm túc thực hiện những quy định trên trong thời hạn cho thuê, nếu bên A lấy phòng phải báo cho bên B ít nhất 01 tháng, hoặc ngược lại.</li>
    <li>Sau thời hạn cho thuê {{thoiHanThue}} tháng nếu bên B có nhu cầu hai bên tiếp tục thương lượng giá thuê để gia hạn hợp đồng bằng miệng hoặc thực hiện như sau.</li>
  </ul>

  <table style="width:100%;border-collapse:collapse;margin:12px 0;font-family:'Times New Roman',serif;">
    <thead>
      <tr style="background-color:#f2f2f2;">
        <th style="border:1px solid #111;padding:8px;text-align:center;">Số lần gia hạn</th>
        <th style="border:1px solid #111;padding:8px;text-align:center;">Thời gian gia hạn (tháng)</th>
        <th style="border:1px solid #111;padding:8px;text-align:center;">Từ ngày</th>
        <th style="border:1px solid #111;padding:8px;text-align:center;">Đến ngày</th>
        <th style="border:1px solid #111;padding:8px;text-align:center;">Giá thuê/ tháng (triệu đồng)</th>
        <th style="border:1px solid #111;padding:8px;text-align:center;">Ký tên</th>
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

  <p style="text-align:right;margin-top:20px;font-family:'Times New Roman',serif;font-style:italic;">{{tinhThanh}}, ngày {{ngayLap}} tháng {{thangLap}} năm {{namLap}}</p>
  <table style="width:100%;border-collapse:collapse;margin-top:24px;font-family:'Times New Roman',serif;">
    <tbody>
      <tr>
        <td style="width:50%;text-align:center;border:none;vertical-align:top;"><strong>Bên B</strong><br/><em>(Ký, ghi rõ họ tên)</em><br/><br/><br/><br/><strong>{{benThue}}</strong></td>
        <td style="width:50%;text-align:center;border:none;vertical-align:top;"><strong>Bên A</strong><br/><em>(Ký, ghi rõ họ tên)</em><br/><br/><br/><br/><strong>{{benChoThue}}</strong></td>
      </tr>
    </tbody>
  </table>
  <p style="text-align:center;margin-top:30px;font-style:italic;color:#666;font-family:'Times New Roman',serif;">(Hợp đồng này chỉ mang tính chất tham khảo)</p>
`

// ==================== TỜ KHAI TẠM TRÚ CT01 ====================
export const DEFAULT_RESIDENCE_TEMPLATE_NAME = 'Mẫu CT01 – Tờ khai thay đổi thông tin cư trú'

export const getDefaultResidenceContent = () => `
<p style="text-align:center;font-family:'Times New Roman',serif;font-size:13px;margin:0;"><em>Mẫu CT01 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an</em></p>

<h3 style="text-align:center;margin:12px 0 4px;font-weight:700;font-family:'Times New Roman',serif;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
<p style="text-align:center;margin:0 0 16px;font-family:'Times New Roman',serif;"><strong>Độc lập – Tự do – Hạnh phúc</strong></p>

<h2 style="text-align:center;text-transform:uppercase;margin-bottom:20px;font-family:'Times New Roman',serif;">TỜ KHAI THAY ĐỔI THÔNG TIN CƯ TRÚ</h2>

<p style="font-family:'Times New Roman',serif;">Kính gửi<sup>(1)</sup>:......................................................................................................................</p>

<p style="font-family:'Times New Roman',serif;">1. Họ, chữ đệm và tên: <strong>{{tenNguoiKhai}}</strong></p>
<p style="font-family:'Times New Roman',serif;">2. Ngày, tháng, năm sinh: {{ngaySinh}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Giới tính: {{gioiTinh}}</p>
<p style="font-family:'Times New Roman',serif;">4. Số định danh cá nhân: <strong>{{soDinhDanh}}</strong></p>
<p style="font-family:'Times New Roman',serif;">5. Số điện thoại liên hệ: {{soDienThoai}}&nbsp;&nbsp;&nbsp;&nbsp;6. Email: {{email}}</p>
<p style="font-family:'Times New Roman',serif;">7. Họ, chữ đệm và tên chủ hộ: {{tenChuHo}}&nbsp;&nbsp;&nbsp;8. Mối quan hệ với chủ hộ: {{quanHeChuHo}}</p>
<p style="font-family:'Times New Roman',serif;">9. Số định danh cá nhân của chủ hộ: <strong>{{sddChuHo}}</strong></p>
<p style="font-family:'Times New Roman',serif;">10. Nội dung đề nghị<sup>(2)</sup>: .................................................................................................</p>

<p style="font-family:'Times New Roman',serif;margin-top:12px;">11. Những thành viên trong hộ gia đình cùng thay đổi:</p>

<table style="width:100%;border-collapse:collapse;margin:12px 0;font-family:'Times New Roman',serif;">
  <thead>
    <tr style="background-color:#f2f2f2;">
      <th style="border:1px solid #111;padding:8px;text-align:center;">TT</th>
      <th style="border:1px solid #111;padding:8px;text-align:center;">Họ, chữ đệm và tên</th>
      <th style="border:1px solid #111;padding:8px;text-align:center;">Ngày, tháng, năm sinh</th>
      <th style="border:1px solid #111;padding:8px;text-align:center;">Giới tính</th>
      <th style="border:1px solid #111;padding:8px;text-align:center;">Số định danh cá nhân</th>
      <th style="border:1px solid #111;padding:8px;text-align:center;">Mối quan hệ với chủ hộ</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #111;padding:8px;text-align:center;">1</td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td></tr>
    <tr><td style="border:1px solid #111;padding:8px;text-align:center;">2</td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td></tr>
    <tr><td style="border:1px solid #111;padding:8px;text-align:center;">3</td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td></tr>
    <tr><td style="border:1px solid #111;padding:8px;text-align:center;">4</td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td></tr>
    <tr><td style="border:1px solid #111;padding:8px;text-align:center;">5</td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td><td style="border:1px solid #111;padding:8px;"></td></tr>
  </tbody>
</table>

<table style="width:100%;border-collapse:collapse;margin-top:24px;font-family:'Times New Roman',serif;">
  <tbody>
    <tr>
      <td style="width:25%;text-align:center;border:none;vertical-align:top;">
        <strong>Ý KIẾN CỦA CHỦ HỘ<sup>(3)</sup></strong>
        <br/><em>(Ngày.....tháng....năm...)</em>
        <br/><br/><br/><br/>
      </td>
      <td style="width:25%;text-align:center;border:none;vertical-align:top;">
        <strong>Ý KIẾN CỦA CHỦ SỞ HỮU CHỖ Ở HỢP PHÁP<sup>(4)</sup></strong>
        <br/><em>(Ngày.....tháng....năm...)</em>
        <br/><br/><br/>
        <p>(7) Họ và tên: ..................</p>
        <p>(7) Số định danh: ..................</p>
      </td>
      <td style="width:25%;text-align:center;border:none;vertical-align:top;">
        <strong>Ý KIẾN CỦA CHA, MẸ HOẶC NGƯỜI GIÁM HỘ<sup>(5)</sup></strong>
        <br/><em>(Ngày.....tháng....năm...)</em>
        <br/><br/><br/>
        <p>(7) Họ và tên: ..................</p>
        <p>(7) Số định danh: ..................</p>
      </td>
      <td style="width:25%;text-align:center;border:none;vertical-align:top;">
        <p>{{diaChi}}, ngày {{ngayLap}}</p>
        <strong>NGƯỜI KÊ KHAI<sup>(6)</sup></strong>
        <br/><em>(Ký, ghi rõ họ tên)</em>
        <br/><br/><br/><br/>
        <strong>{{tenNguoiKhai}}</strong>
      </td>
    </tr>
  </tbody>
</table>
`
