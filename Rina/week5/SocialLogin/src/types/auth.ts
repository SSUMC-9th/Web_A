import type { CommonResponse } from "./common";

// 요청 DTO
export type RequestSignupDto = {
    name: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: string;
};

export type RequestSigninDto = {
    email: string;
    password: string;
};

// 응답 DTO
export type ResponseSignupDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}>;

export type ResponseSigninDto = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

export type ResponseMyInfoDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string| null;
    createdAt: string;
    updatedAt: string;
}>
