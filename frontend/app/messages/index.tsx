import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user1',
        senderName: 'John Doe',
        senderAvatar: 'https://picsum.photos/50',
        lastMessage: 'Hey, how are you?',
        timestamp: '2m ago',
        unreadCount: 2,
      },
      {
        id: '2',
        senderId: 'user2',
        senderName: 'Jane Smith',
        senderAvatar: 'https://picsum.photos/51',
        lastMessage: 'Thanks for your help!',
        timestamp: '1h ago',
        unreadCount: 0,
      },
    ];
    setMessages(mockMessages);
  }, []);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => router.push(`/messages/${item.senderId}`)}
    >
      <Image source={{ uri: item.senderAvatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.senderName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Navigator />
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity 
          style={styles.newMessageButton}
          onPress={() => router.push('/messages/new')}
        >
          <FontAwesome5 name="plus" size={20} color="#7834E6" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 52, 230, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  listContent: {
    padding: 20,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.2)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#7834E6',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
}); 