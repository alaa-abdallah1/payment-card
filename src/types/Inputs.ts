export interface TextFieldProps {
  id?: string
  max?: number
  min?: number
  type?: string
  label?: string
  maxlength?: number
  inputClass?: string
  labelClass?: string
  placeholder?: string
  isRequired?: boolean
  errorMessage?: string
  autocomplete?: string
  containerClass?: string
  modelValue?: string | number
  inputRestriction?: 'numberOnly' | 'letterOnly'
  onFocus?: () => void
  onBlur?: () => void
}

export interface SelectFieldOption {
  text: string
  disabled?: boolean
  value: string | number
}

export interface SelectFieldProps extends TextFieldProps {
  options?: SelectFieldOption[] | Record<string, unknown>
  formatValue?: (value: string | number) => string
}
