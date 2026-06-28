import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { colors, typography } from '@/theme';

const safeColors = colors as any;
const safeTypography = typography as any;

export default function ReflectScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Header title="Reflect" subtitle="Choose the reflection that best fits your time and intention." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 1. Quick Check-in Card (Routes to the 6 short questions) */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/reflection')}>
          <View style={styles.cardHeaderRow}>
             <View style={styles.iconBoxPrimary}>
                <Feather name="clock" size={24} color={safeColors.primary || '#007AFF'} />
             </View>
             <Text style={styles.durationText}>2 MINS</Text>
          </View>
          <Text style={styles.cardTitle}>Quick Check-in</Text>
          <Text style={styles.cardSubtitle}>A fast daily pause to log your mood and vital signs.</Text>
          <View style={[styles.cardButton, { backgroundColor: safeColors.primary || '#007AFF' }]}>
             <Text style={[styles.buttonText, { color: '#FFF' }]}>Start Quick Check-in</Text>
             <Feather name="arrow-right" size={18} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* 2. Guided Reflection Card (Routes to the 13 deep questions) */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/guided-reflection' as any)}>
          <View style={styles.cardHeaderRow}>
             <View style={styles.iconBoxPrimary}>
                <Feather name="compass" size={24} color={safeColors.primary || '#007AFF'} />
             </View>
             <Text style={styles.durationText}>5-7 MINS</Text>
          </View>
          <Text style={styles.cardTitle}>Guided Reflection</Text>
          <Text style={styles.cardSubtitle}>A structured 13-question reflection covering well-being, relationships, and growth.</Text>
          <View style={[styles.cardButton, { backgroundColor: safeColors.primary || '#007AFF' }]}>
             <Text style={[styles.buttonText, { color: '#FFF' }]}>Start Guided Reflection</Text>
             <Feather name="arrow-right" size={18} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* 3. Deep Reflection Card (Routes to the AI Chat Canvas) */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/chat')}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBoxSecondary}>
              <Feather name="layers" size={24} color={safeColors.textSecondary || '#666'} />
            </View>
            <View style={styles.badgeNeutral}>
              <Text style={styles.badgeTextNeutral}>UNSTRUCTURED</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Deep Reflection</Text>
          <Text style={styles.cardSubtitle}>
            A human-led, unguided space for your thoughts. Explore your values and long-term patterns at your own pace.
          </Text>

          <View style={[styles.cardButton, { backgroundColor: safeColors.background || '#F9F9F9', borderWidth: 1, borderColor: safeColors.border || '#EEE' }]}>
            <Text style={[styles.buttonText, { color: safeColors.text || '#111' }]}>Open Canvas</Text>
            <Feather name="arrow-right" size={18} color={safeColors.text || '#111'} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120, paddingTop: 16, gap: 16 },
  card: { backgroundColor: safeColors.cardBackground || '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: safeColors.border || '#EEE' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconBoxPrimary: { width: 48, height: 48, borderRadius: 24, backgroundColor: (safeColors.primary || '#007AFF') + '15', justifyContent: 'center', alignItems: 'center' },
  iconBoxSecondary: { width: 48, height: 48, borderRadius: 24, backgroundColor: safeColors.background || '#F9F9F9', borderWidth: 1, borderColor: safeColors.border || '#EEE', justifyContent: 'center', alignItems: 'center' },
  durationText: { ...(safeTypography.label || { fontSize: 12, fontWeight: '600' }), color: safeColors.textSecondary || '#666' },
  badgeNeutral: { backgroundColor: safeColors.background || '#F9F9F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: safeColors.border || '#EEE' },
  badgeTextNeutral: { ...(safeTypography.label || { fontSize: 12, fontWeight: '600' }), color: safeColors.textSecondary || '#666' },
  cardTitle: { ...(safeTypography.h3 || { fontSize: 18, fontWeight: '600' }), color: safeColors.textPrimary || '#111', marginBottom: 8 },
  cardSubtitle: { ...(safeTypography.body || { fontSize: 16 }), color: safeColors.textSecondary || '#666', marginBottom: 20, lineHeight: 22 },
  cardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  buttonText: { ...(safeTypography.body || { fontSize: 16 }), fontWeight: '600' },
});