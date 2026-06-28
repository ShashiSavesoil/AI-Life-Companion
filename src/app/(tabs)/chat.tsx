import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { sendMessageToAI } from '@/services/conversation-service';
import { colors, spacing, typography, radius } from '@/theme';

const { width } = Dimensions.get('window');

const safeColors = { primary: (colors as any).primary || '#007AFF', cardBackground: (colors as any).cardBackground || '#FFFFFF', text: (colors as any).text || '#111111', textSecondary: (colors as any).textSecondary || '#666666', border: (colors as any).border || '#EEEEEE', background: '#F9F9F9' };
const safeTypography = { h2: { fontSize: 24, fontWeight: 'bold' as const }, h3: { fontSize: 18, fontWeight: '600' as const }, body: { fontSize: 16, lineHeight: 24 }, label: { fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: 0.5 } };

type Message = { id: string; text: string; sender: 'user' | 'ai' };
type AIMode = 'welcome' | 'reflect' | 'growth' | 'coach' | 'free';

const COMPANION_MODES = [
  { id: 'reflect', icon: 'edit-3', title: 'Reflect With Me', subtitle: 'Guided, step-by-step psychological reflection.', prompt: 'I want to reflect on my day. Please ask me ONE psychology-based question at a time to help me unpack my thoughts. Do not overwhelm me.' },
  { id: 'growth', icon: 'trending-up', title: 'Understand My Growth', subtitle: 'Analyze my timeline and habits for insights.', prompt: 'Based on my goals, habits, and timeline context, summarize my recent growth and point out any patterns you see in my behavior.' },
  { id: 'coach', icon: 'target', title: 'Coach Me', subtitle: 'Personalized advice to hit my active goals.', prompt: 'Look at my active goals and current streaks. Give me a personalized, actionable coaching suggestion for what I should focus on today.' },
  { id: 'free', icon: 'message-circle', title: 'Free Conversation', subtitle: 'Open space to talk about anything.', prompt: 'Hello.' },
];

export default function ChatScreen() {
  const [activeMode, setActiveMode] = useState<AIMode>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const startMode = async (modeId: AIMode, systemTriggerPrompt: string) => {
    setActiveMode(modeId);
    setMessages([]);
    
    if (modeId !== 'free') {
      setIsLoading(true);
      try {
        const aiResponseText = await sendMessageToAI(systemTriggerPrompt);
        setMessages([{ id: Date.now().toString(), text: aiResponseText, sender: 'ai' }]);
      } catch (error) {
        setMessages([{ id: Date.now().toString(), text: "I'm having trouble connecting to my systems.", sender: 'ai' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const newUserMsg: Message = { id: Date.now().toString(), text: inputText.trim(), sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponseText = await sendMessageToAI(newUserMsg.text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "I'm having trouble connecting.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderWelcomeScreen = () => (
    <ScrollView contentContainerStyle={styles.welcomeContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.welcomeTitle}>How can I support you?</Text>
      <Text style={styles.welcomeSubtitle}>Select a mode. I will use your timeline, habits, and goals to provide personalized guidance.</Text>
      
      <View style={styles.grid}>
        {COMPANION_MODES.map((mode) => (
          <TouchableOpacity key={mode.id} style={styles.modeCard} onPress={() => startMode(mode.id as AIMode, mode.prompt)} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
              <Feather name={mode.icon as any} size={24} color={safeColors.primary} />
            </View>
            <Text style={styles.modeTitle}>{mode.title}</Text>
            <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <Screen>
      {activeMode === 'welcome' ? (
        <Header title="AI Companion" subtitle="Your personalized growth engine." />
      ) : (
        <View style={styles.activeHeader}>
          <TouchableOpacity onPress={() => setActiveMode('welcome')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={safeColors.text} />
          </TouchableOpacity>
          <Text style={styles.activeHeaderTitle}>{COMPANION_MODES.find(m => m.id === activeMode)?.title || 'Chat'}</Text>
          <View style={{ width: 24 }} />
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {activeMode === 'welcome' ? renderWelcomeScreen() : (
          <>
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chatArea} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
              {messages.map((msg) => (
                <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                  <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.aiText]}>{msg.text}</Text>
                </View>
              ))}
              {isLoading && (
                <View style={[styles.messageBubble, styles.aiBubble, { width: 60 }]}>
                  <Text style={styles.aiText}>...</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputArea}>
              <TextInput style={styles.input} placeholder="Type your response..." value={inputText} onChangeText={setInputText} multiline />
              <TouchableOpacity style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} onPress={handleSend} disabled={!inputText.trim() || isLoading}>
                <Feather name="send" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: { paddingBottom: 40, paddingTop: 16, paddingHorizontal: 4 },
  welcomeTitle: { ...safeTypography.h2, color: safeColors.text, marginBottom: 8 },
  welcomeSubtitle: { ...safeTypography.body, color: safeColors.textSecondary, marginBottom: 24 },
  grid: { gap: 16 },
  modeCard: { backgroundColor: safeColors.cardBackground, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border },
  iconWrapper: { width: 48, height: 48, borderRadius: 12, backgroundColor: safeColors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modeTitle: { ...safeTypography.h3, color: safeColors.text, marginBottom: 4 },
  modeSubtitle: { ...safeTypography.body, color: safeColors.textSecondary, fontSize: 14 },
  
  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottomWidth: 1, borderColor: safeColors.border, marginBottom: 8 },
  backButton: { padding: 4 },
  activeHeaderTitle: { ...safeTypography.h3, color: safeColors.text },
  
  chatArea: { flexGrow: 1, paddingBottom: 24, paddingTop: 16 },
  messageBubble: { padding: 16, borderRadius: 20, maxWidth: '85%', marginBottom: 16 },
  userBubble: { backgroundColor: safeColors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: safeColors.cardBackground, borderWidth: 1, borderColor: safeColors.border, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { ...safeTypography.body },
  userText: { color: '#FFF' },
  aiText: { color: safeColors.text },
  
  inputArea: { flexDirection: 'row', paddingVertical: 12, alignItems: 'flex-end', gap: 12, borderTopWidth: 1, borderColor: safeColors.border, backgroundColor: safeColors.background },
  input: { flex: 1, backgroundColor: safeColors.cardBackground, borderWidth: 1, borderColor: safeColors.border, borderRadius: 24, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, ...safeTypography.body, maxHeight: 120 },
  sendBtn: { backgroundColor: safeColors.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
});