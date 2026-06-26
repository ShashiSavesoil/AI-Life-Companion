import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { getTimelineEvents } from '@/services/timeline-service';
import { TimelineEvent } from '@/types/timeline';
import { colors, spacing, typography, radius } from '@/theme';

// Safe fallbacks to prevent TypeScript red lines
const safeColors = {
  primary: (colors as any).primary || '#007AFF',
  cardBackground: (colors as any).cardBackground || '#FFFFFF',
  text: (colors as any).text || '#111111',
  textSecondary: (colors as any).textSecondary || '#666666',
  border: (colors as any).border || '#EEEEEE',
  success: '#34C759',
  warning: '#FF9500',
};
const safeTypography = {
  h2: (typography as any).h2 || { fontSize: 24, fontWeight: 'bold' },
  h3: (typography as any).h3 || { fontSize: 18, fontWeight: '600' },
  body: (typography as any).body || { fontSize: 16 },
  label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' },
};
const safeSpacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
const safeRadius = { md: 8, lg: 16 };

// Helper to format dates nicely (e.g. "Today", "Yesterday", "Oct 12")
const formatRelativeDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Generic Timeline Card Component
const TimelineCard = ({ event }: { event: TimelineEvent }) => {
  const handlePress = () => {
    // For V1, we just alert. In the future, this routes to detail screens.
    if (event.type === 'reflection') Alert.alert('Reflection Details', 'Opening reflection details...');
    if (event.type === 'insight') Alert.alert('Insight Details', 'Opening insight data...');
    if (event.type === 'streak' || event.type === 'achievement') Alert.alert('Milestone', event.subtitle || event.title);
  };

  // Determine colors based on event type
  let iconColor = safeColors.primary;
  let bgColor = safeColors.primary + '15'; // 15% opacity
  
  if (event.type === 'streak') {
    iconColor = safeColors.warning;
    bgColor = safeColors.warning + '15';
  } else if (event.type === 'achievement') {
    iconColor = safeColors.success;
    bgColor = safeColors.success + '15';
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
             <Feather name={(event.icon as any) || 'circle'} size={18} color={iconColor} />
          </View>
          <Text style={styles.dateText}>{formatRelativeDate(event.createdAt)}</Text>
        </View>
        <Text style={styles.typeLabel}>{event.type}</Text>
      </View>
      <Text style={styles.cardTitle}>{event.title}</Text>
      {event.subtitle && <Text style={styles.cardSubtitle}>{event.subtitle}</Text>}
    </TouchableOpacity>
  );
};

export default function MemoryTimelineScreen() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      getTimelineEvents().then(data => {
        if (isMounted) {
          setEvents(data);
          setLoading(false);
        }
      });
      return () => { isMounted = false; };
    }, [])
  );

  return (
    <Screen>
      <Header 
        title="Timeline" 
        subtitle="Your personal journey and growth over time." 
      />
      
      {loading ? (
        <View style={styles.center}><Text style={styles.cardSubtitle}>Loading your story...</Text></View>
      ) : events.length === 0 ? (
        <View style={styles.center}><Text style={styles.cardSubtitle}>Your journey starts here. Complete a reflection!</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.timelineLine} />
          {events.map((event) => (
            <TimelineCard key={event.id} event={event} />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: safeSpacing.xxl, paddingTop: safeSpacing.md, position: 'relative' },
  timelineLine: {
    position: 'absolute',
    left: 42, // Aligns exactly with the center of the icons
    top: safeSpacing.md,
    bottom: 0,
    width: 2,
    backgroundColor: safeColors.border,
    zIndex: -1,
  },
  card: {
    backgroundColor: safeColors.cardBackground,
    padding: safeSpacing.lg,
    borderRadius: safeRadius.lg,
    borderWidth: 1,
    borderColor: safeColors.border,
    marginBottom: safeSpacing.lg,
    marginLeft: safeSpacing.md,
    marginRight: safeSpacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: safeSpacing.sm },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: safeSpacing.sm },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  dateText: { ...safeTypography.label, color: safeColors.textSecondary },
  typeLabel: { ...safeTypography.label, color: safeColors.primary, fontSize: 10, opacity: 0.8 },
  cardTitle: { ...safeTypography.h3, color: safeColors.text, marginBottom: 4 },
  cardSubtitle: { ...safeTypography.body, color: safeColors.textSecondary },
});