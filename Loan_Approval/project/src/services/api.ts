const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                   (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async calculateLoan(data: any) {
    return this.makeRequest('/calculate_loan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async translateText(text: string, targetLang: string) {
    return this.makeRequest('/translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        target_lang: targetLang,
      }),
    });
  }

  async healthCheck() {
    return this.makeRequest('/health');
  }

  async chatbot(message: string, language: string = 'en') {
    return this.makeRequest('/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message,
        language,
      }),
    });
  }
}

export const apiService = new ApiService();