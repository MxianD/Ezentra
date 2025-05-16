import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

interface User {
  id: string;
  name: string;
  avatar: string;
  title: string;
}

export default function NewMessageScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUsers: User[] = [
      {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://picsum.photos/50',
        title: 'Web3 Developer',
      },
      {
        id: 'user2',
        name: 'Jane Smith',
        avatar: 'https://picsum.photos/51',
        title: 'UI Designer',
      },
      {
        id: 'user3',
        name: 'Mike Johnson',
        avatar: 'https://picsum.photos/52',
        title: 'Smart Contract Developer',
      },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => router.push(`/messages/${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userTitle}>{item.title}</Text>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color="rgba(255, 255, 255, 0.6)" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Navigator />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={16} color="#7834E6" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Message</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={16} color="rgba(255, 255, 255, 0.6)" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.2)',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  listContent: {
    padding: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
}); 