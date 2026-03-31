import { forwardRef } from 'react'

export const Input = forwardRef(function Input({
  label,
  hint,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  required,
  className = '',
  ...props
}, ref) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}{required && <span style={{ color: 'var(--color-error)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={['input', error ? 'input-error' : '', className].filter(Boolean).join(' ')}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {hint && !error && <span className="input-hint">{hint}</span>}
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  )
})
