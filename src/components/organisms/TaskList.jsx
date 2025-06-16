import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import { taskService } from '@/services';
import ApperIcon from '@/components/ApperIcon';

const TaskList = ({ filters, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const taskData = await taskService.getAll();
      setTasks(taskData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      )
    );
    onTaskUpdate?.(updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
  };

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters?.status) {
      switch (filters.status) {
        case 'all':
          break; // Show all
        case 'active':
          if (task.completed) return false;
          break;
        case 'completed':
          if (!task.completed) return false;
          break;
        case 'overdue':
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (task.completed || dueDate >= today) return false;
          break;
        default:
          break;
      }
    }

    // Subject filter
    if (filters?.subjects?.length > 0) {
      if (!filters.subjects.includes(task.subject)) return false;
    }

    // Priority filter
    if (filters?.priorities?.length > 0) {
      if (!filters.priorities.includes(task.priority)) return false;
    }

    return true;
  });

  // Sort tasks: overdue first, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 shadow-md text-center"
      >
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadTasks}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (sortedTasks.length === 0) {
    const isFiltered = filters?.status || filters?.subjects?.length > 0 || filters?.priorities?.length > 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-12 shadow-md text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <ApperIcon 
            name={isFiltered ? "Filter" : "CheckCircle"} 
            className="w-16 h-16 text-gray-300 mx-auto mb-4" 
          />
        </motion.div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
          {isFiltered ? 'No tasks match your filters' : 'No tasks yet'}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {isFiltered 
            ? 'Try adjusting your filters to see more tasks, or create a new task to get started.'
            : 'Ready to be productive? Create your first task and start organizing your academic life!'
          }
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.3,
              exit: { duration: 0.2 }
            }}
          >
            <TaskCard
              task={task}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;