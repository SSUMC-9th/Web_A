import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { PAGINATION_ORDER } from "../enums/common";
import type { CommentClient, CommentServer, PaginatedCommentClient, PostCommentRequest, ResponseCommentListDto } from "../types/comment";
import type { PaginationDto } from "../types/common";
import { api } from "./axios";

// 서버의 comment > 클라이언트 comment로 변환하깅
const toClient = (c: CommentServer) : CommentClient => ({
    id: c.id,
    body: c.content,
    authorName: c.author?.name ?? "익명",
    authorAvatar: c.author?.avatar ?? null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
});

export async function getComments(
    lpId: string | number,
    params: PaginationDto & { order?: PAGINATION_ORDER; limit?: number }
) : Promise<PaginatedCommentClient> {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    const {data : res} = await api.get<ResponseCommentListDto>(
        `/v1/lps/${lpId}/comments`, {
            params,
            withAuth: !!token,
        }
    );

    const nextCursor = res.data?.nextCursor ?? res.nextCursor ?? null;
    const hasNext = res.data?.hasNext ?? res.hasNext ?? false;
    const list = res.data?.data ?? [];

    return {
        data: list.map(toClient),
        nextCursor,
        hasNext,
    };
}

export async function postComment(
    lpId: string | number,
    body: PostCommentRequest,
) {
    const {data} = await api.post<unknown>(
        `/v1/lps/${lpId}/comments`,
        body,
        {withAuth: true}
    );
    return data;
}

export async function patchComment(
    lpId: string | number,
    commentId: number,
    content: string
) {
    const {data} = await api.patch<unknown>(
        `/v1/lps/${lpId}/comments/${commentId}`,
        {content},
        {withAuth: true}
    );
    return data;
};

export async function deleteComment(
    lpId : string | number,
    commentId: number
) {
    const {data} = await api.delete<unknown>(
        `/v1/lps/${lpId}/comments/${commentId}`,
        {withAuth: true}
    );
    return data;
}