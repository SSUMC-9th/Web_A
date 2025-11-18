export type Tag = {
    id?: number;
    name?: string;
};

export type Likes = {
    id?: number;
    userId?: number;
    lpId?: number;
};

// 서버에서 내려오는 lp
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
};

//프론트에서 사용하는 lpclient
export type LpClient = {
    id: number;
    title: string;
    body: string;
    thumbnailUrl: string | null;
    likes: number;
    createdAt: string;
    updatedAt: string;
};

// 상세페이지 전용 lpdetailclient
export type LpDetailClient = LpClient & {
    tags: Tag[];
    likesList: Likes[];
}

// 요청
export type RequestLpDto = {
    lpid: number;

}

// 응답

// 리스트 응답
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

// 상세 응답
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


export type PaginatedLpClient = {
    data: LpClient[];
    nextCursor: number | null;
    hasNext: boolean;
}