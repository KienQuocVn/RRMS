import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Box, Typography } from '@mui/material';
import FilterBar from './FilterBar';
import BillSummaryCards from './BillSummaryCards';
import BillCardItem from './BillCardItem';
import CompactBillList from './CompactBillList';
import PaginationBar from './PaginationBar';
import EmptyState from './EmptyState';

const ALL_BILLS_2024 = [
  {
    id: 'b6',
    month: '06/2024',
    status: 'unpaid',
    dueDate: '05/06/2024',
    totalAmount: '6.250.000 đ',
    items: [
      { name: 'Tiền phòng (Phòng 302)', indexRange: '', quantity: '01', price: '5.500.000', total: '5.500.000' },
      { name: 'Tiền điện', indexRange: '1050 / 1180', quantity: '130 kWh', price: '4.000', total: '520.000' },
      { name: 'Tiền nước', indexRange: '210 / 225', quantity: '15 m³', price: '12.000', total: '180.000' },
      { name: 'Dịch vụ vệ sinh & Rác', indexRange: '', quantity: '01', price: '50.000', total: '50.000' }
    ]
  },
  {
    id: 'b5',
    month: '05/2024',
    status: 'paid',
    paymentDate: '02/05/2024',
    paymentMethod: 'bank',
    totalAmount: '6.120.000 đ',
    items: [
      { name: 'Tiền phòng (Phòng 302)', indexRange: '', quantity: '01', price: '5.500.000', total: '5.500.000' },
      { name: 'Tiền điện', indexRange: '920 / 1050', quantity: '130 kWh', price: '4.000', total: '520.000' },
      { name: 'Tiền nước', indexRange: '202 / 210', quantity: '8 m³', price: '12.000', total: '96.000' },
      { name: 'Dịch vụ vệ sinh & Rác', indexRange: '', quantity: '01', price: '4.000', total: '4.000' }
    ]
  },
  {
    id: 'b4',
    month: '04/2024',
    status: 'paid',
    paymentDate: '03/04/2024',
    paymentMethod: 'momo',
    totalAmount: '6.080.000 đ',
    items: [
      { name: 'Tiền phòng (Phòng 302)', indexRange: '', quantity: '01', price: '5.500.000', total: '5.500.000' },
      { name: 'Tiền điện', indexRange: '810 / 920', quantity: '110 kWh', price: '4.000', total: '440.000' },
      { name: 'Tiền nước', indexRange: '195 / 202', quantity: '7 m³', price: '12.000', total: '84.000' },
      { name: 'Dịch vụ vệ sinh & Rác', indexRange: '', quantity: '01', price: '56.000', total: '56.000' }
    ]
  }
];

const COMPACT_BILLS_2024 = [
  { monthCompact: '03/24', totalAmount: '6.150.000 đ', status: 'paid', payDate: '01/03' },
  { monthCompact: '02/24', totalAmount: '6.150.000 đ', status: 'paid', payDate: '05/02' },
  { monthCompact: '01/24', totalAmount: '6.300.000 đ', status: 'paid', payDate: '04/01' }
];

const MonthlyBills = () => {
  const [year, setYear] = useState('2024');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Xử lý lọc dữ liệu theo năm và trạng thái
  const getFilteredData = () => {
    if (year !== '2024') {
      return { cardBills: [], compactBills: [] };
    }

    let cardBills = [...ALL_BILLS_2024];
    let compactBills = [...COMPACT_BILLS_2024];

    if (status === 'unpaid') {
      cardBills = cardBills.filter(b => b.status === 'unpaid');
      compactBills = [];
    } else if (status === 'paid') {
      cardBills = cardBills.filter(b => b.status === 'paid');
      // compactBills đều là paid nên giữ nguyên
    } else if (status === 'overdue') {
      // Trong ví dụ này, chỉ có hóa đơn tháng 6 chưa đóng (và đã qua hạn 05/06) là overdue
      cardBills = cardBills.filter(b => b.status === 'unpaid');
      compactBills = [];
    }

    return { cardBills, compactBills };
  };

  const { cardBills, compactBills } = getFilteredData();
  const hasData = cardBills.length > 0 || compactBills.length > 0;

  const handleExportExcel = () => {
    const { cardBills, compactBills } = getFilteredData();
    const allBillsData = [];

    // Map dữ liệu từ cardBills
    cardBills.forEach(bill => {
      allBillsData.push({
        'Tháng': bill.month,
        'Trạng thái': bill.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
        'Ngày thanh toán / Hạn thanh toán': bill.paymentDate || bill.dueDate || 'N/A',
        'Phương thức': bill.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : bill.paymentMethod === 'momo' ? 'Momo' : 'N/A',
        'Tổng tiền': bill.totalAmount
      });
    });

    // Map dữ liệu từ compactBills
    compactBills.forEach(bill => {
      allBillsData.push({
        'Tháng': bill.monthCompact,
        'Trạng thái': bill.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
        'Ngày thanh toán / Hạn thanh toán': bill.payDate || 'N/A',
        'Phương thức': 'N/A',
        'Tổng tiền': bill.totalAmount
      });
    });

    if (allBillsData.length === 0) {
      alert('Không có dữ liệu hóa đơn để xuất Excel cho năm ' + year);
      return;
    }

    const ws = XLSX.utils.json_to_sheet(allBillsData);

    // Tự động căn chỉnh độ rộng cột
    const colWidths = Object.keys(allBillsData[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...allBillsData.map(row => String(row[key] || '').length)
      )
      return { wch: maxLength + 2 };
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hóa đơn');
    XLSX.writeFile(wb, `Bao_cao_hoa_don_nam_${year}.xlsx`);
  };

  const handleViewBillDetails = (bill) => {
    alert(`Đang mở chi tiết hóa đơn Tháng ${bill.monthCompact || bill.month}`);
  };

  return (
    <Box sx={{ padding: '20px', bgcolor: '#f5f7fa', minHeight: '100%' }}>
      {/* Block 1 — Filter bar */}
      <FilterBar
        year={year}
        setYear={setYear}
        status={status}
        setStatus={setStatus}
        onExportExcel={handleExportExcel}
      />

      {/* Block 2 — Summary stat cards */}
      <BillSummaryCards
        paidTotal={year === '2024' ? '24.500.000 đ' : '0 đ'}
        pendingTotal={year === '2024' && (status === 'all' || status === 'unpaid') ? '6.250.000 đ' : '0 đ'}
        overdueTotal="0 đ"
      />

      {/* Block 3 — Danh sách hóa đơn */}
      <Box sx={{ marginTop: '20px' }}>
        {hasData ? (
          <>
            {/* Header Danh sách */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '12px' }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>
                Danh sách hóa đơn
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                Hiển thị 5 tháng gần nhất
              </Typography>
            </Box>

            {/* Các hóa đơn dạng Card mở rộng */}
            {cardBills.map((bill) => (
              <BillCardItem
                key={bill.id}
                bill={bill}
                defaultExpanded={bill.status === 'unpaid'} // Mở mặc định cho chưa thanh toán
              />
            ))}

            {/* Các hóa đơn dạng Compact (chỉ hiển thị khi bộ lọc cho phép hóa đơn đã thanh toán) */}
            {compactBills.length > 0 && (
              <CompactBillList
                compactBills={compactBills}
                onViewBill={handleViewBillDetails}
              />
            )}

            {/* Block 4 — Pagination */}
            <PaginationBar currentPage={page} onPageChange={(p) => setPage(p)} />
          </>
        ) : (
          <EmptyState />
        )}
      </Box>
    </Box>
  );
};

export default MonthlyBills;
