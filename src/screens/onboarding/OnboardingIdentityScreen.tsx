import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { AppInput } from '@/components/common/AppInput';
import { GradientScreen } from '@/components/common/GradientScreen';
import { OnboardingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingIdentity'>;

export function OnboardingIdentityScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <GradientScreen contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Identity Details</Text>
        <Text className="mt-2 text-brandText dark:text-white">Enter your legal information.</Text>
        <View className="mt-4 gap-3">
          <AppInput value={firstName} onChangeText={setFirstName} placeholder="First Name" />
          <AppInput value={lastName} onChangeText={setLastName} placeholder="Last Name (optional)" />
          <AppInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View className="mt-5">
          <Button
            label="Next"
            disabled={firstName.trim().length === 0}
            onPress={() =>
              navigation.navigate('OnboardingVehicle', {
                firstName: firstName.trim(),
                lastName: lastName.trim() || undefined,
                email: email.trim() || undefined,
              })
            }
          />
        </View>
      </View>
    </GradientScreen>
  );
}
