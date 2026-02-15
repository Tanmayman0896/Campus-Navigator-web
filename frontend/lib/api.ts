// API configuration and base setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Type definitions
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  [key: string]: any;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    major: string;
    year: number;
    level: number;
    xp: number;
    badges: number;
    completedModules: number;
  };
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Get token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('campus_navigator_token');
    }
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('campus_navigator_token', token);
    }
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('campus_navigator_token');
    }
  }

  // Get headers with authentication
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // User Authentication APIs
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    studentId: string;
    major: string;
    year: number;
  }): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/users/register', userData);
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/users/login', credentials);
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    this.removeToken();
  }

  async getUserProfile() {
    return this.get('/users/profile');
  }

  async updateUserProgress(progressData: {
    xp: number;
    level: number;
    badges: number;
    completedModules: number;
  }) {
    return this.put('/users/progress', progressData);
  }

  // Learning Modules APIs
  async getLearningModules() {
    return this.get('/modules');
  }

  async getLearningModule(id: string) {
    return this.get(`/modules/${id}`);
  }

  async startModule(id: string) {
    return this.post(`/modules/${id}/start`);
  }

  async updateModuleProgress(id: string, progress: number, completed?: boolean) {
    return this.put(`/modules/${id}/progress`, { progress, completed });
  }

  async completeModule(id: string) {
    return this.post(`/modules/${id}/complete`);
  }

  async getUserModuleProgress() {
    return this.get('/modules/user/progress');
  }

  // Community APIs
  async getCommunityPosts(page = 1, limit = 10, category?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });
    return this.get(`/community/posts?${params}`);
  }

  async createCommunityPost(postData: {
    title?: string;
    content: string;
    category: string;
  }) {
    return this.post('/community/posts', postData);
  }

  async togglePostLike(postId: string) {
    return this.post(`/community/posts/${postId}/like`);
  }

  async addComment(postId: string, content: string) {
    return this.post(`/community/posts/${postId}/comments`, { content });
  }

  async getMentorSessions() {
    return this.get('/community/sessions');
  }

  async joinMentorSession(sessionId: string) {
    return this.post(`/community/sessions/${sessionId}/join`);
  }

  async leaveMentorSession(sessionId: string) {
    return this.delete(`/community/sessions/${sessionId}/leave`);
  }

  async getCommunityStats() {
    return this.get('/community/stats');
  }

  // Campus Locations APIs
  async getCampusLocations() {
    return this.get('/locations');
  }

  async getCampusLocation(id: string) {
    return this.get(`/locations/${id}`);
  }

  async searchLocations(query: string) {
    return this.get(`/locations/search?q=${encodeURIComponent(query)}`);
  }

  async getLocationMentors(locationId: string) {
    return this.get(`/locations/${locationId}/mentors`);
  }

  async getLocationTips(locationId: string) {
    return this.get(`/locations/${locationId}/tips`);
  }

  async addLocationTip(locationId: string, tipData: {
    content: string;
    category: string;
  }) {
    return this.post(`/locations/${locationId}/tips`, tipData);
  }

  // Progress Tracking APIs
  async getUserStats() {
    return this.get('/progress/stats');
  }

  async getLeaderboard() {
    return this.get('/progress/leaderboard');
  }

  async getUserBadges() {
    return this.get('/progress/badges');
  }

  async getAchievements() {
    return this.get('/progress/achievements');
  }

  async getUserActivities() {
    return this.get('/progress/activities');
  }

  // User Activities
  async addUserActivity(activityData: {
    type: string;
    description: string;
    xp_earned?: number;
  }) {
    return this.post('/users/activities', activityData);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
