import { format, isToday, isAfter, isBefore, startOfDay } from 'date-fns';
import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(400);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, data) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    // Don't allow Id modification
    const { Id, ...updateData } = data;
    tasks[index] = { ...tasks[index], ...updateData };
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async markComplete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = {
      ...tasks[index],
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    return { ...tasks[index] };
  },

  async getTodaysTasks() {
    await delay(250);
    const today = startOfDay(new Date());
    const todayTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isToday(dueDate) && !task.completed;
    });
    return [...todayTasks];
  },

  async getOverdueTasks() {
    await delay(250);
    const today = startOfDay(new Date());
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isBefore(dueDate, today) && !task.completed;
    });
    return [...overdueTasks];
  },

  async getUpcomingTasks() {
    await delay(250);
    const today = startOfDay(new Date());
    const upcomingTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isAfter(dueDate, today) && !task.completed;
    });
    return [...upcomingTasks];
  },

  async getCompletionStats() {
    await delay(200);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const todayTasks = tasks.filter(task => isToday(new Date(task.dueDate))).length;
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isBefore(dueDate, startOfDay(new Date())) && !task.completed;
    }).length;
    
    return {
      overdueTasks,
      todayTasks,
      weekTasks: tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return dueDate <= weekFromNow && !task.completed;
      }).length,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }
};

export default taskService;