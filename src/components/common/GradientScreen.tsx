import { PropsWithChildren } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type GradientScreenProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function GradientScreen({ children, contentContainerStyle }: GradientScreenProps) {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-brandBlack">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={[{ padding: 16, paddingBottom: 32 }, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
