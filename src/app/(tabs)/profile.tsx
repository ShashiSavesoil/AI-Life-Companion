import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '@/theme';

// Reusable menu item component
const MenuItem = ({ icon, title, description }: { icon: keyof typeof Feather.glyphMap, title: string, description: string }) => (
  <View style={styles.menuItem}>
    <View style={styles.iconContainer}>
      <Feather name={icon} size={20} color={colors.primary} />
    </View>
    <View style={styles.menuText}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuDescription}>{description}</Text>
    </View>
    <Feather name="chevron-right" size={20} color={colors.textSecondary} />
  </View>
);

export default function ProfileScreen() {
  return (
    <Screen>
      <Header title="Profile" subtitle="Your personal growth hub" />
      <ScrollView contentContainerStyle={styles.container}>
        <MenuItem icon="database" title="Memory Engine" description="Manage what the AI knows about you" />
        <MenuItem icon="target" title="Goals" description="Track your long-term aspirations" />
        <MenuItem icon="check-circle" title="Habits" description="Manage your daily routines" />
        <MenuItem icon="settings" title="Settings" description="App preferences and account" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
    marginTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF15', // Subtle primary background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuText: { flex: 1 },
  menuTitle: { ...typography.subtitle, color: colors.text, marginBottom: 2 },
  menuDescription: { ...typography.body, fontSize: 13, color: colors.textSecondary },
});