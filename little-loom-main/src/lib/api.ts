/**
 * API client for backend server
 * Replace direct Supabase calls with API calls when needed
 */

// Use relative paths for Vercel deployment, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Profile endpoints
  async getProfile(userId: string) {
    return this.request(`/api/profile/${userId}`);
  }

  async updateProfile(userId: string, updates: any) {
    return this.request(`/api/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Game endpoints
  async getGames() {
    return this.request('/api/games');
  }

  async getGameScenarios(gameId: string) {
    return this.request(`/api/games/${gameId}/scenarios`);
  }

  async submitGameProgress(data: {
    user_id: string;
    scenario_id: string;
    choice_made: string;
    points_earned?: number;
    completed: boolean;
  }) {
    return this.request('/api/games/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Achievement endpoints
  async getAchievements() {
    return this.request('/api/achievements');
  }

  async getUserAchievements(userId: string) {
    return this.request(`/api/achievements/user/${userId}`);
  }

  async unlockAchievement(userId: string, achievementId: string) {
    return this.request('/api/achievements/unlock', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        achievement_id: achievementId,
      }),
    });
  }

  async checkAchievements(userId: string) {
    return this.request(`/api/achievements/check/${userId}`, {
      method: 'POST',
    });
  }

  // Leaderboard endpoints
  async getWeeklyLeaderboard() {
    return this.request('/api/leaderboard/weekly');
  }

  async getAllTimeLeaderboard() {
    return this.request('/api/leaderboard/alltime');
  }

  // Analytics endpoints
  async getUserStats(userId: string) {
    return this.request(`/api/stats/${userId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

