import { getApiBaseUrl } from '../utils/constants';

class ApiClient {
  getBaseUrl() {
    return getApiBaseUrl();
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = localStorage.getItem('devpilot_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.getBaseUrl()}${endpoint}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401 && !options._retry && !endpoint.includes('/api/auth/')) {
        options._retry = true;
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          const newHeaders = { ...this.getHeaders(), ...options.headers };
          const retryResponse = await fetch(url, { ...options, headers: newHeaders });
          return await this.handleResponse(retryResponse);
        } else {
          localStorage.removeItem('devpilot_access_token');
          localStorage.removeItem('devpilot_refresh_token');
          localStorage.removeItem('devpilot_user');
          window.location.href = '/login';
        }
      }

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (data && data.message) || response.statusText || 'An unexpected error occurred';
      throw new Error(errorMessage);
    }

    return data && data.data !== undefined ? data.data : data;
  }

  async tryRefreshToken() {
    const refreshToken = localStorage.getItem('devpilot_refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.getBaseUrl()}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const json = await response.json();
        const authData = json.data;
        localStorage.setItem('devpilot_access_token', authData.accessToken);
        localStorage.setItem('devpilot_refresh_token', authData.refreshToken);
        return true;
      }
    } catch (err) {
      console.warn('Could not refresh token', err);
    }
    return false;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
