import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OtpVerificationScreen } from '@/screens/auth/OtpVerificationScreen';
import { PhoneLoginScreen } from '@/screens/auth/PhoneLoginScreen';
import { AuthStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    </Stack.Navigator>
  );
}
