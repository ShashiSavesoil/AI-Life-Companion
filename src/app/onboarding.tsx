import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, radius } from '@/theme';

const { width } = Dimensions.get('window');

// Safe fallbacks for premium UI
const safeColors = {
  primary: (colors as any).primary || '#007AFF',
  background: (colors as any).background || '#F9F9F9',
  cardBackground: (colors as any).cardBackground || '#FFFFFF',
  text: (colors as any).text || '#111111',
  textSecondary: (colors as any).textSecondary || '#666666',
  border: (colors as any).border || '#EEEEEE',
};

const safeTypography = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, lineHeight: 24 },
  button: { fontSize: 16, fontWeight: 'bold' as const },
};

const ONBOARDING_STEPS = [
  {
    id: 'step_1',
    icon: 'compass',
    title: 'Find Your Center',
    description: 'Welcome to your AI Life Companion. A private space designed to help you reflect, grow, and navigate your daily life with clarity.',
  },
  {
    id: 'step_2',
    icon: 'edit-3',
    title: 'Meaningful Reflection',
    description: 'Move beyond generic journaling. Our dynamic engine adapts to your state of mind, asking the right questions at the right time based on psychological frameworks.',
  },
  {
    id: 'step_3',
    icon: 'trending-up',
    title: 'Intentional Growth',
    description: 'Turn your reflections into action. Set growth goals and build daily habits that align with the person you are actively becoming.',
  },
  {
    id: 'step_4',
    icon: 'cpu',
    title: 'Intelligent Context',
    description: 'Your companion remembers. The AI Context Engine securely synthesizes your timeline, goals, and habits to provide highly personalized support and insights.',
  },
  {
    id: 'step_5',
    icon: 'shield',
    title: 'Absolute Privacy',
    description: 'Your data is yours. Built on a strict local-first architecture, your reflections never leave this device unless you choose to export them.',
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Mark onboarding as complete and navigate to main app
      await AsyncStorage.setItem('@companion_onboarded', 'true');
      router.replace('/(tabs)');
    }
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Dynamic Icon Display */}
        <View style={styles.iconShowcase}>
          <View style={styles.iconCircle}>
            <Feather name={step.icon as any} size={48} color={safeColors.primary} />
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>

        {/* Footer: Indicators and Button */}
        <View style={styles.footer}>
          <View style={styles.indicatorRow}>
            {ONBOARDING_STEPS.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicator, 
                  currentStep === index && styles.indicatorActive
                ]} 
              />
            ))}
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? "Start Your Journey" : "Continue"}
            </Text>
            <Feather 
              name={currentStep === ONBOARDING_STEPS.length - 1 ? "check" : "arrow-right"} 
              size={20} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: safeColors.background },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  iconShowcase: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: safeColors.primary + '15', justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, justifyContent: 'flex-start' },
  title: { ...safeTypography.h1, color: safeColors.text, marginBottom: 16, textAlign: 'center' },
  description: { ...safeTypography.h3, color: safeColors.textSecondary, textAlign: 'center', fontWeight: '400' },
  footer: { paddingBottom: 24 },
  indicatorRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: safeColors.border },
  indicatorActive: { width: 24, backgroundColor: safeColors.primary },
  button: { backgroundColor: safeColors.primary, flexDirection: 'row', padding: 18, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8 },
  buttonText: { ...safeTypography.button, color: '#FFFFFF' },
});