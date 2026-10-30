const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Universal fetch wrapper for CampusLoop API
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('campusloop_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to CampusLoop server. Please check if backend is running.');
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
};

export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  checkAdmin: () => api.get('/auth/admin-check'),
};

export const itemApi = {
  getItems: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'All') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return api.get(`/items${queryString ? `?${queryString}` : ''}`);
  },
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`),
  getMyListings: () => api.get('/items/my-listings'),
  seedSampleItems: () => api.post('/items/seed', {}),
};

export const requestApi = {
  create: (requestData) => api.post('/requests', requestData),
  getSent: () => api.get('/requests/sent'),
  getIncoming: () => api.get('/requests/incoming'),
  getById: (id) => api.get(`/requests/${id}`),
  approve: (id, responseNote = '') => api.patch(`/requests/${id}/approve`, { responseNote }),
  reject: (id, responseNote = '') => api.patch(`/requests/${id}/reject`, { responseNote }),
  decide: (id, decision, responseNote = '') => api.patch(`/requests/${id}/decision`, { decision, responseNote }),
  cancel: (id) => api.patch(`/requests/${id}/cancel`, {}),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`, {}),
  markAllRead: () => api.patch('/notifications/read-all', {}),
};

export default api;
