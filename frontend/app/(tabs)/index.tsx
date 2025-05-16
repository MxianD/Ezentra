import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import Navigator from "@/components/Navigator/Navigator";
import SimilarUsers from '../../components/SimilarUsers/SimilarUsers';
import Layout from '@/constants/Layout';

interface CommunityUpdate {
  id: string;
  title: string;
  description: string;
  community: string;
  date: string;
  type: 'announcement' | 'event' | 'milestone';
}

export default function HomeScreen() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsSmallScreen(width < Layout.breakpoints.tablet);
    };
    
    // Call once at component mount
    updateLayout();
    
    // Add window dimension change listener
    Dimensions.addEventListener('change', updateLayout);
    
    // Clean up
    return () => {
      // No need to remove listener in newer React Native versions
    };
  }, []);

  // Mock data for community updates
  const communityUpdates: CommunityUpdate[] = [
    {
      id: '1',
      title: 'New Community Milestone',
      description: 'We\'ve reached 1000 members! Join us in celebrating this achievement.',
      community: 'Tech Community',
      date: '2h ago',
      type: 'milestone'
    },
    {
      id: '2',
      title: 'Upcoming Web3 Workshop',
      description: 'Join us for an exciting workshop on Web3 development fundamentals.',
      community: 'Web3 Community',
      date: '5h ago',
      type: 'event'
    },
    {
      id: '3',
      title: 'Community Guidelines Update',
      description: 'We\'ve updated our community guidelines to ensure a better experience for everyone.',
      community: 'General',
      date: '1d ago',
      type: 'announcement'
    }
  ];

  const getUpdateIcon = (type: CommunityUpdate['type']) => {
    switch (type) {
      case 'announcement':
        return { name: 'bullhorn', color: '#7834E6' };
      case 'event':
        return { name: 'calendar-alt', color: '#2ecc71' };
      case 'milestone':
        return { name: 'trophy', color: '#f1c40f' };
      default:
        return { name: 'info-circle', color: '#3498db' };
    }
  };

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isSmallScreen && styles.scrollContentMobile
        ]}
      >
        <SimilarUsers currentUserId="current-user-id" />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Community Updates</Text>
              <Text style={styles.sectionSubtitle}>Stay informed about your communities</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/community')}
            >
              <Text style={styles.viewAllButtonText}>View All</Text>
              <View style={styles.arrowContainer}>
                <FontAwesome5 name="chevron-right" size={12} color="rgba(120, 52, 230, 0.8)" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.updatesList}>
            {communityUpdates.map((update) => {
              const icon = getUpdateIcon(update.type);
              return (
                <TouchableOpacity
                  key={update.id}
                  style={styles.updateCard}
                  onPress={() => router.push('/community')}
                >
                  <View style={styles.updateIconContainer}>
                    <FontAwesome5 name={icon.name} size={20} color={icon.color} />
                  </View>
                  <View style={styles.updateContent}>
                    <Text style={styles.updateTitle}>{update.title}</Text>
                    <Text style={styles.updateDescription}>{update.description}</Text>
                    <View style={styles.updateFooter}>
                      <Text style={styles.updateCommunity}>{update.community}</Text>
                      <Text style={styles.updateDate}>{update.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    flexGrow: 1,
  },
  scrollContentMobile: {
    paddingBottom: 80, // Add padding at bottom for tab bar
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(120, 52, 230, 0.05)',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.2)',
  },
  viewAllButtonText: {
    color: 'rgba(120, 52, 230, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(120, 52, 230, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updatesList: {
    gap: 16,
  },
  updateCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(120, 52, 230, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.2)',
  },
  updateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(120, 52, 230, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  updateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateCommunity: {
    fontSize: 12,
    color: 'rgba(120, 52, 230, 0.8)',
    fontWeight: '500',
  },
  updateDate: {
    fontSize: 12,
    color: '#6B7280',
  },
}); 