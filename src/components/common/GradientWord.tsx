import { Text, View } from 'react-native';

type GradientWordProps = {
  word: string;
  className?: string;
  palette?: readonly string[];
};

const DEFAULT_PALETTE = ['#FFD36B', '#FF9F1C', '#FF6A2A', '#FF3D5A'] as const;

export function GradientWord({ word, className = 'text-[44px] font-extrabold leading-[45px]', palette = DEFAULT_PALETTE }: GradientWordProps) {
  const letters = word.split('');
  const colors = letters.map((_, index) => {
    const paletteIndex = Math.round((index / Math.max(letters.length - 1, 1)) * (palette.length - 1));
    return palette[paletteIndex] ?? palette[palette.length - 1] ?? '#FF7A00';
  });

  return (
    <View className="flex-row">
      {letters.map((char, index) => (
        <Text key={`${char}-${index}`} className={className} style={{ color: colors[index] }}>
          {char}
        </Text>
      ))}
    </View>
  );
}
