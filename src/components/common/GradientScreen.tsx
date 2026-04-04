import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/utils/theme';

type GradientScreenProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
  useGradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  stickyFooter?: ReactNode;
  stickyFooterContainerStyle?: StyleProp<ViewStyle>;
  refreshControl?: ScrollViewProps['refreshControl'];
}>;

export function GradientScreen({
  children,
  contentContainerStyle,
  useGradient = false,
  gradientColors = theme.gradients.brandDefault,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  stickyFooter,
  stickyFooterContainerStyle,
  refreshControl,
}: GradientScreenProps) {
  const content = (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        refreshControl={refreshControl}
        contentContainerStyle={[
          { padding: 16, paddingBottom: stickyFooter ? 132 : 32 },
          contentContainerStyle,
        ]}
      >
        {children}
      </ScrollView>
      {stickyFooter ? (
        <View
          className="absolute bottom-0 left-0 right-0 border-t border-brandYellow/30 bg-white/95 px-4 pb-5 pt-3 dark:border-white/10 dark:bg-[#111111]/95"
          style={stickyFooterContainerStyle}
        >
          {stickyFooter}
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-brandBlack">
      {useGradient ? (
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={{ flex: 1 }}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
