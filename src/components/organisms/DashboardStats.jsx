import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatsCard from '@/components/molecules/StatsCard';
import { taskService } from '@/services';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    overdueTasks: 0,
    todayTasks: 0,
    weekTasks: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await taskService.getCompletionStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl p-6 shadow-md text-center"
      >
        <p className="text-error">Failed to load statistics</p>
        <button
          onClick={loadStats}
          className="mt-2 text-primary hover:underline"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  const statsConfig = [
    {
      title: 'Overdue Tasks',
      value: stats.overdueTasks,
      icon: 'AlertTriangle',
      color: stats.overdueTasks > 0 ? 'error' : 'success',
      delay: 0
    },
    {
      title: 'Due Today',
      value: stats.todayTasks,
      icon: 'Clock',
      color: stats.todayTasks > 0 ? 'warning' : 'info',
      delay: 0.1
    },
    {
      title: 'This Week',
      value: stats.weekTasks,
      icon: 'Calendar',
      color: 'info',
      delay: 0.2
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: 'Target',
      color: stats.completionRate >= 80 ? 'success' : stats.completionRate >= 60 ? 'warning' : 'error',
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          delay={stat.delay}
        />
      ))}
    </div>
  );
};

export default DashboardStats;