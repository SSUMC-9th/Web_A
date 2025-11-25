// api/authApi.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

interface LoginResponse {
  user: {
    id: string;
    email: string;
    nickname: string;
  };
  token: string;
}

const USE_MOCK = true;

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        user: {
          id: '1',
          email,
          nickname: '테스트유저',
        },
        token: 'mock-token-12345',
      };
    }

    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    await api.post('/auth/logout');
  },

  deleteAccount: async (): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await api.delete('/auth/account');
  },
};