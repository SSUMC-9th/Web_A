import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

interface LoginResponse {
  user: {
    id: string;
    email: string;
    nickname: string;
  };
  token: string;
}

const USE_MOCK = false; 

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

    const { data } = await api.post('/v1/auth/signin', { email, password });
    
    return {
      user: {
        id: String(data.id),
        email: email,
        nickname: data.name,
      },
      token: data.accessToken,
    };
  },

  signup: async (email: string, password: string, nickname: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await api.post('/v1/auth/signup', {
      name: nickname,
      email,
      password,
    });
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }

    await api.post('/v1/auth/signout');
  },

  deleteAccount: async (): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    throw new Error('회원 탈퇴 API가 구현되지 않았습니다.');
  },
};

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      const token = parsed.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Token parsing error:', e);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };