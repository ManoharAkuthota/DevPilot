import { api } from './api';

export const authService = {
  async register(data) {
    return await api.post('/api/auth/register', data);
  },

  async login(usernameOrEmail, password) {
    return await api.post('/api/auth/login', { usernameOrEmail, password });
  },

  async logout() {
    try {
      await api.post('/api/auth/logout', {});
    } catch (e) {
      console.warn('Logout notification error:', e);
    } finally {
      localStorage.removeItem('devpilot_access_token');
      localStorage.removeItem('devpilot_refresh_token');
      localStorage.removeItem('devpilot_user');
    }
  },

  async getProfile() {
    return await api.get('/api/users/profile');
  },

  async updateProfile(profileData) {
    return await api.put('/api/users/profile', profileData);
  },

  async changePassword(currentPassword, newPassword) {
    return await api.post('/api/users/change-password', { currentPassword, newPassword });
  },

  getCurrentUser() {
    const raw = localStorage.getItem('devpilot_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveAuthSession(authResponse) {
    localStorage.setItem('devpilot_access_token', authResponse.accessToken);
    localStorage.setItem('devpilot_refresh_token', authResponse.refreshToken);
    localStorage.setItem('devpilot_user', JSON.stringify(authResponse.user));
  },
};
