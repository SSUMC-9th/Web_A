// hooks/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '로그인에 실패했습니다.');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuth((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      navigate('/login');
    },
  });
};

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const clearAuth = useAuth((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      clearAuth();
      navigate('/');
      alert('회원 탈퇴가 완료되었습니다.');
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      email,
      password,
      nickname,
    }: {
      email: string;
      password: string;
      nickname: string;
    }) => authApi.signup(email, password, nickname),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '회원가입에 실패했습니다.');
    },
  });
};