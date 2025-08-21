import { forwardRef, useState } from 'react'
import { clsx } from 'clsx'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  size = 'medium',
  variant = 'default',
  className,
  containerClassName,
  labelClassName,
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const actualType = type === 'password' && showPassword ? 'text' : type

  // Base styles
  const baseStyles = 'block w-full border rounded-xl transition-all duration-200 focus:outline-none placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'

  // Variant styles
  const variants = {
    default: 'border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100',
    filled: 'border-transparent bg-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100',
    flushed: 'border-0 border-b-2 border-gray-200 rounded-none bg-transparent focus:border-primary-500 focus:ring-0'
  }

  // Size styles
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-5 py-4 text-lg'
  }

  // Error/Success styles
  const statusStyles = error 
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-100' 
    : success 
    ? 'border-success-300 focus:border-success-500 focus:ring-success-100'
    : ''

  const inputClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    statusStyles,
    {
      'pl-12': leftIcon,
      'pr-12': rightIcon || (type === 'password' && showPasswordToggle),
      'bg-gray-50 border-gray-100': disabled
    },
    className
  )

  const containerClasses = clsx(
    'relative',
    containerClassName
  )

  const labelClasses = clsx(
    'block text-sm font-medium text-gray-700 mb-2',
    {
      'text-danger-600': error,
      'text-success-600': success
    },
    labelClassName
  )

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={clsx(
              'text-gray-400',
              {
                'text-danger-400': error,
                'text-success-400': success,
                'text-primary-400': isFocused && !error && !success
              }
            )}>
              {leftIcon}
            </span>
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={actualType}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {error && !rightIcon && (
            <AlertCircle className="w-5 h-5 text-danger-400" />
          )}
          {success && !rightIcon && !error && (
            <CheckCircle className="w-5 h-5 text-success-400" />
          )}
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {rightIcon && !error && !success && (
            <span className="text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>
      </div>

      {/* Helper/Error/Success Text */}
      {(error || success || helperText) && (
        <div className="mt-2 text-sm">
          {error && (
            <p className="text-danger-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-success-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input