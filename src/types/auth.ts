export type UserRole = 'CUSTOMER' | 'WORKER' | 'ADMIN';
export const APP_AUTH_ROLE: UserRole = 'WORKER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

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

export interface WorkerOnboardingFlags {
  isBasicInfoCompleted?: boolean;
  isServicesSelected?: boolean;
  isDocumentsCompleted?: boolean;
}

export interface AuthMeResponse {
  user: AuthUser;
  onboarding?:
    | ({
        role?: UserRole;
      } & WorkerOnboardingFlags)
    | {
    WORKER?: WorkerOnboardingFlags;
    [key: string]: unknown;
      };
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
  gender?: Gender;
  bio?: string;
  experienceYears?: number;
  referralCode?: string;
}

export interface CustomerProfilePayload {
  firstName: string;
  lastName?: string;
  email?: string;
  gender?: Gender;
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

export interface CategoryService {
  id: string;
  name: string;
  description?: string;
  iconText?: string;
  isCertificateRequired?: boolean;
}

export interface ServiceSubcategory {
  id: string;
  name: string;
  description?: string;
  iconText?: string;
  services?: CategoryService[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  iconText?: string;
  subcategories?: ServiceSubcategory[];
  services?: CategoryService[];
}

export interface CategoriesQuery {
  city: string;
  includeSubcategory?: boolean;
  includeServices?: boolean;
  includePriceOptions?: boolean;
  includeTask?: boolean;
}

export interface WorkerStatusCertificateItem {
  title?: string;
  description?: string;
  buttonText?: string;
  certificateStatus?: string;
  serviceId?: string;
  workerServiceId?: string;
  latestCertificateId?: string;
  latestFileId?: string;
}

export interface WorkerStatusData {
  worker?: unknown;
  requiredCertificates?: WorkerStatusCertificateItem[];
}
