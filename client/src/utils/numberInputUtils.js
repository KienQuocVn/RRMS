const BLOCKED_NUMBER_KEYS = new Set(['-', '+', 'e', 'E'])

export const isNegativeNumberValue = (value) => {
  if (value === '' || value === null || value === undefined) return false
  const num = Number(value)
  return !Number.isNaN(num) && num < 0
}

export const blockNegativeNumberKeyDown = (event) => {
  if (BLOCKED_NUMBER_KEYS.has(event.key)) {
    event.preventDefault()
  }
}

export const getNonNegativeNumberFieldProps = (min = 0, extraInputProps = {}) => ({
  inputProps: { min, ...extraInputProps },
  onKeyDown: blockNegativeNumberKeyDown
})

export const wrapNonNegativeNumberChange = (handler) => (event) => {
  if (isNegativeNumberValue(event.target.value)) return
  handler(event)
}
