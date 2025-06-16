import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { taskService, subjectService } from '@/services';

const QuickTaskForm = ({ onTaskCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '23:59',
    priority: 'medium'
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const subjectOptions = subjects.map(subject => ({
    value: subject.name,
    label: subject.name
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }

    setLoading(true);
    try {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
      
      const taskData = {
        title: formData.title.trim(),
        description: '',
        subject: formData.subject,
        dueDate: dueDateTime,
        priority: formData.priority
      };

      const newTask = await taskService.create(taskData);
      onTaskCreated?.(newTask);
      toast.success('Task added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        subject: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        dueTime: '23:59',
        priority: 'medium'
      });
      
      setIsExpanded(false);
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target?.value ?? e;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Plus" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Quick Add Task</h3>
                <p className="text-sm text-gray-500">Click to add a new task</p>
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Add New Task</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAdd} className="space-y-3">
              <Input
                placeholder="What do you need to do?"
                value={formData.title}
                onChange={handleInputChange('title')}
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                  options={subjectOptions}
                />
                
                <Select
                  value={formData.priority}
                  onChange={handleInputChange('priority')}
                  options={priorityOptions}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange('dueDate')}
                />
                
                <Input
                  type="time"
                  value={formData.dueTime}
                  onChange={handleInputChange('dueTime')}
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  loading={loading}
                  icon="Plus"
                  className="flex-1"
                >
                  Add Task
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuickTaskForm;