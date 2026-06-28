import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/theme';

const safeColors = colors as any;
const safeTypography = typography as any;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: safeColors.cardBackground || '#ffffff',
          borderTopColor: safeColors.border || '#eeeeee',
          minHeight: 65,
          paddingBottom: Platform.OS === 'android' ? 12 + insets.bottom : insets.bottom,
          paddingTop: 8,
        } as any,
        tabBarActiveTintColor: safeColors.primary || '#007AFF',
        tabBarInactiveTintColor: safeColors.textSecondary || '#8E8E93',
        tabBarLabelStyle: {
          ...safeTypography.label,
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      {/* --- VISIBLE TABS --- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reflect"
        options={{
          title: 'Reflect',
          tabBarIcon: ({ color }) => <Feather name="edit-2" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <Feather name="book" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={22} color={color} />,
        }}
      />

      {/* --- HIDDEN SCREENS (Removes the messy bottom icons) --- */}
      <Tabs.Screen name="home" options={{ href: null }} />
      <Tabs.Screen name="goals" options={{ href: null }} />
      <Tabs.Screen name="habits" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
      <Tabs.Screen name="reflection" options={{ href: null }} />
    </Tabs>
  );
}