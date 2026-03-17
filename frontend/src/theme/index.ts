/**
 * 🔱 Trishul Design System
 * Light, Premium, Enterprise Interface.
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ── Colors ─────────────────────────────────────────────────────────────────
export const COLORS = {
  // Brand
  primary: '#FF6B35', // Premium Trishul Orange
  primaryDark: '#E55A26',
  primaryLight: '#FF8C60',
  primarySubtle: 'rgba(255, 107, 53, 0.1)',

  secondary: '#1C1C2E',
  accent: '#FFD700',

  // Backgrounds & Surfaces (Light Theme)
  background: '#F7F9FC', // Soft, cool off-white (Apple-esque)
  surface: '#FFFFFF', // Clean white cards
  surfaceElevated: '#FFFFFF',
  surfaceHighlight: '#F1F3F5', // Hover/Active
  
  // Text
  text: '#111827', // Almost black for high readability
  textSecondary: '#4B5563', // Gray for subtitles
  textTertiary: '#9CA3AF', // Lighter gray for placeholders
  textInverse: '#FFFFFF', // Text on primary buttons

  // States & Feedback
  success: '#10B981',
  successSubtle: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',
  warningSubtle: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',
  errorSubtle: 'rgba(239, 68, 68, 0.1)',

  // Borders & Dividers
  border: '#E5E7EB',
  borderSubtle: '#F3F4F6',
} as const;

// ── Spacing (8pt Grid System) ──────────────────────────────────────────────
export const SPACING = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// ── Typography ─────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  bodySemibold: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
} as const;

// ── Metrics & Layouts ──────────────────────────────────────────────────────
export const METRICS = {
  screenWidth: width,
  screenHeight: height,
  baseRadius: 10, // Slightly sharper, cleaner edges
  largeRadius: 16,
  pillRadius: 999,
  borderWidth: 1,
} as const;

// ── Shadows & Elevation ────────────────────────────────────────────────────
export const SHADOWS = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// ── Motion & Animation Timing ──────────────────────────────────────────────
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
