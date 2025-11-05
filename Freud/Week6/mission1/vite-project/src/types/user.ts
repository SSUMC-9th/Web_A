export type User = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ResponseUserDto = {
    status: boolean;
    statusCode: number;
    message: string;
    data: User;
};
