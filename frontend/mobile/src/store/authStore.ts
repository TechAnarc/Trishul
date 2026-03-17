import { create } from 'zustand';
import authService, { AuthUser } from '../services/auth.service';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingMfaUserId: string | null;
  pendingMfaMethod: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<{ requiresMfa: boolean }>;
  verifyMfa: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingMfaUserId: null,
  pendingMfaMethod: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    const result = await authService.loginAndStore({ email, password });

    if (result.requiresMfa) {
      set({ pendingMfaUserId: result.userId!, pendingMfaMethod: result.mfaMethod! });
      return { requiresMfa: true };
    }

    set({
      user: result.user!,
      isAuthenticated: true,
      pendingMfaUserId: null,
      pendingMfaMethod: null,
    });
    return { requiresMfa: false };
  },

  verifyMfa: async (token) => {
    const { pendingMfaUserId, pendingMfaMethod } = get();
    if (!pendingMfaUserId || !pendingMfaMethod) throw new Error('No pending MFA session');

    const result = await authService.verifyMfa({
      userId: pendingMfaUserId,
      method: pendingMfaMethod,
      token,
    });

    set({
      user: result.user!,
      isAuthenticated: true,
      pendingMfaUserId: null,
      pendingMfaMethod: null,
    });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, pendingMfaUserId: null, pendingMfaMethod: null });
  },

  checkAuthStatus: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getStoredUser();
      if (user) {
        // Verify token is still valid
        const freshUser = await authService.getMe();
        set({ user: freshUser, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
