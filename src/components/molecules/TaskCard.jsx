import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';
import { taskService, subjectService } from '@/services';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [subjects, setSubjects] = useState([]);

  // Load subjects for color mapping
  useState(() => {
    const loadSubjects = async () => {
      try {
        const subjectData = await subjectService.getAll();
        setSubjects(subjectData);
      } catch (error) {
        console.error('Failed to load subjects:', error);
      }
    };
    loadSubjects();
  }, []);

  const subject = subjects.find(s => s.name === task.subject);
  const subjectColor = subject?.color || '#6B7280';
  const subjectIcon = subject?.icon || 'BookOpen';

  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && !task.completed;
  const isDueToday = isToday(dueDate);
  const isUpcoming = isFuture(dueDate) && !isToday(dueDate);

  const getDueDateColor = () => {
    if (task.completed) return 'success';
    if (isOverdue) return 'error';
    if (isDueToday) return 'warning';
    return 'info';
  };

  const getDueDateText = () => {
    if (isOverdue) return 'Overdue';
    if (isDueToday) return 'Due Today';
    return format(dueDate, 'MMM d');
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#94A3B8';
      default: return '#94A3B8';
    }
  };

  const handleComplete = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    try {
      const updatedTask = await taskService.markComplete(task.Id);
      setShowConfetti(true);
      
      // Confetti animation
      setTimeout(() => setShowConfetti(false), 500);
      
      onUpdate?.(updatedTask);
      toast.success('Task completed! Great job! 🎉');
    } catch (error) {
      toast.error('Failed to complete task');
      console.error('Error completing task:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        onDelete?.(task.Id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200
        border-l-4 overflow-hidden
        ${task.completed ? 'opacity-75' : ''}
      `}
      style={{ borderLeftColor: getPriorityColor() }}
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1,
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="absolute w-2 h-2 bg-primary rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Completion Checkbox */}
          <div className="flex-shrink-0 mt-0.5">
            <Checkbox
              checked={task.completed}
              onChange={handleComplete}
              disabled={isCompleting}
              size="md"
            />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-medium text-gray-900 break-words ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              
              <button
                onClick={handleDelete}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-error transition-colors ml-2"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>

            {task.description && (
              <p className={`text-sm text-gray-600 mb-3 break-words ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}

            {/* Subject Badge */}
            <div className="flex items-center space-x-2 mb-3">
              <Badge
                icon={subjectIcon}
                color={subjectColor}
                size="sm"
              >
                {task.subject}
              </Badge>

              <Badge
                variant={getDueDateColor()}
                size="sm"
                icon={isOverdue ? 'AlertTriangle' : isDueToday ? 'Clock' : 'Calendar'}
              >
                {getDueDateText()}
              </Badge>
            </div>

            {/* Priority and Time */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPriorityColor() }}
                />
                <span className="capitalize">{task.priority} priority</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-3 h-3" />
                <span>{format(dueDate, 'h:mm a')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;