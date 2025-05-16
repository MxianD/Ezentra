import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface SimilarUser {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  matchScore: number;
  role: string;
  community: string;
  level: number;
  contributions: number;
  online: boolean;
  lastActive: string;
}

interface SimilarUsersProps {
  currentUserId: string;
}

export default function SimilarUsers({ currentUserId }: SimilarUsersProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - In real app, this would come from an API
  const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([
    {
      id: '1',
      name: 'Alex Chen',
      avatar: 'https://picsum.photos/200',
      skills: ['React Native', 'TypeScript', 'UI/UX'],
      matchScore: 95,
      role: 'Senior Developer',
      community: 'Tech Community',
      level: 8,
      contributions: 156,
      online: true,
      lastActive: '2m ago'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      avatar: 'https://picsum.photos/201',
      skills: ['React Native', 'JavaScript', 'Mobile Dev'],
      matchScore: 88,
      role: 'Mobile Developer',
      community: 'Tech Community',
      level: 6,
      contributions: 98,
      online: false,
      lastActive: '1h ago'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://picsum.photos/202',
      skills: ['UI/UX', 'Figma', 'Design Systems'],
      matchScore: 82,
      role: 'UI Designer',
      community: 'Design Community',
      level: 5,
      contributions: 76,
      online: true,
      lastActive: '5m ago'
    }
  ]);

  // Mock function to get random users
  const getRandomUsers = () => {
    const mockUsers: SimilarUser[] = [
      {
        id: '4',
        name: 'Emma Davis',
        avatar: 'https://picsum.photos/203',
        skills: ['Web3', 'Solidity', 'Smart Contracts'],
        matchScore: 92,
        role: 'Blockchain Developer',
        community: 'Web3 Community',
        level: 7,
        contributions: 134,
        online: true,
        lastActive: '3m ago'
      },
      {
        id: '5',
        name: 'James Wilson',
        avatar: 'https://picsum.photos/204',
        skills: ['AI/ML', 'Python', 'Data Science'],
        matchScore: 87,
        role: 'AI Engineer',
        community: 'AI Community',
        level: 6,
        contributions: 112,
        online: false,
        lastActive: '30m ago'
      },
      {
        id: '6',
        name: 'Sophie Chen',
        avatar: 'https://picsum.photos/205',
        skills: ['Game Dev', 'Unity', 'C#'],
        matchScore: 85,
        role: 'Game Developer',
        community: 'Gaming Community',
        level: 5,
        contributions: 89,
        online: true,
        lastActive: '10m ago'
      }
    ];
    return mockUsers;
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSimilarUsers(getRandomUsers());
    setIsLoading(false);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return '#2ecc71';
    if (score >= 80) return '#3498db';
    return '#f1c40f';
  };

  const handleUserPress = (userId: string) => {
    setSelectedUser(userId);
    router.push({
      pathname: '/profile/[id]',
      params: { id: userId }
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // ???????????
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Similar Users</Text>
          <Text style={styles.subtitle}>Connect with like-minded builders</Text>
        </View>
        <TouchableOpacity 
          style={[styles.refreshButton, isLoading && styles.refreshButtonDisabled]}
          onPress={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="rgba(120, 52, 230, 0.8)" />
          ) : (
            <>
              <FontAwesome5 name="sync-alt" size={12} color="rgba(120, 52, 230, 0.8)" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.usersList}>
          {similarUsers.map((user) => (
            <Pressable
              key={user.id}
              style={({ pressed }) => [
                styles.userCard,
                pressed && styles.userCardPressed,
                selectedUser === user.id && styles.userCardSelected
              ]}
              onPress={() => handleUserPress(user.id)}
            >
              <LinearGradient
                colors={['rgba(120, 52, 230, 0.1)', 'rgba(120, 52, 230, 0.05)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <View style={[styles.levelBadge, { backgroundColor: getMatchColor(user.matchScore) }]}>
                      <Text style={styles.levelText}>Lvl {user.level}</Text>
                    </View>
                    <View style={[styles.onlineStatus, { backgroundColor: user.online ? '#2ecc71' : '#9CA3AF' }]} />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                    <Text style={styles.lastActive}>{user.online ? 'Online' : `Last active ${user.lastActive}`}</Text>
                  </View>
                </View>

                <View style={styles.skillsContainer}>
                  {user.skills.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <FontAwesome5 name="code" size={10} color="#7834E6" style={styles.skillIcon} />
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.matchScoreContainer}>
                    <FontAwesome5 name="chart-line" size={12} color={getMatchColor(user.matchScore)} />
                    <Text style={[styles.matchScore, { color: getMatchColor(user.matchScore) }]}>
                      {user.matchScore}% Match
                    </Text>
                  </View>
                  <View style={styles.contributionsContainer}>
                    <FontAwesome5 name="star" size={12} color="#f1c40f" />
                    <Text style={styles.contributionsText}>{user.contributions} contributions</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.connectButton}
                  onPress={() => handleUserPress(user.id)}
                >
                  <Text style={styles.connectButtonText}>Connect</Text>
                  <View style={styles.connectIconContainer}>
                    <FontAwesome5 name="user-plus" size={12} color="rgba(120, 52, 230, 0.9)" />
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(120, 52, 230, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.2)',
  },
  refreshButtonDisabled: {
    opacity: 0.7,
  },
  refreshButtonText: {
    color: 'rgba(120, 52, 230, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  usersList: {
    gap: 16,
  },
  userCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.3)',
    shadowColor: '#7834E6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  userCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  userCardSelected: {
    borderColor: '#7834E6',
    borderWidth: 2,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  onlineStatus: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000000',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  lastActive: {
    fontSize: 12,
    color: '#6B7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120, 52, 230, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.3)',
  },
  skillIcon: {
    marginRight: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#7834E6',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  contributionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contributionsText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120, 52, 230, 0.05)',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.3)',
  },
  connectButtonText: {
    color: 'rgba(120, 52, 230, 0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
  connectIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(120, 52, 230, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 