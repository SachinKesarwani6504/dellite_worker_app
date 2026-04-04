import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { AppInput } from '@/components/common/AppInput';
import { GradientScreen } from '@/components/common/GradientScreen';
import { GradientWord } from '@/components/common/GradientWord';
import { ProfilePhotoUploadPlaceholder } from '@/components/common/ProfilePhotoUploadPlaceholder';
import { useAuth } from '@/hooks/useAuth';
import { Gender } from '@/types/auth';
import { OnboardingStackParamList } from '@/types/navigation';
import { APP_TEXT } from '@/utils/appText';
import { APP_LAYOUT } from '@/utils/layout';
import { GENDER_OPTIONS } from '@/utils/options';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingIdentity'>;

export function OnboardingIdentityScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');
  const { completeOnboarding, loading } = useAuth();

  const isValid = firstName.trim().length > 1 && lastName.trim().length > 0;

  const onContinue = async () => {
    if (!isValid || loading) return;
    try {
      await completeOnboarding({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
      });
      navigation.navigate('OnboardingVehicle');
    } catch {
      // Toasts are shown from API layer.
    }
  };

  const gradientWord = APP_TEXT.onboarding.identity.gradientWord;
  return (
    <GradientScreen
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingHorizontal: APP_LAYOUT.screenHorizontalPadding }}
    >
      <View className="rounded-3xl bg-white pb-6 pt-4 dark:bg-[#161616]">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="sparkles-outline" size={14} color="#FF7A00" />
          <Text className="text-xs font-bold tracking-widest text-brandOrange">{APP_TEXT.onboarding.identity.step}</Text>
        </View>
        <Text className="mt-3 text-[36px] font-extrabold leading-[38px] text-brandBlack dark:text-white">
          {APP_TEXT.onboarding.identity.titlePrefix}
        </Text>
        <View className="mt-0.5">
          <GradientWord word={gradientWord} />
        </View>
        <Text className="mt-2 text-sm text-[#6E6E77] dark:text-[#B5B5BD]">{APP_TEXT.onboarding.identity.subtitle}</Text>
        <View className="mt-5">
          <ProfilePhotoUploadPlaceholder
            title={APP_TEXT.onboarding.identity.uploadPhotoTitle}
            subtitle={APP_TEXT.onboarding.identity.uploadPhotoSubtitle}
          />
        </View>

        <View className="mt-6 gap-3">
          <AppInput
            label={APP_TEXT.onboarding.identity.firstNameLabel}
            isRequired
            value={firstName}
            onChangeText={setFirstName}
            placeholder={APP_TEXT.onboarding.identity.firstNamePlaceholder}
          />
          <AppInput
            label={APP_TEXT.onboarding.identity.lastNameLabel}
            isRequired
            value={lastName}
            onChangeText={setLastName}
            placeholder={APP_TEXT.onboarding.identity.lastNamePlaceholder}
          />
        </View>

        <Text className="mt-5 text-sm font-semibold text-brandBlack dark:text-white">{APP_TEXT.onboarding.identity.genderLabel}</Text>
        <View className="mt-2 flex-row gap-2">
          {GENDER_OPTIONS.map(option => {
            const selected = option.value === gender;
            return (
              <Pressable
                key={option.value}
                onPress={() => setGender(option.value)}
                className={`flex-1 rounded-2xl border p-3 ${
                  selected
                    ? 'border-brandOrange bg-brandOrange/10'
                    : 'border-brandYellow/40 bg-white dark:border-white/10 dark:bg-[#1D1D1D]'
                }`}
              >
                <Text className="text-center text-2xl">{option.icon}</Text>
                <Text
                  className={`mt-1 text-center text-sm font-semibold ${
                    selected ? 'text-brandOrange' : 'text-brandBlack dark:text-white'
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-5">
        <Button label={APP_TEXT.onboarding.identity.nextButton} onPress={onContinue} loading={loading} disabled={!isValid || loading} />
      </View>
    </GradientScreen>
  );
}


