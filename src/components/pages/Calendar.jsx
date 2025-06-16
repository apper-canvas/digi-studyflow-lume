import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths,
  isSameDay
} from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { taskService, subjectService } from '@/services';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [taskData, subjectData] = await Promise.all([
        taskService.getAll(),
        subjectService.getAll()
      ]);
      setTasks(taskData);
      setSubjects(subjectData);
    } catch (error) {
      toast.error('Failed to load calendar data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  const getSubjectColor = (subjectName) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.color || '#6B7280';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="min-h-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="grid grid-cols-7 gap-4">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Calendar
            </h1>
            <p className="text-gray-600 mt-1">
              View your tasks and deadlines in calendar format
            </p>
          </div>
          
          <Button onClick={goToToday} variant="outline" icon="Calendar">
            Today
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Calendar Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="ChevronRight" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dayTasks = getTasksForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isToday(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <motion.button
                      key={day.toISOString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        p-2 h-24 border-r border-b border-gray-100 hover:bg-gray-50 
                        transition-colors text-left relative
                        ${isSelected ? 'bg-primary/5 border-primary' : ''}
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                      `}
                    >
                      <div className={`
                        text-sm font-medium mb-1
                        ${isTodayDate ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                      `}>
                        {format(day, 'd')}
                      </div>
                      
                      <div className="space-y-1 max-w-full overflow-hidden">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.Id}
                            className="text-xs px-1 py-0.5 rounded truncate text-white"
                            style={{ backgroundColor: getSubjectColor(task.subject) }}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Selected Date Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
              </h3>
              
              {selectedDate ? (
                <>
                  {selectedDateTasks.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedDateTasks.map((task) => (
                        <motion.div
                          key={task.Id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`
                            p-3 rounded-lg border-l-4 bg-gray-50
                            ${task.completed ? 'opacity-60' : ''}
                          `}
                          style={{ 
                            borderLeftColor: task.priority === 'high' ? '#FF6B6B' : 
                                            task.priority === 'medium' ? '#FFD93D' : '#94A3B8'
                          }}
                        >
                          <h4 className={`font-medium text-sm text-gray-900 mb-1 ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              size="sm"
                              color={getSubjectColor(task.subject)}
                            >
                              {task.subject}
                            </Badge>
                            
                            {task.completed && (
                              <Badge variant="success" size="sm" icon="Check">
                                Done
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 flex items-center">
                            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                            {format(new Date(task.dueDate), 'h:mm a')}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No tasks scheduled for this date</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="CalendarDays" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Click on a date to view tasks</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;