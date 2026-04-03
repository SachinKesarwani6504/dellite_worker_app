import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { AppIcon } from '@/icons';
import { ProfileNavigator } from '@/navigation/ProfileNavigator';
import { EarningsScreen } from '@/screens/tabs/EarningsScreen';
import { HomeScreen } from '@/screens/tabs/HomeScreen';
import { OngoingScreen } from '@/screens/tabs/OngoingScreen';
import { MainTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabsNavigator() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF7A00',
        tabBarInactiveTintColor: isDark ? '#A3A3A3' : '#7A6A55',
        tabBarStyle: { backgroundColor: isDark ? '#141414' : '#FFFFFF' },
        tabBarIcon: ({ color, size }) => {
          const tabIconMap: Record<keyof MainTabParamList, 'home' | 'ongoing' | 'earnings' | 'profile'> = {
            Home: 'home',
            Ongoing: 'ongoing',
            Earnings: 'earnings',
            Profile: 'profile',
          };
          const iconName = tabIconMap[route.name as keyof MainTabParamList];
          return <AppIcon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ongoing" component={OngoingScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
