/**
 * Danh sách tỉnh/thành Việt Nam sau sáp nhập 2025 (63 → 34 đơn vị hành chính)
 * Mỗi tỉnh có danh sách phường/xã/quận/huyện chính
 */
export const VIETNAM_PROVINCES = [
  {
    id: 'ha-noi',
    name: 'Hà Nội',
    wards: [
      'Phường Ba Đình', 'Phường Hoàn Kiếm', 'Phường Tây Hồ', 'Phường Long Biên',
      'Phường Cầu Giấy', 'Phường Đống Đa', 'Phường Hai Bà Trưng', 'Phường Hoàng Mai',
      'Phường Thanh Xuân', 'Phường Hà Đông', 'Phường Nam Từ Liêm', 'Phường Bắc Từ Liêm',
      'Phường Gia Lâm', 'Phường Đông Anh', 'Phường Sóc Sơn', 'Phường Thạch Thất',
      'Phường Quốc Oai', 'Phường Thanh Oai', 'Phường Thường Tín', 'Phường Phú Xuyên',
      'Phường Ứng Hòa', 'Phường Mỹ Đức', 'Phường Chương Mỹ', 'Phường Hoài Đức'
    ]
  },
  {
    id: 'ho-chi-minh',
    name: 'Hồ Chí Minh',
    wards: [
      'Phường Quận 1', 'Phường Quận 3', 'Phường Quận 4', 'Phường Quận 5',
      'Phường Quận 6', 'Phường Quận 7', 'Phường Quận 8', 'Phường Quận 10',
      'Phường Quận 11', 'Phường Quận 12', 'Phường Bình Thạnh', 'Phường Gò Vấp',
      'Phường Phú Nhuận', 'Phường Tân Bình', 'Phường Tân Phú', 'Phường Bình Tân',
      'Phường Thủ Đức', 'Phường Bình Chánh', 'Phường Củ Chi', 'Phường Cần Giờ',
      'Phường Hóc Môn', 'Phường Nhà Bè'
    ]
  },
  {
    id: 'da-nang',
    name: 'Đà Nẵng',
    wards: [
      'Phường Hải Châu', 'Phường Cẩm Lệ', 'Phường Thanh Khê', 'Phường Sơn Trà',
      'Phường Ngũ Hành Sơn', 'Phường Liên Chiểu', 'Phường Hòa Vang', 'Phường Hòa Xuân',
      'Phường An Hải Bắc', 'Phường An Hải Đông', 'Phường An Hải Tây', 'Phường Mân Thái',
      'Phường Nại Hiên Đông', 'Phường Phước Mỹ', 'Phường Thuận Phước', 'Phường Hòa Thuận'
    ]
  },
  {
    id: 'hai-phong',
    name: 'Hải Phòng',
    wards: [
      'Phường Hồng Bàng', 'Phường Lê Chân', 'Phường Ngô Quyền', 'Phường Kiến An',
      'Phường Hải An', 'Phường Đồ Sơn', 'Phường Dương Kinh', 'Phường Thủy Nguyên',
      'Phường An Dương', 'Phường An Lão', 'Phường Kiến Thụy', 'Phường Tiên Lãng',
      'Phường Vĩnh Bảo', 'Phường Cát Hải', 'Phường Bắc Sơn', 'Phường Đông Hải'
    ]
  },
  {
    id: 'can-tho',
    name: 'Cần Thơ',
    wards: [
      'Phường Ninh Kiều', 'Phường Bình Thủy', 'Phường Cái Răng', 'Phường Ô Môn',
      'Phường Thốt Nốt', 'Phường Phong Điền', 'Phường Cờ Đỏ', 'Phường Thới Lai',
      'Phường Vĩnh Thạnh', 'Phường An Bình', 'Phường Cái Khế', 'Phường Xuân Khánh',
      'Phường Hưng Lợi', 'Phường Ba Láng', 'Phường Thường Thạnh', 'Phường Long Hòa'
    ]
  },
  {
    id: 'binh-duong',
    name: 'Bình Dương',
    wards: [
      'Phường Thủ Dầu Một', 'Phường Dĩ An', 'Phường Thuận An', 'Phường Tân Uyên',
      'Phường Bến Cát', 'Phường Bàu Bàng', 'Phường Dầu Tiếng', 'Phường Phú Giáo',
      'Phường Bình An', 'Phường Lái Thiêu', 'Phường An Phú', 'Phường Hiệp An',
      'Phường Phú Hòa', 'Phường Phú Thọ', 'Phường Tân Hiệp', 'Phường Hòa Phú'
    ]
  },
  {
    id: 'dong-nai',
    name: 'Đồng Nai',
    wards: [
      'Phường Biên Hòa', 'Phường Long Khánh', 'Phường Nhơn Trạch', 'Phường Long Thành',
      'Phường Trảng Bom', 'Phường Thống Nhất', 'Phường Cẩm Mỹ', 'Phường Vĩnh Cửu',
      'Phường Định Quán', 'Phường Tân Phú', 'Phường Xuân Lộc', 'Phường Trảng Dài',
      'Phường Quang Vinh', 'Phường Tân Hiệp', 'Phường Hóa An', 'Phường Long Bình'
    ]
  },
  {
    id: 'ba-ria-vung-tau',
    name: 'Bà Rịa - Vũng Tàu',
    wards: [
      'Phường Vũng Tàu', 'Phường Bà Rịa', 'Phường Phú Mỹ', 'Phường Xuyên Mộc',
      'Phường Long Điền', 'Phường Đất Đỏ', 'Phường Châu Đức', 'Phường Côn Đảo',
      'Phường Phước Hưng', 'Phường Ngãi Giao', 'Phường Hòa Long', 'Phường Kim Dinh'
    ]
  },
  {
    id: 'khanh-hoa',
    name: 'Khánh Hòa',
    wards: [
      'Phường Nha Trang', 'Phường Cam Ranh', 'Phường Ninh Hòa', 'Phường Diên Khánh',
      'Phường Khánh Vĩnh', 'Phường Khánh Sơn', 'Phường Trường Sa', 'Phường Vạn Ninh',
      'Phường Cam Lâm', 'Phường Vĩnh Nguyên', 'Phường Vĩnh Hải', 'Phường Vĩnh Thọ',
      'Phường Phước Long', 'Phường Phước Hải', 'Phường Lộc Thọ', 'Phường Tân Lập'
    ]
  },
  {
    id: 'lam-dong',
    name: 'Lâm Đồng',
    wards: [
      'Phường Đà Lạt', 'Phường Bảo Lộc', 'Phường Di Linh', 'Phường Bảo Lâm',
      'Phường Đức Trọng', 'Phường Đơn Dương', 'Phường Lạc Dương', 'Phường Lâm Hà',
      'Phường Đam Rông', 'Phường Đạ Huoai', 'Phường Đạ Tẻh', 'Phường Cát Tiên',
      'Phường 1 Đà Lạt', 'Phường 2 Đà Lạt', 'Phường 3 Đà Lạt', 'Phường 4 Đà Lạt'
    ]
  },
  {
    id: 'binh-thuan',
    name: 'Bình Thuận',
    wards: [
      'Phường Phan Thiết', 'Phường La Gi', 'Phường Tuy Phong', 'Phường Bắc Bình',
      'Phường Hàm Thuận Bắc', 'Phường Hàm Thuận Nam', 'Phường Tánh Linh', 'Phường Đức Linh',
      'Phường Hàm Tân', 'Phường Phú Quý', 'Phường Mũi Né', 'Phường Phú Hài',
      'Phường Lạc Đạo', 'Phường Xuân An', 'Phường Bình Hưng', 'Phường Đức Long'
    ]
  },
  {
    id: 'ninh-thuan',
    name: 'Ninh Thuận',
    wards: [
      'Phường Phan Rang - Tháp Chàm', 'Phường Ninh Sơn', 'Phường Ninh Hải',
      'Phường Ninh Phước', 'Phường Bác Ái', 'Phường Thuận Nam', 'Phường Đô Vinh',
      'Phường Đông Hải', 'Phường Kinh Dinh', 'Phường Mỹ Bình', 'Phường Mỹ Đông', 'Phường Tân Sơn'
    ]
  },
  {
    id: 'binh-phuoc',
    name: 'Bình Phước',
    wards: [
      'Phường Đồng Xoài', 'Phường Bình Long', 'Phường Phước Long', 'Phường Bù Đốp',
      'Phường Bù Đăng', 'Phường Chơn Thành', 'Phường Đồng Phú', 'Phường Hớn Quản',
      'Phường Lộc Ninh', 'Phường Tân Phú', 'Phường Tiến Thành', 'Phường Đồng Tiến'
    ]
  },
  {
    id: 'tay-ninh',
    name: 'Tây Ninh',
    wards: [
      'Phường Tây Ninh', 'Phường Hòa Thành', 'Phường Gò Dầu', 'Phường Bến Cầu',
      'Phường Trảng Bàng', 'Phường Dương Minh Châu', 'Phường Châu Thành', 'Phường Tân Biên',
      'Phường Tân Châu', 'Phường Ninh Sơn', 'Phường Phước Ninh', 'Phường Ninh Kiều'
    ]
  },
  {
    id: 'long-an',
    name: 'Long An',
    wards: [
      'Phường Tân An', 'Phường Kiến Tường', 'Phường Bến Lức', 'Phường Cần Đước',
      'Phường Cần Giuộc', 'Phường Châu Thành', 'Phường Đức Hòa', 'Phường Đức Huệ',
      'Phường Mộc Hóa', 'Phường Tân Hưng', 'Phường Tân Thạnh', 'Phường Thạnh Hóa',
      'Phường Thủ Thừa', 'Phường Tân Trụ', 'Phường Vĩnh Hưng', 'Phường Tân Phước'
    ]
  },
  {
    id: 'tien-giang',
    name: 'Tiền Giang',
    wards: [
      'Phường Mỹ Tho', 'Phường Gò Công', 'Phường Cai Lậy', 'Phường Châu Thành',
      'Phường Chợ Gạo', 'Phường Gò Công Đông', 'Phường Gò Công Tây', 'Phường Tân Phú Đông',
      'Phường Tân Phước', 'Phường Cái Bè', 'Phường Bình Đức', 'Phường Mỹ Phong'
    ]
  },
  {
    id: 'ben-tre',
    name: 'Bến Tre',
    wards: [
      'Phường Bến Tre', 'Phường Ba Tri', 'Phường Bình Đại', 'Phường Châu Thành',
      'Phường Chợ Lách', 'Phường Giồng Trôm', 'Phường Mỏ Cày Bắc', 'Phường Mỏ Cày Nam',
      'Phường Thạnh Phú', 'Phường Phú Hưng', 'Phường An Hội', 'Phường Phú Khương'
    ]
  },
  {
    id: 'tra-vinh',
    name: 'Trà Vinh',
    wards: [
      'Phường Trà Vinh', 'Phường Càng Long', 'Phường Cầu Kè', 'Phường Cầu Ngang',
      'Phường Châu Thành', 'Phường Duyên Hải', 'Phường Tiểu Cần', 'Phường Trà Cú',
      'Phường 1 Trà Vinh', 'Phường 2 Trà Vinh', 'Phường 3 Trà Vinh', 'Phường 4 Trà Vinh'
    ]
  },
  {
    id: 'vinh-long',
    name: 'Vĩnh Long',
    wards: [
      'Phường Vĩnh Long', 'Phường Bình Minh', 'Phường Long Hồ', 'Phường Mang Thít',
      'Phường Tam Bình', 'Phường Trà Ôn', 'Phường Vũng Liêm', 'Phường 1 Vĩnh Long',
      'Phường 2 Vĩnh Long', 'Phường 3 Vĩnh Long', 'Phường 4 Vĩnh Long', 'Phường 5 Vĩnh Long'
    ]
  },
  {
    id: 'dong-thap',
    name: 'Đồng Tháp',
    wards: [
      'Phường Cao Lãnh', 'Phường Sa Đéc', 'Phường Hồng Ngự', 'Phường Cao Lãnh (H)',
      'Phường Châu Thành', 'Phường Lai Vung', 'Phường Lấp Vò', 'Phường Tam Nông',
      'Phường Tân Hồng', 'Phường Thanh Bình', 'Phường Tháp Mười', 'Phường Mỹ An'
    ]
  },
  {
    id: 'an-giang',
    name: 'An Giang',
    wards: [
      'Phường Long Xuyên', 'Phường Châu Đốc', 'Phường Tân Châu', 'Phường An Phú',
      'Phường Châu Phú', 'Phường Châu Thành', 'Phường Chợ Mới', 'Phường Phú Tân',
      'Phường Thoại Sơn', 'Phường Tịnh Biên', 'Phường Tri Tôn', 'Phường Bình Khánh'
    ]
  },
  {
    id: 'kien-giang',
    name: 'Kiên Giang',
    wards: [
      'Phường Rạch Giá', 'Phường Hà Tiên', 'Phường Phú Quốc', 'Phường An Biên',
      'Phường An Minh', 'Phường Châu Thành', 'Phường Giang Thành', 'Phường Giồng Riềng',
      'Phường Gò Quao', 'Phường Hòn Đất', 'Phường Kiên Hải', 'Phường Kiên Lương',
      'Phường Tân Hiệp', 'Phường U Minh Thượng', 'Phường Vĩnh Thuận', 'Phường Dương Đông'
    ]
  },
  {
    id: 'hau-giang',
    name: 'Hậu Giang',
    wards: [
      'Phường Vị Thanh', 'Phường Ngã Bảy', 'Phường Châu Thành', 'Phường Châu Thành A',
      'Phường Long Mỹ', 'Phường Phụng Hiệp', 'Phường Vị Thủy', 'Phường 1 Vị Thanh',
      'Phường 3 Vị Thanh', 'Phường 4 Vị Thanh', 'Phường 5 Vị Thanh', 'Phường 7 Vị Thanh'
    ]
  },
  {
    id: 'soc-trang',
    name: 'Sóc Trăng',
    wards: [
      'Phường Sóc Trăng', 'Phường Vĩnh Châu', 'Phường Ngã Năm', 'Phường Châu Thành',
      'Phường Cù Lao Dung', 'Phường Kế Sách', 'Phường Long Phú', 'Phường Mỹ Tú',
      'Phường Mỹ Xuyên', 'Phường Thạnh Trị', 'Phường Trần Đề', 'Phường 1 Sóc Trăng'
    ]
  },
  {
    id: 'bac-lieu',
    name: 'Bạc Liêu',
    wards: [
      'Phường Bạc Liêu', 'Phường Giá Rai', 'Phường Đông Hải', 'Phường Hòa Bình',
      'Phường Hồng Dân', 'Phường Phước Long', 'Phường Vĩnh Lợi', 'Phường 1 Bạc Liêu',
      'Phường 2 Bạc Liêu', 'Phường 3 Bạc Liêu', 'Phường 5 Bạc Liêu', 'Phường 7 Bạc Liêu'
    ]
  },
  {
    id: 'ca-mau',
    name: 'Cà Mau',
    wards: [
      'Phường Cà Mau', 'Phường Năm Căn', 'Phường Sông Đốc', 'Phường Cái Nước',
      'Phường Đầm Dơi', 'Phường Ngọc Hiển', 'Phường Phú Tân', 'Phường Thới Bình',
      'Phường Trần Văn Thời', 'Phường U Minh', 'Phường 1 Cà Mau', 'Phường 2 Cà Mau'
    ]
  },
  {
    id: 'nghe-an',
    name: 'Nghệ An',
    wards: [
      'Phường Vinh', 'Phường Cửa Lò', 'Phường Thái Hòa', 'Phường Hoàng Mai',
      'Phường Anh Sơn', 'Phường Con Cuông', 'Phường Diễn Châu', 'Phường Đô Lương',
      'Phường Hưng Nguyên', 'Phường Kỳ Sơn', 'Phường Nam Đàn', 'Phường Nghĩa Đàn',
      'Phường Nghi Lộc', 'Phường Quế Phong', 'Phường Quỳ Châu', 'Phường Quỳ Hợp'
    ]
  },
  {
    id: 'thanh-hoa',
    name: 'Thanh Hóa',
    wards: [
      'Phường Thanh Hóa', 'Phường Bỉm Sơn', 'Phường Sầm Sơn', 'Phường Bá Thước',
      'Phường Cẩm Thủy', 'Phường Hà Trung', 'Phường Hậu Lộc', 'Phường Hoằng Hóa',
      'Phường Lang Chánh', 'Phường Mường Lát', 'Phường Nga Sơn', 'Phường Ngọc Lặc',
      'Phường Như Thanh', 'Phường Như Xuân', 'Phường Nông Cống', 'Phường Quan Hóa'
    ]
  },
  {
    id: 'quang-ninh',
    name: 'Quảng Ninh',
    wards: [
      'Phường Hạ Long', 'Phường Móng Cái', 'Phường Cẩm Phả', 'Phường Uông Bí',
      'Phường Đông Triều', 'Phường Quảng Yên', 'Phường Ba Chẽ', 'Phường Bình Liêu',
      'Phường Cô Tô', 'Phường Đầm Hà', 'Phường Hải Hà', 'Phường Hoành Bồ',
      'Phường Tiên Yên', 'Phường Vân Đồn', 'Phường Bãi Cháy', 'Phường Hà Khánh'
    ]
  },
  {
    id: 'bac-giang',
    name: 'Bắc Giang',
    wards: [
      'Phường Bắc Giang', 'Phường Lạng Giang', 'Phường Lục Nam', 'Phường Lục Ngạn',
      'Phường Sơn Động', 'Phường Tân Yên', 'Phường Việt Yên', 'Phường Yên Dũng',
      'Phường Yên Thế', 'Phường Hiệp Hòa', 'Phường Ngô Quyền', 'Phường Trần Nguyên Hãn'
    ]
  },
  {
    id: 'thai-nguyen',
    name: 'Thái Nguyên',
    wards: [
      'Phường Thái Nguyên', 'Phường Sông Công', 'Phường Phổ Yên', 'Phường Đại Từ',
      'Phường Định Hóa', 'Phường Đồng Hỷ', 'Phường Phú Bình', 'Phường Phú Lương',
      'Phường Võ Nhai', 'Phường Tân Cương', 'Phường Quang Trung', 'Phường Hoàng Văn Thụ'
    ]
  },
  {
    id: 'phu-tho',
    name: 'Phú Thọ',
    wards: [
      'Phường Việt Trì', 'Phường Phú Thọ', 'Phường Cẩm Khê', 'Phường Đoan Hùng',
      'Phường Hạ Hòa', 'Phường Lâm Thao', 'Phường Phù Ninh', 'Phường Tam Nông',
      'Phường Tân Sơn', 'Phường Thanh Ba', 'Phường Thanh Sơn', 'Phường Thanh Thủy',
      'Phường Yên Lập', 'Phường Vân Cơ', 'Phường Nông Trang', 'Phường Tiên Cát'
    ]
  },
  {
    id: 'ha-tinh',
    name: 'Hà Tĩnh',
    wards: [
      'Phường Hà Tĩnh', 'Phường Hồng Lĩnh', 'Phường Vũ Quang', 'Phường Can Lộc',
      'Phường Cẩm Xuyên', 'Phường Đức Thọ', 'Phường Hương Khê', 'Phường Hương Sơn',
      'Phường Kỳ Anh', 'Phường Lộc Hà', 'Phường Nghi Xuân', 'Phường Thạch Hà',
      'Phường Bắc Hà', 'Phường Nam Hà', 'Phường Tân Giang', 'Phường Trần Phú'
    ]
  },
  {
    id: 'quang-binh-quang-tri',
    name: 'Quảng Bình - Quảng Trị',
    wards: [
      'Phường Đồng Hới', 'Phường Đông Hà', 'Phường Quảng Trị', 'Phường Ba Đồn',
      'Phường Bố Trạch', 'Phường Cam Lộ', 'Phường Đakrông', 'Phường Gio Linh',
      'Phường Hải Lăng', 'Phường Hướng Hóa', 'Phường Lệ Thủy', 'Phường Minh Hóa',
      'Phường Quảng Ninh', 'Phường Triệu Phong', 'Phường Tuyên Hóa', 'Phường Vĩnh Linh'
    ]
  },
  {
    id: 'thua-thien-hue',
    name: 'Thừa Thiên Huế',
    wards: [
      'Phường Huế', 'Phường Hương Thủy', 'Phường Hương Trà', 'Phường A Lưới',
      'Phường Nam Đông', 'Phường Phong Điền', 'Phường Phú Lộc', 'Phường Phú Vang',
      'Phường Quảng Điền', 'Phường Phú Hội', 'Phường Phú Hậu', 'Phường Kim Long',
      'Phường Thuận Thành', 'Phường Tây Lộc', 'Phường Vỹ Dạ', 'Phường An Đông'
    ]
  }
]

/**
 * Tìm tỉnh theo id hoặc tên
 */
export const findProvince = (idOrName) => {
  if (!idOrName) return null
  const normalized = idOrName.toLowerCase()
  return VIETNAM_PROVINCES.find(
    (p) => p.id === normalized || p.name.toLowerCase() === normalized
  )
}
