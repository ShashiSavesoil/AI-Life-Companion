import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { sendMessageToAI } from '@/services/conversation-service';
import { getDashboardInsights } from '@/services/insights-service';
import { colors, spacing, typography, radius } from '@/theme';

const safeColors = { primary: (colors as any).primary || '#007AFF', cardBackground: (colors as any).cardBackground || '#FFFFFF', text: (colors as any).text || '#111111', textSecondary: (colors as any).textSecondary || '#666666', border: (colors as any).border || '#EEEEEE', background: '#F9F9F9' };
const safeTypography = { h3: (typography as any).h3 || { fontSize: 18, fontWeight: '600' }, body: (typography as any).body || { fontSize: 16 }, label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' } };

type Message = { id: string; text: string; sender: 'user' | 'ai' };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState({ streak: 0, latestMood: '...' });

  useFocusEffect(
    useCallback(() => {
      getDashboardInsights().then(setInsights).catch(console.error);
    }, [])
  );

  const handleSend = async (presetText?: string) => {
    const textToSend = presetText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const newUserMsg: Message = { id: Date.now().toString(), text: textToSend.trim(), sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponseText = await sendMessageToAI(newUserMsg.text);
      const newAiMsg: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "I'm having trouble connecting to my systems.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.contextBadge}>
        <Feather name="activity" size={16} color={safeColors.primary} />
        <Text style={styles.contextText}>Mood: {insights.latestMood} • Streak: 🔥 {insights.streak}</Text>
      </View>
      <Text style={styles.emptyTitle}>How can I support you today?</Text>
      <View style={styles.suggestionRow}>
        <TouchableOpacity style={styles.suggestionBtn} onPress={() => handleSend("Help me reflect on my day.")}>
          <Text style={styles.suggestionText}>Reflect on my day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestionBtn} onPress={() => handleSend("I'm feeling a bit overwhelmed.")}>
          <Text style={styles.suggestionText}>I feel overwhelmed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Screen>
      <Header title="AI Companion" subtitle="Your private space to talk." />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <ScrollView contentContainerStyle={styles.chatArea}>
          {messages.length === 0 ? renderEmptyState() : messages.map((msg) => (
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
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} onPress={() => handleSend()} disabled={!inputText.trim() || isLoading}>
            <Feather name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chatArea: { flexGrow: 1, paddingBottom: 24, paddingTop: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  contextBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: safeColors.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 16, gap: 8 },
  contextText: { ...safeTypography.label, color: safeColors.primary },
  emptyTitle: { ...safeTypography.h3, color: safeColors.text, marginBottom: 24 },
  suggestionRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  suggestionBtn: { backgroundColor: safeColors.cardBackground, borderWidth: 1, borderColor: safeColors.border, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  suggestionText: { ...safeTypography.body, color: safeColors.textSecondary, fontSize: 14 },
  
  messageBubble: { padding: 14, borderRadius: 20, maxWidth: '80%', marginBottom: 12 },
  userBubble: { backgroundColor: safeColors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: safeColors.cardBackground, borderWidth: 1, borderColor: safeColors.border, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { ...safeTypography.body },
  userText: { color: '#FFF' },
  aiText: { color: safeColors.text },
  
  inputArea: { flexDirection: 'row', paddingVertical: 12, alignItems: 'flex-end', gap: 8, borderTopWidth: 1, borderColor: safeColors.border },
  input: { flex: 1, backgroundColor: safeColors.background, borderWidth: 1, borderColor: safeColors.border, borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, ...safeTypography.body, maxHeight: 100 },
  sendBtn: { backgroundColor: safeColors.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
});