import { Box } from '@mui/material'
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'
import EmptyInvoiceState from './EmptyInvoiceState'

const PRIMARY = '#20a9e7'

const InvoiceTable = ({ columns, data, options }) => {
  return (
    <Box
      sx={{
        mt: 2,
        position: 'relative',
        '& .tabulator': {
          border: '1px solid #e8f4fd',
          borderRadius: '10px',
          overflow: 'hidden',
          fontSize: '0.82rem',
        },
        '& .tabulator .tabulator-header': {
          backgroundColor: '#f0f8ff',
          borderBottom: `2px solid ${PRIMARY}`,
        },
        '& .tabulator .tabulator-header .tabulator-col': {
          backgroundColor: '#f0f8ff',
          color: '#1a1a2e',
          fontWeight: 700,
          fontSize: '0.8rem',
          borderRight: '1px solid #e0eefc',
        },
        '& .tabulator .tabulator-header .tabulator-col-title': {
          whiteSpace: 'normal',
          lineHeight: 1.3,
        },
        '& .tabulator-row': {
          borderBottom: '1px solid #f0f4f8',
          transition: 'background-color 0.15s',
        },
        '& .tabulator-row:hover': {
          backgroundColor: '#f7fbff',
        },
        '& .tabulator-row.tabulator-row-even': {
          backgroundColor: '#fafcff',
        },
        '& .tabulator-cell': {
          borderRight: '1px solid #eef3f8',
          padding: '8px 6px',
          color: '#333',
        },
        '& .tabulator-placeholder': {
          display: 'none',
        },
        '& .icon-menu-action': {
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          margin: '0 auto',
          transition: 'background 0.2s',
        },
        '& .icon-menu-action:hover': {
          backgroundColor: '#e3f2fd',
          color: PRIMARY,
        },
        '& .icon-first': {
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
        },
        '& .badge': {
          padding: '4px 10px',
          borderRadius: '20px',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.75rem',
          display: 'inline-block',
          whiteSpace: 'nowrap',
        },
        '& .tabulator-footer': {
          backgroundColor: '#f0f8ff',
          borderTop: `2px solid ${PRIMARY}`,
        },
      }}
    >
      {data.length === 0 ? (
        <Box
          sx={{
            border: '1px solid #e8f4fd',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          {/* Render header even when empty */}
          <Box
            sx={{
              backgroundColor: '#f0f8ff',
              borderBottom: `2px solid ${PRIMARY}`,
              display: 'none',
            }}
          />
          <EmptyInvoiceState />
        </Box>
      ) : (
        <ReactTabulator
          className="my-custom-table rounded"
          columns={columns}
          options={options}
          data={data}
          placeholder="Không tìm thấy dữ liệu!"
        />
      )}
    </Box>
  )
}

export default InvoiceTable
