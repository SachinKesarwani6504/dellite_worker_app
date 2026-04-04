export const theme = {
  colors: {
    brandOrange: '#FF7A00',
    brandRed: '#FF3D5A',
    brandYellow: '#FFC53D',
    brandCream: '#FFF7E8',
    brandText: '#2D1B00',
    brandBlack: '#0F0F10',
    white: '#FFFFFF',
    mutedText: '#6B5B46',
    border: '#F3D8A8',
    success: '#20A464',
  },
  gradients: {
    brandDefault: ['#FF7A00', '#FF3D5A', '#FFC53D', '#0F0F10'] as const,
    heroWarm: ['#FFD8A1', '#FFFFFF'] as const,
  },
};

export const palette = {
  light: {
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#2D1B00',
    mutedText: '#6B5B46',
    border: '#F3D8A8',
  },
  dark: {
    background: '#0F0F10',
    card: '#1A1A1A',
    text: '#FFFFFF',
    mutedText: '#C7C7C7',
    border: '#2E2E2E',
  },
} as const;
