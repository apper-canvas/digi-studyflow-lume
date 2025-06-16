import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <div className="relative">
        <motion.div
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          className={`
            ${sizes[size]} border-2 rounded transition-all duration-200
            ${checked 
              ? 'bg-primary border-primary' 
              : 'bg-white border-gray-300 hover:border-primary'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ApperIcon name="Check" className={`${iconSizes[size]} text-white`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
      </div>
      
      {label && (
        <span className="text-sm text-gray-700 select-none">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;