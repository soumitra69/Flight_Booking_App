import { Platform } from 'react-native';

export const COLORS = {
  primaryDark: '#07170e',
  primaryBg: '#0a2314',
  primaryGreen: '#123821',
  primaryMid: '#18472b',
  gold: '#d4b842',
  goldMuted: '#a79132',
  goldLight: '#f3e394',
  goldSoftBg: 'rgba(212, 184, 66, 0.14)',
  goldBorder: 'rgba(212, 184, 66, 0.32)',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  emeraldBg: 'rgba(16, 185, 129, 0.16)',
  white: '#ffffff',
  ivoryBg: '#f6f5f0',
  cardLight: '#ffffff',
  cardDark: '#0f2f1c',
  cardDarkElevated: '#153d25',
  textDark: '#12261a',
  textMutedDark: '#5c6660',
  textLight: '#f8faf8',
  textMutedLight: '#a3b8aa',
  borderLight: '#e3e1d8',
  borderDark: 'rgba(255, 255, 255, 0.11)',
  danger: '#ef4444',
};

export const SHADOWS = {
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    default: {
      boxShadow: '0 10px 28px rgba(0, 0, 0, 0.22)',
    },
  }),
  soft: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    android: {
      elevation: 3,
    },
    default: {
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
    },
  }),
  goldGlow: Platform.select({
    ios: {
      shadowColor: '#d4b842',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
    default: {
      boxShadow: '0 6px 22px rgba(212, 184, 66, 0.32)',
    },
  }),
};
