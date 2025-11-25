export interface Lp {
  id: string;
  title: string;
  thumbnail: string;
  content: string;
  uploadDate: string;
  likes: number;
  userId: string;
}

export interface Comment {
  id: string;
  lpId: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export type SortOrder = 'latest' | 'oldest';