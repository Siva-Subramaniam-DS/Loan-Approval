const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
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
}

export const apiService = new ApiService();