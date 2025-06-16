import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  trend, 
  className = '',
  delay = 0
}) => {
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white'
  };

  const bgColorClasses = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    accent: 'bg-accent/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    error: 'bg-error/10',
    info: 'bg-info/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">
            {title}
          </p>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold text-gray-900">
              {value}
            </p>
            {trend && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2 }}
                className={`ml-2 flex items-center text-sm ${
                  trend.direction === 'up' 
                    ? 'text-success' 
                    : trend.direction === 'down' 
                    ? 'text-error' 
                    : 'text-gray-500'
                }`}
              >
                {trend.direction === 'up' && <ApperIcon name="TrendingUp" className="w-4 h-4" />}
                {trend.direction === 'down' && <ApperIcon name="TrendingDown" className="w-4 h-4" />}
                <span className="ml-1">{trend.value}</span>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className={`flex-shrink-0 p-3 rounded-lg ${bgColorClasses[color]}`}>
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.4 }}
          >
            <ApperIcon 
              name={icon} 
              className={`w-6 h-6 ${color === 'warning' ? 'text-warning' : `text-${color}`}`}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;