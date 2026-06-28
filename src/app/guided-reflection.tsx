import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Using inline safe colors to guarantee it builds without theme import errors
const safeColors = { primary: '#007AFF', background: '#F9F9F9', card: '#FFFFFF', text: '#111111', textSecondary: '#666666', border: '#EEEEEE' };

const PSYCHOLOGY_QUESTIONS = [
  { id: 1, theory: "Affect Labeling", question: "How would you name the exact emotion you are feeling right now, and where do you feel it in your body?" },
  { id: 2, theory: "Cognitive Reframing (CBT)", question: "What is the most dominant thought on your mind today? Is it an absolute fact, or an assumption?" },
  { id: 3, theory: "Positive Psychology", question: "What is one small, highly specific thing that brought you a moment of comfort or joy today?" },
  { id: 4, theory: "Self-Compassion", question: "If someone you loved deeply was having the exact day you are having, what would you say to them?" },
  { id: 5, theory: "Energy Audit", question: "What activity, environment, or thought drained your energy the most today?" },
  { id: 6, theory: "Energy Cultivation", question: "What gave you a sense of vitality or made you feel engaged today?" },
  { id: 7, theory: "Locus of Control (Stoicism)", question: "What is one thing causing you stress that is entirely outside of your control, which you need to release?" },
  { id: 8, theory: "Actionable Agency", question: "What is one small, manageable action entirely within your control that you can take tomorrow?" },
  { id: 9, theory: "Values Alignment (ACT)", question: "In what way did your actions today align (or misalign) with the core values of the person you are trying to become?" },
  { id: 10, theory: "Inner Critic Audit", question: "What is a harsh judgment you made about yourself today, and how can you rewrite it with kindness?" },
  { id: 11, theory: "Connection & Empathy", question: "Did you feel truly connected to anyone today? If not, how can you create a moment of connection tomorrow?" },
  { id: 12, theory: "Future Pacing", question: "When you wake up tomorrow, what is the single intentional emotion or mindset you want to carry with you?" },
  { id: 13, theory: "Brain Dump", question: "What is the final lingering thought you need to leave on this page before closing out your day?" },
];

export default function GuidedReflectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSave = () => {
    // In v2.0, this will save to your local database. For now, it returns to the journal.
    router.push('/journal' as any);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: safeColors.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={safeColors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Guided Reflection</Text>
          <Text style={styles.headerSubtitle}>Deep cognitive processing</Text>
        </View>
        <View style={{ width: 40 }} /> {/* Spacer for alignment */}
      </View>

      {/* Questions Scroll */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {PSYCHOLOGY_QUESTIONS.map((q, index) => (
          <View key={q.id} style={styles.questionCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{q.theory.toUpperCase()}</Text>
            </View>
            <Text style={styles.questionNumber}>Question {index + 1} of 13</Text>
            <Text style={styles.questionText}>{q.question}</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Tap to reflect..."
              placeholderTextColor={safeColors.textSecondary + '80'}
              multiline
              textAlignVertical="top"
              value={answers[q.id] || ''}
              onChangeText={(text) => setAnswers({ ...answers, [q.id]: text })}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8} onPress={handleSave}>
          <Text style={styles.submitButtonText}>Save Reflection</Text>
          <Feather name="check" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, backgroundColor: safeColors.background, borderBottomWidth: 1, borderBottomColor: safeColors.border },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: safeColors.text, textAlign: 'center' },
  headerSubtitle: { fontSize: 12, color: safeColors.textSecondary, textAlign: 'center', marginTop: 2 },
  scrollContent: { padding: 20, paddingBottom: 60, gap: 24 },
  questionCard: { backgroundColor: safeColors.card, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  badge: { alignSelf: 'flex-start', backgroundColor: safeColors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: safeColors.border },
  badgeText: { fontSize: 10, fontWeight: '700', color: safeColors.primary, letterSpacing: 0.5 },
  questionNumber: { fontSize: 12, fontWeight: '600', color: safeColors.textSecondary, marginBottom: 8 },
  questionText: { fontSize: 18, fontWeight: '600', color: safeColors.text, lineHeight: 26, marginBottom: 16 },
  textInput: { backgroundColor: safeColors.background, minHeight: 120, borderRadius: 12, padding: 16, fontSize: 16, color: safeColors.text, borderWidth: 1, borderColor: safeColors.border },
  submitButton: { backgroundColor: safeColors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, marginTop: 10 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});