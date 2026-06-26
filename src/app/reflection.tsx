import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { getReflectionTemplate } from '@/services/reflection-engine';
import { saveReflection } from '@/services/reflection-storage'; 
import { ReflectionMode, ReflectionTemplate } from '@/types/reflection-engine';
import { ReflectionEntry, ReflectionResponse } from '@/types/reflection';
import { colors, spacing, typography, radius } from '@/theme';

export default function ReflectionScreen() {
  const router = useRouter();
  
  const { mode } = useLocalSearchParams<{ mode: string }>();
  
  // 1. New Async State Management
  const [template, setTemplate] = useState<ReflectionTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // 2. Fetch the template asynchronously (checking memory for follow-ups)
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      getReflectionTemplate((mode as ReflectionMode) || 'quick').then(t => {
        if (isMounted) {
          setTemplate(t);
          setLoading(false);
        }
      });
      return () => { isMounted = false; };
    }, [mode])
  );

  // 3. Loading Gatekeeper (Prevents the crash!)
  if (loading || !template) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Preparing your reflection...</Text>
        </View>
      </Screen>
    );
  }

  // 4. Safe to read questions now that loading is finished
  const questions = template.questions;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || '';

  const canContinue = currentQuestion.optional || currentAnswer.trim().length > 0;

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      await handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const responses: ReflectionResponse[] = questions.map(q => ({
        questionId: q.id,
        dimension: q.dimension,
        answer: answers[q.id] || '',
      }));

      const newEntry: ReflectionEntry = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        responses: responses,
        mood: responses.find(r => r.dimension === 'emotional_wellbeing')?.answer,
        meaningfulMoment: responses.find(r => r.dimension === 'meaning')?.answer,
      };

      await saveReflection(newEntry);
      router.replace('/journal'); 
    } catch (error) {
      console.error("Failed to save reflection:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = () => {
    if (currentQuestion.inputType === 'mood') {
      const moods = ['Great', 'Good', 'Okay', 'Bad', 'Awful'];
      return (
        <View style={styles.moodContainer}>
          {moods.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.moodButton, currentAnswer === m && styles.moodButtonActive]}
              onPress={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: m }))}
            >
              <Text style={[styles.moodText, currentAnswer === m && styles.moodTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <TextInput
        style={[styles.textInput, currentQuestion.inputType === 'text_long' && styles.textInputLarge]}
        multiline={currentQuestion.inputType === 'text_long'}
        placeholder={currentQuestion.description || "Type your answer here..."}
        placeholderTextColor={safeColors.textSecondary}
        value={currentAnswer}
        onChangeText={(text) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: text }))}
      />
    );
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Screen>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{template.title}</Text>
          <Text style={styles.subtitle}>{template.description}</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</Text>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.questionCard}>
            <Text style={styles.dimensionLabel}>{currentQuestion.title.toUpperCase()}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>
          {renderInput()}
        </ScrollView>

        <View style={styles.footer}>
           <TouchableOpacity 
             style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
             onPress={handleNext}
             disabled={!canContinue || isSaving}
           >
             <Text style={styles.continueButtonText}>
               {currentIndex === questions.length - 1 ? (isSaving ? "Saving..." : "Finish") : "Continue"}
             </Text>
           </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// Safe fallbacks to fix TypeScript red lines
const safeColors = {
  primary: (colors as any).primary || '#007AFF',
  background: (colors as any).background || '#F9F9F9',
  cardBackground: (colors as any).cardBackground || '#FFFFFF',
  text: (colors as any).text || '#111111',
  textSecondary: (colors as any).textSecondary || '#666666',
  border: (colors as any).border || '#EEEEEE',
};

const safeTypography = {
  h2: (typography as any).h2 || { fontSize: 24, fontWeight: 'bold' },
  h3: (typography as any).h3 || { fontSize: 18, fontWeight: '600' },
  body: (typography as any).body || { fontSize: 16 },
  label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' },
  button: (typography as any).button || { fontSize: 16, fontWeight: 'bold' },
};

const safeSpacing = {
  xs: (spacing as any).xs || 4,
  sm: (spacing as any).sm || 8,
  md: (spacing as any).md || 16,
  lg: (spacing as any).lg || 24,
  xl: (spacing as any).xl || 32,
  xxl: (spacing as any).xxl || 48,
};

const safeRadius = {
  sm: (radius as any).sm || 4,
  md: (radius as any).md || 8,
  lg: (radius as any).lg || 16,
};

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...safeTypography.body, color: safeColors.textSecondary },
  header: { marginBottom: safeSpacing.lg, marginTop: safeSpacing.md },
  title: { ...safeTypography.h2, color: safeColors.text, marginBottom: safeSpacing.xs },
  subtitle: { ...safeTypography.body, color: safeColors.textSecondary },
  progressTrack: { height: 8, backgroundColor: safeColors.border, borderRadius: 4, overflow: 'hidden', marginBottom: safeSpacing.sm },
  progressBar: { height: '100%', backgroundColor: safeColors.primary },
  progressText: { ...safeTypography.label, color: safeColors.textSecondary, textAlign: 'center', marginBottom: safeSpacing.xl },
  content: { flexGrow: 1, paddingBottom: safeSpacing.xxl },
  questionCard: { backgroundColor: safeColors.cardBackground, padding: safeSpacing.lg, borderRadius: safeRadius.lg, borderWidth: 1, borderColor: safeColors.border, marginBottom: safeSpacing.lg },
  dimensionLabel: { ...safeTypography.label, color: safeColors.primary, marginBottom: safeSpacing.sm, fontWeight: 'bold' },
  questionText: { ...safeTypography.h3, color: safeColors.text },
  textInput: { backgroundColor: safeColors.background, borderWidth: 1, borderColor: safeColors.primary, borderRadius: safeRadius.md, padding: safeSpacing.lg, ...safeTypography.body, color: safeColors.text, minHeight: 120, textAlignVertical: 'top' },
  textInputLarge: { minHeight: 200 },
  moodContainer: { gap: safeSpacing.md },
  moodButton: { backgroundColor: safeColors.cardBackground, padding: safeSpacing.md, borderRadius: safeRadius.md, borderWidth: 1, borderColor: safeColors.border, alignItems: 'center' },
  moodButtonActive: { backgroundColor: safeColors.primary, borderColor: safeColors.primary },
  moodText: { ...safeTypography.body, color: safeColors.text },
  moodTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  footer: { paddingTop: safeSpacing.md, paddingBottom: safeSpacing.lg },
  continueButton: { backgroundColor: safeColors.primary, padding: 16, borderRadius: safeRadius.lg, alignItems: 'center' },
  continueButtonDisabled: { backgroundColor: safeColors.border },
  continueButtonText: { ...safeTypography.button, color: '#FFFFFF' },
});