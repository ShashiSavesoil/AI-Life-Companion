import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Screen } from '@/components/ui/screen';
import { spacing, typography, colors } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.page}>
        <Header
          title="Welcome"
          subtitle="Let's set up your calm daily rhythm."
        />

        <Card style={styles.card}>
          <Text style={styles.heading}>
            A better way to review your day.
          </Text>

          <Text style={styles.body}>
            Build a simple reflection practice with gentle guidance,
            meaningful prompts, and a soothing interface.
          </Text>

          <Button
            fullWidth
            onPress={() => router.push('/onboarding/why-this-app')}
          >
            Continue
          </Button>

          <Button
            variant="secondary"
            fullWidth
            style={styles.backButton}
            onPress={() => router.back()}
          >
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
  },
  card: {
    marginTop: spacing.xl,
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  heading: {
    fontSize: typography.fontSize.title2,
    lineHeight: typography.lineHeight.title2,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  body: {
    fontSize: typography.fontSize.bodyLarge,
    lineHeight: typography.lineHeight.bodyLarge,
    color: colors.textSecondary,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
