import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          localStorage.setItem('accessToken', data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authApi = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh-token', { refreshToken }),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refreshToken }),
  getMe: () => api.get('/auth/me'),
};

// Profile
export const profileApi = {
  getMyProfile: () => api.get('/profile'),
  updatePersonalInfo: (data: Record<string, unknown>) => api.patch('/profile/personal', data),
  updateProfilePhoto: (data: FormData) => api.patch('/profile/photo', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePhoto: (data: Record<string, unknown>) => api.patch('/profile/photo', data),
  upsertOLevelResults: (data: { results: unknown[] }) => api.put('/profile/o-level', data),
  upsertALevelResults: (data: { results: unknown[] }) => api.put('/profile/a-level', data),
  upsertOLevel: (results: unknown[]) => api.put('/profile/o-level', { results }),
  upsertALevel: (results: unknown[]) => api.put('/profile/a-level', { results }),
  updateCareerInterests: (interests: string[]) => api.put('/profile/career-interests', { interests }),
  addLeadershipActivity: (data: Record<string, unknown>) => api.post('/profile/leadership', data),
  updateLeadershipActivity: (id: string, data: Record<string, unknown>) => api.patch(`/profile/leadership/${id}`, data),
  deleteLeadershipActivity: (id: string) => api.delete(`/profile/leadership/${id}`),
  addLeadership: (data: Record<string, unknown>) => api.post('/profile/leadership', data),
  updateLeadership: (id: string, data: Record<string, unknown>) => api.patch(`/profile/leadership/${id}`, data),
  deleteLeadership: (id: string) => api.delete(`/profile/leadership/${id}`),
  addSportProfile: (data: Record<string, unknown>) => api.post('/profile/sports', data),
  updateSportProfile: (id: string, data: Record<string, unknown>) => api.patch(`/profile/sports/${id}`, data),
  deleteSportProfile: (id: string) => api.delete(`/profile/sports/${id}`),
  addSport: (data: Record<string, unknown>) => api.post('/profile/sports', data),
  updateSport: (id: string, data: Record<string, unknown>) => api.patch(`/profile/sports/${id}`, data),
  deleteSport: (id: string) => api.delete(`/profile/sports/${id}`),
  addCulturalActivity: (data: Record<string, unknown>) => api.post('/profile/cultural', data),
  deleteCulturalActivity: (id: string) => api.delete(`/profile/cultural/${id}`),
  addCultural: (data: Record<string, unknown>) => api.post('/profile/cultural', data),
  deleteCultural: (id: string) => api.delete(`/profile/cultural/${id}`),
  addDocument: (data: FormData | Record<string, unknown>) => api.post('/profile/documents', data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  deleteDocument: (id: string) => api.delete(`/profile/documents/${id}`),
  getPublicProfile: (userId: string) => api.get(`/profile/${userId}`),
};

// Opportunities
export const opportunityApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/opportunities', { params }),
  getById: (id: string) => api.get(`/opportunities/${id}`),
  getMyMatches: () => api.get('/opportunities/my/matches'),
  getSaved: () => api.get('/opportunities/my/saved'),
  save: (id: string) => api.post(`/opportunities/${id}/save`),
  unsave: (id: string) => api.delete(`/opportunities/${id}/save`),
};
