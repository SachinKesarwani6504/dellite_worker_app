import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearAuthTokens,
  createProfileWithPhoneToken,
  refreshAuth,
  getAuthTokens,
  getMe,
  logoutCurrentSession,
  resendOtp,
  saveAuthTokens,
  sendOtp,
  verifyOtp,
} from '@/actions';
import { AuthStatus } from '@/types/auth-status';
import {
  APP_AUTH_ROLE,
  AuthMeResponse,
  AuthUser,
  UserRole,
  WorkerOnboardingFlags,
  WorkerProfilePayload,
} from '@/types/auth';
import { ApiError } from '@/types/api';
import { OnboardingStackParamList } from '@/types/navigation';

type OnboardingRouteName = keyof OnboardingStackParamList;
type OnboardingPayload = AuthMeResponse['onboarding'];

type AuthContextType = {
  user: AuthUser | null;
  status: AuthStatus;
  loading: boolean;
  phone: string;
  onboardingRoute: OnboardingRouteName;
  isAuthenticated: boolean;
  sendOtpCode: (phone: string, role?: UserRole) => Promise<void>;
  verifyOtpCode: (phone: string, otp: string) => Promise<void>;
  resendOtpCode: (phone: string) => Promise<void>;
  completeOnboarding: (payload: WorkerProfilePayload) => Promise<void>;
  completeOnboardingFlow: () => void;
  logout: () => Promise<void>;
  refreshMe: () => Promise<AuthStatus>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractWorkerOnboardingFlags(onboarding?: OnboardingPayload): WorkerOnboardingFlags | undefined {
  if (!onboarding || typeof onboarding !== 'object') {
    return undefined;
  }

  const toBoolean = (value: unknown): boolean | undefined => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
      return undefined;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return undefined;
  };

  const normalizeFlags = (raw: unknown): WorkerOnboardingFlags | undefined => {
    if (!raw || typeof raw !== 'object') return undefined;
    const source = raw as Record<string, unknown>;
    return {
      isBasicInfoCompleted: toBoolean(source.isBasicInfoCompleted),
      isServicesSelected: toBoolean(source.isServicesSelected),
      isDocumentsCompleted: toBoolean(source.isDocumentsCompleted),
    };
  };

  if ('WORKER' in onboarding && onboarding.WORKER && typeof onboarding.WORKER === 'object') {
    return normalizeFlags(onboarding.WORKER);
  }

  const hasFlatFlags =
    'isBasicInfoCompleted' in onboarding ||
    'isServicesSelected' in onboarding ||
    'isDocumentsCompleted' in onboarding;

  if (!hasFlatFlags) {
    return undefined;
  }

  return normalizeFlags(onboarding);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.BOOTSTRAPPING);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [onboardingRoute, setOnboardingRoute] = useState<OnboardingRouteName>('OnboardingIdentity');
  const [phoneVerificationToken, setPhoneVerificationToken] = useState<string | null>(null);

  const applyOnboardingFromWorkerFlags = useCallback((flags?: WorkerOnboardingFlags) => {
    if (!flags) {
      setOnboardingRoute('OnboardingWelcome');
      return AuthStatus.AUTHENTICATED;
    }

    if (!flags?.isBasicInfoCompleted) {
      setOnboardingRoute('OnboardingIdentity');
      return AuthStatus.ONBOARDING;
    }
    if (!flags?.isServicesSelected) {
      setOnboardingRoute('OnboardingVehicle');
      return AuthStatus.ONBOARDING;
    }
    if (!flags?.isDocumentsCompleted) {
      setOnboardingRoute('OnboardingCertification');
      return AuthStatus.ONBOARDING;
    }
    setOnboardingRoute('OnboardingWelcome');
    return AuthStatus.AUTHENTICATED;
  }, []);

  const refreshMe = useCallback(async () => {
    const me = (await getMe()) as AuthMeResponse;
    setUser(me.user);
    return applyOnboardingFromWorkerFlags(extractWorkerOnboardingFlags(me.onboarding));
  }, [applyOnboardingFromWorkerFlags]);

  const bootstrap = useCallback(async () => {
    try {
      const tokens = await getAuthTokens();
      if (tokens?.accessToken) {
        try {
          const nextStatus = await refreshMe();
          setStatus(nextStatus);
        } catch {
          if (!tokens.refreshToken) {
            throw new Error('Missing refresh token');
          }
          const refreshed = await refreshAuth(tokens.refreshToken);
          await saveAuthTokens(refreshed);
          const nextStatus = await refreshMe();
          setStatus(nextStatus);
        }
      } else {
        setPhoneVerificationToken(null);
        setStatus(AuthStatus.LOGGED_OUT);
      }
    } catch {
      setPhoneVerificationToken(null);
      setStatus(AuthStatus.LOGGED_OUT);
    }
  }, [refreshMe]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const sendOtpCode = useCallback(async (phoneNumber: string, role: UserRole = APP_AUTH_ROLE) => {
    await sendOtp({ phone: phoneNumber, role });
    setPhone(phoneNumber);
  }, []);

  const verifyOtpCode = useCallback(
    async (phoneNumber: string, otp: string) => {
      const response = await verifyOtp({ phone: phoneNumber, otp });
      setPhone(phoneNumber);

      if (response.accessToken && response.refreshToken) {
        await saveAuthTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        setPhoneVerificationToken(null);
        setStatus(AuthStatus.ONBOARDING);
        try {
          const nextStatus = await refreshMe();
          setStatus(nextStatus);
        } catch {
          setStatus(AuthStatus.ONBOARDING);
        }
        return;
      }

      if (response.phoneToken) {
        setPhoneVerificationToken(response.phoneToken);
        setOnboardingRoute('OnboardingIdentity');
        setStatus(AuthStatus.PHONE_VERIFIED);
        return;
      }

      throw new Error('Invalid verification response from server.');
    },
    [refreshMe],
  );

  const resendOtpCode = useCallback(async (phoneNumber: string) => {
    await resendOtp(phoneNumber);
  }, []);

  const completeOnboarding = useCallback(
    async (payload: WorkerProfilePayload) => {
      const phoneToken = phoneVerificationToken;
      if (!phoneToken) {
        setStatus(AuthStatus.LOGGED_OUT);
        throw new Error('Phone token missing. Please verify OTP again.');
      }

      let response: {
        accessToken?: string;
        refreshToken?: string;
        tokens?: { accessToken?: string; refreshToken?: string };
      };

      try {
        response = (await createProfileWithPhoneToken(payload, phoneToken)) as {
          accessToken?: string;
          refreshToken?: string;
          tokens?: { accessToken?: string; refreshToken?: string };
        };
      } catch (error) {
        if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
          setPhoneVerificationToken(null);
          setStatus(AuthStatus.LOGGED_OUT);
        }
        throw error;
      }

      const accessToken = response.accessToken ?? response.tokens?.accessToken;
      const refreshToken = response.refreshToken ?? response.tokens?.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('Profile created, but auth tokens are missing.');
      }

      await saveAuthTokens({ accessToken, refreshToken });
      setPhoneVerificationToken(null);
      setStatus(AuthStatus.ONBOARDING);
      try {
        const nextStatus = await refreshMe();
        setStatus(nextStatus);
      } catch {
        setStatus(AuthStatus.ONBOARDING);
      }
    },
    [phoneVerificationToken, refreshMe],
  );

  const completeOnboardingFlow = useCallback(() => {
    setStatus(AuthStatus.AUTHENTICATED);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const tokens = await getAuthTokens();
      if (tokens?.refreshToken) {
        await logoutCurrentSession(tokens.refreshToken);
      }
    } catch {
      // Even if API logout fails, we clear local session for safety.
    } finally {
      await clearAuthTokens();
      setPhoneVerificationToken(null);
      setUser(null);
      setPhone('');
      setStatus(AuthStatus.LOGGED_OUT);
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      status,
      loading,
      phone,
      onboardingRoute,
      isAuthenticated: status === AuthStatus.AUTHENTICATED,
      sendOtpCode: async (phoneNumber, role) => {
        setLoading(true);
        try {
          await sendOtpCode(phoneNumber, role);
        } finally {
          setLoading(false);
        }
      },
      verifyOtpCode: async (phoneNumber, otp) => {
        setLoading(true);
        try {
          await verifyOtpCode(phoneNumber, otp);
        } finally {
          setLoading(false);
        }
      },
      resendOtpCode: async phoneNumber => {
        setLoading(true);
        try {
          await resendOtpCode(phoneNumber);
        } finally {
          setLoading(false);
        }
      },
      completeOnboarding: async payload => {
        setLoading(true);
        try {
          await completeOnboarding(payload);
        } finally {
          setLoading(false);
        }
      },
      completeOnboardingFlow,
      logout,
      refreshMe,
    }),
    [
      user,
      status,
      loading,
      phone,
      onboardingRoute,
      sendOtpCode,
      verifyOtpCode,
      resendOtpCode,
      completeOnboarding,
      completeOnboardingFlow,
      logout,
      refreshMe,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return context;
}
