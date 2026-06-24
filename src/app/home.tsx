import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Screen } from '@/components/ui/screen';
import { spacing, typography, colors } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Header
        title="Welcome Back 👋"
        subtitle="Let's continue your journey."
      />

      <View style={styles.container}>

        <Card style={styles.card}>
          <Text style={styles.heading}>Today's Reflection</Text>

          <Text style={styles.body}>
            Take just a few minutes to understand your day and improve tomorrow.
          </Text>

          <Button
            fullWidth
            onPress={() => router.push('/reflection')}
          >
            Start Reflection
          </Button>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.heading}>Quick Actions</Text>

          <View style={styles.actions}>
            <Button variant="secondary">Journal</Button>

            <Button variant="secondary">AI Companion</Button>

            <Button variant="secondary">Goals</Button>

            <Button variant="secondary">Habits</Button>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.heading}>Daily Insight</Text>

          <Text style={styles.body}>
            Small consistent actions create meaningful change.
          </Text>
        </Card>

      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },

  card: {
    padding: spacing.xl,
  },

  heading: {
    fontSize: typography.fontSize.title3,
    lineHeight: typography.lineHeight.title3,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  body: {
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  actions: {
    gap: spacing.md,
  },
});