import { Text, View } from 'react-native';
import { GradientScreen } from '@/components/common/GradientScreen';

export function OngoingScreen() {
  return (
    <GradientScreen>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Ongoing</Text>
        <Text className="mt-2 text-brandText dark:text-white">
          Active orders, route progress, and live task updates will show here.
        </Text>
      </View>
    </GradientScreen>
  );
}
