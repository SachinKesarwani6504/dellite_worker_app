import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { theme } from '@/utils/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = loading || disabled;

  return (
    <Pressable onPress={onPress} disabled={isDisabled} className={isDisabled ? 'opacity-60' : ''}>
      {isPrimary ? (
        <LinearGradient
          colors={['#FF7A00', '#FFC53D', '#0F0F10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 }}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text className="text-center text-base font-semibold text-white">{label}</Text>
          )}
        </LinearGradient>
      ) : (
        <View className="rounded-xl bg-brandYellow/20 dark:bg-[#2A2A2A] px-4 py-3">
          {loading ? (
            <ActivityIndicator color={theme.colors.brandOrange} />
          ) : (
            <Text className="text-center text-base font-semibold text-brandOrange dark:text-brandYellow">
              {label}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
