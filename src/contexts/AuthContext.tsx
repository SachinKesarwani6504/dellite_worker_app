import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearAuthTokens,
  clearPhoneToken,
  createWorkerProfile,
  refreshAuth,
  getAuthTokens,
  getMe,
  getPhoneToken,
  logoutCurrentSession,
  resendOtp,
  saveAuthTokens,
  savePhoneToken,
  sendOtp,
  verifyOtp,
} from '@/actions';
import { APP_AUTH_ROLE, AuthUser, UserRole, WorkerProfilePayload } from '@/types/auth';

type AuthStatus = 'bootstrapping' | 'logged_out' | 'phone_verified' | 'authenticated';

type AuthContextType = {
  user: AuthUser | null;
  status: AuthStatus;
  loading: boolean;
  phone: string;
  isAuthenticated: boolean;
  sendOtpCode: (phone: string, role?: UserRole) => Promise<void>;
  verifyOtpCode: (phone: string, otp: string) => Promise<void>;
  resendOtpCode: (phone: string) => Promise<void>;
  completeOnboarding: (payload: WorkerProfilePayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('bootstrapping');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const refreshMe = useCallback(async () => {
    const me = await getMe();
    setUser(me);
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const [tokens, phoneToken] = await Promise.all([getAuthTokens(), getPhoneToken()]);
      if (tokens?.accessToken) {
        try {
          await refreshMe();
          setStatus('authenticated');
        } catch {
          if (!tokens.refreshToken) {
            throw new Error('Missing refresh token');
          }
          const refreshed = await refreshAuth(tokens.refreshToken);
          await saveAuthTokens(refreshed);
          await refreshMe();
          setStatus('authenticated');
        }
      } else if (phoneToken) {
        setStatus('phone_verified');
      } else {
        setStatus('logged_out');
      }
    } catch {
      setStatus('logged_out');
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
        await clearPhoneToken();
        await refreshMe();
        setStatus('authenticated');
        return;
      }

      if (response.phoneToken) {
        await savePhoneToken(response.phoneToken);
        setStatus('phone_verified');
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
      const phoneToken = await getPhoneToken();
      if (!phoneToken) {
        throw new Error('Phone token missing. Please verify OTP again.');
      }

      const response = (await createWorkerProfile(payload, phoneToken)) as {
        accessToken?: string;
        refreshToken?: string;
        tokens?: { accessToken?: string; refreshToken?: string };
      };
      const accessToken = response.accessToken ?? response.tokens?.accessToken;
      const refreshToken = response.refreshToken ?? response.tokens?.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('Profile created, but auth tokens are missing.');
      }

      await saveAuthTokens({ accessToken, refreshToken });
      await clearPhoneToken();
      await refreshMe();
      setStatus('authenticated');
    },
    [refreshMe],
  );

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
      await Promise.all([clearAuthTokens(), clearPhoneToken()]);
      setUser(null);
      setPhone('');
      setStatus('logged_out');
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      status,
      loading,
      phone,
      isAuthenticated: status === 'authenticated',
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
      logout,
      refreshMe,
    }),
    [
      user,
      status,
      loading,
      phone,
      sendOtpCode,
      verifyOtpCode,
      resendOtpCode,
      completeOnboarding,
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
