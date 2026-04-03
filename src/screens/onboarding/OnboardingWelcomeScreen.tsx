import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { OnboardingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingWelcome'>;

export function OnboardingWelcomeScreen({ navigation }: Props) {
  return (
    <GradientScreen contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Worker Onboarding</Text>
        <Text className="mt-2 text-brandText dark:text-white">
          Complete 3 quick steps to activate your partner account.
        </Text>
        <View className="mt-5">
          <Button label="Start Onboarding" onPress={() => navigation.navigate('OnboardingIdentity')} />
        </View>
      </View>
    </GradientScreen>
  );
}
