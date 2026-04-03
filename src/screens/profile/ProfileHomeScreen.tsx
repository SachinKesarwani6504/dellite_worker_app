import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuth } from '@/hooks/useAuth';
import { ProfileStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

export function ProfileHomeScreen({ navigation }: Props) {
  const { user, phone, logout, loading } = useAuth();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  return (
    <GradientScreen>
      <View className="rounded-2xl bg-white dark:bg-[#1A1A1A] border border-brandYellow/40 dark:border-white/10 p-5">
        <Text className="text-2xl font-bold text-brandText dark:text-white">Profile</Text>
        <Text className="mt-2 text-brandText dark:text-white">Phone: {(user?.phone ?? phone) || 'Not available'}</Text>
        <Text className="mt-1 text-brandText dark:text-white">Name: {displayName || 'Not set'}</Text>
        <View className="mt-5 gap-3">
          <Button
            label="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
            disabled={loading}
            variant="secondary"
          />
          <Button
            label="Payout Details"
            onPress={() => navigation.navigate('PayoutDetails')}
            disabled={loading}
            variant="secondary"
          />
          <Button
            label="Help & Support"
            onPress={() => navigation.navigate('HelpSupport')}
            disabled={loading}
            variant="secondary"
          />
          <Button label="Logout" onPress={logout} loading={loading} disabled={loading} />
        </View>
      </View>
    </GradientScreen>
  );
}
