// hooks/useAuthMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from './useAuth';

// export 키워드가 있는지 확인!
export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuthState } = useAuth();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setAuthState(data.user, data.token);
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '로그인에 실패했습니다.');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: clearAuthState } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuthState();
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      clearAuthState();
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const { logout: clearAuthState } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      clearAuthState();
      queryClient.clear();
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/login');
    },
    onError: () => {
      alert('회원 탈퇴에 실패했습니다.');
    },
  });
};