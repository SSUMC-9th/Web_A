import type { CursorBasedResponse } from "./common.ts";

export type Comment = {
    id: number;
    content: string;
    authorId: number;
    lpId: number;
    createdAt: string;
    updatedAt: string;
    author?: {
        id: number;
        name: string;
        email: string;
    };
};

export type ResponseCommentListDto = CursorBasedResponse<{
    data: Comment[];
}>;
