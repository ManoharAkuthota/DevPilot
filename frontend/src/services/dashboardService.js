import { api } from './api';

export const dashboardService = {
  // GitHub
  async getGitHubProfile() {
    return await api.get('/api/github/profile');
  },
  async connectGitHub(username, token = '') {
    return await api.post('/api/github/connect', { username, token });
  },
  async getRepositories(keyword = '') {
    return await api.get(`/api/github/repos${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`);
  },
  async generateAiRepoSummary(repoId) {
    return await api.post(`/api/github/repos/${repoId}/ai-summary`, {});
  },

  // Tasks (Kanban)
  async getTasks() {
    return await api.get('/api/tasks');
  },
  async createTask(task) {
    return await api.post('/api/tasks', task);
  },
  async updateTask(id, task) {
    return await api.put(`/api/tasks/${id}`, task);
  },
  async updateTaskStatus(id, status, positionIndex = 0) {
    return await api.patch(`/api/tasks/${id}/status`, { status, positionIndex });
  },
  async deleteTask(id) {
    return await api.delete(`/api/tasks/${id}`);
  },
  async addTaskComment(taskId, content) {
    return await api.post(`/api/tasks/${taskId}/comments`, { content });
  },
  async getTaskComments(taskId) {
    return await api.get(`/api/tasks/${taskId}/comments`);
  },

  // AI Assistant
  async sendAiPrompt(promptData) {
    return await api.post('/api/ai/chat', promptData);
  },
  async getAiHistory() {
    return await api.get('/api/ai/history');
  },
  async getAiChat(chatId) {
    return await api.get(`/api/ai/chats/${chatId}`);
  },
  async deleteAiChat(chatId) {
    return await api.delete(`/api/ai/chats/${chatId}`);
  },

  // Browser Automations
  async getAutomations() {
    return await api.get('/api/automation');
  },
  async createAutomation(automation) {
    return await api.post('/api/automation/create', automation);
  },
  async runAutomation(id) {
    return await api.post(`/api/automation/${id}/run`, {});
  },
  async getAutomationRuns(id) {
    return await api.get(`/api/automation/${id}/runs`);
  },

  // System Monitor
  async getLiveSystemMetrics() {
    return await api.get('/api/system/metrics');
  },
  async getSystemHistory() {
    return await api.get('/api/system/history');
  },
};
