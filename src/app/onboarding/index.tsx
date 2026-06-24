
import { StyleSheet, Text, View, Button as RNButton } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { spacing, typography } from '@/theme';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.page}>
        <Card style={styles.heroCard} borderless>
          <Text style={styles.title}>THIS IS THE CORRECT FILE</Text>

          <Text style={styles.description}>
            A calm, premium onboarding experience to help you reflect with clarity and ease.
          </Text>

          <RNButton
            title="Begin"
            onPress={() => {
              console.log('RN Button Pressed');
              router.push('/onboarding/welcome');
            }}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
  },
  heroCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.xxxl,
    backgroundColor: '#F7F8FC',
  },
  title: {
    fontSize: typography.fontSize.display,
    lineHeight: typography.lineHeight.display,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: '#111827',
  },
  description: {
    fontSize: typography.fontSize.bodyLarge,
    lineHeight: typography.lineHeight.bodyLarge,
    color: '#4B5563',
    marginBottom: spacing.xxl,
  },
});
