import api from './api';
import { setItemAsync, getItemAsync, deleteItemAsync } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface MfaVerifyPayload {
  userId: string;
  method: string;
  token: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  requiresMfa: boolean;
  userId?: string;
  mfaMethod?: string;
  tokens?: { accessToken: string; refreshToken: string };
  user?: AuthUser;
}

const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post('/auth/login', payload);
    return data.data;
  },

  async verifyMfa(payload: MfaVerifyPayload): Promise<LoginResponse> {
    const { data } = await api.post('/auth/mfa/verify', payload);
    const result: LoginResponse = data.data;

    if (result.tokens) {
      await authService.storeTokens(result.tokens, result.user!);
    }
    return result;
  },

  async loginAndStore(payload: LoginPayload): Promise<LoginResponse> {
    const result = await authService.login(payload);
    if (!result.requiresMfa && result.tokens) {
      await authService.storeTokens(result.tokens, result.user!);
    }
    return result;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore API errors on logout
    } finally {
      await deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      await deleteItemAsync(STORAGE_KEYS.USER_PROFILE);
    }
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  async storeTokens(
    tokens: { accessToken: string; refreshToken: string },
    user: AuthUser
  ): Promise<void> {
    await setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    await setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    await setItemAsync(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  },

  async getStoredUser(): Promise<AuthUser | null> {
    const raw = await getItemAsync(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  },
};

export default authService;
