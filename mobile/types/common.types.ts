/**
 * Common Type Definitions
 */

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface BackendResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
