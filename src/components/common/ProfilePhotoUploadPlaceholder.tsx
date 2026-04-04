import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type ProfilePhotoUploadPlaceholderProps = {
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export function ProfilePhotoUploadPlaceholder({
  title,
  subtitle,
  onPress,
}: ProfilePhotoUploadPlaceholderProps) {
  return (
    <View className="items-center">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        className="h-24 w-24 items-center justify-center rounded-full border border-brandYellow/45 bg-brandCream dark:border-white/10 dark:bg-[#252525]"
        style={{
          shadowColor: '#FF8B1F',
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 4,
        }}
      >
        <View className="h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-[#1D1D1D]">
          <Ionicons name="person-outline" size={28} color="#FF7A00" />
        </View>
        <View className="absolute bottom-1 right-1 h-7 w-7 items-center justify-center rounded-full border border-white bg-brandOrange">
          <Ionicons name="camera-outline" size={14} color="#FFFFFF" />
        </View>
      </Pressable>
      <Text className="mt-3 text-sm font-semibold text-brandBlack dark:text-white">{title}</Text>
      <Text className="mt-1 text-xs text-[#6E6E77] dark:text-[#B5B5BD]">{subtitle}</Text>
    </View>
  );
}

