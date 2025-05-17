import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { ethers } from 'ethers';

interface CommunityForm {
  name: string;
  description: string;
  image: string | null;
  tags: string[];
  type: string;
  memberLimit?: number;
  isPrivate: boolean;
  startTime: Date;
  endTime: Date;
}

interface CreateCommunityRequest {
  communityName: string;
  communityDescription: string;
  communityLabelId: number;
  createBy: number;
  createTime: string;
  expireTime: string;
  userId: number;
  chainCommunityId: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  creator: string;
  startTime: string;
  endTime: string;
  targetGoal: string;
  memberDeposit: string;
  rewardPerMember: string;
  maxMembers: string;
  totalMembers: string;
  rewardPool: string;
  depositPool: string;
  isClosed: boolean;
  category: string;
  passingScore: string;
}

const COMMUNITY_TYPES = [
  'NONE',
  'MUSIC',
  'ART',
  'SPORTS',
  'EDUCATION',
  'TECHNOLOGY',
  'OTHER'
];

const AVAILABLE_TAGS = [
  'Web3', 'Blockchain', 'Smart Contracts', 'DApp',
  'DeFi', 'NFT', 'Gaming', 'Trading', 'Security',
  'Development', 'Art', 'Music', 'Sports', 'Education',
  'Community', 'DAO', 'Governance', 'Technical'
];

const CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const ABI = [
  "function createCommunity(string _name, string _description, string _targetGoal, uint256 _startTime, uint256 _endTime, uint256 _memberDeposit, uint256 _rewardPerMember, uint256 _maxMembers, uint8 _category) external payable",
  "function joinCommunity(uint256 _communityId) external payable",
  "function submitCompletion(uint256 _communityId, string _submissionUrl) external",
  "function reviewerScore(uint256 _communityId, address _member, uint256 _score, string _comment) external",
  "function senateAuditScore(uint256 _communityId, address _member, uint256 _score, string _comment) external",
  "function claimReward(uint256 _communityId) external",
  "function closeCommunityByAuthor(uint256 _communityId) external",
  "function voteForClose(uint256 _communityId, bool _vote) external",
  "function proposeCloseCommunity(uint256 _communityId) external",
  "function getMemberCount(uint256 communityId) external view returns (uint256)",
  "function getScores(uint256 _communityId, address _member) external view returns (tuple(address senator, uint256 score, string comment)[])",
  "function getMemberStatus(uint256 _communityId, address _member) external view returns (bool isScored, bool isApproved)",
  "function STAKE_AMOUNT() external view returns (uint256)",
  "function communityToken() external view returns (address)",
  
  "event CommunityCreated(uint256 indexed id, address creator, uint8 category)",
  "event MemberJoined(uint256 indexed id, address member)",
  "event SubmissionUploaded(uint256 indexed id, address member, string submissionUrl)",
  "event ScoreSubmitted(uint256 indexed id, address indexed member, address indexed senator, uint256 score)",
  "event GoalApproved(uint256 indexed id, address member)",
  "event RewardClaimed(uint256 indexed id, address member, uint256 amount)",
  "event CommunityClosed(uint256 indexed id)",
  "event ReviewerAdded(uint256 indexed id, address indexed reviewer)",
  "event CloseVoteSubmitted(uint256 indexed id, address indexed member, bool vote)",
  "event ReviewerApproval(uint256 indexed id, address indexed reviewer, address indexed member, bool approved)",
  "event CommunityKeysGenerated(uint256 indexed communityId, string publicKey)",
  "event PrivateKeyEncrypted(uint256 indexed communityId, address indexed accessor, bool isSenator)",
  "function communities(uint256) external view returns (uint256 id, string name, string description, address creator, uint256 startTime, uint256 endTime, string targetGoal, uint256 memberDeposit, uint256 rewardPerMember, uint256 maxMembers, uint256 totalMembers, uint256 rewardPool, uint256 depositPool, bool isClosed, uint8 category, uint256 passingScore)",
  "function communityCount() external view returns (uint256)",
  "function getMemberCount(uint256) external view returns (uint256)"
];

const getCommunities = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      Alert.alert('Error', 'Please install MetaMask!');
      return [];
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    // 获取社区总数
    const count = await contract.communityCount();
    console.log('Total communities:', count.toString());

    const communities = [];
    
    // 获取每个社区的详细信息
    for (let i = 0; i < count; i++) {
      try {
        const community = await contract.communities(i);
        const memberCount = await contract.getMemberCount(i);
        
        // 转换时间戳为日期
        const startDate = new Date(community.startTime.toNumber() * 1000);
        const endDate = new Date(community.endTime.toNumber() * 1000);
        
        // 获取类别名称
        const categoryName = COMMUNITY_TYPES[community.category];
        
        communities.push({
          id: community.id.toString(),
          name: community.name,
          description: community.description,
          creator: community.creator,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          targetGoal: community.targetGoal,
          memberDeposit: ethers.utils.formatEther(community.memberDeposit),
          rewardPerMember: ethers.utils.formatEther(community.rewardPerMember),
          maxMembers: community.maxMembers.toString(),
          totalMembers: memberCount.toString(),
          rewardPool: ethers.utils.formatEther(community.rewardPool),
          depositPool: ethers.utils.formatEther(community.depositPool),
          isClosed: community.isClosed,
          category: categoryName,
          passingScore: community.passingScore.toString()
        });
      } catch (error) {
        console.error(`Error fetching community ${i}:`, error);
      }
    }

    return communities;
  } catch (error) {
    console.error('Error getting communities:', error);
    return [];
  }
};

const TestGetCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetCommunities = async () => {
    setLoading(true);
    try {
      const result = await getCommunities();
      setCommunities(result);
      console.log('Communities:', result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.testSection}>
      <TouchableOpacity
        style={styles.testButton}
        onPress={handleGetCommunities}
        disabled={loading}
      >
        <Text style={styles.testButtonText}>
          {loading ? 'Loading...' : 'Get Communities'}
        </Text>
      </TouchableOpacity>

      {communities.length > 0 && (
        <ScrollView style={styles.communitiesList}>
          {communities.map((community) => (
            <View key={community.id} style={styles.communityCard}>
              <Text style={styles.communityName}>{community.name}</Text>
              <Text style={styles.communityDescription}>{community.description}</Text>
              <Text style={styles.communityInfo}>Category: {community.category}</Text>
              <Text style={styles.communityInfo}>Members: {community.totalMembers}/{community.maxMembers}</Text>
              <Text style={styles.communityInfo}>Status: {community.isClosed ? 'Closed' : 'Active'}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const joinCommunity = async (communityId: string) => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      Alert.alert('Error', 'Please install MetaMask!');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    
    // 检查合约地址
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      Alert.alert('Error', 'Contract not deployed at the specified address');
      return;
    }
    console.log('Contract code exists at address:', CONTRACT_ADDRESS);

    // 创建新的合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // 获取社区信息和质押金额
    const community = await contract.communities(communityId);
    const memberDeposit = community.memberDeposit;
    const stakeAmount = await contract.STAKE_AMOUNT();
    
    // 检查用户是否已经加入
    const member = await contract.members(communityId, userAddress);
    console.log('Member status:', {
      joinTime: member.joinTime.toString(),
      isApproved: member.isApproved,
      hasClaimed: member.hasClaimed
    });

    // 检查用户余额
    const balance = await provider.getBalance(userAddress);
    console.log('User ETH balance:', ethers.utils.formatEther(balance));

    // 获取代币合约地址
    const tokenAddress = await contract.communityToken();
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
    const currentAllowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESS);
    console.log('Current allowance:', currentAllowance.toString());

    // 如果授权额度不足，请求授权
    if (currentAllowance.lt(stakeAmount)) {
      console.log('Approving tokens...');
      const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, stakeAmount);
      console.log('Approval transaction sent:', approveTx.hash);
      await approveTx.wait();
      console.log('Approval confirmed');
    }

    console.log('Attempting to join community with:', {
      communityId,
      memberDeposit: ethers.utils.formatEther(memberDeposit),
      stakeAmount: stakeAmount.toString()
    });

    // 调用合约，发送正确的ETH金额
    const tx = await contract.joinCommunity(communityId, {
      value: memberDeposit,
      gasLimit: 1000000 // 增加gas限制
    });

    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    Alert.alert('Success', 'Successfully joined the community!');
  } catch (error: any) {
    console.error('Error joining community:', error);
    if (error.data) {
      console.error('Error data:', error.data);
    }
    if (error.reason) {
      console.error('Error reason:', error.reason);
    }
    if (error.message) {
      console.error('Error message:', error.message);
    }
    Alert.alert('Error', error.message || 'Failed to join community');
  }
};

export default function CreateCommunityScreen() {
  const [form, setForm] = useState<CommunityForm>({
    name: '',
    description: '',
    image: null,
    tags: [],
    type: '',
    memberLimit: undefined,
    isPrivate: false,
    startTime: new Date(),
    endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month from now
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      setForm(prev => ({ ...prev, startTime: selectedDate }));
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      setForm(prev => ({ ...prev, endTime: selectedDate }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreate = async () => {
    if (!form.name || !form.description || !form.type || form.tags.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // 1. 链上创建社区
      const { ethereum } = window;
      if (!ethereum) {
        Alert.alert('Error', 'Please install MetaMask!');
        return;
      }

      // 检查网络连接
      const provider = new ethers.providers.Web3Provider(ethereum);
      const network = await provider.getNetwork();
      console.log('Current network:', network);

      // 检查合约地址
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        Alert.alert('Error', 'Contract not deployed at the specified address');
        return;
      }
      console.log('Contract code exists at address');

      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // 检查合约实例
      console.log('Contract instance created:', contract.address);

      // 检查账户余额
      const balance = await provider.getBalance(await signer.getAddress());
      console.log('Account balance:', ethers.utils.formatEther(balance), 'ETH');

      // 你可以根据实际业务调整这些参数
      const memberDeposit = ethers.utils.parseEther('0.01'); // 质押金额（ETH为单位）
      const rewardPerMember = ethers.utils.parseEther('0.01'); // 每人奖励（ETH为单位）
      const maxMembers = form.memberLimit || 1;
      const rewardPool = rewardPerMember.mul(maxMembers);

      // 检查是否有足够的余额
      if (balance.lt(rewardPool)) {
        Alert.alert('Error', `Insufficient balance. Need ${ethers.utils.formatEther(rewardPool)} ETH`);
        return;
      }

      // Category 枚举数字（你需要和合约保持一致）
      const category = COMMUNITY_TYPES.indexOf(form.type);
      console.log('Selected category:', form.type, 'Category index:', category);

      // 检查时间参数
      const startTime = Math.floor(form.startTime.getTime() / 1000);
      const endTime = Math.floor(form.endTime.getTime() / 1000);
      const currentTime = Math.floor(Date.now() / 1000);

      if (startTime <= currentTime) {
        Alert.alert('Error', 'Start time must be in the future');
        return;
      }

      if (endTime <= startTime) {
        Alert.alert('Error', 'End time must be after start time');
        return;
      }

      // 打印所有参数
      console.log('==== 调用 createCommunity 参数 ====');
      console.log('name:', form.name, typeof form.name);
      console.log('description:', form.description, typeof form.description);
      console.log('targetGoal:', 'IELTS', typeof 'IELTS');
      console.log('startTime:', startTime, typeof startTime);
      console.log('endTime:', endTime, typeof endTime);
      console.log('memberDeposit:', memberDeposit.toString(), memberDeposit._isBigNumber ? 'BigNumber' : typeof memberDeposit);
      console.log('rewardPerMember:', rewardPerMember.toString(), rewardPerMember._isBigNumber ? 'BigNumber' : typeof rewardPerMember);
      console.log('maxMembers:', maxMembers, typeof maxMembers);
      console.log('category:', category, typeof category);
      console.log('value (rewardPool):', rewardPool.toString(), rewardPool._isBigNumber ? 'BigNumber' : typeof rewardPool);
      console.log('===============================');

      // 调用合约
      let receipt;
      try {
        console.log('Sending transaction...');
        const tx = await contract.createCommunity(
          form.name,
          form.description,
          'IELTS',
          startTime,
          endTime,
          memberDeposit,
          rewardPerMember,
          maxMembers,
          category,
          { value: rewardPool }
        );
        console.log('Transaction sent:', tx.hash);
        receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
      } catch (chainError: any) {
        console.error('Detailed chain error:', chainError);
        if (chainError.data) {
          console.error('Error data:', chainError.data);
        }
        if (chainError.reason) {
          console.error('Error reason:', chainError.reason);
        }
        if (chainError.message) {
          console.error('Error message:', chainError.message);
        }
        Alert.alert('链上调用失败', chainError.reason || chainError.message || 'Unknown error');
        return;
      }

      // 获取链上社区ID
      const event = receipt.events.find((e: any) => e.event === 'CommunityCreated');
      if (!event) {
        console.error('CommunityCreated event not found in receipt');
        Alert.alert('Error', 'Failed to get community ID');
        return;
      }
      const communityId = event.args.id.toString();
      console.log('Community created with ID:', communityId);

      // 2. 后端同步
      try {
        // 获取用户详情
        const userResponse = await axios.get(`http://localhost:8080/api/user/address/${await signer.getAddress()}`);
        if (userResponse.data.code !== 200) {
          throw new Error('Failed to get user details');
        }
        const userId = userResponse.data.data.id;
        console.log('User ID:', userId);

        // 创建社区
        const now = new Date();
        const communityRequestData = {
          communityName: form.name,
          communityDescription: form.description,
          communityLabelId: category + 1,
          createBy: userId,
          createTime: now.toISOString(),
          expireTime: form.endTime.toISOString(),
          userId: userId,
          updateBy: userId,
          updateTime: now.toISOString(),
        };

        console.log('Community request data:', JSON.stringify(communityRequestData, null, 2));

        const communityResponse = await axios.post('http://localhost:8080/api/user-community', communityRequestData, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (communityResponse.data.code !== 200) {
          console.error('Backend response:', communityResponse.data);
          throw new Error(communityResponse.data.message || 'Failed to create community');
        }
        console.log('communityRespons.data.data:', communityResponse.data.data);

        // 添加社区成员（创建者自动成为成员）
        const memberRequestData = {
          communityId: communityResponse.data.data, // 使用后端返回的社区ID
          createBy: userId,
          createTime: new Date().toISOString(),
          memberRole: 'creator', // 创建者角色
          updateBy: userId,
          updateTime: new Date().toISOString(),
          userId: userId
        };

        const memberResponse = await axios.post('http://localhost:8080/api/community-member', memberRequestData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (memberResponse.data.code !== 200) {
          throw new Error(memberResponse.data.message || 'Failed to add community member');
        }

        Alert.alert('Success', 'Community created successfully', [
          { text: 'OK', onPress: () => router.navigate('/(tabs)/community') }
        ]);
      } catch (error: any) {
        console.error('Backend sync error:', error);
        Alert.alert('Error', error.message || 'Failed to sync with backend');
      }
    } catch (error: any) {
      console.error('Error creating community:', error);
      Alert.alert('Error', error.message || 'Failed to create community');
    }
  };

  const renderDatePicker = (type: 'start' | 'end') => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="datetime-local"
          value={type === 'start' ? form.startTime.toISOString().slice(0, 16) : form.endTime.toISOString().slice(0, 16)}
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (type === 'start') {
              setForm(prev => ({ ...prev, startTime: date }));
            } else {
              setForm(prev => ({ ...prev, endTime: date }));
            }
          }}
          style={{
            backgroundColor: 'rgba(35, 35, 40, 0.95)',
            color: 'white',
            border: '1px solid rgba(120, 52, 230, 0.5)',
            borderRadius: '8px',
            padding: '12px',
            width: '100%',
            fontSize: '16px',
          }}
        />
      );
    }

    return (
      <DateTimePicker
        value={type === 'start' ? form.startTime : form.endTime}
        mode="datetime"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedDate) => {
          if (Platform.OS === 'android') {
            type === 'start' ? setShowStartPicker(false) : setShowEndPicker(false);
          }
          if (selectedDate) {
            setForm(prev => ({
              ...prev,
              [type === 'start' ? 'startTime' : 'endTime']: selectedDate
            }));
          }
        }}
        minimumDate={type === 'end' ? form.startTime : new Date()}
        style={Platform.OS === 'ios' ? { width: '100%', backgroundColor: 'rgba(35, 35, 40, 0.95)' } : undefined}
        textColor={Platform.OS === 'ios' ? 'white' : undefined}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Navigator />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableOpacity 
          style={[styles.imageUpload, { pointerEvents: 'auto' }]} 
          onPress={pickImage}
        >
          {form.image ? (
            <Image 
              source={{ uri: form.image }} 
              style={styles.previewImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <FontAwesome5 name="image" size={40} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.uploadText}>Upload Cover Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Text style={styles.label}>Community Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              placeholder="Enter community name"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              selectionColor="#7834E6"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              placeholder="Describe your community"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              numberOfLines={4}
              selectionColor="#7834E6"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Community Type</Text>
            <View style={styles.typeContainer}>
              {COMMUNITY_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    form.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, type }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    form.type === type && styles.typeButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {AVAILABLE_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    form.tags.includes(tag) && styles.tagButtonActive
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagButtonText,
                    form.tags.includes(tag) && styles.tagButtonTextActive
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Time Settings</Text>
            
            <View style={styles.timeSettingRow}>
              <Text style={styles.label}>Start Time</Text>
              {Platform.OS === 'web' ? (
                renderDatePicker('start')
              ) : (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formatDate(form.startTime)}
                  </Text>
                  <FontAwesome5 name="calendar-alt" size={16} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.timeSettingRow}>
              <Text style={styles.label}>End Time</Text>
              {Platform.OS === 'web' ? (
                renderDatePicker('end')
              ) : (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formatDate(form.endTime)}
                  </Text>
                  <FontAwesome5 name="calendar-alt" size={16} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              )}
            </View>

            {Platform.OS !== 'web' && showStartPicker && renderDatePicker('start')}
            {Platform.OS !== 'web' && showEndPicker && renderDatePicker('end')}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Settings</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.label}>Member Limit</Text>
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={form.memberLimit?.toString()}
                onChangeText={(text) => setForm(prev => ({ 
                  ...prev, 
                  memberLimit: text ? parseInt(text) : undefined 
                }))}
                placeholder="Optional"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="numeric"
                selectionColor="#7834E6"
              />
            </View>

            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => setForm(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
            >
              <Text style={styles.label}>Private Community</Text>
              <View style={[
                styles.switch,
                form.isPrivate && styles.switchActive
              ]}>
                <View style={[
                  styles.switchThumb,
                  form.isPrivate && styles.switchThumbActive
                ]} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              (!form.name || !form.description || !form.type || form.tags.length === 0) && styles.disabledButton,
            ]}
            onPress={handleCreate}
            
          >
            <Text style={styles.createButtonText}>Create Community</Text>
          </TouchableOpacity>
        </View>

        <TestGetCommunities />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 52, 230, 0.5)',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  uploadText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    padding: 20,
    gap: 24,
  },
  formSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    color: 'white',
  },
  numberInput: {
    width: 120,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(120, 52, 230, 0.2)',
    borderColor: '#7834E6',
  },
  typeButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  tagButtonActive: {
    backgroundColor: 'rgba(120, 52, 230, 0.2)',
    borderColor: '#7834E6',
  },
  tagButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  tagButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#7834E6',
    borderColor: '#7834E6',
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  switchThumbActive: {
    backgroundColor: '#fff',
    transform: [{ translateX: 24 }],
  },
  createButton: {
    backgroundColor: '#7834E6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(120, 52, 230, 0.3)',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  testSection: {
    padding: 20,
    marginTop: 20,
  },
  testButton: {
    backgroundColor: '#7834E6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  communitiesList: {
    maxHeight: 400,
  },
  communityCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  communityName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  communityDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  communityInfo: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 4,
  },
}); 