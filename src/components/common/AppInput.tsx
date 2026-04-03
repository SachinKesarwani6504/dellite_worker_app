import { TextInput, TextInputProps, View, useColorScheme } from 'react-native';

type AppInputProps = TextInputProps & {
  hasError?: boolean;
};

export function AppInput({ hasError = false, ...props }: AppInputProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      className={`rounded-xl border bg-white dark:bg-[#1A1A1A] px-3 py-2 ${
        hasError ? 'border-red-500' : 'border-brandYellow dark:border-white/10'
      }`}
    >
      <TextInput
        placeholderTextColor="#8A7A66"
        className="text-base text-brandText dark:text-white"
        keyboardAppearance={isDark ? 'dark' : 'light'}
        {...props}
      />
    </View>
  );
}
