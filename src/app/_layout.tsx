import { Stack } from 'expo-router';

import { OnboardingProvider } from '@/context/onboarding-context';

export default function Layout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </OnboardingProvider>
  );
}