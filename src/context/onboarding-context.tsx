import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

const ONBOARDING_KEY = 'hasCompletedOnboarding';

interface OnboardingContextValue {
  hasCompleted: boolean | undefined;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompleted, setHasCompleted] = useState<boolean | undefined>(undefined);

  // Read AsyncStorage once on initial mount
  useEffect(() => {
    const initializeOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasCompleted(value === 'true');
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        setHasCompleted(false);
      }
    };

    initializeOnboardingStatus();
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

  const value: OnboardingContextValue = {
    hasCompleted,
    isLoading: hasCompleted === undefined,
    completeOnboarding,
    resetOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
