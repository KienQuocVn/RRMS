import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography
} from '@mui/material'

const REPORT_SCOPE_OPTIONS = [
  { value: 'month', label: 'Tổng kết theo tháng' },
  { value: 'quarter', label: 'Tổng kết theo quý' },
  { value: 'year', label: 'Tổng kết theo năm' },
  { value: 'day', label: 'Tổng kết theo ngày' }
]

const REPORT_VIEW_OPTIONS = [
  { value: 'detail', label: 'Báo cáo chi tiết' },
  { value: 'month', label: 'Báo cáo theo tháng' }
]

const getFilterCardStyles = (isActive) => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  minHeight: 42,
  px: 1.25,
  py: 0.75,
  borderRadius: 2,
  border: '1px solid',
  borderColor: isActive ? '#20a9e7' : '#d8e1eb',
  backgroundColor: isActive ? '#eff8ff' : '#fff',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#20a9e7',
    backgroundColor: '#f8fcff'
  }
})

const getBadgeStyles = (backgroundColor) => ({
  position: 'absolute',
  top: -11,
  right: 8,
  minWidth: 20,
  height: 20,
  px: 0.5,
  borderRadius: 999,
  backgroundColor,
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 6px 14px rgba(15, 23, 42, 0.15)'
})

const FilterCard = ({ active, label, count, badgeColor, onClick, checked, icon }) => {
  return (
    <Box onClick={onClick} sx={getFilterCardStyles(active)}>
      {typeof count === 'number' ? <Box sx={getBadgeStyles(badgeColor)}>{count}</Box> : null}
      {icon}
      {typeof checked === 'boolean' ? (
        <Checkbox checked={checked} size="small" sx={{ p: 0.25, pointerEvents: 'none' }} />
      ) : null}
      <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155' }}>
        {label}
      </Typography>
    </Box>
  )
}

const MultiSelectField = ({ label, options, value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 210 } }}>
      <Select
        multiple
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={<OutlinedInput />}
        IconComponent={KeyboardArrowDownRoundedIcon}
        renderValue={(selected) => {
          if (!selected.length) return label
          return `${label}: ${selected.length}`
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              borderRadius: 2
            }
          }
        }}
        sx={{
          borderRadius: 2,
          backgroundColor: '#fff',
          '& .MuiSelect-select': {
            py: 1.15
          }
        }}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.includes(option)} size="small" />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const SingleSelectField = ({ label, value, onChange, options }) => {
  return (
    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 170 } }}>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        IconComponent={KeyboardArrowDownRoundedIcon}
        sx={{
          borderRadius: 2,
          backgroundColor: '#fff',
          '& .MuiSelect-select': {
            py: 1.15
          }
        }}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label || label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const actionButtonStyles = {
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 2,
  px: 2,
  py: 1,
  boxShadow: 'none'
}

const IncomeSummaryFilters = ({
  totalCount,
  receiptCount,
  expenseCount,
  paymentMethodOptions,
  selectedPaymentMethods,
  onSelectedPaymentMethodsChange,
  showReceipts,
  showExpenses,
  onToggleReceipts,
  onToggleExpenses,
  categories,
  includedCategories,
  excludedCategories,
  onIncludedCategoriesChange,
  onExcludedCategoriesChange,
  reportScope,
  reportView,
  onReportScopeChange,
  onReportViewChange,
  onResetFilters,
  onOpenExpense,
  onOpenReceipt,
  onPrint,
  onDownloadExcel,
  onManageCategories
}) => {
  return (
    <Box
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: '#d8e1eb',
        borderRadius: 2.5,
        backgroundColor: '#fff'
      }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', xl: 'center' }}>
          <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
            <FilterCard
              active={false}
              label=""
              count={totalCount}
              badgeColor="#20a9e7"
              onClick={onResetFilters}
              icon={<FilterAltOutlinedIcon sx={{ color: '#1f2937' }} />}
            />

            <FilterCard
              active={showReceipts}
              label="Tất cả khoản thu"
              count={receiptCount}
              badgeColor="#20a9e7"
              checked={showReceipts}
              onClick={onToggleReceipts}
            />

            <FilterCard
              active={showExpenses}
              label="Tất cả khoản chi"
              count={expenseCount}
              badgeColor="#ef4444"
              checked={showExpenses}
              onClick={onToggleExpenses}
            />

            {paymentMethodOptions.map((paymentMethod) => {
              const active = selectedPaymentMethods.includes(paymentMethod)
              return (
                <FilterCard
                  key={paymentMethod}
                  active={active}
                  label={paymentMethod}
                  checked={active}
                  onClick={() => {
                    if (active) {
                      onSelectedPaymentMethodsChange(selectedPaymentMethods.filter((item) => item !== paymentMethod))
                      return
                    }

                    onSelectedPaymentMethodsChange([...selectedPaymentMethods, paymentMethod])
                  }}
                />
              )
            })}
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
            <MultiSelectField
              label="Loại trừ danh mục"
              options={categories}
              value={excludedCategories}
              onChange={onExcludedCategoriesChange}
            />
            <MultiSelectField
              label="Lọc theo danh mục"
              options={categories}
              value={includedCategories}
              onChange={onIncludedCategoriesChange}
            />
            <SingleSelectField
              label="Tổng kết theo tháng"
              value={reportScope}
              onChange={onReportScopeChange}
              options={REPORT_SCOPE_OPTIONS}
            />
            <SingleSelectField
              label="Báo cáo chi tiết"
              value={reportView}
              onChange={onReportViewChange}
              options={REPORT_VIEW_OPTIONS}
            />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1.25}
          justifyContent="flex-end"
          alignItems={{ xs: 'stretch', lg: 'center' }}>
          <Button
            variant="contained"
            startIcon={<LibraryBooksOutlinedIcon />}
            onClick={onManageCategories}
            sx={{
              ...actionButtonStyles,
              backgroundColor: '#1f2937',
              '&:hover': { backgroundColor: '#111827' }
            }}>
            Quản lý danh mục
          </Button>

          <Button
            variant="contained"
            startIcon={<ReceiptLongOutlinedIcon />}
            onClick={onOpenExpense}
            sx={{
              ...actionButtonStyles,
              backgroundColor: '#facc15',
              color: '#111827',
              '&:hover': { backgroundColor: '#eab308' }
            }}>
            Thêm phiếu chi
          </Button>

          <Button
            variant="contained"
            startIcon={<AddCardOutlinedIcon />}
            onClick={onOpenReceipt}
            sx={{
              ...actionButtonStyles,
              backgroundColor: '#20a9e7',
              '&:hover': { backgroundColor: '#2b7ed7' }
            }}>
            Thêm phiếu thu
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintOutlinedIcon />}
            onClick={onPrint}
            sx={{
              ...actionButtonStyles,
              backgroundColor: '#20a9e7',
              '&:hover': { backgroundColor: '#2b7ed7' }
            }}>
            In thu/chi
          </Button>

          <Button
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={onDownloadExcel}
            sx={{
              ...actionButtonStyles,
              backgroundColor: '#20a9e7',
              '&:hover': { backgroundColor: '#2b7ed7' }
            }}>
            Xuất excel
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default IncomeSummaryFilters
