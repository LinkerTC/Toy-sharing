import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'medium',
  hover = false,
  interactive = false,
  animate = true,
  className,
  onClick,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = 'bg-white rounded-2xl border transition-all duration-200'

  // Variant styles
  const variants = {
    default: 'border-gray-100 shadow-card',
    toy: 'border-pink-100 shadow-toy group',
    elevated: 'border-gray-200 shadow-lg',
    outlined: 'border-gray-300 shadow-none',
    ghost: 'border-transparent shadow-none bg-transparent'
  }

  // Padding styles
  const paddings = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  // Hover styles
  const hoverStyles = hover && {
    default: 'hover:shadow-card-hover hover:-translate-y-1',
    toy: 'hover:shadow-toy-hover hover:-translate-y-2',
    elevated: 'hover:shadow-xl hover:-translate-y-1',
    outlined: 'hover:border-gray-400 hover:shadow-md',
    ghost: 'hover:bg-gray-50'
  }

  // Interactive styles
  const interactiveStyles = interactive || onClick ? 'cursor-pointer select-none' : ''

  const cardClasses = clsx(
    baseStyles,
    variants[variant],
    paddings[padding],
    hoverStyles && hoverStyles[variant],
    interactiveStyles,
    className
  )

  // Animation variants
  const animationVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: hover ? 1.02 : 1,
      y: hover ? -4 : 0
    },
    tap: { scale: 0.98 }
  }

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        variants={animationVariants}
        initial="rest"
        whileHover="hover"
        whileTap={interactive || onClick ? "tap" : undefined}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('border-b border-gray-100 pb-4 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Body Component
export const CardBody = ({ children, className, ...props }) => {
  return (
    <div className={clsx('flex-1', className)} {...props}>
      {children}
    </div>
  )
}

// Card Footer Component
export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('border-t border-gray-100 pt-4 mt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card