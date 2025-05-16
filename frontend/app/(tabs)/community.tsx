import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import { router, Stack, usePathname } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';
import Layout from '@/constants/Layout';
import { communityService, CommunityResponse } from '@/services/communityService';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  rating?: number;
  createdAt?: string;
  endDate?: string;
  tags?: string[];
}

export default function CommunityScreen() {
  const pathname = usePathname();
  const [popularCommunities, setPopularCommunities] = useState<Community[]>([]);
  const [newCommunities, setNewCommunities] = useState<Community[]>([]);
  const [topRatedCommunities, setTopRatedCommunities] = useState<Community[]>([]);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset state when pathname changes
    if (pathname === '/community') {
      setSearchQuery('');
      setSelectedTags([]);
      // Refresh communities when returning to the page
      fetchCommunities();
    }

    // Add responsive layout check
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsSmallScreen(width < 768);
    };
    
    updateLayout();
    Dimensions.addEventListener('change', updateLayout);
  }, [pathname]);

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const response = await communityService.getCommunities(1, 50);
      
      console.log('API Response:', response);
      
      if (response.code === 200 && response.data.records) {
        const communities = response.data.records.map(community => ({
          id: community.id.toString(),
          name: community.communityName,
          description: community.communityDescription,
          memberCount: 0,
          rating: 0,
          createdAt: new Date(community.createTime).toLocaleDateString(),
          endDate: community.expireTime ? new Date(community.expireTime).toLocaleDateString() : undefined,
          tags: [],
        }));

        console.log('Mapped Communities:', communities);

        // 按创建时间倒序排序
        const sortedByDate = [...communities].sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );

        // 使用倒序排序后的数据
        setPopularCommunities(sortedByDate.slice(0, 5));
        setNewCommunities(sortedByDate.slice(0, 5));
        setTopRatedCommunities(sortedByDate.slice(0, 5));
        setAllCommunities(sortedByDate);
      } else {
        console.log('No records found in response');
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableTags = [
    'Development', 'Web3', 'Blockchain', 'DeFi', 'Finance',
    'NFT', 'Art', 'Creative', 'Gaming', 'Security',
    'Smart Contracts', 'Audit', 'Trading', 'Analysis', 'Crypto'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredCommunities = allCommunities.filter(community => {
    const matchesSearch = searchQuery === '' ||
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => community.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  const CommunityCard = ({ community }: { community: Community }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        try {
          router.push({
            pathname: '/community/[id]',
            params: { id: community.id }
          });
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.communityIcon}>
            <FontAwesome5 name="users" size={24} color="#7834E6" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.communityName} numberOfLines={1}>{community.name}</Text>
            <View style={styles.memberCount}>
              <FontAwesome5 name="user-friends" size={12} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.memberCountText}>{community.memberCount} members</Text>
              {community.rating && (
                <View style={styles.ratingContainer}>
                  <FontAwesome5 name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{community.rating}</Text>
                </View>
              )}
              {community.createdAt && (
                <View style={styles.dateContainer}>
                  <FontAwesome5 name="calendar-alt" size={12} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.dateText}>{community.createdAt}</Text>
                </View>
              )}
              {community.endDate && (
                <View style={styles.dateContainer}>
                  <FontAwesome5 name="clock" size={12} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.dateText}>Ends {community.endDate}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <Text style={styles.communityDescription} numberOfLines={2}>
          {community.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const CommunitySection = ({ title, communities, showMore = true }: { title: string, communities: Community[], showMore?: boolean }) => {
    console.log(`Rendering ${title} with communities:`, communities); // Debug log
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {showMore && <Text style={styles.sectionSubtitle}>TOP50</Text>}
          </View>
          {showMore && (
            <TouchableOpacity>
              <Text style={styles.sectionMore}>more</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.sectionContent}>
          {communities && communities.length > 0 ? (
            communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))
          ) : (
            <Text style={styles.noCommunitiesText}>No communities found</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
    <Stack.Screen
      options={{
        headerShown: false,
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
        <Text style={styles.headerTitle}>Communities</Text>
        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={16} color="rgba(255, 255, 255, 0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search communities..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={[styles.tagsContainer, isSmallScreen && styles.tagsContainerSmall]}
          contentContainerStyle={styles.tagsScrollContent}
        >
          {availableTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                selectedTags.includes(tag) && styles.tagButtonActive
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextActive
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading communities...</Text>
          </View>
        ) : searchQuery || selectedTags.length > 0 ? (
          <View style={styles.allCommunitiesSection}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <Text style={styles.communityCount}>{filteredCommunities.length} communities found</Text>
            {filteredCommunities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </View>
        ) : (
          <>
            <CommunitySection title="Popular Communities" communities={popularCommunities} />
            <CommunitySection title="New Communities" communities={newCommunities} />
            <CommunitySection title="Top Rated" communities={topRatedCommunities} />
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.createButton,
          isSmallScreen && styles.createButtonMobile
        ]}
        onPress={() => {
          router.push({
            pathname: '/community/create',
            params: { returnTo: '/community' }
          });
        }}
      >
        <FontAwesome5 name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      
      <Navigator />
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
    gap: 20,
    paddingTop: 80,
  },
  scrollContentMobile: {
    paddingBottom: 80, // Add padding at bottom for tab bar
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  searchContainer: {
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
  tagsContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  tagsContainerSmall: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
  },
  tagsScrollContent: {
    paddingVertical: 16,
    flexDirection: 'row',
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    marginRight: 8,
  },
  tagButtonActive: {
    backgroundColor: '#7834E6',
    borderColor: '#7834E6',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  allCommunitiesSection: {
    gap: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  sectionMore: {
    color: '#7834E6',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContent: {
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    overflow: 'hidden',
    width: '100%',
  },
  cardContent: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberCountText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  communityDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  createButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7834E6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7834E6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createButtonMobile: {
    bottom: 90, // Position above the tab bar
  },
  communityCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  noCommunitiesText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
}); 