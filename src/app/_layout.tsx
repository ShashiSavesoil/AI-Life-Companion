import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/context/onboarding-context';

export default function Layout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* This tells the app to load your new bottom tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </OnboardingProvider>
  );
}