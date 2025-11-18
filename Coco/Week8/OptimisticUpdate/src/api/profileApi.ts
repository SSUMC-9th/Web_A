import { api } from './authApi'; 
const USE_MOCK = false; 

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

    const { data } = await api.patch('/v1/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data || data;
  },
};