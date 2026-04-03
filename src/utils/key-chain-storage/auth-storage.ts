import { AuthTokens } from '@/types/auth';
import { keyChainValues } from '@/utils/key-chain-storage/key-chain-values';
import {
  getSecureValue,
  removeSecureValue,
  saveSecureValue,
} from '@/utils/key-chain-storage/key-chain-service';

export async function saveAuthTokens(tokens: AuthTokens): Promise<void> {
  await saveSecureValue(
    keyChainValues.authService,
    keyChainValues.authUsername,
    JSON.stringify(tokens),
  );
}

export async function getAuthTokens(): Promise<AuthTokens | null> {
  const value = await getSecureValue(keyChainValues.authService, keyChainValues.authUsername);
  if (!value) return null;
  return JSON.parse(value) as AuthTokens;
}

export async function clearAuthTokens(): Promise<void> {
  await removeSecureValue(keyChainValues.authService, keyChainValues.authUsername);
}

export async function savePhoneToken(phoneToken: string): Promise<void> {
  await saveSecureValue(
    keyChainValues.phoneTokenService,
    keyChainValues.phoneUsername,
    phoneToken,
  );
}

export async function getPhoneToken(): Promise<string | null> {
  return getSecureValue(keyChainValues.phoneTokenService, keyChainValues.phoneUsername);
}

export async function clearPhoneToken(): Promise<void> {
  await removeSecureValue(keyChainValues.phoneTokenService, keyChainValues.phoneUsername);
}
