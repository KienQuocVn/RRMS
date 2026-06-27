/** Hiển thị số tiền VND trong ô nhập: 3000000 → "3.000.000" */
export const formatVndInput = (value) => {
  if (value === null || value === undefined || value === '') return ''

  const digits = String(value).replace(/\D/g, '')
  if (!digits) return ''

  return Number(digits).toLocaleString('vi-VN')
}

/** Lấy chuỗi số thuần từ giá trị đã format (để lưu state / gửi API) */
export const parseVndInput = (value) => String(value ?? '').replace(/\D/g, '')

/** Chuyển sang number cho payload API */
export const parseVndNumber = (value) => {
  const digits = parseVndInput(value)
  if (!digits) return 0
  const num = Number(digits)
  return Number.isFinite(num) ? num : 0
}

export const getVndInputFieldProps = (extraInputProps = {}) => ({
  type: 'text',
  inputProps: { inputMode: 'numeric', ...extraInputProps },
})
