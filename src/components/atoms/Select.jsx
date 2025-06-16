import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const shouldFloatLabel = isFocused || value || isOpen;

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            w-full px-3 py-3 border-2 rounded-lg transition-all duration-200 text-left
            flex items-center justify-between
            ${error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}
            focus:outline-none
          `}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>

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
              ${shouldFloatLabel ? 'bg-white px-1' : ''}
            `}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors
                    ${value === option.value ? 'bg-primary/5 text-primary' : 'text-gray-900'}
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                  `}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

export default Select;