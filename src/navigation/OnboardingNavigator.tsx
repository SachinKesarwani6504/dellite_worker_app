import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingIdentityScreen } from '@/screens/onboarding/OnboardingIdentityScreen';
import { OnboardingVehicleScreen } from '@/screens/onboarding/OnboardingVehicleScreen';
import { OnboardingWelcomeScreen } from '@/screens/onboarding/OnboardingWelcomeScreen';
import { OnboardingStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="OnboardingIdentity" component={OnboardingIdentityScreen} />
      <Stack.Screen name="OnboardingVehicle" component={OnboardingVehicleScreen} />
    </Stack.Navigator>
  );
}
