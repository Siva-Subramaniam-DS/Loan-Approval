// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' // Replace with actual backend URL when available
  : 'http://localhost:5000';

export const api = {
  calculateLoan: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/calculate_loan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  translate: async (text: string, targetLang: string) => {
    const response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        target_lang: targetLang,
      }),
    });
    return response.json();
  },

  chatbot: async (message: string, language: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
      }),
    });
    return response.json();
  },

  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },
};