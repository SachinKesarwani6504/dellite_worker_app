import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { OtpCodeInput } from '@/components/common/OtpCodeInput';
import { useAuth } from '@/hooks/useAuth';
import { AppIcon } from '@/icons';
import { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

function maskPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length <= 4) return phoneNumber;
  return `+91${digits.slice(0, 2)}****${digits.slice(-4)}`;
}

export function OtpVerificationScreen({ route, navigation }: Props) {
  const { phoneNumber } = route.params;
  const { verifyOtpCode, resendOtpCode, loading } = useAuth();
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const [counter, setCounter] = useState(26);
  const maskedPhone = useMemo(() => maskPhoneNumber(phoneNumber), [phoneNumber]);
  const isBusy = loading || resending;
  const otpIllustration = require('@/assets/images/png/otp-verify-illustration.png');

  useEffect(() => {
    if (counter <= 0) return;
    const timer = setTimeout(() => setCounter(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

  const onVerify = async () => {
    try {
      await verifyOtpCode(phoneNumber, otp);
    } catch (error) {
      Alert.alert('Verification failed', error instanceof Error ? error.message : 'Try again.');
    }
  };

  const onResend = async () => {
    if (counter > 0) return;
    try {
      setResending(true);
      await resendOtpCode(phoneNumber);
      setCounter(26);
      Alert.alert('OTP sent', 'A new OTP has been sent to your phone.');
    } catch (error) {
      Alert.alert('Resend failed', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <GradientScreen contentContainerStyle={{ flexGrow: 1, padding: 0, paddingBottom: 24 }}>
      <View className="flex-1 bg-white dark:bg-brandBlack">
        <View
          className="bg-[#F5EBDC] px-6 pb-8 pt-6 dark:bg-[#201A14]"
          style={{ borderBottomLeftRadius: 34, borderBottomRightRadius: 34 }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-xl bg-white/80 dark:bg-[#2A2A2A]"
          >
            <AppIcon name="chevronRight" color="#0F0F10" style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>

          <View className="items-center">
            <Image
              source={otpIllustration}
              resizeMode="contain"
              style={{ width: 160, height: 120, marginTop: 12 }}
            />
          </View>
        </View>

        <View className="px-6 pt-6">
          <Text className="text-center text-4xl font-extrabold text-[#0C1D36] dark:text-white">
            Verify Your Number
          </Text>
          <Text className="mt-3 text-center text-base text-[#6E6E77] dark:text-[#B5B5BD]">
            We&apos;ve sent a 4-digit code to <Text className="font-semibold">{maskedPhone}</Text>
          </Text>

          <View className="mt-6">
            <OtpCodeInput value={otp} onChange={setOtp} length={4} disabled={isBusy} />
          </View>

          <Pressable onPress={onResend} disabled={counter > 0 || isBusy} className="mt-6 items-center">
            <Text className="text-base text-[#7A7A84] dark:text-[#B5B5BD]">
              Resend code in{' '}
              <Text className="font-bold text-brandOrange">00:{counter.toString().padStart(2, '0')}</Text>
            </Text>
          </Pressable>

          <View className="mt-5">
            <Button
              label="Verify & Continue"
              onPress={onVerify}
              loading={loading}
              disabled={otp.length !== 4 || isBusy}
            />
          </View>

          <Text className="mt-6 text-center text-xs text-[#9A9AA2] dark:text-[#8C8C93]">
            Didn&apos;t receive the code? Check your SMS inbox or try resending
          </Text>
        </View>
      </View>
    </GradientScreen>
  );
}
