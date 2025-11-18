import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lpApi } from '../api/lpApi';

export const useCreateComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => lpApi.createComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
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
    },
  });
};

export const useDeleteComment = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => lpApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
    },
  });
};