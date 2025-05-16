import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Founder' | 'Reviewer' | 'Member';
  joinDate: string;
  skillPoints: number;
}

interface CommunityDetails {
  id: string;
  name: string;
  endDate?: string;
  members: CommunityMember[];
}

export default function CommunityMembersScreen() {
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock data based on static data structure
    const mockCommunities = {
      '1': {
        id: '1',
        name: 'Web3 Developers',
        members: [
          {
            id: '1',
            name: 'John Doe',
            avatar: 'https://picsum.photos/50',
            role: 'Founder' as const,
            joinDate: '2024-01-15',
            skillPoints: 1000
          },
          {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://picsum.photos/51',
            role: 'Reviewer' as const,
            joinDate: '2024-02-01',
            skillPoints: 850
          },
          {
            id: '3',
            name: 'Mike Johnson',
            avatar: 'https://picsum.photos/52',
            role: 'Member' as const,
            joinDate: '2024-02-15',
            skillPoints: 650
          },
          {
            id: '4',
            name: 'Sarah Wilson',
            avatar: 'https://picsum.photos/53',
            role: 'Member' as const,
            joinDate: '2024-01-20',
            skillPoints: 720
          },
          {
            id: '6',
            name: 'Emma Davis',
            avatar: 'https://picsum.photos/55',
            role: 'Member' as const,
            joinDate: '2024-01-05',
            skillPoints: 580
          },
          {
            id: '7',
            name: 'Alex Thompson',
            avatar: 'https://picsum.photos/56',
            role: 'Member' as const,
            joinDate: '2024-02-10',
            skillPoints: 620
          },
          {
            id: '8',
            name: 'Lisa Anderson',
            avatar: 'https://picsum.photos/57',
            role: 'Member' as const,
            joinDate: '2024-02-20',
            skillPoints: 450
          },
          {
            id: '10',
            name: 'Sophie Chen',
            avatar: 'https://picsum.photos/59',
            role: 'Member' as const,
            joinDate: '2024-02-05',
            skillPoints: 680
          }
        ]
      },
      '2': {
        id: '2',
        name: 'DeFi Enthusiasts',
        members: [
          {
            id: '1',
            name: 'Robert Zhang',
            avatar: 'https://picsum.photos/60',
            role: 'Founder' as const,
            joinDate: '2024-01-10',
            skillPoints: 1000
          },
          {
            id: '2',
            name: 'Maria Garcia',
            avatar: 'https://picsum.photos/61',
            role: 'Reviewer' as const,
            joinDate: '2024-01-15',
            skillPoints: 890
          },
          {
            id: '3',
            name: 'Kevin O\'Brien',
            avatar: 'https://picsum.photos/62',
            role: 'Member' as const,
            joinDate: '2024-01-20',
            skillPoints: 750
          },
          {
            id: '4',
            name: 'Linda Chen',
            avatar: 'https://picsum.photos/63',
            role: 'Member' as const,
            joinDate: '2024-02-01',
            skillPoints: 680
          },
          {
            id: '5',
            name: 'Tom Wilson',
            avatar: 'https://picsum.photos/64',
            role: 'Member' as const,
            joinDate: '2024-02-10',
            skillPoints: 720
          }
        ]
      },
      '3': {
        id: '3',
        name: 'NFT Artists',
        members: [
          {
            id: '1',
            name: 'Alex Rivera',
            avatar: 'https://picsum.photos/70',
            role: 'Founder' as const,
            joinDate: '2024-01-05',
            skillPoints: 1000
          },
          {
            id: '2',
            name: 'Sophie Kim',
            avatar: 'https://picsum.photos/71',
            role: 'Reviewer' as const,
            joinDate: '2024-01-15',
            skillPoints: 920
          },
          {
            id: '3',
            name: 'Marcus Brown',
            avatar: 'https://picsum.photos/72',
            role: 'Member' as const,
            joinDate: '2024-01-25',
            skillPoints: 780
          },
          {
            id: '4',
            name: 'Elena Popov',
            avatar: 'https://picsum.photos/73',
            role: 'Member' as const,
            joinDate: '2024-02-05',
            skillPoints: 650
          },
          {
            id: '5',
            name: 'David Lee',
            avatar: 'https://picsum.photos/74',
            role: 'Member' as const,
            joinDate: '2024-02-15',
            skillPoints: 720
          }
        ]
      }
    };

    setCommunity(mockCommunities[id as keyof typeof mockCommunities] || null);
  }, [id]);

  if (!community) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const filteredMembers = community.members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    // Founder always first
    if (a.role === 'Founder') return -1;
    if (b.role === 'Founder') return 1;
    // Then sort by skill points
    return b.skillPoints - a.skillPoints;
  });

  return (
    <View style={styles.container}>
      <Navigator />
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#7834E6" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Community Members</Text>
            <Text style={styles.subtitle}>{community.name}</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <FontAwesome5 name="search" size={16} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search members..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View style={styles.membersList}>
            {sortedMembers.map((member, index) => (
              <View key={member.id} style={styles.memberItem}>
                <View style={styles.rankContainer}>
                  <Text style={[
                    styles.rankNumber,
                    index === 0 && styles.firstRank,
                    index === 1 && styles.secondRank,
                    index === 2 && styles.thirdRank
                  ]}>
                    {index + 1}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.memberAvatarContainer}
                  onPress={() => router.push({
                    pathname: '/profile/[id]',
                    params: { id: member.id }
                  })}
                >
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                </TouchableOpacity>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={[
                    styles.memberRole,
                    member.role === 'Founder' && styles.founderRole,
                    member.role === 'Reviewer' && styles.reviewerRole
                  ]}>{member.role}</Text>
                </View>
                <View style={styles.memberStats}>
                  <Text style={styles.memberContribution}>{member.skillPoints} pts</Text>
                  <Text style={styles.memberJoinDate}>Joined {member.joinDate}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: '#7834E6',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  membersList: {
    gap: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  rankContainer: {
    width: 24,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  firstRank: {
    color: '#FFD700',
    fontSize: 20,
  },
  secondRank: {
    color: '#C0C0C0',
    fontSize: 18,
  },
  thirdRank: {
    color: '#CD7F32',
    fontSize: 18,
  },
  memberAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  memberRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  memberContribution: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ecc71',
  },
  memberJoinDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  founderRole: {
    color: '#FFD700',
    fontWeight: '600',
  },
  reviewerRole: {
    color: '#7834E6',
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 