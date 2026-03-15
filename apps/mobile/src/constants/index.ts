// ── API ───────────────────────────────────────────────────────────────────
export const API_BASE_URL = __DEV__
  ? 'http://localhost:5000/api/v1'
  : 'https://api.trishul.app/api/v1';

export const SOCKET_URL = __DEV__ ? 'http://localhost:5000' : 'https://api.trishul.app';

// ── App ───────────────────────────────────────────────────────────────────
export const APP_NAME = 'Trishul';
export const APP_TAGLINE = 'Travel Agency Intelligence Platform';

// ── Storage Keys ──────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'trishul_access_token',
  REFRESH_TOKEN: 'trishul_refresh_token',
  USER_PROFILE: 'trishul_user_profile',
  THEME: 'trishul_theme',
} as const;

// ── Colors ────────────────────────────────────────────────────────────────
export const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E55A26',
  primaryLight: '#FF8C60',
  secondary: '#1C1C2E',
  accent: '#FFD700',
  background: '#0C0C1E',
  surface: '#1A1A2E',
  card: '#16213E',
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  border: '#2A2A4A',
} as const;

// ── Roles ─────────────────────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  DRIVER: 'DRIVER',
} as const;

// ── MFA Methods ───────────────────────────────────────────────────────────
export const MFA_METHODS = {
  TOTP: 'TOTP',
  EMAIL_OTP: 'EMAIL_OTP',
  SMS_OTP: 'SMS_OTP',
} as const;

// ── Trip Status ───────────────────────────────────────────────────────────
export const TRIP_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  PAUSED: 'PAUSED',
} as const;
