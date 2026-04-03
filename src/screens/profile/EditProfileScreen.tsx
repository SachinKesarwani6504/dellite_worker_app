import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { AppInput } from '@/components/common/AppInput';
import { GradientScreen } from '@/components/common/GradientScreen';

export function EditProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <GradientScreen>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Edit Profile</Text>
        <View className="mt-4 gap-3">
          <AppInput value={name} onChangeText={setName} placeholder="Full Name" />
          <AppInput value={email} onChangeText={setEmail} placeholder="Email Address" keyboardType="email-address" />
        </View>
        <View className="mt-5">
          <Button label="Save Changes" onPress={() => undefined} disabled />
        </View>
      </View>
    </GradientScreen>
  );
}
