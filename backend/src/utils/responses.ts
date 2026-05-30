import type { ApiResponse } from '../types/index';

export const successResponse = <T>(
  data: T,
  message: string = 'Success'
): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

export const errorResponse = (error: string): ApiResponse => {
  return {
    success: false,
    error,
  };
};
