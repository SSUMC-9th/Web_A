import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLpComment,
  deleteLpComment,
  updateLpComment,
} from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

type CreateVariables = {
  lpId: number;
  content: string;
};

type UpdateVariables = {
  lpId: number;
  commentId: number;
  content: string;
};

type DeleteVariables = {
  lpId: number;
  commentId: number;
};

export function useCreateLpComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, content }: CreateVariables) =>
      createLpComment({ lpId, content }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
  });
}

export function useUpdateLpComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, commentId, content }: UpdateVariables) =>
      updateLpComment({ lpId, commentId, content }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
  });
}

export function useDeleteLpComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lpId, commentId }: DeleteVariables) =>
      deleteLpComment({ lpId, commentId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
  });
}
