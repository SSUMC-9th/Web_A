import type { PaginationDto } from "../types/common";
import type {
  CreateLpBody,
  ResponseCommentDto,
  ResponseCommentListDto,
  ResponseLikeLpDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

export const getLpDetail = async (lpId: number): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const postLp = async (body: CreateLpBody): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.post(`/v1/lps`, body);
  return data;
};

export const postLpLike = async (lpId: number): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLpLike = async (lpId: number): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

export const getLpComments = async (
  lpId: number,
  pagination: PaginationDto
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, { params: pagination });
  return data;
};

export const postLpComment = async (lpId: number, content: string): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
};
