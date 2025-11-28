export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export type UnwrapApiResponse<T> = T;
