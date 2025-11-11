import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lpApi } from '../api/lpApi';
import type { Lp } from '../types/lp.types';


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
export const useLikeLp = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => lpApi.toggleLike(lpId),
    
    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 변경
    onMutate: async () => {
      // 진행 중인 쿼리 취소 (충돌 방지)
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });

      // 이전 데이터 백업 (롤백용)
      const previousLp = queryClient.getQueryData<Lp>(['lp', lpId]);

      // 낙관적 업데이트: 좋아요 수 즉시 증가
      queryClient.setQueryData<Lp>(['lp', lpId], (old) => {
        if (!old) return old;
        return {
          ...old,
          likes: old.likes + 1,
        };
      });

      // 롤백을 위해 이전 데이터 반환
      return { previousLp };
    },
    onError: (error, variables, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(['lp', lpId], context.previousLp);
      }
      alert('좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
  });
};
