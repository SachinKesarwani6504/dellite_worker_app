import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuth } from '@/hooks/useAuth';
import { APP_AUTH_ROLE } from '@/types/auth';
import { AuthStackParamList } from '@/types/navigation';
import { APP_TEXT } from '@/utils/appText';
import { theme } from '@/utils/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneLogin'>;

export function PhoneLoginScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const { sendOtpCode, loading } = useAuth();
  const logo = require('@/assets/images/png/dellite_logo.png');
  const phoneIllustration = require('@/assets/images/png/phone-verify-illustration.png');

  const onContinue = async () => {
    try {
      await sendOtpCode(phoneNumber, APP_AUTH_ROLE);
      navigation.navigate('OtpVerification', { phoneNumber });
    } catch {
      // Toasts are handled centrally in the HTTP layer.
    }
  };

  return (
    <GradientScreen contentContainerStyle={{ flexGrow: 1, padding: 0, paddingBottom: 24 }}>
      <View className="flex-1 bg-white dark:bg-brandBlack ">
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
            className="items-center px-6 pb-8 pt-10"
          >
            <Image source={logo} resizeMode="contain" style={{ width: 140, height: 42 }} />
            <Image
              source={phoneIllustration}
              resizeMode="contain"
              style={{ width: 230, height: 180, marginTop: 18 }}
            />
          </LinearGradient>
        </View>

        <View className="px-6 pt-7">
          <Text className="text-center text-4xl font-extrabold text-[#0C1D36] dark:text-white">
            {APP_TEXT.auth.phoneLogin.title}
          </Text>
          <Text className="mt-3 text-center text-base text-[#6E6E77] dark:text-[#B5B5BD]">
            {APP_TEXT.auth.phoneLogin.subtitle}
          </Text>

          <View
            className={`mt-6 rounded-2xl border ${
              isPhoneFocused ? 'border-brandOrange' : 'border-brandYellow/70 dark:border-white/10'
            }`}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              transform: [{ translateY: isPhoneFocused ? -1 : 0 }],
              shadowColor: '#FF7A00',
              shadowOpacity: isPhoneFocused ? 0.18 : 0.05,
              shadowRadius: isPhoneFocused ? 10 : 3,
              shadowOffset: { width: 0, height: isPhoneFocused ? 6 : 2 },
              elevation: isPhoneFocused ? 5 : 1,
            }}
          >
            <View className="flex-row items-center rounded-2xl bg-white dark:bg-[#1A1A1A]">
              <View className="w-20 border-r border-brandYellow/60 py-4 dark:border-white/10">
                <Text className="text-center text-base font-semibold text-brandBlack dark:text-white">
                  {APP_TEXT.auth.phoneLogin.countryCode}
                </Text>
              </View>
              <View className="flex-1 px-3">
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  placeholder={APP_TEXT.auth.phoneLogin.phonePlaceholder}
                  placeholderTextColor="#8A7A66"
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={{ includeFontPadding: false }}
                  className="py-4 text-base font-semibold text-brandBlack dark:text-white"
                />
              </View>
            </View>
          </View>

          <View className="mt-5">
            <Button
              label={APP_TEXT.auth.phoneLogin.sendOtpButton}
              onPress={onContinue}
              loading={loading}
              disabled={loading || phoneNumber.trim().length !== 10}
            />
          </View>

          <View className="mt-6 flex-row items-center justify-center gap-6">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="shield-checkmark-outline" size={15} color="#FF7A00" />
              <Text className="text-sm text-[#74747C] dark:text-[#B5B5BD]">
                {APP_TEXT.auth.phoneLogin.securePrivate}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="sparkles-outline" size={15} color="#FF7A00" />
              <Text className="text-sm text-[#74747C] dark:text-[#B5B5BD]">
                {APP_TEXT.auth.phoneLogin.noSpam}
              </Text>
            </View>
          </View>

          <Text className="mt-5 text-center text-xs text-[#9A9AA2] dark:text-[#8C8C93]">
            {APP_TEXT.auth.phoneLogin.terms}
          </Text>
        </View>
      </View>
    </GradientScreen>
  );
}
