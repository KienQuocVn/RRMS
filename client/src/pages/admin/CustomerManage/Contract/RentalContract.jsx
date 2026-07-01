import React from 'react';
import { Box } from '@mui/material';
import ContractStatusBanner from './ContractStatusBanner';
import ContractDetailsCard from './ContractDetailsCard';
import TermsAndPartiesCard from './TermsAndPartiesCard';
import ContractHistoryTimeline from './ContractHistoryTimeline';

const RentalContract = () => {
  const handleDownloadPDF = () => {
    alert('Đang tải tệp Hợp đồng thuê phòng 102 dạng PDF...');
  };

  return (
    <Box sx={{ padding: '20px', bgcolor: '#f5f7fa', minHeight: '100%' }}>
      {/* Block 1 — Contract status banner */}
      <ContractStatusBanner onDownloadPDF={handleDownloadPDF} />

      {/* Block 2 — Main content (2 columns) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column — Chi tiết hợp đồng */}
        <ContractDetailsCard />

        {/* Right Column — Điều khoản & Thông tin các bên */}
        <TermsAndPartiesCard />
      </Box>

      {/* Block 3 — Lịch sử hợp đồng */}
      <ContractHistoryTimeline />
    </Box>
  );
};

export default RentalContract;
