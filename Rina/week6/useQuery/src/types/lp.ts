export type Lp = {
    id: number;
    title: string;
    thumbnailUrl: string;
    body: string;
    likes: number;
    createdAt: string;
    updatedAt: string;
}
export type Paginated<T> = {
    data: T[];
    total: number;
}