/**
 * 🔱 Trishul Design System
 * Premium, Advanced Dark Theme Interface.
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ── Colors ─────────────────────────────────────────────────────────────────
export const COLORS = {
  // Brand Main Accents
  primary: '#FF6B35', // Premium Trishul Orange
  primaryDark: '#E55A26',
  primaryLight: '#FF8C60',
  primarySubtle: 'rgba(255, 107, 53, 0.15)',

  secondary: '#00F0FF', // Neon Cyan Accent
  accent: '#FFD700', // Gold/Yellow rating accents

  // Backgrounds & Surfaces (Premium Dark Theme)
  background: '#0B0F19', // Deep space dark background
  surface: '#121826', // Clean dark cards
  surfaceElevated: '#1A2235', // Hover/Active or raised cards
  surfaceHighlight: '#232E48', // Subtle highlights
  
  // Text
  text: '#FFFFFF', // Pure white for high contrast readablity
  textSecondary: '#94A3B8', // Slate gray for subtitles
  textTertiary: '#64748B', // Muted slate for placeholders
  textInverse: '#111827', // Dark text on primary buttons

  // States & Feedback
  success: '#10B981', // Neon green
  successSubtle: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningSubtle: 'rgba(245, 158, 11, 0.15)',
  error: '#EF4444', // SOS Read
  errorSubtle: 'rgba(239, 68, 68, 0.15)',

  // Borders & Dividers
  border: '#1E293B',
  borderSubtle: '#0F172A',
  
  // Custom Gradients (Represented as array of colors for linear-gradient)
  gradientPrimary: ['#FF6B35', '#FF8C60'],
  gradientSurface: ['#121826', '#1A2235'],
} as const;

// ── Spacing (8pt Grid System) ──────────────────────────────────────────────
export const SPACING = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ── Typography ─────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodySemibold: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  button: {
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.2,
  },
} as const;

// ── Metrics & Layouts ──────────────────────────────────────────────────────
export const METRICS = {
  screenWidth: width,
  screenHeight: height,
  baseRadius: 12, // Smooth, app-like edges
  largeRadius: 20, 
  pillRadius: 999,
  borderWidth: 1.5, // Thicker borders for aesthetic dark pop
} as const;

// ── Shadows & Elevation ────────────────────────────────────────────────────
// Note: In Dark Mode, shadows are less visible, so we use colored glow shadows
export const SHADOWS = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  glowPrimary: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glowSecondary: {
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  }
} as const;

// ── Motion & Animation Timing ──────────────────────────────────────────────
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;
