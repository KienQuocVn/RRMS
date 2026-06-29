export const DASHBOARD_COLORS = {
  primary: '#20a9e7',
  primaryHover: '#2b7ed7',
  warning: '#BA7517',
  warningChart: '#EF9F27',
  danger: '#E24B4A',
  muted: '#B4B2A9',
  pageBg: '#f5f7fa',
  cardBg: '#ffffff',
  border: '#e5e7eb',
  textMuted: '#6b7280',
  textDark: '#111827',
  success: '#16a34a',
  purple: '#7c3aed',
  orange: '#ea580c',
  green: '#22c55e'
}

export const MONTH_LABELS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']

export const POST_STATUS_CONFIG = [
  { key: 'approved', label: 'Đã duyệt', color: DASHBOARD_COLORS.primary },
  { key: 'pending', label: 'Chờ duyệt', color: DASHBOARD_COLORS.warningChart },
  { key: 'rejected', label: 'Từ chối', color: DASHBOARD_COLORS.danger },
  { key: 'hidden', label: 'Đã ẩn', color: DASHBOARD_COLORS.muted }
]

export const dashboardCardSx = {
  bgcolor: DASHBOARD_COLORS.cardBg,
  borderRadius: '12px',
  border: `0.5px solid ${DASHBOARD_COLORS.border}`,
  boxShadow: 'none'
}
