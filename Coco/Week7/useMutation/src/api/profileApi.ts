// api/profileApi.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const USE_MOCK = true;

export const profileApi = {
  updateProfile: async (formData: FormData) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: '1',
        email: 'test@example.com',
        nickname: formData.get('nickname') as string,
        bio: formData.get('bio') as string,
      };
    }

    const { data } = await api.patch('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};