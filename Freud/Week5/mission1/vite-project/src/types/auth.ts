// 인증 관련 타입 정의
export interface UserData {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UserInfo {
    id: number;
    email: string;
    name: string;
    bio?: string | null;
    avatar?: string | null;
}

export interface TokenData {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResult {
    user: UserInfo;
    tokens: TokenData;
}

// API 요청/응답 타입 정의
export interface RequestSigninDto {
    email: string;
    password: string;
}

export interface RequestSignupDto {
    email: string;
    password: string;
    name: string;
}

export interface ResponseSigninDto {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        id: number;
        name: string;
        accessToken: string;
        refreshToken: string;
    };
}

export interface ResponseSignupDto {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        bio: string | null;
        avatar: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export interface ResponseMyInfoDto {
    status: boolean;
    statusCode: number;
    message: string;
    data: UserInfo;
}
