import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Screen } from '@/components/ui/screen';
import { useOnboarding } from '@/context/onboarding-context';
import { spacing, typography } from '@/theme';

export default function DailyReflectionIntroScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace('/');
  };

  return (
    <Screen>
      <View style={styles.page}>
        <Header title="Daily reflection" subtitle="A calm place to review today and prepare for tomorrow." />
        <Card style={styles.card}>
          <Text style={styles.body}>
            Each day, you’ll answer a few thoughtful questions, capture what matters, and leave with a gentle insight.
          </Text>
          <Text style={styles.body}>
            This is designed to be fast, focused, and supportive—just one positive habit in your day.
          </Text>
          <Button fullWidth onPress={handleFinish}>
            Finish setup
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