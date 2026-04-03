import axios, { AxiosRequestConfig, Method } from 'axios';
import { getAuthTokens } from '@/utils/key-chain-storage/auth-storage';
import { ApiError } from '@/types/api';
import { toBearerToken } from '@/utils/token';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RequestOptions = {
  auth?: boolean;
  headers?: Record<string, string>;
};

async function request<TResponse, TBody = unknown>(
  method: Method,
  path: string,
  body?: TBody,
  options: RequestOptions = {},
): Promise<TResponse> {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: path,
      data: body,
      headers: { ...(options.headers ?? {}) },
    };

    if (options.auth) {
      const tokens = await getAuthTokens();
      if (tokens?.accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: toBearerToken(tokens.accessToken),
        };
      }
    }

    const response = await client.request<TResponse>(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const payload = error.response?.data;
      const message =
        (payload as { message?: string })?.message ?? error.message ?? 'Request failed';
      throw new ApiError(message, statusCode, payload);
    }

    throw new ApiError('Unknown network error', 500, error);
  }
}

export function apiGet<TResponse>(path: string, options?: RequestOptions) {
  return request<TResponse>('GET', path, undefined, options);
}

export function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: RequestOptions,
) {
  return request<TResponse, TBody>('POST', path, body, options);
}

export function apiPatch<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: RequestOptions,
) {
  return request<TResponse, TBody>('PATCH', path, body, options);
}

export function apiDelete<TResponse>(path: string, options?: RequestOptions) {
  return request<TResponse>('DELETE', path, undefined, options);
}
