// hooks/useLpMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lpApi } from '../api/lpApi';

export const useCreateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => (lpApi as any).createLp(formData),
    onSuccess: () => {
      // LP 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      alert('LP가 성공적으로 등록되었습니다!');
    },
    onError: (error) => {
      console.error('LP 생성 실패:', error);
      alert('LP 등록에 실패했습니다.');
    },
  });
};

export const useUpdateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      (lpApi as any).updateLp(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lp', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      alert('LP가 수정되었습니다.');
    },
    onError: () => {
      alert('LP 수정에 실패했습니다.');
    },
  });
};

export const useDeleteLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => (lpApi as any).deleteLp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      alert('LP가 삭제되었습니다.');
    },
    onError: () => {
      alert('LP 삭제에 실패했습니다.');
    },
  });
};

export const useLikeLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => (lpApi as any).toggleLike(id),
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
  });
};