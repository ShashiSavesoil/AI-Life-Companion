import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, radius, typography } from '@/theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.label}>
        Question {current} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },

  track: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: radius.large,
    overflow: 'hidden',
  },

  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.large,
  },

  label: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
  },
});