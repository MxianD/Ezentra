import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isSender: boolean;
}

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUserInfo: UserInfo = {
      id: id as string,
      name: 'John Doe',
      avatar: 'https://picsum.photos/50',
      online: true,
    };
    setUserInfo(mockUserInfo);

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Hey, how are you?',
        timestamp: '2:30 PM',
        isSender: false,
      },
      {
        id: '2',
        content: 'I\'m doing great! How about you?',
        timestamp: '2:31 PM',
        isSender: true,
      },
    ];
    setMessages(mockMessages);
  }, [id]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSender: true,
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isSender ? styles.senderMessage : styles.receiverMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isSender ? styles.senderBubble : styles.receiverBubble
      ]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Navigator />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={16} color="#7834E6" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <FontAwesome5 name="user-circle" size={40} color="#7834E6" />
            {userInfo.online && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.userTextInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.onlineStatus}>
              {userInfo.online ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!newMessage.trim()}
        >
          <FontAwesome5 
            name="paper-plane" 
            size={20} 
            color={newMessage.trim() ? '#7834E6' : 'rgba(120, 52, 230, 0.5)'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 52, 230, 0.2)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
  backButtonText: {
    color: '#7834E6',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: 'black',
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  onlineStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  messagesList: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  senderMessage: {
    alignSelf: 'flex-end',
  },
  receiverMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  senderBubble: {
    backgroundColor: '#7834E6',
  },
  receiverBubble: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(120, 52, 230, 0.2)',
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    color: 'white',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
}); 