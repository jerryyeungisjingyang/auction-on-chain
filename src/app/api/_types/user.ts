export interface User {
  id: string;
  walletAddress: string;
  createdAt: number;
  updatedAt: number;
}

export interface ListResult<T> {
  items: T[];
  total: number;
}

