export type ThemeMode = 'dark' | 'light';

export type Palette = {
  void: string;
  deep: string;
  ink: string;
  panel: string;
  panelSolid: string;
  panelHot: string;
  hairline: string;
  hairlineStrong: string;
  star: string;
  muted: string;
  faint: string;
  spark: string;
  sparkDim: string;
  nebula: string;
  nebulaDim: string;
  aurora: string;
  auroraDim: string;
  gold: string;
  goldDim: string;
  danger: string;
  onAccent: string;
  tabBar: string;
  sky: readonly [string, string, string];
  nebulaA: string;
  nebulaB: string;
  starDot: string;
};

export const palettes: Record<ThemeMode, Palette> = {
  dark: {
    void: '#000000',
    deep: '#050505',
    ink: '#0A0A0A',
    panel: 'rgba(255, 255, 255, 0.08)',
    panelSolid: '#111111',
    panelHot: '#1A1A1A',
    hairline: 'rgba(255, 255, 255, 0.16)',
    hairlineStrong: 'rgba(255, 255, 255, 0.34)',
    star: '#FFFFFF',
    muted: 'rgba(255, 255, 255, 0.64)',
    faint: 'rgba(255, 255, 255, 0.34)',
    spark: '#FFFFFF',
    sparkDim: 'rgba(255, 255, 255, 0.14)',
    nebula: '#E6E6E6',
    nebulaDim: 'rgba(255, 255, 255, 0.12)',
    aurora: '#F2F2F2',
    auroraDim: 'rgba(255, 255, 255, 0.12)',
    gold: '#D4D4D4',
    goldDim: 'rgba(255, 255, 255, 0.12)',
    danger: '#FFFFFF',
    onAccent: '#000000',
    tabBar: 'rgba(14, 14, 14, 0.42)',
    sky: ['#000000', '#050508', '#000000'],
    nebulaA: 'rgba(255, 255, 255, 0.07)',
    nebulaB: 'rgba(255, 255, 255, 0.045)',
    starDot: '#FFFFFF',
  },
  light: {
    void: '#FFFFFF',
    deep: '#F4F4F4',
    ink: '#EBEBEB',
    panel: 'rgba(255, 255, 255, 0.86)',
    panelSolid: '#FFFFFF',
    panelHot: '#F0F0F0',
    hairline: 'rgba(0, 0, 0, 0.14)',
    hairlineStrong: 'rgba(0, 0, 0, 0.28)',
    star: '#111111',
    muted: 'rgba(0, 0, 0, 0.64)',
    faint: 'rgba(0, 0, 0, 0.38)',
    spark: '#111111',
    sparkDim: 'rgba(0, 0, 0, 0.08)',
    nebula: '#222222',
    nebulaDim: 'rgba(0, 0, 0, 0.08)',
    aurora: '#111111',
    auroraDim: 'rgba(0, 0, 0, 0.06)',
    gold: '#333333',
    goldDim: 'rgba(0, 0, 0, 0.08)',
    danger: '#111111',
    onAccent: '#FFFFFF',
    tabBar: 'rgba(255, 255, 255, 0.92)',
    sky: ['#FFFFFF', '#F3F3F3', '#E8E8E8'],
    nebulaA: 'rgba(0, 0, 0, 0.05)',
    nebulaB: 'rgba(0, 0, 0, 0.035)',
    starDot: 'rgba(0, 0, 0, 0.45)',
  },
};

export const colors = palettes.dark;

export const fonts = {
  light: 'SpaceGrotesk_300Light',
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semibold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
} as const;

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 56,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
} as const;

export const layout = {
  phone: 440,
  tabBar: 72,
} as const;
