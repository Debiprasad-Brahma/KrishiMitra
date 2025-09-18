const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setAuthToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getAuthHeaders(isFormData = false) {
    const headers = {
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
    
    // Don't set Content-Type for FormData, let browser handle it
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(options.isFormData),
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

  // Profile methods
  async uploadProfileImage(formData) {
    return this.request('/auth/upload-profile-image', {
      method: 'POST',
      body: formData,
      isFormData: true
    });
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Enhanced Query methods with image support
  async submitQuery(question, language = 'english', images = []) {
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Add text data
    formData.append('userId', user._id || '');
    formData.append('question', question);
    formData.append('language', language);
    
    // Add images if provided
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('images', image);
        } else if (typeof image === 'string') {
          // Handle base64 or URL strings
          formData.append(`imageUrls[${index}]`, image);
        }
      });
    }

    return this.request('/query', {
      method: 'POST',
      body: formData,
      isFormData: true
    });
  }

  async submitQueryWithImages(question, language = 'english', imageFiles = []) {
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    formData.append('userId', user._id || '');
    formData.append('question', question || '');
    formData.append('language', language);
    
    // Add image files
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    return this.request('/query', {
      method: 'POST',
      body: formData,
      isFormData: true
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

  // Image analysis specific method
  async analyzeImage(imageFile, question = '', language = 'english') {
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    formData.append('userId', user._id || '');
    formData.append('question', question || 'Please analyze this image and provide farming advice.');
    formData.append('language', language);
    formData.append('images', imageFile);

    return this.request('/query/analyze-image', {
      method: 'POST',
      body: formData,
      isFormData: true
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

  // Utility method to convert blob URL to File
  async convertBlobToFile(blobUrl, filename = 'image.jpg') {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error converting blob to file:', error);
      throw error;
    }
  }

  // Method to validate image file
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload images smaller than 5MB.');
    }

    return true;
  }

  // Method to compress image before upload
  async compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxWidth / height);
        
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export default new ApiService();