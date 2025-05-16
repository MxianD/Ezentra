import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Navigator from '@/components/Navigator/Navigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { 
  IconLevel, 
  IconMath, 
  IconEnglish, 
  IconSports, 
  IconMusic, 
  IconComputer 
} from "@/components/icons/StatIcons";
import { Stack, useRouter } from 'expo-router';
import Layout from '@/constants/Layout';

interface UserStats {
  level: number;
  math: number;
  english: number;
  sports: number;
  music: number;
  computer: number;
}

interface RankingData {
  id: string;
  name: string;
  title: string;
  avatar: string;
  stats: UserStats;
  rank: number;
}

const mockRankingData: RankingData[] = [
  { 
    id: '1', 
    name: "John Doe", 
    title: "Web3 Developer",
    avatar: 'https://picsum.photos/50',
    stats: {
      level: 1000,
      math: 2000,
      english: 5000,
      sports: 1000,
      music: 2000,
      computer: 9900,
    },
    rank: 1,
  },
  { 
    id: '2', 
    name: "Jane Smith", 
    title: "Smart Contract Engineer",
    avatar: 'https://picsum.photos/51',
    stats: {
      level: 900,
      math: 1800,
      english: 4500,
      sports: 800,
      music: 1500,
      computer: 8800,
    },
    rank: 2,
  },
  { 
    id: '3', 
    name: "Mike Johnson", 
    title: "DApp Developer",
    avatar: 'https://picsum.photos/52',
    stats: {
      level: 800,
      math: 1600,
      english: 4000,
      sports: 700,
      music: 1200,
      computer: 7700,
    },
    rank: 3,
  },
  {
    id: '4',
    name: "Sarah Wilson",
    title: "Blockchain Developer",
    avatar: 'https://picsum.photos/53',
    stats: {
      level: 750,
      math: 1500,
      english: 3800,
      sports: 600,
      music: 1000,
      computer: 7600,
    },
    rank: 4,
  },
  {
    id: '5',
    name: "Emma Davis",
    title: "Web3 Designer",
    avatar: 'https://picsum.photos/55',
    stats: {
      level: 700,
      math: 1400,
      english: 3600,
      sports: 500,
      music: 900,
      computer: 7500,
    },
    rank: 5,
  }
];

const categories = [
  { label: "Level", value: "level", Icon: IconLevel, color: "rgba(255, 136, 0, 0.1)" },
  { label: "Math", value: "math", Icon: IconMath, color: "rgba(64, 156, 255, 0.1)" },
  { label: "English", value: "english", Icon: IconEnglish, color: "rgba(103, 194, 58, 0.1)" },
  { label: "Sports", value: "sports", Icon: IconSports, color: "rgba(255, 69, 0, 0.1)" },
  { label: "Music", value: "music", Icon: IconMusic, color: "rgba(144, 19, 254, 0.1)" },
  { label: "Computer", value: "computer", Icon: IconComputer, color: "rgba(24, 144, 255, 0.1)" },
];

export default function RankingScreen() {
  const [selectedCategory, setSelectedCategory] = useState('level');
  const [rankingData, setRankingData] = useState<RankingData[]>(mockRankingData);
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
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

  const getScoreForCategory = (stats: UserStats, category: string) => {
    return stats[category as keyof UserStats];
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
        contentContainerStyle={[
          styles.scrollContent,
          isSmallScreen && styles.scrollContentMobile
        ]}
      >
        <View style={styles.content}>
          <View style={styles.sidebar}>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.value && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.value)}
                >
                  <View style={styles.categoryIcon}>
                    {category.Icon && <category.Icon style={styles.categoryIconImage} />}
                  </View>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.value && styles.categoryTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.mainContent}>
            {rankingData.map((item) => (
              <View key={item.id} style={styles.rankingCard}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNumber}>#{item.rank}</Text>
                </View>
                
                <View style={styles.userInfo}>
                  <TouchableOpacity 
                    style={styles.iconContainer}
                    onPress={() => router.push({
                      pathname: '/profile/[id]',
                      params: { id: item.id }
                    })}
                  >
                    <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                  </TouchableOpacity>
                  <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{item.name}</Text>
                  </View>
                </View>

                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Score</Text>
                  <Text style={styles.scoreValue}>
                    {getScoreForCategory(item.stats, selectedCategory)}
                  </Text>
                </View>
              </View>
            ))}
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
    position: 'relative',
    backgroundColor: 'black',
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
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryList: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 52, 230, 0.2)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(120, 52, 230, 0.15)',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIconImage: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  categoryText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  categoryTextActive: {
    color: '#7834E6',
    fontWeight: '600',
  },
  rankingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7834E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(120, 52, 230, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    overflow: 'hidden',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  nameContainer: {
    marginLeft: 15,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  scoreValue: {
    color: '#7834E6',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
}); 