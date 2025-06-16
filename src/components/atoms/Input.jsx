import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  const shouldFloatLabel = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={!label ? placeholder : ''}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3 py-3 border-2 rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            focus:outline-none
          `}
          {...props}
        />
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              top: shouldFloatLabel ? '0.5rem' : '50%',
              fontSize: shouldFloatLabel ? '0.75rem' : '1rem',
              transform: shouldFloatLabel ? 'translateY(0)' : 'translateY(-50%)',
              color: error ? '#FF6B6B' : isFocused ? '#5B4CFF' : '#6B7280'
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              absolute left-3 pointer-events-none font-medium
              ${icon ? 'left-10' : 'left-3'}
              ${shouldFloatLabel ? 'bg-white px-1' : ''}
            `}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center space-x-1"
        >
          <ApperIcon name="AlertCircle" className="w-3 h-3" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default Input;