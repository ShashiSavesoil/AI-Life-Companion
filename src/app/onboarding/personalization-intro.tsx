import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Screen } from '@/components/ui/screen';
import { spacing, typography } from '@/theme';

export default function PersonalizationIntroScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.page}>
        <Header title="Personalization" subtitle="A few preferences make the companion feel more intentional." />
        <Card style={styles.card}>
          <Text style={styles.body}>
            We’ll ask a few simple questions so your reflection journey matches your goals, schedule, and mood.
          </Text>
          <Button fullWidth onPress={() => router.push('/onboarding/profile-setup')}>
            Set up profile
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
