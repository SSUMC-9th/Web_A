import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';
import { useAuth } from './useAuth';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updateProfile(formData),
    
    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 변경
    onMutate: async (formData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['user'] });

      // 이전 유저 데이터 백업
      const previousUser = user;

      // FormData에서 값 추출
      const nickname = formData.get('nickname') as string;
      const bio = formData.get('bio') as string;

      // 낙관적 업데이트: 즉시 UI 변경
      if (nickname) {
        updateUser({ nickname, bio });
      }

      // 롤백을 위해 이전 데이터 반환
      return { previousUser };
    },

    // 에러 발생 시 롤백
    onError: (error, variables, context) => {
      if (context?.previousUser) {
        // 이전 상태로 복구
        updateUser(context.previousUser);
      }
      alert('프로필 수정에 실패했습니다.');
    },

    // 성공 시 서버 데이터로 동기화
    onSuccess: (data) => {
      updateUser(data);
      alert('프로필이 수정되었습니다.');
    },
  });
};