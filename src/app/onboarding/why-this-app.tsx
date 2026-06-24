import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Screen } from '@/components/ui/screen';
import { spacing, typography } from '@/theme';

export default function WhyThisAppScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.page}>
        <Header title="Why this app?" subtitle="Reason, rhythm, and reflection." />
        <Card style={styles.card}>
          <Text style={styles.body}>
            This companion is designed to help you notice patterns, surface small wins, and stay grounded with a focused daily check-in.
          </Text>
          <Text style={styles.body}>
            The experience is calm, uncluttered, and tuned to your pace—like a thoughtful daily habit rather than a task list.
          </Text>
          <Button fullWidth onPress={() => router.push('/onboarding/personalization-intro')}>
            Next
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
    marginBottom: spacing.md,
  },
  backButton: {
    marginTop: spacing.sm,
    borderColor: '#D1D5DB',
  },
});
