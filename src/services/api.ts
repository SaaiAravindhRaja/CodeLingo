import {
  AuthResponse,
  UserResponse,
  LessonsResponse,
  LessonResponse,
  LessonCompleteResponse,
  LeaderboardResponse,
  ApiError
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  // Auth endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: { login: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<UserResponse>(response);
  }

  async updateProfile(profileData: any): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    
    return this.handleResponse<UserResponse>(response);
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });
    
    return this.handleResponse<{ message: string }>(response);
  }

  // Lessons endpoints
  async getLessons(params?: {
    page?: number;
    limit?: number;
    language?: string;
    level?: string;
    category?: string;
    search?: string;
  }): Promise<LessonsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/lessons?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<LessonsResponse>(response);
  }

  async getLesson(id: string): Promise<LessonResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<LessonResponse>(response);
  }

  async completeLesson(id: string, answers: any[], timeSpent?: number): Promise<LessonCompleteResponse> {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}/complete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ answers, timeSpent }),
    });
    
    return this.handleResponse<LessonCompleteResponse>(response);
  }

  // Users endpoints
  async getLeaderboard(limit?: number): Promise<LeaderboardResponse> {
    const queryParams = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${API_BASE_URL}/users/leaderboard${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<LeaderboardResponse>(response);
  }

  async getUserProgress(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/progress`, {
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<any>(response);
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse<any>(response);
  }
}

export default new ApiService();