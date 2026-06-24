import { useRef, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, FlatList, Text } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';

import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';

import { Message } from '@/types/chat';
import { generateAIResponse } from '@/services/ai-service';
import { colors, spacing, typography } from '@/theme';

const SUGGESTED_PROMPTS = [
  'Help me reflect on today',
  'Plan tomorrow',
  'Reduce stress',
  'Understand my emotions',
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Pass the conversation history to our mock service
      const aiResponseText = await generateAIResponse(updatedMessages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Service Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.welcomeTitle}>Hello.</Text>
      <Text style={styles.welcomeBody}>
        I'm your AI companion. I'm here to listen, help you reflect, or just chat. How can I support you today?
      </Text>
      
      <View style={styles.promptsContainer}>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            variant="secondary"
            size="sm"
            style={styles.promptButton}
            onPress={() => handleSend(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </View>
    </View>
  );

  return (
    <Screen contentStyle={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Header title="AI Companion" style={styles.header} />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListEmptyComponent={renderEmptyState}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        )}

        <ChatInput onSend={handleSend} disabled={isTyping} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  welcomeTitle: {
    fontSize: typography.fontSize.title1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  welcomeBody: {
    fontSize: typography.fontSize.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.title3,
    marginBottom: spacing.xxxl,
  },
  promptsContainer: {
    width: '100%',
    gap: spacing.md,
  },
  promptButton: {
    alignSelf: 'stretch',
  },
  typingIndicator: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  typingText: {
    fontSize: typography.fontSize.label,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});