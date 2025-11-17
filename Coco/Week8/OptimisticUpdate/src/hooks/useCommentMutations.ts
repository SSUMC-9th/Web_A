// hooks/useCommentMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lpApi } from '../api/lpApi';

export const useCreateComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => lpApi.createComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
    },
    onError: () => {
      alert('댓글 작성에 실패했습니다.');
    },
  });
};

export const useUpdateComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      lpApi.updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      alert('댓글이 수정되었습니다.');
    },
    onError: () => {
      alert('댓글 수정에 실패했습니다.');
    },
  });
};

export const useDeleteComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => lpApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      alert('댓글이 삭제되었습니다.');
    },
    onError: () => {
      alert('댓글 삭제에 실패했습니다.');
    },
  });
};