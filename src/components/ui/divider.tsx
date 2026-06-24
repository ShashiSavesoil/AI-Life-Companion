import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, spacing } from '@/theme';

export interface DividerProps extends ViewProps {
  inset?: boolean;
  thickness?: number;
  color?: string;
}

export function Divider({ inset = false, thickness = 1, color = colors.border, style, ...viewProps }: DividerProps) {
  return <View style={[styles.divider, inset && styles.inset, { height: thickness, backgroundColor: color }, style]} {...viewProps} />;
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
  inset: {
    marginLeft: spacing.lg,
  },
});