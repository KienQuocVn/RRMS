import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Swal from 'sweetalert2'
import { getViolationReportStats, getViolationReports, resolveViolationReport } from '~/apis/violationReportAPI'
import ViolationEmptyState from './components/violationReports/ViolationEmptyState'
import ViolationFiltersBar from './components/violationReports/ViolationFiltersBar'
import ViolationReportDetailPanel from './components/violationReports/ViolationReportDetailPanel'
import ViolationReportsHeader from './components/violationReports/ViolationReportsHeader'
import ViolationReportsTable from './components/violationReports/ViolationReportsTable'
import ViolationResolveModal from './components/violationReports/ViolationResolveModal'
import ViolationStatsRow from './components/violationReports/ViolationStatsRow'
import { mapStatsToQuickStats } from './components/violationReports/violationReportConstants'

const DEFAULT_FILTERS = {
  status: 'Chờ xử lý',
  reason: 'Tất cả',
  subjectType: 'Tất cả',
  severity: 'Tất cả',
  time: '7 ngày'
}

const matchesSeverity = (reportCount, filter) => {
  if (filter === 'Tất cả') return true
  if (filter === 'Thấp (1-2 lần)') return reportCount >= 1 && reportCount <= 2
  if (filter === 'Trung bình (3-5 lần)') return reportCount >= 3 && reportCount <= 5
  if (filter === 'Cao (6-10 lần)') return reportCount >= 6 && reportCount <= 10
  return reportCount > 10
}

const matchesReason = (report, filter) => {
  if (filter === 'Tất cả') return true
  if (filter === 'Thông tin sai lệch') {
    return report.reason === 'Thông tin sai lệch' || report.reason === 'Giá không hợp lý'
  }
  return report.reason === filter
}

const parseReportDate = (report) => {
  const [datePart] = (report.createdAtLabel || '').split(' lúc ')
  if (!datePart) return null
  const [day, month, year] = datePart.split('/').map(Number)
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}

const matchesTime = (report, filter) => {
  if (filter === 'Tất cả') return true
  const reportDate = parseReportDate(report)
  if (!reportDate) return true

  const today = new Date()
  const diffDays = Math.floor((today - reportDate) / (1000 * 60 * 60 * 24))

  if (filter === 'Hôm nay') return diffDays === 0
  if (filter === '7 ngày') return diffDays <= 7
  if (filter === '30 ngày') return diffDays <= 30
  return true
}

const mapApiReport = (report) => ({
  ...report,
  id: report.caseKey
})

const ListSupports = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [reports, setReports] = useState([])
  const [quickStats, setQuickStats] = useState(mapStatsToQuickStats())
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [resolveModalReport, setResolveModalReport] = useState(null)

  const fetchReports = useCallback(async () => {
    try {
      const [reportsResponse, statsResponse] = await Promise.all([getViolationReports(), getViolationReportStats()])
      const nextReports = (reportsResponse?.result || []).map(mapApiReport)
      const stats = statsResponse?.result || {}

      setReports(nextReports)
      setQuickStats(mapStatsToQuickStats(stats))
    } catch (error) {
      console.error('Error fetching violation reports:', error)
      setReports([])
      setQuickStats(mapStatsToQuickStats())
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus = filters.status === 'Tất cả' || report.status === filters.status
      const matchesType = filters.subjectType === 'Tất cả' || report.subjectType === filters.subjectType
      const hasSearch =
        !searchValue.trim() ||
        [report.subjectTitle, report.latestContent, report.lastReporter?.name, report.reason]
          .join(' ')
          .toLowerCase()
          .includes(searchValue.toLowerCase())

      return (
        matchesStatus &&
        matchesType &&
        matchesReason(report, filters.reason) &&
        matchesSeverity(report.reportCount, filters.severity) &&
        matchesTime(report, filters.time) &&
        hasSearch
      )
    })
  }, [filters, reports, searchValue])

  useEffect(() => {
    setPage(0)
    setIsDetailOpen(false)
  }, [filters, searchValue])

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage
    return filteredReports.slice(start, start + rowsPerPage)
  }, [filteredReports, page, rowsPerPage])

  useEffect(() => {
    if (!filteredReports.length) {
      setSelectedRowId(null)
      setSelectedIds([])
      setIsDetailOpen(false)
      return
    }

    if (selectedRowId) {
      const selectedStillExists = filteredReports.some((report) => report.id === selectedRowId)
      if (!selectedStillExists) {
        setSelectedRowId(null)
        setIsDetailOpen(false)
      }
    }
  }, [filteredReports, selectedRowId])

  const selectedReport = filteredReports.find((report) => report.id === selectedRowId) || null

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setIsDetailOpen(false)
  }

  const handleRowSelect = (id) => {
    setSelectedRowId(id)
    setIsDetailOpen(true)
  }

  const handleToggleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleToggleSelectAll = (checked) => {
    if (!checked) {
      setSelectedIds([])
      return
    }
    setSelectedIds(paginatedRows.map((row) => row.id))
  }

  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      status: 'Tất cả',
      time: 'Tất cả'
    })
    setSearchValue('')
  }

  const handleResolveSubmit = async ({ action, adminNote, notificationMessage, lockDays }) => {
    if (!resolveModalReport?.caseKey) return

    try {
      await resolveViolationReport({
        caseKey: resolveModalReport.caseKey,
        action,
        adminNote,
        notificationMessage,
        lockDays
      })

      setResolveModalReport(null)
      await fetchReports()
      await Swal.fire('Thành công', 'Đã xử lý báo cáo vi phạm.', 'success')
    } catch (error) {
      console.error('Error resolving violation report:', error)
      Swal.fire('Lỗi', error?.response?.data?.message || 'Không thể xử lý báo cáo. Vui lòng thử lại.', 'error')
    }
  }

  return (
    <Box sx={{ px: { xs: 2, lg: 3 }, py: 2, background: '#f5f7fa', minHeight: '100%' }}>
      <Stack spacing={2}>
        <ViolationReportsHeader />
        <ViolationStatsRow stats={quickStats} />
        <ViolationFiltersBar
          filters={filters}
          searchValue={searchValue}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchValue}
        />

        {filteredReports.length === 0 ? (
          <ViolationEmptyState onReset={handleResetFilters} />
        ) : (
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, xl: isDetailOpen ? 6.6 : 12 }}>
              <ViolationReportsTable
                rows={paginatedRows}
                selectedRowId={selectedRowId}
                selectedIds={selectedIds}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredReports.length}
                onRowSelect={handleRowSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelectOne={handleToggleSelectOne}
                onRowsPerPageChange={setRowsPerPage}
                onPageChange={setPage}
                onOpenResolveModal={setResolveModalReport}
              />
            </Grid>
            {selectedReport && isDetailOpen && (
              <Grid size={{ xs: 12, xl: 5.4 }}>
                <ViolationReportDetailPanel report={selectedReport} onClose={() => setIsDetailOpen(false)} />
              </Grid>
            )}
          </Grid>
        )}
      </Stack>

      <ViolationResolveModal
        open={Boolean(resolveModalReport)}
        report={resolveModalReport}
        onClose={() => setResolveModalReport(null)}
        onSubmit={handleResolveSubmit}
      />
    </Box>
  )
}

export default ListSupports
