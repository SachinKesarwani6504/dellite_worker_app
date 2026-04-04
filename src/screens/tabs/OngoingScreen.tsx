import { Text, View } from 'react-native';
import { GradientScreen } from '@/components/common/GradientScreen';
import { APP_TEXT } from '@/utils/appText';

export function OngoingScreen() {
  return (
    <GradientScreen>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">{APP_TEXT.ongoing.title}</Text>
        <Text className="mt-2 text-brandText dark:text-white">
          {APP_TEXT.ongoing.subtitle}
        </Text>
      </View>
    </GradientScreen>
  );
}
