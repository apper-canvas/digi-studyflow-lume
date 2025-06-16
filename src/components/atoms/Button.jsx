import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-md hover:shadow-lg',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    success: 'bg-success text-white hover:bg-success/90 focus:ring-success shadow-md hover:shadow-lg'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <ApperIcon name="Loader2" className="w-4 h-4" />
        </motion.div>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} className="w-4 h-4" />
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} className="w-4 h-4" />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;