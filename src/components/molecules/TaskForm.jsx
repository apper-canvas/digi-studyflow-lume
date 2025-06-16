import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { taskService, subjectService } from '@/services';

const TaskForm = ({ onTaskCreated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium'
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectData = await subjectService.getAll();
        setSubjects(subjectData);
      } catch (error) {
        console.error('Failed to load subjects:', error);
        toast.error('Failed to load subjects');
      }
    };
    loadSubjects();
  }, []);

  const subjectOptions = subjects.map(subject => ({
    value: subject.name,
    label: subject.name
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Combine date and time into ISO string
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
      
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject,
        dueDate: dueDateTime,
        priority: formData.priority
      };

      const newTask = await taskService.create(taskData);
      onTaskCreated?.(newTask);
      toast.success('Task created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium'
      });
      
      onClose?.();
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
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Set default date to today
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setFormData(prev => ({ ...prev, dueDate: today }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-gray-900">Add New Task</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          required
          placeholder="e.g., Complete math homework"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleInputChange('description')}
            placeholder="Add any additional details..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>

        <Select
          label="Subject"
          value={formData.subject}
          onChange={handleInputChange('subject')}
          options={subjectOptions}
          error={errors.subject}
          required
          placeholder="Choose subject"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={handleInputChange('dueDate')}
            error={errors.dueDate}
            required
          />
          
          <Input
            type="time"
            label="Due Time"
            value={formData.dueTime}
            onChange={handleInputChange('dueTime')}
            error={errors.dueTime}
            required
          />
        </div>

        <Select
          label="Priority"
          value={formData.priority}
          onChange={handleInputChange('priority')}
          options={priorityOptions}
          required
        />

        <div className="flex space-x-3 pt-4">
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          
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
  );
};

export default TaskForm;