import axios from 'axios';
import type { Lp, Comment, PaginatedResponse, SortOrder } from '../types/lp.types';

const api = axios.create({
  baseURL: '/api',
});

const mockLps: Lp[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  title: `테스트 LP ${i + 1}`,
  thumbnail: `https://picsum.photos/400/300?random=${i}`,
  content: `이것은 테스트 LP ${i + 1}의 내용입니다.`,
  uploadDate: new Date(Date.now() - i * 86400000).toISOString(),
  likes: Math.floor(Math.random() * 100),
  userId: 'user1',
}));

const mockComments: Comment[] = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 1}`,
  lpId: '1',
  content: `테스트 댓글 ${i + 1}입니다.`,
  userId: `user${i % 3 + 1}`,
  userName: `사용자${i % 3 + 1}`,
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

const USE_MOCK = true; 

export const lpApi = {
  getLps: async (page: number, sort: SortOrder): Promise<PaginatedResponse<Lp>> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const itemsPerPage = 8;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      const sortedLps = [...mockLps].sort((a, b) => {
        if (sort === 'latest') {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        }
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      });
      
      return {
        items: sortedLps.slice(startIndex, endIndex),
        hasMore: endIndex < sortedLps.length,
      };
    }

    // API 호출
    const { data } = await api.get('/v1/lps', {
      params: { page, sort }
    });
    return data;
  },

  getLpById: async (id: string): Promise<Lp> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const lp = mockLps.find(lp => lp.id === id);
      if (!lp) throw new Error('LP not found');
      return lp;
    }

    const { data } = await api.get(`/v1/lps/${id}`);
    return data;
  },

  getComments: async (
    lpId: string, 
    page: number, 
    order: SortOrder
  ): Promise<PaginatedResponse<Comment>> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const itemsPerPage = 5;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      const sortedComments = [...mockComments].sort((a, b) => {
        if (order === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
      return {
        items: sortedComments.slice(startIndex, endIndex),
        hasMore: endIndex < sortedComments.length,
      };
    }

    const { data } = await api.get(`/v1/lps/${lpId}/comments`, {
      params: { page, order }
    });
    return data;
  }, createLp: async (formData: FormData) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: String(Date.now()),
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        thumbnail: 'https://picsum.photos/400/300',
        uploadDate: new Date().toISOString(),
        likes: 0,
        userId: 'user1',
      };
    }

    const { data } = await api.post('/v1/lps', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  updateLp: async (id: string, formData: FormData) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    const { data } = await api.patch(`/v1/lps/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteLp: async (id: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }

    const { data } = await api.delete(`/v1/lps/${id}`);
    return data;
  },

  toggleLike: async (id: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }

    const { data } = await api.post(`/v1/lps/${id}/like`);
    return data;
  },

  createComment: async (lpId: string, content: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: String(Date.now()),
        lpId,
        content,
        userId: 'user1',
        userName: '테스트유저',
        createdAt: new Date().toISOString(),
      };
    }

    const { data } = await api.post(`/v1/lps/${lpId}/comments`, { content });
    return data;
  },

  updateComment: async (commentId: string, content: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }

    const { data } = await api.patch(`/v1/comments/${commentId}`, { content });
    return data;
  },

  deleteComment: async (commentId: string) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }

    const { data } = await api.delete(`/v1/comments/${commentId}`);
    return data;
  },
};