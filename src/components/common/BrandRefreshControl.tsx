import { useMemo } from 'react';
import { Platform, RefreshControlProps, useColorScheme } from 'react-native';

type BrandRefreshControlStyleProps = Pick<
  RefreshControlProps,
  'tintColor' | 'colors' | 'progressBackgroundColor'
>;

type BrandRefreshControlConfig = {
  modeKey: 'dark' | 'light';
  refreshProps: BrandRefreshControlStyleProps;
};

export function useBrandRefreshControlProps(): BrandRefreshControlConfig {
  const modeKey = useColorScheme() === 'dark' ? 'dark' : 'light';
  const spinnerColor = modeKey === 'dark' ? '#FFC53D' : '#FF7A00';
  const progressBackgroundColor = modeKey === 'dark' ? '#1A1A1A' : '#FFF7E8';

  return useMemo(
    () => ({
      modeKey,
      refreshProps: {
        tintColor: spinnerColor,
        colors: [spinnerColor],
        ...(Platform.OS === 'android' ? { progressBackgroundColor } : {}),
      },
    }),
    [modeKey, spinnerColor, progressBackgroundColor],
  );
}
