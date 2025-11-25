import type { CommonResponse, CursorBasedResponse } from "./common";

export type LpCommentAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LpComment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: LpCommentAuthor;
};

export type ResponseLpCommentListDto = CursorBasedResponse<LpComment[]>;
export type ResponseLpCommentDto = CommonResponse<LpComment>;
export type ResponseLpCommentDeleteDto = CommonResponse<{ message: string }>;
