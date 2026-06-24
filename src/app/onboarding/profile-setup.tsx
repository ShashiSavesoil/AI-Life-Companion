import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { spacing, typography } from '@/theme';

const ONBOARDING_PROFILE_KEY = 'onboardingProfile';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [focus, setFocus] = useState('');
  const [nameError, setNameError] = useState('');
  const [focusError, setFocusError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    const trimmedName = name.trim();
    const trimmedFocus = focus.trim();
    const nextNameError = trimmedName.length === 0 ? 'Please enter your name.' : '';
    const nextFocusError = trimmedFocus.length === 0 ? 'Please enter your current focus.' : '';

    setNameError(nextNameError);
    setFocusError(nextFocusError);

    if (nextNameError || nextFocusError) {
      return;
    }

    try {
      setIsSaving(true);
      await AsyncStorage.setItem(
        ONBOARDING_PROFILE_KEY,
        JSON.stringify({
          name: trimmedName,
          focus: trimmedFocus,
        })
      );
      router.push('/onboarding/daily-reflection-intro');
    } catch (error) {
      console.error('Failed to save onboarding profile:', error);
      setFocusError('We could not save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen>
      <View style={styles.page}>
        <Header title="Profile setup" subtitle="Give your companion a clearer sense of you." />
        <Card style={styles.card}>
          <Text style={styles.body}>
            Enter your name and the area you want to focus on most. This helps the app feel thoughtful and familiar.
          </Text>
          <Input
            label="Your name"
            placeholder="e.g. Maya"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (nameError) {
                setNameError('');
              }
            }}
            error={nameError}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <Input
            label="Current focus"
            placeholder="e.g. calm mornings, better habits"
            value={focus}
            onChangeText={(value) => {
              setFocus(value);
              if (focusError) {
                setFocusError('');
              }
            }}
            error={focusError}
            returnKeyType="done"
          />
          <Button fullWidth disabled={isSaving} onPress={handleContinue}>
            {isSaving ? 'Saving...' : 'Continue'}
          </Button>
          <Button variant="secondary" fullWidth style={styles.backButton} onPress={() => router.back()}>
            Back
          </Button>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  card: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  body: {
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: '#4B5563',
    marginBottom: spacing.lg,
  },
  backButton: {
    marginTop: spacing.sm,
    borderColor: '#D1D5DB',
  },
});
