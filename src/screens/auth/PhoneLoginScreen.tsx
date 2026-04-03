import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Image, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuth } from '@/hooks/useAuth';
import { APP_AUTH_ROLE } from '@/types/auth';
import { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneLogin'>;

export function PhoneLoginScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { sendOtpCode, loading } = useAuth();
  const logo = require('@/assets/images/png/dellite_logo.png');
  const phoneIllustration = require('@/assets/images/png/phone-verify-illustration.png');

  const onContinue = async () => {
    try {
      await sendOtpCode(phoneNumber, APP_AUTH_ROLE);
      navigation.navigate('OtpVerification', { phoneNumber });
    } catch (error) {
      Alert.alert('Could not send OTP', error instanceof Error ? error.message : 'Try again.');
    }
  };

  return (
    <GradientScreen contentContainerStyle={{ flexGrow: 1, padding: 0, paddingBottom: 24 }}>
      <View className="flex-1 bg-white dark:bg-brandBlack">
        <View
          className="items-center bg-[#F5EBDC] px-6 pb-8 pt-10 dark:bg-[#201A14]"
          style={{ borderBottomLeftRadius: 34, borderBottomRightRadius: 34 }}
        >
          <Image source={logo} resizeMode="contain" style={{ width: 140, height: 42 }} />
          <Image
            source={phoneIllustration}
            resizeMode="contain"
            style={{ width: 230, height: 180, marginTop: 18 }}
          />
        </View>

        <View className="px-6 pt-7">
          <Text className="text-center text-4xl font-extrabold text-[#0C1D36] dark:text-white">
            Welcome to Dellite!
          </Text>
          <Text className="mt-3 text-center text-base text-[#6E6E77] dark:text-[#B5B5BD]">
            Enter your phone number to get started with home services in Prayagraj
          </Text>

          <View className="mt-6 overflow-hidden rounded-2xl border border-brandYellow/70 dark:border-white/10">
            <View className="flex-row items-center bg-white dark:bg-[#1A1A1A]">
              <View className="w-20 border-r border-brandYellow/60 py-4 dark:border-white/10">
                <Text className="text-center text-base font-semibold text-brandBlack dark:text-white">IN +91</Text>
              </View>
              <View className="flex-1 px-3">
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="8888888888"
                  placeholderTextColor="#8A7A66"
                  keyboardType="phone-pad"
                  maxLength={10}
                  className="py-4 text-base font-semibold text-brandBlack dark:text-white"
                />
              </View>
            </View>
          </View>

          <View className="mt-5">
            <Button
              label="Send OTP"
              onPress={onContinue}
              loading={loading}
              disabled={loading || phoneNumber.trim().length !== 10}
            />
          </View>

          <View className="mt-6 flex-row items-center justify-center gap-6">
            <Text className="text-sm text-[#74747C] dark:text-[#B5B5BD]">Secure & Private</Text>
            <Text className="text-sm text-[#74747C] dark:text-[#B5B5BD]">No Spam</Text>
          </View>

          <Text className="mt-5 text-center text-xs text-[#9A9AA2] dark:text-[#8C8C93]">
            By continuing, you agree to our Terms of Service & Privacy Policy
          </Text>
        </View>
      </View>
    </GradientScreen>
  );
}
