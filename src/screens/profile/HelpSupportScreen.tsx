import { Text, View } from 'react-native';
import { GradientScreen } from '@/components/common/GradientScreen';

export function HelpSupportScreen() {
  return (
    <GradientScreen>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Help & Support</Text>
        <Text className="mt-3 text-brandText dark:text-white">Support chat, FAQs, and contact channels can be added here.</Text>
      </View>
    </GradientScreen>
  );
}
