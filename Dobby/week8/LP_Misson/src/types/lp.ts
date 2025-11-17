import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Like = {
  id: number;
  userId: number;
  lpId: number;
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
    tags: Tag[];
    likes: Like[];
  };
}>;

export type ResponseLpDetailDto = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Like[];
}>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export type Comment = {
  id: number;
  userId: number;
  lpId: number;
  content: string;
  createdAt: Date;
};

export type ResponseCommentListDto = CursorBasedResponse<{
  data: Comment;
}>;

export type ResponseCommentDto = CommonResponse<Comment>;

// LP 생성 요청 바디 (Swagger 스펙 기준)
export type CreateLpBody = {
  title: string;
  content?: string;
  thumbnail: string;
  tags?: string[];
  published?: boolean;
};
