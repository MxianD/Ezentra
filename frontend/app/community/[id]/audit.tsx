import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

interface ReviewedFile {
  id: string;
  fileName: string;
  submitter: string;
  score: number;
  reviewDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Reviewer {
  id: string;
  name: string;
  avatar: string;
  role: 'Reviewer' | 'Senior Reviewer';
  joinDate: string;
  reviewCount: number;
}

export default function CommunityAuditScreen() {
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedFile, setSelectedFile] = useState<ReviewedFile | null>(null);
  const [score, setScore] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data for reviewed files
  const [reviewedFiles, setReviewedFiles] = useState<ReviewedFile[]>([
    {
      id: '1',
      fileName: 'Project_Proposal.pdf',
      submitter: 'John Doe',
      score: 85,
      reviewDate: '2024-03-15',
      status: 'pending'
    },
    {
      id: '2',
      fileName: 'Design_Document.docx',
      submitter: 'Jane Smith',
      score: 92,
      reviewDate: '2024-03-14',
      status: 'approved'
    },
    {
      id: '3',
      fileName: 'Game_Concept.md',
      submitter: 'Mike Johnson',
      score: 78,
      reviewDate: '2024-03-13',
      status: 'rejected'
    }
  ]);

  const reviewers: Reviewer[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: 'https://picsum.photos/100',
      role: 'Senior Reviewer',
      joinDate: '2024-01-15',
      reviewCount: 156
    },
    {
      id: '2',
      name: 'Emma Wilson',
      avatar: 'https://picsum.photos/101',
      role: 'Senior Reviewer',
      joinDate: '2024-01-20',
      reviewCount: 142
    },
    {
      id: '3',
      name: 'Michael Chen',
      avatar: 'https://picsum.photos/102',
      role: 'Reviewer',
      joinDate: '2024-02-01',
      reviewCount: 98
    }
  ];

  const filteredFiles = reviewedFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.submitter.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <View style={styles.container}>
      <Navigator />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Audit</Text>
          <Text style={styles.subtitle}>Review and manage community files</Text>
        </View>

        <View style={styles.reviewersCard}>
          <View style={styles.reviewersHeader}>
            <Text style={styles.reviewersTitle}>Reviewers</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push(`/community/${id}/members`)}
            >
              <Text style={styles.viewAllButtonText}>View All</Text>
              <FontAwesome5 name="chevron-right" size={12} color="#7834E6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewersList}>
            {reviewers.map((reviewer) => (
              <View key={reviewer.id} style={styles.reviewerItem}>
                <TouchableOpacity 
                  style={styles.reviewerAvatarContainer}
                  onPress={() => router.push({
                    pathname: '/profile/[id]',
                    params: { id: reviewer.id }
                  })}
                >
                  <Image source={{ uri: reviewer.avatar }} style={styles.reviewerAvatar} />
                </TouchableOpacity>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{reviewer.name}</Text>
                  <Text style={[
                    styles.reviewerRole,
                    reviewer.role === 'Senior Reviewer' && styles.seniorReviewerRole
                  ]}>{reviewer.role}</Text>
                </View>
                <View style={styles.reviewerStats}>
                  <Text style={styles.reviewerReviewCount}>{reviewer.reviewCount} reviews</Text>
                  <Text style={styles.reviewerJoinDate}>Joined {reviewer.joinDate}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

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
                  <Text style={styles.submitterName}>Submitted by {file.submitter}</Text>
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
      </ScrollView>

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
                <Text style={styles.modalSubmitter}>Submitted by {selectedFile.submitter}</Text>
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
  reviewersCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    marginBottom: 24,
  },
  reviewersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewersTitle: {
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
  reviewersList: {
    gap: 12,
  },
  reviewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  reviewerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  reviewerRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  seniorReviewerRole: {
    color: '#FFD700',
    fontWeight: '600',
  },
  reviewerStats: {
    alignItems: 'flex-end',
  },
  reviewerReviewCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
  },
  reviewerJoinDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  searchContainer: {
    gap: 16,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
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
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  filterButtonActive: {
    backgroundColor: '#7834E6',
    borderColor: '#7834E6',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  filesList: {
    gap: 12,
  },
  fileCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
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
  submitterName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  modalFileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalSubmitter: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
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
    paddingHorizontal: 24,
    paddingVertical: 12,
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
    fontWeight: '600',
  },
}); 