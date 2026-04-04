import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AppState, Image, Pressable, Text, View } from 'react-native';
import { BackButton } from '@/components/common/BackButton';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { OtpCodeInput } from '@/components/common/OtpCodeInput';
import { useAuth } from '@/hooks/useAuth';
import { AppIcon } from '@/icons';
import { AuthStackParamList } from '@/types/navigation';
import { maskPhoneNumber } from '@/utils';
import { APP_TEXT } from '@/utils/appText';
import { theme } from '@/utils/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

export function OtpVerificationScreen({ route, navigation }: Props) {
  const { phoneNumber } = route.params;
  const { verifyOtpCode, resendOtpCode, loading } = useAuth();
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const resendDuration = 60;
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [resendAvailableAt, setResendAvailableAt] = useState(() => Date.now() + resendDuration * 1000);
  const maskedPhone = useMemo(() => maskPhoneNumber(phoneNumber), [phoneNumber]);
  const isBusy = loading || resending;
  const counter = Math.max(0, Math.ceil((resendAvailableAt - nowMs) / 1000));
  const canResend = counter <= 0 && !isBusy;
  const resendProgress = Math.max(0, Math.min(1, counter / resendDuration));
  const otpIllustration = require('@/assets/images/png/otp-verify-illustration.png');

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    const appStateSubscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        setNowMs(Date.now());
      }
    });

    return () => {
      clearInterval(timer);
      appStateSubscription.remove();
    };
  }, []);

  const onVerify = async () => {
    try {
      await verifyOtpCode(phoneNumber, otp);
    } catch {
      // Toasts are handled centrally in the HTTP layer.
    }
  };

  const onResend = async () => {
    if (counter > 0) return;
    try {
      setResending(true);
      await resendOtpCode(phoneNumber);
      setResendAvailableAt(Date.now() + resendDuration * 1000);
      setNowMs(Date.now());
    } catch {
      // Toasts are handled centrally in the HTTP layer.
    } finally {
      setResending(false);
    }
  };

  return (
    <GradientScreen contentContainerStyle={{ flexGrow: 1, padding: 0, paddingBottom: 24 }}>
      <View className="flex-1 bg-white dark:bg-brandBlack">
        <View
          style={{
            borderBottomLeftRadius: 34,
            borderBottomRightRadius: 34,
            overflow: 'hidden',
            shadowColor: '#FF8B1F',
            shadowOpacity: 0.2,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={theme.gradients.heroWarm}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="px-6 pb-8 pt-6"
          >
            <BackButton onPress={() => navigation.goBack()} visible={navigation.canGoBack()} />

            <View className="items-center">
              <Image
                source={otpIllustration}
                resizeMode="contain"
                style={{ width: 160, height: 120, marginTop: 12 }}
              />
            </View>
          </LinearGradient>
        </View>

        <View className="px-6 pt-7">
          <Text className="text-center text-4xl font-extrabold text-[#0C1D36] dark:text-white">
            {APP_TEXT.auth.otpVerification.title}
          </Text>
          <Text className="mt-3 text-center text-base text-[#6E6E77] dark:text-[#B5B5BD]">
            {APP_TEXT.auth.otpVerification.codeSentPrefix}
            <Text className="font-semibold">{maskedPhone}</Text>
          </Text>

          <View className="mt-6">
            <OtpCodeInput value={otp} onChange={setOtp} length={4} disabled={isBusy} />
          </View>

          <View className="mt-5">
            {counter > 0 ? (
              <View className="space-y-2">
                <Text className="text-center text-sm text-[#6E6E77] dark:text-[#B5B5BD]">
                  Resend code in{' '}
                  <Text className="font-semibold text-brandOrange">
                    00:{counter.toString().padStart(2, '0')}
                  </Text>
                </Text>
                <View className="h-1.5 overflow-hidden rounded-full bg-[#F2E7D9] dark:bg-white/10">
                  <View
                    className="h-full rounded-full bg-brandOrange"
                    style={{ width: `${Math.max(6, resendProgress * 100)}%` }}
                  />
                </View>
              </View>
            ) : (
              <Pressable
                onPress={onResend}
                disabled={!canResend}
                className="self-center flex-row items-center gap-1.5 rounded-lg border border-brandOrange/30 bg-brandOrange/10 px-3 py-2"
              >
                <AppIcon name="refresh" size={14} color={theme.colors.brandOrange} />
                <Text className="text-sm font-semibold text-brandOrange">Resend code</Text>
              </Pressable>
            )}
          </View>

          <View className="mt-5">
            <Button
              label={APP_TEXT.auth.otpVerification.verifyButton}
              onPress={onVerify}
              loading={loading}
              disabled={otp.length !== 4 || isBusy}
            />
          </View>

          <Text className="mt-6 text-center text-xs text-[#9A9AA2] dark:text-[#8C8C93]">
            {APP_TEXT.auth.otpVerification.helpText}
          </Text>
        </View>
      </View>
    </GradientScreen>
  );
}
