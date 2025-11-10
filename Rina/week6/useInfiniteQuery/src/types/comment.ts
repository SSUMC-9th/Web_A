export type CommentServer = {
    id: number;
    content: string;
    lpid: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author: {
        id: number;
        name: string;
        email: string;
        bio: string | null;
        avatar: string | null;
        createdAt: string;
        updatedAt: string;
    };
};

export type CommentClient = {
    id: number;
    body: string;
    authorName: string;
    authorAvatar: string | null;
    createdAt: string;
    updatedAt: string;
};

// 무한스크롤 페이지 단위
export type PaginatedCommentClient = {
    data: CommentClient[];
    nextCursor: number | null;
    hasNext: boolean;
};

// 댓글 목록 조회 API 응답
export type ResponseCommentListDto = {
    status: boolean;
    statusCode : number;
    message: string;

    data: {
        data: CommentServer[];
        nextCursor?: number | null;
        hasNext?: boolean;
    };

    nextCursor?: number | null;
    hasNext?: boolean;
};

// 댓글 작성 요청
export type PostCommentRequest = {
    content: string;
};

// 댓글 작성 응답
export type ResponsePostCommentDto = {
    status: boolean;
    statusCode: number;
    message: string;
    data: CommentServer;
}