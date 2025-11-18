import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpid: number;
};

export type ResponseLpListDto = CursorBasedResponse<{
    data: {
        id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags : Tag[];
        likes: Likes[];
    }[];
}>;

export type ResponseLpDetailDto = CommonResponse<{
    id: number;
    title: string;
    content: string;
    thumbnail : string | null;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    likes: Likes[];
}>;

export type LpClient = {
    id: number;
    title: string;
    body: string;
    thumbnailUrl: string | null;
    likes: number;
    createdAt: string;
    updatedAt: string;
}

export type PaginatedLpClient = {
    data: LpClient[];
    nextCursor: number | null;
    hasNext: boolean;
}