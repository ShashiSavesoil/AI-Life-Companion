import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { Screen } from '@/components/ui/screen';

import MoodSelector from '@/components/reflection/MoodSelector';
import ProgressBar from '@/components/reflection/ProgressBar';
import QuestionCard from '@/components/reflection/QuestionCard';
import ReflectionInput from '@/components/reflection/ReflectionInput';

import { saveReflection } from '@/services/reflection-storage';
import { ReflectionEntry } from '@/types/reflection';

import { spacing } from '@/theme';

const QUESTIONS = [
  {
    title: 'Emotion',
    question: 'How are you feeling right now?',
    type: 'mood',
  },
  {
    title: 'Meaning',
    question: 'What was the most meaningful moment today?',
    type: 'text',
  },
  {
    title: 'Challenge',
    question: 'What challenged you the most today?',
    type: 'text',
  },
  {
    title: 'Gratitude',
    question: 'What are you grateful for today?',
    type: 'text',
  },
  {
    title: 'Tomorrow',
    question: 'What is one small intention for tomorrow?',
    type: 'text',
  },
];

export default function ReflectionScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [answers, setAnswers] = useState({
    mood: '',
    meaningfulMoment: '',
    challenge: '',
    gratitude: '',
    tomorrowGoal: '',
  });

  const current = QUESTIONS[step];

  const updateAnswer = (text: string) => {
    const updated = { ...answers };

    switch (step) {
      case 1:
        updated.meaningfulMoment = text;
        break;
      case 2:
        updated.challenge = text;
        break;
      case 3:
        updated.gratitude = text;
        break;
      case 4:
        updated.tomorrowGoal = text;
        break;
    }

    setAnswers(updated);
  };

  const currentValue =
    step === 1
      ? answers.meaningfulMoment
      : step === 2
      ? answers.challenge
      : step === 3
      ? answers.gratitude
      : step === 4
      ? answers.tomorrowGoal
      : '';

  const isCurrentStepValid =
    current.type === 'mood'
      ? answers.mood !== ''
      : currentValue.trim().length > 0;

  const handleNext = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      try {
        const newEntry: ReflectionEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          mood: answers.mood,
          meaningfulMoment: answers.meaningfulMoment,
          challenge: answers.challenge,
          gratitude: answers.gratitude,
          tomorrowGoal: answers.tomorrowGoal,
          createdAt: Date.now(),
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
        title="Today's Reflection"
        subtitle="Take a few calm minutes for yourself."
      />

      <ProgressBar
        current={step + 1}
        total={QUESTIONS.length}
      />

      <QuestionCard
        title={current.title}
        question={current.question}
      />

      <View style={styles.content}>
        {current.type === 'mood' ? (
          <MoodSelector
            onSelect={(mood) =>
              setAnswers({
                ...answers,
                mood,
              })
            }
          />
        ) : (
          <ReflectionInput
            value={currentValue}
            onChangeText={updateAnswer}
            placeholder="Write your thoughts..."
          />
        )}

        <Button
          fullWidth
          onPress={handleNext}
          disabled={isSaving || !isCurrentStepValid}
        >
          {step === QUESTIONS.length - 1
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