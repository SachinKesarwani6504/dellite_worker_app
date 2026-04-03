import { Text, View } from 'react-native';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuth } from '@/hooks/useAuth';

export function HomeScreen() {
  const { user } = useAuth();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  return (
    <GradientScreen>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Home</Text>
        <Text className="mt-2 text-brandText dark:text-white">Welcome, {displayName || 'Partner'}.</Text>
        <Text className="mt-2 text-brandText dark:text-white">
          Daily summary, quick actions, and assigned tasks will appear here.
        </Text>
      </View>
    </GradientScreen>
  );
}
