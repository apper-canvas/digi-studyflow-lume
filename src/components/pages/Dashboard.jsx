import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DashboardStats from '@/components/organisms/DashboardStats';
import TaskList from '@/components/organisms/TaskList';
import QuickTaskForm from '@/components/organisms/QuickTaskForm';
import FilterTabs from '@/components/molecules/FilterTabs';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';
import { isToday, isPast, startOfDay } from 'date-fns';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    status: 'active',
    subjects: null,
    priorities: null
  });
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    active: 0,
    completed: 0,
    overdue: 0
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadTaskCounts();
  }, [refreshKey]);

  const loadTaskCounts = async () => {
    try {
      const tasks = await taskService.getAll();
      const today = startOfDay(new Date());
      
      const counts = {
        all: tasks.length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length,
        overdue: tasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return isPast(dueDate) && !isToday(dueDate) && !t.completed;
        }).length
      };
      
      setTaskCounts(counts);
    } catch (error) {
      console.error('Failed to load task counts:', error);
    }
  };

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Task created successfully! 🎯');
  };

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay organized and on top of your academic tasks. Track your progress, 
            manage deadlines, and achieve your study goals with StudyFlow.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardStats key={refreshKey} />
        </motion.section>

        {/* Quick Add Task */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QuickTaskForm onTaskCreated={handleTaskCreated} />
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="font-heading font-bold text-lg text-gray-900 mb-4">
                Filter Tasks
              </h2>
              <FilterTabs
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                taskCounts={taskCounts}
              />
            </div>
          </motion.aside>

          {/* Tasks List */}
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-xl text-gray-900">
                  Your Tasks
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>
                    {filters.status === 'active' ? 'Active Tasks' : 
                     filters.status === 'completed' ? 'Completed Tasks' :
                     filters.status === 'overdue' ? 'Overdue Tasks' : 'All Tasks'}
                  </span>
                </div>
              </div>
              
              <TaskList
                key={refreshKey}
                filters={filters}
                onTaskUpdate={handleTaskUpdate}
              />
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;