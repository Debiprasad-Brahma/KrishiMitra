const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setAuthToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async sendOTP(phone) {
    return this.request('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  }

  async verifyOTP(phone, otp) {
    const response = await this.request('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
    
    if (response.success && response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  // Query methods
  async submitQuery(question, language = 'english', imageUrl = null) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.request('/query', {
      method: 'POST',
      body: JSON.stringify({
        userId: user._id,
        question,
        language,
        imageUrl
      })
    });
  }

  async getQueryHistory() {
    return this.request('/query/history');
  }

  async giveFeedback(queryId, feedback) {
    return this.request('/query/feedback', {
      method: 'POST',
      body: JSON.stringify({ queryId, feedback })
    });
  }

  // Weather & Market data
  async getWeather() {
    return this.request('/weather');
  }

  async getPrices() {
    return this.request('/prices');
  }

  async getAlerts() {
    return this.request('/alerts');
  }

  // Escalation
  async createEscalation(escalationData) {
    return this.request('/escalation', {
      method: 'POST',
      body: JSON.stringify(escalationData)
    });
  }

  // Profile methods
  async getProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { user }; // Since user info is stored locally after login
  }

  async updateProfile(profileData) {
    // You'll need to create this endpoint in backend
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
}

export default new ApiService();