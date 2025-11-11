import type { PAGINATION_ORDER } from "../enums/common";
import type { PaginationDto } from "../types/common"
import type { LpClient, LpDetailClient, PaginatedLpClient, RequestLpDto, ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
import { api } from "./axios";

// 서버 원본 DTO 그대로 받는 함수
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
  likes: Array.isArray(d.likes) ? d.likes.length : 0,
  createdAt: String(d.createdAt),
  updatedAt: String(d.updatedAt),
});

// 클라이언트 모델로 변환해 반환하는 함수
export const getLpListClient = async (
  pagination : PaginationDto & { order?: PAGINATION_ORDER, limit?: number}
) : Promise<PaginatedLpClient> => {
  const response = await api.get<ResponseLpListDto>("/v1/lps", {
    params: pagination,
  });
  const dto = response.data;

  const payload = dto.data;

  return {
    data: payload.data.map(toClient),
    nextCursor: payload.nextCursor ?? null,
    hasNext: !!payload.hasNext,
  };
};

export const getLpDetail = async ({lpid}: RequestLpDto): Promise<LpDetailClient> => {
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
    tags: d.tags,
    likesList: d.likes,
  }
}


// LP 생성/수정/삭제
export type CreateLpBody = {
  title: string;
  content: string;
  thumbnail?: string | null;
  tags: string[];
  published?: boolean;
};

export const createLp = async (body: CreateLpBody) => {
  // 서버가 JSON을 받되, 빈 필드는 제외
  const payload: Record<string, unknown> = {};
  if (body.title?.trim()) payload.title = body.title.trim();
  if (body.content?.trim()) payload.content = body.content.trim();
  if (body.thumbnail !== undefined) payload.thumbnail = body.thumbnail ?? null;
  if (Array.isArray(body.tags) && body.tags.length > 0) payload.tags = body.tags;
  if (body.published !== undefined) payload.published = body.published;

  const {data} = await api.post("/v1/lps", payload, {
    withAuth: true,
  });
  return data;
};

export const updateLp = async (lpid : number, body: Partial<CreateLpBody>) => {
  const payload: Record<string, unknown> = {};
  if (body.title !== undefined) payload.title = body.title?.trim() ?? "";
  if (body.content !== undefined) payload.content = body.content?.trim() ?? "";
  if (body.thumbnail !== undefined) payload.thumbnail = body.thumbnail ?? null;
  if (body.tags !== undefined) payload.tags = body.tags;
  if (body.published !== undefined) payload.published = body.published;

  const {data} = await api.patch(`/v1/lps/${lpid}`, payload, {
    withAuth: true, 
  });
  return data;
};

export const deleteLp = async (lpid: number) => {
  const {data} = await api.delete(`/v1/lps/${lpid}`, {withAuth: true});
  return data;
};