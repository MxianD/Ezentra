import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Navigator from '@/components/Navigator/Navigator';
import AbilityPolygon from '@/components/AbilityPolygon';
import { 
  IconLevel, 
  IconMath, 
  IconEnglish, 
  IconSports, 
  IconMusic, 
  IconComputer 
} from '@/components/icons/StatIcons';

interface CommunityDetails {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl: string;
  isJoined: boolean;
  rating?: number;
  createdAt?: string;
  endDate?: string;
  tags?: string[];
  currentTask?: CommunityTask;
  reviewBoard?: ReviewBoard;
  members?: CommunityMember[];
}

interface CommunityTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  reward: string;
  status: 'active' | 'completed' | 'pending';
}

interface ReviewBoard {
  id: string;
  members: ReviewMember[];
  rating: number;
}

interface ReviewMember {
  id: string;
  name: string;
  role: 'Founder' | 'Reviewer' | 'Member';
  avatar: string;
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Founder' | 'Reviewer' | 'Member';
  joinDate: string;
  skillPoints: number;
}

export default function CommunityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    // Mock data based on static data structure
    const mockCommunities = {
      '1': {
        id: '1',
        name: 'Web3 Developers',
        description: 'A community for Web3 developers to share knowledge and experiences. Join us to learn, share, and grow together in the Web3 space.',
        memberCount: 1234,
        imageUrl: 'https://picsum.photos/200',
        isJoined: false,
        rating: 4.9,
        createdAt: '2024-03-15',
        endDate: '2024-12-31',
        tags: ['Development', 'Web3', 'Blockchain'],
        currentTask: {
          id: '1',
          title: 'Build a DApp',
          description: 'Create a decentralized application using Web3 technologies',
          deadline: '2024-04-15',
          reward: '1000 POINTS',
          status: 'active' as const
        },
        reviewBoard: {
          id: '1',
          members: [
            {
              id: '1',
              name: 'John Doe',
              role: 'Founder' as const,
              avatar: 'https://picsum.photos/50'
            },
            {
              id: '2',
              name: 'Jane Smith',
              role: 'Reviewer' as const,
              avatar: 'https://picsum.photos/51'
            },
            {
              id: '5',
              name: 'David Chen',
              role: 'Reviewer' as const,
              avatar: 'https://picsum.photos/54'
            },
            {
              id: '9',
              name: 'James Wilson',
              role: 'Reviewer' as const,
              avatar: 'https://picsum.photos/58'
            }
          ],
          rating: 4.8
        },
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
        description: 'Discuss the latest in decentralized finance',
        memberCount: 567,
        imageUrl: 'https://picsum.photos/201',
        isJoined: false,
        rating: 4.8,
        createdAt: '2024-03-14',
        endDate: '2024-10-15',
        tags: ['DeFi', 'Finance', 'Blockchain'],
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
        ],
        reviewBoard: {
          id: '2',
          members: [
            {
              id: '1',
              name: 'Robert Zhang',
              role: 'Founder' as const,
              avatar: 'https://picsum.photos/60'
            },
            {
              id: '2',
              name: 'Maria Garcia',
              role: 'Reviewer' as const,
              avatar: 'https://picsum.photos/61'
            }
          ],
          rating: 4.7
        },
      },
      '3': {
        id: '3',
        name: 'NFT Artists',
        description: 'A place for NFT artists to collaborate and share work',
        memberCount: 345,
        imageUrl: 'https://picsum.photos/202',
        isJoined: false,
        rating: 4.7,
        createdAt: '2024-03-13',
        endDate: '2024-09-30',
        tags: ['NFT', 'Art', 'Creative'],
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
        ],
        reviewBoard: {
          id: '3',
          members: [
            {
              id: '1',
              name: 'Alex Rivera',
              role: 'Founder' as const,
              avatar: 'https://picsum.photos/70'
            },
            {
              id: '2',
              name: 'Sophie Kim',
              role: 'Reviewer' as const,
              avatar: 'https://picsum.photos/71'
            }
          ],
          rating: 4.6
        },
      },
    };

    setCommunity(mockCommunities[id as keyof typeof mockCommunities] || {
      id: id as string,
      name: 'Web3 Developers',
      description: 'A community for Web3 developers to share knowledge and experiences. Join us to learn, share, and grow together in the Web3 space.',
      memberCount: 1234,
      imageUrl: 'https://picsum.photos/200',
      isJoined: false,
      rating: 4.9,
      createdAt: '2024-03-15',
      endDate: '2024-12-31',
      tags: ['Development', 'Web3', 'Blockchain'],
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
        }
      ]
    });
  }, [id]);

  const handleJoinCommunity = async () => {
    // TODO: Implement API call to join community
    Alert.alert('Success', 'You have joined the community!');
    setCommunity(prev => prev ? { ...prev, isJoined: true } : null);
  };

  const handleUploadProof = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsUploading(true);
      // TODO: Implement API call to upload proof
      setTimeout(() => {
        Alert.alert('Success', 'Proof uploaded successfully!');
        setIsUploading(false);
      }, 1500);
    }
  };

  const abilityIcons = {
    Math: IconMath,
    English: IconEnglish,
    Sports: IconSports,
    Music: IconMusic,
    Computer: IconComputer,
  };

  const getAbilityStats = () => {
    return [];
  };

  const toggleAbility = (ability: string) => {
    // Empty function
  };

  if (!community) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navigator />
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.sidebar}>
            <View style={styles.headerSection}>
              {community.imageUrl && (
                <Image 
                  source={{ uri: community.imageUrl }} 
                  style={styles.communityImage}
                />
              )}
              <Text style={styles.title}>{community.name}</Text>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.memberCount}>
                  <FontAwesome5 name="users" size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.memberCountText}>{community.memberCount} members</Text>
                </View>
                {community.rating && (
                  <View style={styles.ratingContainer}>
                    <FontAwesome5 name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{community.rating}</Text>
                  </View>
                )}
              </View>
              {community.createdAt && (
                <View style={styles.dateContainer}>
                  <FontAwesome5 name="calendar-alt" size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.dateText}>Created {community.createdAt}</Text>
                </View>
              )}
              {community.endDate && (
                <View style={styles.dateContainer}>
                  <FontAwesome5 name="clock" size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.dateText}>Ends {community.endDate}</Text>
                </View>
              )}
              {!community.isJoined ? (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={handleJoinCommunity}
                >
                  <Text style={styles.joinButtonText}>Join Community</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Add Audit Button for Reviewers */}
            {community.reviewBoard?.members.some(member => member.role === 'Reviewer') && (
              <TouchableOpacity 
                style={styles.auditButton}
                onPress={() => router.push(`/community/${id}/audit`)}
              >
                <FontAwesome5 name="shield-alt" size={16} color="#7834E6" />
                <Text style={styles.auditButtonText}>Audit Panel</Text>
              </TouchableOpacity>
            )}

            {community.tags && community.tags.length > 0 && (
              <View style={styles.tagsCard}>
                <Text style={styles.tagsTitle}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {community.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.membersCard}>
              <View style={styles.membersHeader}>
                <Text style={styles.membersTitle}>Community Members</Text>
                <TouchableOpacity 
                  onPress={() => {
                    try {
                      router.push(`/community/${id}/members`);
                    } catch (error) {
                      console.error('Navigation error:', error);
                      Alert.alert('Error', 'Failed to navigate to members page');
                    }
                  }}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllButtonText}>View All</Text>
                  <FontAwesome5 name="chevron-right" size={12} color="#7834E6" />
                </TouchableOpacity>
              </View>
              {community.members && (
                <View style={styles.membersList}>
                  {[...community.members]
                    .sort((a, b) => {
                      // Founder always first
                      if (a.role === 'Founder') return -1;
                      if (b.role === 'Founder') return 1;
                      // Then sort by skill points
                      return b.skillPoints - a.skillPoints;
                    })
                    .slice(0, 5)
                    .map((member) => (
                      <View key={member.id} style={styles.memberItem}>
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
              )}
            </View>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>About</Text>
              <Text style={styles.description}>{community.description}</Text>
            </View>

            {community.isJoined && (
              <>
                {community.currentTask && (
                  <View style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskTitle}>Current Task</Text>
                      <View style={[styles.taskStatus, styles[`taskStatus${community.currentTask.status}`]]}>
                        <Text style={styles.taskStatusText}>{community.currentTask.status.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.taskName}>{community.currentTask.title}</Text>
                    <Text style={styles.taskDescription}>{community.currentTask.description}</Text>
                    <View style={styles.taskFooter}>
                      <View style={styles.taskDeadline}>
                        <FontAwesome5 name="clock" size={14} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.taskDeadlineText}>Deadline: {community.currentTask.deadline}</Text>
                      </View>
                      <Text style={styles.taskReward}>{community.currentTask.reward}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleUploadProof}
                    >
                      <Text style={styles.submitButtonText}>Submit Work</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.reviewBoardCard}
                  onPress={() => router.push(`/community/${id}/review-board`)}
                >
                  <View style={styles.reviewBoardHeader}>
                    <Text style={styles.reviewBoardTitle}>Review Board</Text>
                    <View style={styles.reviewBoardRating}>
                      <FontAwesome5 name="star" size={16} color="#FFD700" />
                      <Text style={styles.reviewBoardRatingText}>{community.reviewBoard?.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.reviewMembersContainer}>
                    {community.reviewBoard?.members.map((member) => (
                      <View key={member.id} style={styles.reviewMember}>
                        <TouchableOpacity 
                          style={styles.reviewMemberAvatarContainer}
                          onPress={() => router.push({
                            pathname: '/profile/[id]',
                            params: { id: member.id }
                          })}
                        >
                          <Image source={{ uri: member.avatar }} style={styles.reviewMemberAvatar} />
                        </TouchableOpacity>
                        <View style={styles.reviewMemberInfo}>
                          <Text style={styles.reviewMemberName}>{member.name}</Text>
                          <Text style={[
                            styles.reviewMemberRole,
                            member.role === 'Founder' && styles.founderRole,
                            member.role === 'Reviewer' && styles.reviewerRole
                          ]}>{member.role}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              </>
            )}
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
  scrollContent: {
    paddingTop: 20,
  },
  content: {
    flexDirection: 'row',
    padding: 20,
    gap: 20,
  },
  sidebar: {
    flex: 3,
    gap: 20,
  },
  mainContent: {
    flex: 7,
    gap: 20,
  },
  headerSection: {
    gap: 16,
  },
  communityImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  statsCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberCountText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: '#7834E6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tagsCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(120, 52, 230, 0.2)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  descriptionCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  taskCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    marginBottom: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  taskStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taskStatusactive: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderColor: '#2ecc71',
  },
  taskStatuscompleted: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderColor: '#3498db',
  },
  taskStatuspending: {
    backgroundColor: 'rgba(241, 196, 15, 0.2)',
    borderColor: '#f1c40f',
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  taskName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 16,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskDeadlineText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  taskReward: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#7834E6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewBoardCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  reviewBoardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewBoardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  reviewBoardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewBoardRatingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewMembersContainer: {
    gap: 12,
  },
  reviewMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  reviewMemberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewMemberInfo: {
    flex: 1,
  },
  reviewMemberName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  reviewMemberRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  membersCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    marginTop: 20,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllButtonText: {
    color: '#7834E6',
    fontSize: 14,
    fontWeight: '600',
  },
  membersList: {
    gap: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 14,
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
  memberAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  reviewMemberAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  auditButton: {
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  auditButtonText: {
    color: '#7834E6',
    fontSize: 16,
    fontWeight: '600',
  },
}); 