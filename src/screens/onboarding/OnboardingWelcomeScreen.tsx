import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingStackParamList } from '@/types/navigation';
import { APP_TEXT } from '@/utils/appText';
import { APP_LAYOUT } from '@/utils/layout';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingWelcome'>;

export function OnboardingWelcomeScreen({}: Props) {
  const { completeOnboardingFlow } = useAuth();

  return (
    <GradientScreen
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 22,
        paddingHorizontal: APP_LAYOUT.screenHorizontalPadding,
      }}
    >
      <View className="rounded-3xl bg-white px-5 pb-6 pt-5 dark:bg-[#161616]">
        <Text className="text-xs font-bold tracking-widest text-brandOrange">{APP_TEXT.onboarding.welcome.step}</Text>
        <Text className="mt-3 text-4xl font-extrabold leading-[40px] text-brandBlack dark:text-white">
          {APP_TEXT.onboarding.welcome.title}
        </Text>
        <Text className="mt-2 text-sm text-[#6E6E77] dark:text-[#B5B5BD]">{APP_TEXT.onboarding.welcome.subtitle}</Text>

        <View className="mt-6 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full border border-brandYellow/50 bg-brandCream dark:border-white/10 dark:bg-[#252525]">
            <Text className="text-4xl">🎉</Text>
          </View>
        </View>
      </View>

      <View className="mt-5">
        <Button label={APP_TEXT.onboarding.welcome.button} onPress={completeOnboardingFlow} />
      </View>
    </GradientScreen>
  );
}
