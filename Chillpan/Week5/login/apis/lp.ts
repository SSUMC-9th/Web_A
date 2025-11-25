import type { PaginationDto, CommonResponse } from "../src/types/common.ts";
import axiosInstance from "./axios.ts";
import type {
  ResponseLpDetailDto,
  ResponseLpListDto,
} from "../src/types/lp.ts";
import type {
  ResponseLpCommentDeleteDto,
  ResponseLpCommentDto,
  ResponseLpCommentListDto,
} from "../src/types/comment.ts";
import type { PAGINATION_ORDER } from "../enums/common";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (
  lpId: number
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

type GetLpCommentsParams = {
  lpId: number;
  cursor?: number;
  limit?: number;
  order?: PAGINATION_ORDER;
};

export const getLpComments = async ({
  lpId,
  cursor,
  limit,
  order,
}: GetLpCommentsParams): Promise<ResponseLpCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: {
      cursor,
      limit,
      order,
    },
  });

  return data;
};

type CreateLpCommentParams = {
  lpId: number;
  content: string;
};

export const createLpComment = async ({
  lpId,
  content,
}: CreateLpCommentParams): Promise<ResponseLpCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });

  return data;
};

type UpdateLpCommentParams = {
  lpId: number;
  commentId: number;
  content: string;
};

export const updateLpComment = async ({
  lpId,
  commentId,
  content,
}: UpdateLpCommentParams): Promise<ResponseLpCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    {
      content,
    }
  );

  return data;
};

type DeleteLpCommentParams = {
  lpId: number;
  commentId: number;
};

export const deleteLpComment = async ({
  lpId,
  commentId,
}: DeleteLpCommentParams): Promise<ResponseLpCommentDeleteDto> => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );

  return data;
};

// 좋아요 관련 API
type CreateLikeResponse = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

type DeleteLikeResponse = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export const createLike = async (lpId: number): Promise<CreateLikeResponse> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async (lpId: number): Promise<DeleteLikeResponse> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};
