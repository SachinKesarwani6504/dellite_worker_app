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
    <View
      style={{
        borderRadius: 14,
        backgroundColor: 'transparent',
        shadowColor: isPrimary ? '#FF4B2B' : '#000000',
        shadowOpacity: isPrimary ? 0.18 : 0.08,
        shadowRadius: isPrimary ? 10 : 6,
        shadowOffset: { width: 0, height: 5 },
        elevation: 0,
      }}
    >
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        android_ripple={{ color: 'transparent' }}
        className={isDisabled ? 'opacity-60' : ''}
        style={{ borderRadius: 14, overflow: 'hidden', backgroundColor: 'transparent' }}
      >
        {isPrimary ? (
          <LinearGradient
            colors={['#FFD36B', '#FF9F1C', '#FF6A2A', '#FF3D5A']}
            locations={[0, 0.25, 0.62, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 14,
              paddingVertical: 13,
              paddingHorizontal: 16,
              backgroundColor: 'transparent',
            }}
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
    </View>
  );
}
