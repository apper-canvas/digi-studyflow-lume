import subjectData from '../mockData/subjects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let subjects = [...subjectData];

const subjectService = {
  async getAll() {
    await delay(200);
    return [...subjects];
  },

  async getById(id) {
    await delay(150);
    const subject = subjects.find(s => s.Id === parseInt(id, 10));
    return subject ? { ...subject } : null;
  },

  async create(subjectData) {
    await delay(300);
    const maxId = subjects.length > 0 ? Math.max(...subjects.map(s => s.Id)) : 0;
    const newSubject = {
      Id: maxId + 1,
      ...subjectData
    };
    subjects.push(newSubject);
    return { ...newSubject };
  },

  async update(id, data) {
    await delay(250);
    const index = subjects.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Subject not found');
    
    // Don't allow Id modification
    const { Id, ...updateData } = data;
    subjects[index] = { ...subjects[index], ...updateData };
    
    return { ...subjects[index] };
  },

  async delete(id) {
    await delay(200);
    const index = subjects.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Subject not found');
    
    const deletedSubject = subjects[index];
    subjects.splice(index, 1);
    return { ...deletedSubject };
  }
};

export default subjectService;