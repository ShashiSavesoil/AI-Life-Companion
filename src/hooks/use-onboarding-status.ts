import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const ONBOARDING_KEY = 'hasCompletedOnboarding';

/**
 * Hook to check and manage onboarding completion status.
 * Returns undefined while loading, then boolean value.
 */
export function useOnboardingStatus() {
  const [hasCompleted, setHasCompleted] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasCompleted(value === 'true');
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        setHasCompleted(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompleted(true);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setHasCompleted(false);
    } catch (error) {
      console.error('Failed to reset onboarding status:', error);
    }
  };

  return {
    hasCompleted,
    isLoading: hasCompleted === undefined,
    completeOnboarding,
    resetOnboarding,
  };
}
