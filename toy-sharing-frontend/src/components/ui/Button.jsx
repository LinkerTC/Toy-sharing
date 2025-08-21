import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

const Button = forwardRef(({ 
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  animate = true,
  onClick,
  ...props 
}, ref) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed'

  // Variant styles
  const variants = {
    primary: 'text-white bg-primary-500 hover:bg-primary-600 shadow-toy hover:shadow-toy-hover focus:ring-primary-200',
    secondary: 'text-primary-600 bg-white border-2 border-primary-500 hover:bg-primary-50 shadow-card hover:shadow-card-hover focus:ring-primary-200',
    accent: 'text-white bg-accent-400 hover:bg-accent-500 shadow-lg focus:ring-accent-200',
    success: 'text-white bg-success-500 hover:bg-success-600 shadow-lg focus:ring-success-200',
    danger: 'text-white bg-danger-500 hover:bg-danger-600 shadow-lg focus:ring-danger-200',
    ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200',
    outline: 'text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-200'
  }

  // Size styles
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  // Animation variants
  const animationVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  const buttonClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  )

  const handleClick = (e) => {
    if (loading || disabled) return
    onClick?.(e)
  }

  const ButtonContent = () => (
    <>
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </>
  )

  if (animate) {
    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        variants={animationVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        disabled={loading || disabled}
        onClick={handleClick}
        {...props}
      >
        <ButtonContent />
      </motion.button>
    )
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={loading || disabled}
      onClick={handleClick}
      {...props}
    >
      <ButtonContent />
    </button>
  )
})

Button.displayName = 'Button'

export default Button