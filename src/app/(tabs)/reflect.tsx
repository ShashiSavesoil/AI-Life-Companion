import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/theme';

// Safe fallbacks to fix TypeScript red lines
const safeColors = {
  primary: (colors as any).primary || '#007AFF',
  cardBackground: (colors as any).cardBackground || '#FFFFFF',
  textSecondary: (colors as any).textSecondary || '#666666',
  border: (colors as any).border || '#EEEEEE',
};

const safeTypography = {
  subtitle: (typography as any).subtitle || { fontSize: 18, fontWeight: '600' },
  body: (typography as any).body || { fontSize: 16 },
  label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' },
  button: (typography as any).button || { fontSize: 16, fontWeight: 'bold' },
};

const safeSpacing = {
  md: (spacing as any).md || 16,
  lg: (spacing as any).lg || 24,
  xxl: (spacing as any).xxl || 48,
};

const safeRadius = {
  md: (radius as any).md || 8,
  lg: (radius as any).lg || 16,
};

const HubCard = ({ 
  title, description, time, icon, isComingSoon, onPress 
}: { 
  title: string, description: string, time: string, icon: keyof typeof Feather.glyphMap, isComingSoon?: boolean, onPress?: () => void 
}) => (
  <View style={[styles.card, isComingSoon && styles.cardDisabled]}>
    <View style={styles.cardHeader}>
      <View style={[styles.iconContainer, isComingSoon && styles.iconContainerDisabled]}>
        <Feather name={icon} size={22} color={isComingSoon ? safeColors.textSecondary : safeColors.primary} />
      </View>
      {isComingSoon ? (
        <View style={styles.badge}><Text style={styles.badgeText}>Coming Soon</Text></View>
      ) : (
        <Text style={styles.timeText}>{time}</Text>
      )}
    </View>
    
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    
    {!isComingSoon && (
      <TouchableOpacity style={styles.startButton} onPress={onPress}>
        <Text style={styles.startButtonText}>Start</Text>
        <Feather name="arrow-right" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    )}
  </View>
);

export default function ReflectHubScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Header 
        title="Reflect" 
        subtitle="Choose the reflection that best fits your time and intention." 
      />
      
      <ScrollView contentContainerStyle={styles.container}>
        <HubCard 
          title="Quick Check-in"
          description="Capture today's emotional pulse and check your vital signs."
          time="2–3 mins"
          icon="zap"
          onPress={() => router.push('/reflection?mode=quick')}
        />
        
        <HubCard 
          title="Guided Reflection"
          description="A structured reflection covering well-being, relationships, and growth."
          time="5–7 mins"
          icon="compass"
          onPress={() => router.push('/reflection?mode=guided')}
        />
        
        <HubCard 
          title="Deep Reflection"
          description="Explore your thoughts, values, and long-term patterns."
          time="10–15 mins"
          icon="layers"
          isComingSoon={true}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: safeSpacing.lg, paddingBottom: safeSpacing.xxl, paddingTop: safeSpacing.md },
  card: {
    backgroundColor: safeColors.cardBackground,
    padding: safeSpacing.lg,
    borderRadius: safeRadius.lg,
    borderWidth: 1,
    borderColor: safeColors.border,
  },
  cardDisabled: { opacity: 0.6, backgroundColor: '#F9F9F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: safeSpacing.md },
  iconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#007AFF15',
    justifyContent: 'center', alignItems: 'center',
  },
  iconContainerDisabled: { backgroundColor: '#E0E0E0' },
  badge: { backgroundColor: safeColors.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { ...safeTypography.label, fontSize: 10, color: safeColors.textSecondary },
  timeText: { ...safeTypography.label, color: safeColors.textSecondary },
  cardTitle: { ...safeTypography.subtitle, fontSize: 18, marginBottom: 4 },
  cardDescription: { ...safeTypography.body, color: safeColors.textSecondary, marginBottom: safeSpacing.lg },
  startButton: {
    backgroundColor: safeColors.primary,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 12, borderRadius: safeRadius.md, gap: 8,
  },
  startButtonText: { ...safeTypography.button, color: '#FFFFFF' },
});