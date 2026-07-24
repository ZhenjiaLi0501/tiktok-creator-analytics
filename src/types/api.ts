export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  requestId: string;
  timestamp: number;
};

export type PageResponse<T> = {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
};
