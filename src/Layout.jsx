import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const currentDate = new Date();

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-full">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-heading font-bold text-xl text-gray-900">StudyFlow</h1>
          </motion.div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </div>
          <div className="text-sm font-medium text-gray-900">
            {format(currentDate, 'h:mm a')}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex-shrink-0 bg-white border-b border-gray-200 px-6 z-40">
        <div className="flex space-x-1">
          {Object.values(routes).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/5 border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-4 h-4" />
              <span>{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 max-w-full">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;