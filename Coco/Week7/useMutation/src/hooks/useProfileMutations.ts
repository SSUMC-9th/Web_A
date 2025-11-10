// hooks/useProfileMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';
import { useAuth } from './useAuth';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updateProfile(formData),
    onSuccess: (data) => {
      // 유저 정보 업데이트
      updateUser(data);
      alert('프로필이 수정되었습니다.');
    },
    onError: () => {
      alert('프로필 수정에 실패했습니다.');
    },
  });
};