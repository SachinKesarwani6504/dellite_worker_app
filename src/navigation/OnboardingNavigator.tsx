import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingIdentityScreen } from '@/screens/onboarding/OnboardingIdentityScreen';
import { OnboardingVehicleScreen } from '@/screens/onboarding/OnboardingServiceSelectionScreen';
import { OnboardingCertificationScreen } from '@/screens/onboarding/OnboardingCertificationScreen';
import { OnboardingWelcomeScreen } from '@/screens/onboarding/OnboardingWelcomeScreen';
import { OnboardingStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const { onboardingRoute } = useAuth();

  return (
    <Stack.Navigator
      key={onboardingRoute}
      initialRouteName={onboardingRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="OnboardingIdentity" component={OnboardingIdentityScreen} />
      <Stack.Screen name="OnboardingVehicle" component={OnboardingVehicleScreen} />
      <Stack.Screen name="OnboardingServiceSelection" component={OnboardingVehicleScreen} />
      <Stack.Screen name="OnboardingCertification" component={OnboardingCertificationScreen} />
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
    </Stack.Navigator>
  );
}
