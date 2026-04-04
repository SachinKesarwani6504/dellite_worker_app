import { Pressable, useColorScheme } from 'react-native';
import { AppIcon } from '@/icons';

type BackButtonProps = {
  onPress: () => void;
  visible?: boolean;
};

export function BackButton({ onPress, visible = true }: BackButtonProps) {
  const isDark = useColorScheme() === 'dark';
  if (!visible) return null;

  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-xl bg-white/85 dark:bg-[#2A2A2A]"
      style={{
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,15,16,0.08)',
      }}
    >
      <AppIcon
        name="chevronRight"
        color={isDark ? '#FFFFFF' : '#0F0F10'}
        style={{ transform: [{ rotate: '180deg' }] }}
      />
    </Pressable>
  );
}
