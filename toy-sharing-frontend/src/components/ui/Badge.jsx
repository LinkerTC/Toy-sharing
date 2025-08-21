import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  animate = false,
  icon,
  className,
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center font-medium rounded-full whitespace-nowrap'

  // Variant styles
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-danger-100 text-danger-800',
    info: 'bg-blue-100 text-blue-800'
  }

  // Size styles
  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  }

  const badgeClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  )

  const BadgeContent = () => (
    <>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </>
  )

  if (animate) {
    return (
      <motion.span
        className={badgeClasses}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.3 }}
        {...props}
      >
        <BadgeContent />
      </motion.span>
    )
  }

  return (
    <span className={badgeClasses} {...props}>
      <BadgeContent />
    </span>
  )
}

export default Badge