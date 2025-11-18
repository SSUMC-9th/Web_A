export type Tag = {
    id?: number;
    name?: string;
};

export type Likes = {
    id?: number;
    userId?: number;
    lpid?: number;
};

export type ResponseLpListDto = {
    status:  boolean;
    message: string;
    statusCode: number;
    data: {
        data: LpServer[];
        nextCursor?: number | null;
        hasNext?: boolean;
    };
    nextCursor?: number | null;
    hasNext?: boolean;
};

export type ResponseLpDetailDto = {
    status: boolean;
     message: string;
    statusCode: number;
    data: {
        id: number;
        title: string;
        content: string;
        thumbnail: string | null;
        published: boolean;
        authorId: number;
        createdAt: string; 
        updatedAt: string; 
        tags: Tag[];
        likes: Likes[];
    };
};

export type LpServer = {
    id: number;
    title: string;
    content: string;
    thumbnail: string | null;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Likes[];
}

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