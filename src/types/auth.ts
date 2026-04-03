export type UserRole = 'CUSTOMER' | 'WORKER' | 'ADMIN';
export const APP_AUTH_ROLE: UserRole = 'WORKER';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}

export interface SendOtpPayload {
  phone: string;
  role: UserRole;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface VerifyOtpResult {
  accessToken?: string;
  refreshToken?: string;
  phoneToken?: string;
  user?: AuthUser;
}

export interface WorkerProfilePayload {
  firstName: string;
  lastName?: string;
  email?: string;
  bio?: string;
  experienceYears?: number;
  referralCode?: string;
}

export interface WorkerServicePayload {
  city: string;
  services: string[];
}

export interface WorkerServiceUpdatePayload {
  workerServiceId: string;
  cityId?: string;
  experienceYears?: number;
  priceOverride?: number;
}

export interface WorkerCertificateCreatePayload {
  certificates: Array<{
    workerServiceId: string;
    fileId?: string;
  }>;
}

export interface WorkerCertificateUpdatePayload {
  certificateId: string;
  title?: string;
  description?: string;
  workerServiceId?: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  issuedAt?: string;
  expiresAt?: string;
  fileId?: string;
}
