import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const Spinner = ({ 
  size = 'medium', 
  color = 'primary',
  className,
  ...props 
}) => {
  // Size styles
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  // Color styles
  const colors = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  const spinnerClasses = clsx(
    'animate-spin',
    sizes[size],
    colors[color],
    className
  )

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      <svg
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

// Loading Component with message
export const Loading = ({ 
  message = 'Đang tải...', 
  size = 'medium',
  fullScreen = false,
  className 
}) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex flex-col items-center justify-center p-8'

  return (
    <div className={clsx(containerClasses, className)}>
      <Spinner size={size} />
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  )
}

export default Spinner