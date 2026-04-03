import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { AppInput } from '@/components/common/AppInput';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingVehicle'>;

export function OnboardingVehicleScreen({ route }: Props) {
  const { firstName, lastName, email } = route.params;
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const { completeOnboarding, loading } = useAuth();

  const onFinish = async () => {
    try {
      await completeOnboarding({
        firstName,
        lastName,
        email,
        bio: bio.trim() || undefined,
        experienceYears: experienceYears ? Number(experienceYears) : undefined,
      });
    } catch (error) {
      Alert.alert('Onboarding failed', error instanceof Error ? error.message : 'Try again.');
    }
  };

  return (
    <GradientScreen contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Profile Setup</Text>
        <Text className="mt-2 text-brandText dark:text-white">Add worker details to start receiving jobs.</Text>
        <View className="mt-4 gap-3">
          <AppInput value={bio} onChangeText={setBio} placeholder="Short Bio (optional)" />
          <AppInput
            value={experienceYears}
            onChangeText={setExperienceYears}
            placeholder="Experience Years (optional)"
            keyboardType="number-pad"
          />
        </View>
        <View className="mt-5">
          <Button
            label="Finish Onboarding"
            onPress={onFinish}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    </GradientScreen>
  );
}
