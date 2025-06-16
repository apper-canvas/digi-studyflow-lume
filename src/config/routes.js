import Dashboard from '@/components/pages/Dashboard';
import Calendar from '@/components/pages/Calendar';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  }
};

export const routeArray = Object.values(routes);