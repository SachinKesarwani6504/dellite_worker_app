import { apiGet, apiPost } from '@/actions/http/httpClient';
import { ApiEnvelope } from '@/types/api';
import {
  APP_AUTH_ROLE,
  AuthTokens,
  AuthUser,
  SendOtpPayload,
  UserRole,
  VerifyOtpPayload,
  VerifyOtpResult,
} from '@/types/auth';
import { toBearerToken } from '@/utils/token';

function unwrapData<T>(payload: T | ApiEnvelope<T>): T {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    const envelope = payload as ApiEnvelope<T>;
    return (envelope.data ?? ({} as T)) as T;
  }
  return payload as T;
}

type VerifyResponseData = {
  accessToken?: string;
  refreshToken?: string;
  phoneToken?: string;
  user?: AuthUser;
};

export async function sendOtp(payload: SendOtpPayload): Promise<void> {
  await apiPost<ApiEnvelope<{ otp?: string }>, SendOtpPayload>('/auth/send-otp', payload);
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResult> {
  const response = await apiPost<ApiEnvelope<VerifyResponseData>, VerifyOtpPayload>(
    '/auth/verify-otp',
    payload,
  );
  const data = unwrapData(response);
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    phoneToken: data.phoneToken,
    user: data.user,
  };
}

export async function resendOtp(phone: string): Promise<void> {
  await apiPost<ApiEnvelope<{ otp?: string }>, { phone: string }>('/auth/resend-otp', { phone });
}

export async function refreshAuth(refreshToken: string): Promise<AuthTokens> {
  const response = await apiPost<
    ApiEnvelope<{ accessToken: string; refreshToken: string }>,
    { refreshToken: string }
  >('/auth/refresh', { refreshToken: toBearerToken(refreshToken) });
  return unwrapData(response);
}

export async function logoutCurrentSession(refreshToken: string): Promise<void> {
  await apiPost<ApiEnvelope<{ loggedOut: boolean }>, { refreshToken: string }>('/auth/logout', {
    refreshToken: toBearerToken(refreshToken),
  });
}

export async function getMe(role: UserRole = APP_AUTH_ROLE): Promise<AuthUser> {
  const response = await apiGet<ApiEnvelope<AuthUser>>(`/auth/me?role=${role}`, { auth: true });
  const data = unwrapData(response) as AuthUser | { user?: AuthUser };
  return (data as { user?: AuthUser }).user ?? (data as AuthUser);
}
