import { StyleSheet, View } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { Screen } from '@/components/ui/screen';

import MoodSelector from '@/components/reflection/MoodSelector';
import ProgressBar from '@/components/reflection/ProgressBar';
import QuestionCard from '@/components/reflection/QuestionCard';
import ReflectionInput from '@/components/reflection/ReflectionInput';

import { saveReflection } from '@/services/reflection-storage';
import { getReflectionTemplate } from '@/services/reflection-engine';
import { ReflectionEntry, ReflectionResponse } from '@/types/reflection';

import { spacing } from '@/theme';

export default function ReflectionScreen() {
  const router = useRouter();
  
  // The UI is now a generic renderer. It loads the template directly from the engine.
  const template = useMemo(() => getReflectionTemplate('quick'), []);
  const questions = template.questions;

  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic dictionary to hold answers keyed by question ID, not hardcoded names
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = questions[step];
  const currentValue = answers[current.id] || '';

  const updateAnswer = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [current.id]: text,
    }));
  };

  const isCurrentStepValid = current.optional || currentValue.trim().length > 0;

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      try {
        // Map dynamic answers into psychological measurements
        const responses: ReflectionResponse[] = questions.map((q) => ({
          questionId: q.id,
          dimension: q.dimension,
          framework: q.framework,
          answer: answers[q.id] || '',
        }));

        // Helper to extract measurements for legacy compatibility
        const getLegacyValue = (dimension: string) => {
          return responses.find(r => r.dimension === dimension)?.answer || '';
        };

        const newEntry: ReflectionEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          createdAt: Date.now(),
          responses, // The new standard
          
          // Fallbacks for MVP dashboard/memory integration
          mood: getLegacyValue('emotional_wellbeing'),
          meaningfulMoment: getLegacyValue('meaning'),
          challenge: '', 
          gratitude: '',
          tomorrowGoal: '',
        };

        await saveReflection(newEntry);
        router.replace('/journal');
      } catch (error) {
        console.error('Failed to save reflection:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Screen>
      <Header
        title={template.title}
        subtitle={template.description}
      />

      <ProgressBar
        current={step + 1}
        total={questions.length}
      />

      <QuestionCard
        title={current.title}
        question={current.question}
      />

      <View style={styles.content}>
        {current.inputType === 'mood' ? (
          <MoodSelector
            onSelect={(mood) => updateAnswer(mood)}
          />
        ) : (
          <ReflectionInput
            value={currentValue}
            onChangeText={updateAnswer}
            placeholder={current.description || "Write your thoughts..."}
          />
        )}

        <Button
          fullWidth
          onPress={handleNext}
          disabled={isSaving || !isCurrentStepValid}
        >
          {step === questions.length - 1
            ? 'Finish Reflection'
            : 'Continue'}
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: spacing.lg,
    gap: spacing.xl,
  },
});