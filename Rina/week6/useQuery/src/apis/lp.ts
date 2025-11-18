import type { PAGINATION_ORDER } from "../enums/common";
import type { PaginationDto } from "../types/common"
import type { LpClient, PaginatedLpClient, ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import { api } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto
) :Promise<ResponseLpListDto> => {
  const {data} = await api.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
}

const toClient = (d: ResponseLpListDto["data"]["data"][number]) : LpClient => ({
  id: d.id,
  title : d.title,
  body: d.content,
  thumbnailUrl: d.thumbnail ?? null,
  likes: d.likes.length ?? 0,
  createdAt: String(d.createdAt),
  updatedAt: String(d.updatedAt),
});

export const getLpListClient = async (
  pagination : PaginationDto & { order?: PAGINATION_ORDER, limit?: number}
) : Promise<PaginatedLpClient> => {
  const response = await api.get<ResponseLpListDto>("/v1/lps", {
    params: pagination,
  });
  const dto = response.data;

  return {
    data: dto.data.data.map(toClient),
    nextCursor: dto.nextCursor ?? null,
    hasNext: dto.hasNext ?? false,
  };
};

export const getLp = async (lpid: string): Promise<LpClient> => {
  const response = await api.get<ResponseLpDetailDto>(`/v1/lps/${lpid}`);
  const d = response.data.data;

  return {
    id: d.id,
    title: d.title,
    body: d.content,
    thumbnailUrl: d.thumbnail ?? null,
    likes: Array.isArray(d.likes) ? d.likes.length : 0,
    createdAt: String(d.createdAt),
    updatedAt: String(d.updatedAt),
  }
}
