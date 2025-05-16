import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';
import AbilityPolygon from '@/components/AbilityPolygon';
import { 
  IconMath, 
  IconEnglish, 
  IconSports, 
  IconMusic, 
  IconComputer 
} from '@/components/icons/StatIcons';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  level: number;
  skillPoints: number;
  communities: number;
  reviews: number;
  joinDate: string;
  bio: string;
  abilities?: {
    [key: string]: {
      value: string;
      maxValue: number;
    };
  };
  visibleAbilities?: string[];
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>(['Math', 'English', 'Sports', 'Music', 'Computer']);
  const isCurrentUser = id === 'current-user';

  const abilityIcons = {
    Math: IconMath,
    English: IconEnglish,
    Sports: IconSports,
    Music: IconMusic,
    Computer: IconComputer,
  };

  const getAbilityStats = () => {
    if (!profile?.abilities) return [];
    
    const abilitiesToShow = isCurrentUser ? selectedAbilities : (profile.visibleAbilities || []);
    
    return abilitiesToShow.map(ability => ({
      title: ability,
      value: profile.abilities?.[ability]?.value || "0",
      maxValue: profile.abilities?.[ability]?.maxValue || 10000,
      Icon: abilityIcons[ability as keyof typeof abilityIcons],
      bgColor: "rgba(120, 52, 230, 0.1)"
    }));
  };

  const toggleAbility = (ability: string) => {
    if (!isCurrentUser) return;
    
    setSelectedAbilities(prev => {
      if (prev.includes(ability)) {
        return prev.filter(a => a !== ability);
      } else {
        return [...prev, ability];
      }
    });
  };

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProfile: UserProfile = {
      id: id as string,
      name: 'John Doe',
      avatar: 'https://picsum.photos/50',
      title: 'Web3 Developer',
      level: 25,
      skillPoints: 1250,
      communities: 5,
      reviews: 42,
      joinDate: '2024-01-15',
      bio: 'Passionate Web3 developer with expertise in smart contracts and decentralized applications. Contributing to the future of decentralized technology.',
      abilities: {
        Math: { value: "8500", maxValue: 10000 },
        English: { value: "7200", maxValue: 10000 },
        Sports: { value: "4500", maxValue: 10000 },
        Music: { value: "3800", maxValue: 10000 },
        Computer: { value: "9500", maxValue: 10000 }
      },
      visibleAbilities: ['Math', 'English', 'Computer']
    };
    setProfile(mockProfile);
    setEditedProfile(mockProfile);
    if (isCurrentUser) {
      setSelectedAbilities(mockProfile.visibleAbilities || ['Math', 'English', 'Sports', 'Music', 'Computer']);
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      setIsEditing(false);
      // Here you would typically make an API call to save the changes
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (!profile) {
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
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome5 name="arrow-left" size={16} color="#7834E6" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            {isCurrentUser && !isEditing && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEdit}
              >
                <FontAwesome5 name="edit" size={16} color="#7834E6" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
            {!isCurrentUser && (
              <TouchableOpacity 
                style={[styles.editButton, styles.messageButton]}
                onPress={() => router.push({
                  pathname: "/messages/[id]",
                  params: { id: id.toString() }
                })}
              >
                <FontAwesome5 name="envelope" size={16} color="#7834E6" />
                <Text style={styles.editButtonText}>Message</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <View style={styles.levelBadge}>
                <FontAwesome5 name="star" size={12} color="#FFD700" />
                <Text style={styles.levelText}>Lvl {profile.level}</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedProfile?.name}
                  onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, name: text} : null)}
                />
              ) : (
                <Text style={styles.userName}>{profile.name}</Text>
              )}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
                <FontAwesome5 name="star" size={20} color="#FFD700" />
              </View>
              <Text style={styles.statValue}>{profile.skillPoints}</Text>
              <Text style={styles.statLabel}>Skill Points</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(120, 52, 230, 0.1)' }]}>
                <FontAwesome5 name="users" size={20} color="#7834E6" />
              </View>
              <Text style={styles.statValue}>{profile.communities}</Text>
              <Text style={styles.statLabel}>Communities</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
                <FontAwesome5 name="check-circle" size={20} color="#2ecc71" />
              </View>
              <Text style={styles.statValue}>{profile.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          <View style={styles.abilitiesCard}>
            <View style={styles.abilitiesHeader}>
              <Text style={styles.abilitiesTitle}>Abilities</Text>
              {isCurrentUser && (
                <View style={styles.abilitiesToggleContainer}>
                  {Object.keys(abilityIcons).map((ability) => (
                    <TouchableOpacity
                      key={ability}
                      style={[
                        styles.abilityToggle,
                        selectedAbilities.includes(ability) && styles.abilityToggleActive
                      ]}
                      onPress={() => toggleAbility(ability)}
                    >
                      <FontAwesome5 
                        name={
                          ability === 'Math' ? 'calculator' :
                          ability === 'English' ? 'language' :
                          ability === 'Sports' ? 'running' :
                          ability === 'Music' ? 'music' :
                          ability === 'Computer' ? 'laptop-code' :
                          'question'
                        }
                        size={16} 
                        color={selectedAbilities.includes(ability) ? '#7834E6' : 'rgba(255, 255, 255, 0.6)'} 
                      />
                      <Text style={[
                        styles.abilityToggleText,
                        selectedAbilities.includes(ability) && styles.abilityToggleTextActive
                      ]}>
                        {ability}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.abilityPolygonContainer}>
              <AbilityPolygon 
                stats={getAbilityStats()} 
                size={300}
                strokeColor="#7834E6"
                fillColor="rgba(120, 52, 230, 0.2)"
                backgroundColor="rgba(120, 52, 230, 0.1)"
              />
            </View>

            <View style={styles.abilitiesGrid}>
              {getAbilityStats().map((stat, index) => (
                <View key={index} style={[styles.abilityItem, { backgroundColor: stat.bgColor }]}>
                  <View style={styles.abilityIconContainer}>
                    <stat.Icon style={styles.abilityIcon} />
                  </View>
                  <View style={styles.abilityInfo}>
                    <Text style={styles.abilityTitle}>{stat.title}</Text>
                    <Text style={styles.abilityValue}>{stat.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bioContainer}>
            <View style={styles.bioHeader}>
              <FontAwesome5 name="user-circle" size={20} color="#7834E6" />
              <Text style={styles.bioTitle}>About</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.editBioInput}
                value={editedProfile?.bio}
                onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, bio: text} : null)}
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.bioText}>{profile.bio}</Text>
            )}
          </View>

          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={[styles.editActionButton, styles.saveButton]}
                onPress={handleSave}
              >
                <FontAwesome5 name="check" size={16} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editActionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <FontAwesome5 name="times" size={16} color="#7834E6" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.joinDateContainer}>
            <FontAwesome5 name="calendar-alt" size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.joinDateText}>Member since {profile.joinDate}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 80,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#7834E6',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#7834E6',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7834E6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  abilitiesCard: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  abilitiesHeader: {
    marginBottom: 20,
  },
  abilitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  abilitiesToggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  abilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.3)',
    gap: 6,
  },
  abilityToggleActive: {
    backgroundColor: 'rgba(120, 52, 230, 0.2)',
    borderColor: '#7834E6',
  },
  abilityToggleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  abilityToggleTextActive: {
    color: '#7834E6',
    fontWeight: '600',
  },
  abilityPolygonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  abilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.3)',
    flex: 1,
    minWidth: '45%',
  },
  abilityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(120, 52, 230, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  abilityIcon: {
    width: 24,
    height: 24,
  },
  abilityInfo: {
    flex: 1,
  },
  abilityTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  abilityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7834E6',
  },
  bioContainer: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  bioText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  joinDateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  editButtonText: {
    color: '#7834E6',
    fontSize: 14,
    fontWeight: '600',
  },
  editInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editBioInput: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    minHeight: 100,
    textAlignVertical: 'top',
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  editActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: '#7834E6',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  cancelButtonText: {
    color: '#7834E6',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: 'rgba(120, 52, 230, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
}); 