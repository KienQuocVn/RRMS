import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Box, Typography, CircularProgress } from '@mui/material';
import FilterBar from './FilterBar';
import BillSummaryCards from './BillSummaryCards';
import BillCardItem from './BillCardItem';
import CompactBillList from './CompactBillList';
import PaginationBar from './PaginationBar';
import EmptyState from './EmptyState';
import { useMotel } from '~/hooks/useMotel';
import { fetchInvoices } from '~/apis/invoiceAPI';

/* ── Helpers ── */
const fmtVND = (val) => {
  if (val == null) return '0 đ';
  return Number(val).toLocaleString('vi-VN') + ' đ';
};

const fmtDate = (str) => {
  if (!str) return null;
  try { return new Date(str).toLocaleDateString('vi-VN'); } catch { return str; }
};

const fmtMonth = (str) => {
  if (!str) return null;
  try {
    const d = new Date(str);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  } catch { return str; }
};

const PAGE_SIZE = 10;

const ErrorAlert = ({ message }) => (
  <Box sx={{ bgcolor: '#fff7ed', border: '0.5px solid #fed7aa', borderRadius: 2, p: 2, mt: 2 }}>
    <Typography sx={{ fontSize: 13, color: '#7c2d12' }}>{message}</Typography>
  </Box>
);

/* ── Normalize API invoice → internal bill shape ── */
const normalizeInvoice = (inv) => {
  const status = inv.status === 'PAID' ? 'paid'
    : inv.status === 'OVERDUE' ? 'overdue'
    : 'unpaid';

  const items = [];
  if (inv.roomFee != null) items.push({ name: 'Tiền phòng', indexRange: '', quantity: '01', price: Number(inv.roomFee).toLocaleString('vi-VN'), total: Number(inv.roomFee).toLocaleString('vi-VN') });
  if (inv.electricityFee != null) {
    const kwhOld = inv.electricityOldIndex ?? '';
    const kwhNew = inv.electricityNewIndex ?? '';
    const range = kwhOld && kwhNew ? `${kwhOld} / ${kwhNew}` : '';
    const qty = kwhOld && kwhNew ? `${kwhNew - kwhOld} kWh` : '—';
    items.push({ name: 'Tiền điện', indexRange: range, quantity: qty, price: '', total: Number(inv.electricityFee).toLocaleString('vi-VN') });
  }
  if (inv.waterFee != null) {
    const wOld = inv.waterOldIndex ?? '';
    const wNew = inv.waterNewIndex ?? '';
    const range = wOld && wNew ? `${wOld} / ${wNew}` : '';
    const qty = wOld && wNew ? `${wNew - wOld} m³` : '—';
    items.push({ name: 'Tiền nước', indexRange: range, quantity: qty, price: '', total: Number(inv.waterFee).toLocaleString('vi-VN') });
  }
  if (inv.internetFee != null) items.push({ name: 'Internet', indexRange: '', quantity: '01', price: '', total: Number(inv.internetFee).toLocaleString('vi-VN') });
  if (inv.garbageFee != null) items.push({ name: 'Dịch vụ vệ sinh & Rác', indexRange: '', quantity: '01', price: '', total: Number(inv.garbageFee).toLocaleString('vi-VN') });

  // Fallback: nếu server trả items array
  const rawItems = inv.items ?? inv.invoiceDetails ?? [];
  const finalItems = items.length > 0 ? items : rawItems.map(i => ({
    name: i.label ?? i.name ?? i.serviceName ?? '',
    indexRange: i.indexRange ?? '',
    quantity: i.quantity ?? '01',
    price: i.price ?? '',
    total: i.amount != null ? Number(i.amount).toLocaleString('vi-VN') : (i.total ?? '')
  }));

  return {
    id: inv.invoiceId ?? inv.id ?? String(Math.random()),
    month: fmtMonth(inv.invoiceMonth ?? inv.createdAt ?? inv.invoiceCreateDate),
    status,
    dueDate: fmtDate(inv.dueDate),
    paymentDate: fmtDate(inv.paymentDate ?? inv.paidDate),
    paymentMethod: inv.paymentMethod ?? inv.method ?? null,
    totalAmount: fmtVND(inv.totalAmount ?? inv.amount),
    items: finalItems,
    _raw: inv,
  };
};

/* ── Main Component ── */
const MonthlyBills = () => {
  const { motels } = useMotel();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [allBills, setAllBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const motelId = motels?.[0]?.motelId ?? motels?.[0]?.contract?.room?.motelId ?? null;
  const roomId = motels?.[0]?.roomId ?? motels?.[0]?.room?.roomId ?? motels?.[0]?.contract?.room?.roomId ?? null;

  const loadBills = useCallback(async () => {
    if (!motelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: page - 1,
        size: PAGE_SIZE,
        sortBy: 'invoiceCreateDate',
        sortDirection: 'DESC',
        year: Number(year),
      };
      if (status !== 'all') params.status = status.toUpperCase();

      let res = await fetchInvoices(motelId, params);
      const items = res?.result?.items ?? res?.items ?? res?.result ?? [];
      const tenantInvoices = Array.isArray(items) && roomId
        ? items.filter((invoice) => (invoice?.roomId ?? invoice?.room?.roomId) === roomId)
        : items;
      const tp = res?.result?.totalPages ?? res?.totalPages ?? 1;

      setAllBills(Array.isArray(tenantInvoices) ? tenantInvoices.map(normalizeInvoice) : []);
      setTotalPages(roomId ? Math.max(1, Math.ceil(tenantInvoices.length / PAGE_SIZE)) : tp);
    } catch (err) {
      console.error('MonthlyBills fetch error:', err);
      setError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [motelId, roomId, year, status, page]);

  useEffect(() => { loadBills(); }, [loadBills]);
  useEffect(() => { setPage(1); }, [year, status]);

  /* ── Summary stats ── */
  const paidBills = allBills.filter(b => b.status === 'paid');
  const pendingBills = allBills.filter(b => b.status === 'unpaid');
  const overdueBills = allBills.filter(b => b.status === 'overdue');

  const sumAmt = (bills) => {
    const total = bills.reduce((acc, b) => {
      const n = Number(b._raw?.totalAmount ?? b._raw?.amount ?? 0);
      return acc + (isNaN(n) ? 0 : n);
    }, 0);
    return fmtVND(total);
  };

  /* ── Export Excel ── */
  const handleExportExcel = () => {
    const data = allBills.map(bill => ({
      'Tháng': bill.month,
      'Trạng thái': bill.status === 'paid' ? 'Đã thanh toán' : bill.status === 'overdue' ? 'Quá hạn' : 'Chưa thanh toán',
      'Ngày thanh toán / Hạn thanh toán': bill.paymentDate || bill.dueDate || 'N/A',
      'Phương thức': bill.paymentMethod ?? 'N/A',
      'Tổng tiền': bill.totalAmount,
    }));

    if (data.length === 0) {
      alert('Không có dữ liệu hóa đơn để xuất.');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const colWidths = Object.keys(data[0]).map(key => ({
      wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length)) + 2,
    }));
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hóa đơn');
    XLSX.writeFile(wb, `Bao_cao_hoa_don_nam_${year}.xlsx`);
  };

  const handleViewBillDetails = (bill) => {
    alert(`Đang mở chi tiết hóa đơn Tháng ${bill.monthCompact || bill.month}`);
  };

  const hasData = allBills.length > 0;

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
      {!loading && !error && (
        <BillSummaryCards
          paidTotal={sumAmt(paidBills)}
          pendingTotal={sumAmt(pendingBills)}
          overdueTotal={sumAmt(overdueBills)}
          paidCount={paidBills.length}
          pendingCount={pendingBills.length}
          year={year}
        />
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Error */}
      {!loading && error && <ErrorAlert message={error} />}

      {/* No motel */}
      {!loading && !error && !motelId && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontSize: 14, color: '#9ca3af' }}>
            Bạn chưa có thông tin nhà trọ để xem hóa đơn.
          </Typography>
        </Box>
      )}

      {/* Block 3 — Danh sách hóa đơn */}
      {!loading && !error && motelId && (
        <Box sx={{ marginTop: '20px' }}>
          {hasData ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '12px' }}>
                <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>
                  Danh sách hóa đơn
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                  {allBills.length} hóa đơn
                </Typography>
              </Box>

              {allBills.map((bill) => (
                <BillCardItem
                  key={bill.id}
                  bill={bill}
                  defaultExpanded={bill.status === 'unpaid' || bill.status === 'overdue'}
                />
              ))}

              <PaginationBar
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MonthlyBills;
