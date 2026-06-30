import httpClient from './httpClient'

export const getViolationReports = async () => {
  const response = await httpClient.get('/api/v1/violation-reports')
  return response.data
}

export const getViolationReportStats = async () => {
  const response = await httpClient.get('/api/v1/violation-reports/stats')
  return response.data
}

export const resolveViolationReport = async (payload) => {
  const response = await httpClient.put('/api/v1/violation-reports/resolve', payload)
  return response.data
}
