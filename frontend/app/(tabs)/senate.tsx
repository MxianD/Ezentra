import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image, Dimensions } from 'react-native';
import Navigator from '@/components/Navigator/Navigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import Layout from '@/constants/Layout';

interface ReviewedFile {
  id: string;
  community: string;
  fileName: string;
  score: number;
  reviewDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SenateMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Senator' | 'Senior Senator';
  joinDate: string;
  reviewCount: number;
}

export default function SenateScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedFile, setSelectedFile] = useState<ReviewedFile | null>(null);
  const [score, setScore] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const isSenateMember = false;

  const [reviewedFiles, setReviewedFiles] = useState<ReviewedFile[]>([
    {
      id: '1',
      community: 'Tech Community',
      fileName: 'Project_Proposal.pdf',
      score: 85,
      reviewDate: '2024-03-15',
      status: 'pending'
    },
    {
      id: '2',
      community: 'Art Community',
      fileName: 'Design_Document.docx',
      score: 92,
      reviewDate: '2024-03-14',
      status: 'approved'
    },
    {
      id: '3',
      community: 'Gaming Community',
      fileName: 'Game_Concept.md',
      score: 78,
      reviewDate: '2024-03-13',
      status: 'rejected'
    }
  ]);

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
    }
  ];

  const filteredFiles = reviewedFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.community.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || file.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleScoreSubmit = () => {
    if (!selectedFile || !score) return;

    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      Alert.alert('Invalid Score', 'Please enter a score between 0 and 100');
      return;
    }

    const updatedFiles = reviewedFiles.map(file => {
      if (file.id === selectedFile.id) {
        return {
          ...file,
          score: scoreNum,
          status: scoreNum >= 80 ? 'approved' as const : 'rejected' as const,
          reviewDate: new Date().toISOString().split('T')[0]
        };
      }
      return file;
    });

    setReviewedFiles(updatedFiles);
    setIsModalVisible(false);
    setScore('');
    setSelectedFile(null);
  };

  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsSmallScreen(width < Layout.breakpoints.tablet);
    };

    updateLayout();
    Dimensions.addEventListener('change', updateLayout);

    return () => {
      // No cleanup needed in newer React Native versions
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isSmallScreen && styles.scrollContentMobile
          ]}
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <Text style={styles.title}>Senate Review</Text>
              <Text style={styles.subtitle}>Review and manage community files</Text>
            </View>

            <View style={styles.senateMembersCard}>
              <View style={styles.senateMembersHeader}>
                <Text style={styles.senateMembersTitle}>Senate Members</Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => router.push('/senate/members')}
                >
                  <Text style={styles.viewAllButtonText}>View All</Text>
                  <FontAwesome5 name="chevron-right" size={12} color="#7834E6" />
                </TouchableOpacity>
              </View>
              <View style={styles.senateMembersList}>
                {senateMembers.map((member) => (
                  <View key={member.id} style={styles.senateMemberItem}>
                    <TouchableOpacity
                      style={styles.senateMemberAvatarContainer}
                      onPress={() => router.push({
                        pathname: '/profile/[id]',
                        params: { id: member.id }
                      })}
                    >
                      <Image source={{ uri: member.avatar }} style={styles.senateMemberAvatar} />
                    </TouchableOpacity>
                    <View style={styles.senateMemberInfo}>
                      <Text style={styles.senateMemberName}>{member.name}</Text>
                      <Text style={[
                        styles.senateMemberRole,
                        member.role === 'Senior Senator' && styles.seniorSenatorRole
                      ]}>{member.role}</Text>
                    </View>
                    <View style={styles.senateMemberStats}>
                      <Text style={styles.senateMemberReviewCount}>{member.reviewCount} reviews</Text>
                      <Text style={styles.senateMemberJoinDate}>Joined {member.joinDate}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {isSenateMember ? (
              <>
                <View style={styles.searchContainer}>
                  <View style={styles.searchBar}>
                    <FontAwesome5 name="search" size={16} color="#6B7280" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search files..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                  <View style={styles.filterContainer}>
                    <TouchableOpacity
                      style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
                      onPress={() => setFilterStatus('all')}
                    >
                      <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.filterButton, filterStatus === 'pending' && styles.filterButtonActive]}
                      onPress={() => setFilterStatus('pending')}
                    >
                      <Text style={[styles.filterButtonText, filterStatus === 'pending' && styles.filterButtonTextActive]}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.filterButton, filterStatus === 'approved' && styles.filterButtonActive]}
                      onPress={() => setFilterStatus('approved')}
                    >
                      <Text style={[styles.filterButtonText, filterStatus === 'approved' && styles.filterButtonTextActive]}>Approved</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.filterButton, filterStatus === 'rejected' && styles.filterButtonActive]}
                      onPress={() => setFilterStatus('rejected')}
                    >
                      <Text style={[styles.filterButtonText, filterStatus === 'rejected' && styles.filterButtonTextActive]}>Rejected</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.filesList}>
                  {filteredFiles.map(file => (
                    <TouchableOpacity
                      key={file.id}
                      style={styles.fileCard}
                      onPress={() => {
                        setSelectedFile(file);
                        setIsModalVisible(true);
                      }}
                    >
                      <View style={styles.fileHeader}>
                        <View style={styles.fileInfo}>
                          <Text style={styles.fileName}>{file.fileName}</Text>
                          <Text style={styles.communityName}>{file.community}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(file.status) }]}>
                          <Text style={styles.statusText}>{file.status.charAt(0).toUpperCase() + file.status.slice(1)}</Text>
                        </View>
                      </View>
                      <View style={styles.fileDetails}>
                        <View style={styles.detailItem}>
                          <FontAwesome5 name="star" size={14} color="#6B7280" />
                          <Text style={styles.detailText}>{file.score}/100</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <FontAwesome5 name="calendar" size={14} color="#6B7280" />
                          <Text style={styles.detailText}>{file.reviewDate}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.nonMemberCard}>
                <FontAwesome5 name="shield-alt" size={48} color="#7834E6" />
                <Text style={styles.nonMemberTitle}>Become a Senate Member</Text>
                <Text style={styles.nonMemberDescription}>
                  Join the Senate to review and manage community files. As a Senate member, you'll have the opportunity to:
                </Text>
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={16} color="#2ecc71" />
                    <Text style={styles.benefitText}>Review community files</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={16} color="#2ecc71" />
                    <Text style={styles.benefitText}>Score and approve documents</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <FontAwesome5 name="check-circle" size={16} color="#2ecc71" />
                    <Text style={styles.benefitText}>Help maintain quality standards</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => router.push('/senate/join')}
                >
                  <Text style={styles.joinButtonText}>Apply to Join Senate</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        <Navigator />

        {isSenateMember && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Review File</Text>
                {selectedFile && (
                  <>
                    <Text style={styles.modalFileName}>{selectedFile.fileName}</Text>
                    <Text style={styles.modalCommunity}>{selectedFile.community}</Text>
                    <View style={styles.scoreInputContainer}>
                      <Text style={styles.scoreLabel}>Score (0-100):</Text>
                      <TextInput
                        style={styles.scoreInput}
                        value={score}
                        onChangeText={setScore}
                        keyboardType="numeric"
                        placeholder="Enter score"
                        placeholderTextColor="#6B7280"
                      />
                    </View>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => {
                          setIsModalVisible(false);
                          setScore('');
                          setSelectedFile(null);
                        }}
                      >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.submitButton]}
                        onPress={handleScoreSubmit}
                      >
                        <Text style={styles.modalButtonText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        )}
      </View>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
  },
  scrollContentMobile: {
    paddingBottom: 80, // Add padding at bottom for tab bar
  },
  overlay: {
    flex: 1,
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
  senateMembersCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    marginBottom: 24,
  },
  senateMembersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  senateMembersTitle: {
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
  senateMembersList: {
    gap: 12,
  },
  senateMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  senateMemberAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  senateMemberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  senateMemberInfo: {
    flex: 1,
  },
  senateMemberName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  senateMemberRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  seniorSenatorRole: {
    color: '#FFD700',
    fontWeight: '600',
  },
  senateMemberStats: {
    alignItems: 'flex-end',
  },
  senateMemberReviewCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
  },
  senateMemberJoinDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
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
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#7834E6',
  },
  filterButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filesList: {
    gap: 16,
  },
  fileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  communityName: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  fileDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalFileName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalCommunity: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  scoreInputContainer: {
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scoreInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    backgroundColor: '#7834E6',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  nonMemberCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    marginTop: 24,
  },
  nonMemberTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
  },
  nonMemberDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  benefitsList: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  joinButton: {
    backgroundColor: '#7834E6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 