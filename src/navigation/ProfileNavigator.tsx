import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { HelpSupportScreen } from '@/screens/profile/HelpSupportScreen';
import { PayoutDetailsScreen } from '@/screens/profile/PayoutDetailsScreen';
import { ProfileHomeScreen } from '@/screens/profile/ProfileHomeScreen';
import { ProfileStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="PayoutDetails" component={PayoutDetailsScreen} options={{ title: 'Payout Details' }} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ title: 'Help & Support' }} />
    </Stack.Navigator>
  );
}
