import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import { proofService } from '@/services/proofService';
import axios from 'axios';
import { ethers } from 'ethers';
import "@ethersproject/shims";

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    fetchCommunityDetails();
  }, [id]);

  const fetchCommunityDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取当前连接的钱包地址
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('Current user address:', userAddress);

      // 获取用户详情
      console.log('Fetching user details...');
      const userResponse = await api.get(`/api/user/address/${userAddress}`);
      console.log('User details response:', userResponse.data);
      
      if (userResponse.data.code !== 200) {
        throw new Error('Failed to get user details');
      }
      
      const userData = userResponse.data.data;
      console.log('User data:', userData);

      // Fetch community details
      const communityResponse = await api.get(`/api/user-community/${id}`);
      const communityData = communityResponse.data;
      console.log('Community data:', communityData);

      // Fetch community logo
      let logoUrl = 'https://picsum.photos/200'; // Default logo
      try {
        const logoResponse = await api.get(`/api/user-community/${id}/logo`);
        if (logoResponse.data && logoResponse.data.url) {
          logoUrl = logoResponse.data.url;
        }
      } catch (logoErr) {
        console.warn('Failed to fetch community logo:', logoErr);
      }

      // Fetch community members with pagination
      console.log('Fetching community members...');
      const membersResponse = await api.get('/api/community-member/list', {
        params: {
          current: 1,
          size: 100,
          communityId: parseInt(id as string)
        }
      });
      console.log('Full members response:', membersResponse);
      console.log('Members response data:', membersResponse.data);
      console.log('Members response data type:', typeof membersResponse.data);
      console.log('Members response data keys:', Object.keys(membersResponse.data));

      // Process members data
      let membersData = [];
      if (membersResponse.data && membersResponse.data.data && Array.isArray(membersResponse.data.data.records)) {
        membersData = membersResponse.data.data.records;
        console.log('Members data after assignment:', membersData);
      } else {
        console.log('No records found in response data');
      }

      // 检查数据是否为空
      if (!membersData || membersData.length === 0) {
        console.log('Members data is empty, skipping membership check');
        return;
      }

      // 检查用户数据是否存在
      if (!userData || !userData.id) {
        console.log('User data is missing or invalid:', userData);
        return;
      }

      // Check if current user is a member
      console.log('Starting membership check with:', {
        membersDataLength: membersData.length,
        userId: userData.id
      });

      const isUserMember = membersData.some((member: any) => {
        console.log('Processing member:', member);
        const isMember = member.userId === userData.id;
        console.log(member.userId, userData.id, "@@@");
        
        console.log('Checking member:', {
          memberUserId: member.userId,
          currentUserId: userData.id,
          isMatch: isMember
        });
        return isMember;
      });
      console.log('Final membership check result:', isUserMember);

      // Ensure all required fields are present in members data
      const validatedMembers = membersData.map((member: any) => ({
        id: String(member.id || member.userId || ''),
        name: member.name || member.userName || 'Unknown',
        avatar: member.avatar || member.userAvatar || 'https://picsum.photos/200',
        role: member.role || member.memberRole || 'Member',
        joinDate: member.joinDate || member.createTime || new Date().toISOString().split('T')[0],
        skillPoints: member.skillPoints || 0
      }));

      // Create review board data from members
      const reviewBoard = {
        id: '1',
        members: validatedMembers.filter((member: any) => 
          member.role === 'Founder' || member.role === 'Reviewer'
        ),
        rating: 4.8
      };

      // Add current task data if user is a member
      const currentTask = isUserMember ? {
        id: '1',
        title: 'Welcome Task',
        description: 'Complete your profile and introduce yourself to the community',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reward: '100 POINTS',
        status: 'active' as const
      } : undefined;

      // Combine all data
      const combinedData: CommunityDetails = {
        ...communityData,
        imageUrl: logoUrl,
        members: validatedMembers,
        memberCount: validatedMembers.length,
        isJoined: isUserMember,
        reviewBoard: reviewBoard,
        currentTask: currentTask
      };

      console.log('Combined community data:', combinedData);
      setCommunity(combinedData);
    } catch (err) {
      console.error('Error fetching community details:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('Community not found. Please check the community ID.');
        } else if (err.code === 'ECONNREFUSED') {
          setError('Unable to connect to the server. Please check if the server is running.');
        } else {
          setError(`Failed to load community details: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 检查用户是否在社区中
  const checkUserInCommunity = async (userAddress: string) => {
    try {
      // 调用后端 API 获取社区成员列表（分页数据）
      const response = await api.get(`/api/community-member/${id}`, {
        params: {
          current: 1,
          size: 100  // 设置一个合理的页面大小
        }
      });
      console.log('Community members pagination data:', response.data);

      // 检查返回的数据结构
      if (!response.data || !response.data.records) {
        console.log('No members data found');
        return false;
      }

      // 检查用户是否在成员列表中
      const isMember = response.data.records.some((member: any) => 
        member.walletAddress === userAddress
      );
      
      console.log('Is user in community:', isMember);
      return isMember;
    } catch (err) {
      console.error('Error checking user in community:', err);
      return false;
    }
  };

  const handleJoinCommunity = async () => {
    try {
      console.log('Starting join community process...');
      
      // 获取当前连接的钱包地址
      const { ethereum } = window;
      if (!ethereum) {
        console.log('MetaMask not found');
        Alert.alert('Error', 'Please install MetaMask!');
        return;
      }

      // 请求用户连接钱包
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('Error requesting accounts:', error);
        Alert.alert('Error', 'Please connect your MetaMask wallet first');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('Connected wallet address:', userAddress);

      // 检查用户是否已在社区中
      const isInCommunity = await checkUserInCommunity(userAddress);
      if (isInCommunity) {
        console.log('User is already a member of this community');
        Alert.alert('Error', 'You are already a member of this community.');
        return;
      }

      // 调用智能合约加入社区
      console.log('Initializing contract...');
      const communityContract = new ethers.Contract(
        '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // 本地测试网络合约地址
        [
          'function joinCommunity(uint256 _communityId) external payable',
          'function STAKE_AMOUNT() view returns (uint256)',
          'function communities(uint256) view returns (uint256 id, string name, string description, address creator, uint256 startTime, uint256 endTime, string targetGoal, uint256 memberDeposit, uint256 rewardPerMember, uint256 maxMembers, uint256 totalMembers, uint256 rewardPool, uint256 depositPool, bool isClosed, uint8 category, uint256 passingScore)',
          'function communityToken() external view returns (address)'
        ],
        signer
      );

      // 获取社区信息
      console.log('Fetching community info...');
      const communityInfo = await communityContract.communities(parseInt(id as string));
      console.log('Community info:', communityInfo);
      
      // 检查社区状态
      if (communityInfo.isClosed) {
        console.log('Community is closed');
        Alert.alert('Error', 'This community is closed.');
        return;
      }

      // 获取质押金额
      console.log('Getting stake amount...');
      const stakeAmount = await communityContract.STAKE_AMOUNT();
      console.log('Stake amount:', stakeAmount.toString());

      // 获取代币合约地址
      const tokenAddress = await communityContract.communityToken();
      console.log('Token address:', tokenAddress);

      // 创建代币合约实例
      const tokenABI = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function balanceOf(address account) external view returns (uint256)"
      ];
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

      // 检查代币余额
      const tokenBalance = await tokenContract.balanceOf(userAddress);
      console.log('Token balance:', tokenBalance.toString());

      // 检查当前授权额度
      const currentAllowance = await tokenContract.allowance(userAddress, communityContract.address);
      console.log('Current allowance:', currentAllowance.toString());

      // 如果授权额度不足，请求授权
      if (currentAllowance.lt(stakeAmount)) {
        console.log('Approving tokens...');
        const approveTx = await tokenContract.approve(communityContract.address, stakeAmount);
        console.log('Approval transaction sent:', approveTx.hash);
        await approveTx.wait();
        console.log('Approval confirmed');
      }

      // 调用合约加入社区
      console.log('Calling joinCommunity contract function...');
      const tx = await communityContract.joinCommunity(
        parseInt(id as string),
        { 
          value: communityInfo.memberDeposit,
          gasLimit: 1000000 // 增加gas限制
        }
      );
      console.log('Transaction sent:', tx.hash);

      // 等待交易确认
      console.log('Waiting for transaction confirmation...');
      await tx.wait();
      console.log('Transaction confirmed');

      // 调用后端 API 记录加入信息
      console.log('Calling backend API...');
      
      try {
        // 获取用户信息
        const userResponse = await api.get(`/api/user/address/${userAddress}`);
        if (userResponse.data.code !== 200) {
          throw new Error('Failed to get user details');
        }
        
        const userData = userResponse.data.data;
        console.log('User data:', userData);

        const joinData = {
          communityId: parseInt(id as string),
          userId: userData.id,
          createBy: userData.id,
          updateBy: userData.id,
          memberRole: 'member',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        };

        console.log('Join request data:', joinData);

        const response = await api.post('/api/community-member', joinData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('Backend API response:', response.data);
        
        // Update community state immediately to show joined content
        console.log('Updating UI state...');
        setCommunity(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isJoined: true,
            memberCount: (prev.memberCount || 0) + 1,
            members: [
              ...(prev.members || []),
              {
                id: userAddress,
                name: userData.name || userAddress.slice(0, 6) + '...' + userAddress.slice(-4),
                avatar: userData.avatar || 'https://picsum.photos/200',
                role: 'Member',
                joinDate: new Date().toISOString().split('T')[0],
                skillPoints: 0
              }
            ]
          };
        });

        Alert.alert('Success', 'You have joined the community!');
        console.log('Join community process completed successfully');
        
        // Refresh community details in the background
        fetchCommunityDetails();
      } catch (error: any) {
        console.error('Backend API error:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        Alert.alert('Error', 'Failed to sync with backend. Please try again.');
      }
    } catch (err) {
      console.error('Error in join community process:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          Alert.alert('Error', 'You are already a member of this community.');
        } else {
          Alert.alert('Error', `Failed to join community: ${err.message}`);
        }
      } else {
        Alert.alert('Error', 'Failed to join community. Please try again.');
      }
    }
  };

  const handleUploadProof = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setIsUploading(true);
        
        // Create a File object from the image URI
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        
        // Check file size (10MB = 10 * 1024 * 1024 bytes)
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if (blob.size > MAX_FILE_SIZE) {
          Alert.alert(
            'File Too Large',
            'The selected file is too large. Maximum file size is 10MB.'
          );
          setIsUploading(false);
          return;
        }

        const file = new File([blob], 'proof.jpg', { type: 'image/jpeg' });

        // Upload to IPFS through our backend
        const uploadResult = await proofService.uploadProof(
          parseInt(id as string),
          1, // TODO: Replace with actual member ID from user context
          community?.currentTask?.title || '',
          community?.currentTask?.description || '',
          file
        );

        if (uploadResult.code === 200) {
          // 调用智能合约提交文件URL
          try {
            const { ethereum } = window;
            if (!ethereum) {
              throw new Error('Please install MetaMask!');
            }

            // 获取合约实例
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const communityContract = new ethers.Contract(
              '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // 本地测试网络合约地址
              ['function submitCompletion(uint256 _communityId, string memory _submissionUrl)'],
              signer
            );

            // 调用合约
            const tx = await communityContract.submitCompletion(
              parseInt(id as string),
              uploadResult.data.proofHash // 使用 proofHash 作为提交URL
            );

            // 等待交易确认
            await tx.wait();

            Alert.alert('Success', 'Proof uploaded and submitted to blockchain successfully!');
          } catch (contractError) {
            console.error('Error submitting to blockchain:', contractError);
            Alert.alert('Warning', 'File uploaded but blockchain submission failed. Please try submitting to blockchain again.');
          }
        } else {
          throw new Error(uploadResult.message);
        }
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
      Alert.alert('Error', 'Failed to upload proof. Please try again.');
    } finally {
      setIsUploading(false);
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7834E6" />
          <Text style={styles.loadingText}>Loading community details...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-circle" size={48} color="#ff4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchCommunityDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
              <Image 
                source={{ uri: community?.imageUrl || 'https://picsum.photos/200' }} 
                style={styles.communityImage}
                onError={(e) => {
                  console.warn('Failed to load community image:', e.nativeEvent.error);
                  // Set a default image if the current one fails to load
                  setCommunity(prev => prev ? { ...prev, imageUrl: 'https://picsum.photos/200' } : null);
                }}
              />
              <Text style={styles.title}>{community?.name}</Text>
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
              {!community.isJoined && (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => {
                    console.log('Join button clicked');
                    handleJoinCommunity();
                  }}
                >
                  <Text style={styles.joinButtonText}>Join Community</Text>
                </TouchableOpacity>
              )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#7834E6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 