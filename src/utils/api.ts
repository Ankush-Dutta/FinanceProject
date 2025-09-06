// src/utils/api.ts
interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL = 'https://spendmate.shubhodip.in';
  private apiKey = 'Meowmeowmeow123456789';

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  private async makeRequest(endpoint: string, options: ApiRequestOptions = {}): Promise<Response> {
    const { method = 'GET', headers = {}, body, requireAuth = false } = options;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...headers,
    };

    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    let response = await fetch(url, {
      method,
      headers: requestHeaders,
      body,
    });

    // If we get a 401 and this was an authenticated request, try to refresh the token
    if (response.status === 401 && requireAuth) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the request with the new token
        const newToken = this.getAuthToken();
        if (newToken) {
          requestHeaders['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, {
            method,
            headers: requestHeaders,
            body,
          });
        }
      }
    }

    return response;
  }

  async get(endpoint: string, requireAuth = false): Promise<Response> {
    return this.makeRequest(endpoint, { method: 'GET', requireAuth });
  }

  async post(endpoint: string, data?: unknown, requireAuth = false): Promise<Response> {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  async put(endpoint: string, data?: unknown, requireAuth = false): Promise<Response> {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requireAuth,
    });
  }

  async delete(endpoint: string, requireAuth = false): Promise<Response> {
    return this.makeRequest(endpoint, { method: 'DELETE', requireAuth });
  }
}

// Profile API functions
export const profileApi = {
  createProfile: async (profileData: {
    uid: string;
    dateOfBirth: string;
    occupation: string;
    monthlyIncome: number;
    maritalStatus: string;
    numberOfDependents: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }) => {
    try {
      const response = await apiClient.post('/profiles', profileData, false); // Don't require auth
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('createProfile error:', error);
      throw error;
    }
  },

  getProfile: async (uid: string) => {
    try {
      const response = await apiClient.get(`/profiles/${uid}`, false); // Don't require auth for GET
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profile not found');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('getProfile error:', error);
      throw error;
    }
  },

  updateProfile: async (uid: string, profileData: {
    occupation: string;
    monthlyIncome: number;
    maritalStatus: string;
    numberOfDependents: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }) => {
    try {
      const response = await apiClient.put(`/profiles/${uid}`, profileData, false); // Don't require auth
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('updateProfile error:', error);
      throw error;
    }
  }
};

export const apiClient = new ApiClient();
