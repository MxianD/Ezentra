import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

interface SenateMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Senator' | 'Senior Senator';
  joinDate: string;
  reviewCount: number;
}

export default function SenateMembersScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const senateMembers: SenateMember[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: 'https://picsum.photos/100',
      role: 'Senior Senator',
      joinDate: '2024-01-15',
      reviewCount: 156
    },
    {
      id: '2',
      name: 'Emma Wilson',
      avatar: 'https://picsum.photos/101',
      role: 'Senior Senator',
      joinDate: '2024-01-20',
      reviewCount: 142
    },
    {
      id: '3',
      name: 'Michael Chen',
      avatar: 'https://picsum.photos/102',
      role: 'Senator',
      joinDate: '2024-02-01',
      reviewCount: 98
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      avatar: 'https://picsum.photos/103',
      role: 'Senator',
      joinDate: '2024-02-15',
      reviewCount: 85
    },
    {
      id: '5',
      name: 'David Brown',
      avatar: 'https://picsum.photos/104',
      role: 'Senator',
      joinDate: '2024-03-01',
      reviewCount: 67
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      avatar: 'https://picsum.photos/105',
      role: 'Senator',
      joinDate: '2024-03-05',
      reviewCount: 45
    },
    {
      id: '7',
      name: 'Robert Taylor',
      avatar: 'https://picsum.photos/106',
      role: 'Senator',
      joinDate: '2024-03-10',
      reviewCount: 32
    },
    {
      id: '8',
      name: 'Sophie Chen',
      avatar: 'https://picsum.photos/107',
      role: 'Senator',
      joinDate: '2024-03-15',
      reviewCount: 28
    }
  ];

  const filteredMembers = senateMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    // Senior Senator always first
    if (a.role === 'Senior Senator' && b.role !== 'Senior Senator') return -1;
    if (a.role !== 'Senior Senator' && b.role === 'Senior Senator') return 1;
    // Then sort by review count
    return b.reviewCount - a.reviewCount;
  });

  return (
    <View style={styles.container}>
      <Navigator />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Senate Members</Text>
          <Text style={styles.subtitle}>All members of the Senate review board</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <FontAwesome5 name="search" size={16} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
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
                  member.role === 'Senior Senator' && styles.seniorSenatorRole
                ]}>{member.role}</Text>
              </View>
              <View style={styles.memberStats}>
                <Text style={styles.memberReviewCount}>{member.reviewCount} reviews</Text>
                <Text style={styles.memberJoinDate}>Joined {member.joinDate}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
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
  membersList: {
    gap: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  rankContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  firstRank: {
    backgroundColor: '#FFD700',
    color: '#000000',
  },
  secondRank: {
    backgroundColor: '#C0C0C0',
    color: '#000000',
  },
  thirdRank: {
    backgroundColor: '#CD7F32',
    color: '#000000',
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  seniorSenatorRole: {
    color: '#FFD700',
    fontWeight: '600',
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  memberReviewCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
  },
  memberJoinDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
}); 