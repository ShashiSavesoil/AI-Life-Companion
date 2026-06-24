import { type PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, spacing } from '@/theme';

export interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  contentStyle?: ViewStyle;
  style?: ViewStyle;
}

export function Screen({
  children,
  backgroundColor = colors.background,
  contentStyle,
  style,
}: PropsWithChildren<ScreenProps>) {
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor }, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});