import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Badge from '@/components/atoms/Badge';
import { subjectService } from '@/services';

const FilterTabs = ({ activeFilters, onFilterChange, taskCounts = {} }) => {
  const [subjects, setSubjects] = useState([]);

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

  const statusFilters = [
    { id: 'all', label: 'All Tasks', count: taskCounts.all || 0 },
    { id: 'active', label: 'Active', count: taskCounts.active || 0 },
    { id: 'completed', label: 'Completed', count: taskCounts.completed || 0 },
    { id: 'overdue', label: 'Overdue', count: taskCounts.overdue || 0 }
  ];

  const priorityFilters = [
    { id: 'high', label: 'High', color: '#FF6B6B' },
    { id: 'medium', label: 'Medium', color: '#FFD93D' },
    { id: 'low', label: 'Low', color: '#94A3B8' }
  ];

  const handleStatusFilter = (status) => {
    onFilterChange?.({
      ...activeFilters,
      status: activeFilters.status === status ? null : status
    });
  };

  const handleSubjectFilter = (subject) => {
    const currentSubjects = activeFilters.subjects || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];
    
    onFilterChange?.({
      ...activeFilters,
      subjects: newSubjects.length > 0 ? newSubjects : null
    });
  };

  const handlePriorityFilter = (priority) => {
    const currentPriorities = activeFilters.priorities || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFilterChange?.({
      ...activeFilters,
      priorities: newPriorities.length > 0 ? newPriorities : null
    });
  };

  const clearAllFilters = () => {
    onFilterChange?.({
      status: null,
      subjects: null,
      priorities: null
    });
  };

  const hasActiveFilters = activeFilters.status || activeFilters.subjects?.length > 0 || activeFilters.priorities?.length > 0;

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Status Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusFilter(filter.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${activeFilters.status === filter.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                }
              `}
            >
              <span>{filter.label}</span>
              <Badge variant="default" size="sm">
                {filter.count}
              </Badge>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Subject Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => {
            const isActive = activeFilters.subjects?.includes(subject.name);
            return (
              <motion.button
                key={subject.Id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubjectFilter(subject.name)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all border
                  ${isActive
                    ? 'text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:shadow-md'
                  }
                `}
                style={{
                  backgroundColor: isActive ? subject.color : 'white',
                  borderColor: isActive ? subject.color : '#e5e7eb',
                  color: isActive ? 'white' : subject.color
                }}
              >
                {subject.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Priority Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter) => {
            const isActive = activeFilters.priorities?.includes(filter.id);
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePriorityFilter(filter.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all border
                  ${isActive
                    ? 'text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:shadow-md'
                  }
                `}
                style={{
                  backgroundColor: isActive ? filter.color : 'white',
                  borderColor: isActive ? filter.color : '#e5e7eb',
                  color: isActive ? 'white' : filter.color
                }}
              >
                {filter.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all filters
        </motion.button>
      )}
    </div>
  );
};

export default FilterTabs;