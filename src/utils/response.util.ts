export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ResponseUtil {
  static success<T>(
    data: T,
    message?: string,
    meta?: ApiResponse<T>["meta"]
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message: string, error?: string): ApiResponse<null> {
    return {
      success: false,
      message,
      error,
    };
  }
}