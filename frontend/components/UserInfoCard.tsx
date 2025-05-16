import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { 
  IconLevel, 
  IconMath, 
  IconEnglish, 
  IconSports, 
  IconMusic, 
  IconComputer 
} from "./icons/StatIcons";
import { LinearGradient } from 'expo-linear-gradient';
import AbilityPolygon from './AbilityPolygon';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Card() {
  const userLevel = {
    value: "1000",
    maxValue: 10000
  };

  const userStats = [
    { 
      title: "Math", 
      value: "2000",
      maxValue: 10000,
      Icon: IconMath,
      bgColor: "rgba(64, 156, 255, 0.1)"
    },
    { 
      title: "English", 
      value: "5000",
      maxValue: 10000,
      Icon: IconEnglish,
      bgColor: "rgba(103, 194, 58, 0.1)"
    },
    { 
      title: "Sports", 
      value: "1000",
      maxValue: 10000,
      Icon: IconSports,
      bgColor: "rgba(255, 69, 0, 0.1)"
    },
    { 
      title: "Music", 
      value: "2000",
      maxValue: 10000,
      Icon: IconMusic,
      bgColor: "rgba(144, 19, 254, 0.1)"
    },
    { 
      title: "Computer", 
      value: "9900",
      maxValue: 10000,
      Icon: IconComputer,
      bgColor: "rgba(24, 144, 255, 0.1)"
    },
  ];

  const communityTokens = [
    {
      name: "English Community",
      token: "5000 ENG",
      color: "#4CAF50"
    },
    {
      name: "Tech Community",
      token: "3000 TECH",
      color: "#2196F3"
    },
    {
      name: "Art Community",
      token: "2000 ART",
      color: "#9C27B0"
    },
    {
      name: "Gaming Community",
      token: "1500 GAME",
      color: "#FF9800"
    }
  ];

  const totalSystemTokens = "11500 MBT";

  return (
    <View style={styles.container}>
      <ScrollView style={styles.cardContainer}>
        <View style={styles.card}>
          <LinearGradient
            colors={['rgba(120, 52, 230, 0.2)', 'rgba(120, 52, 230, 0.05)']}
            style={styles.cardHead}
          >
            <View style={styles.avatarContainer}>
              <Image source={require("@/assets/images/AI.png")} style={styles.avatar} />
              <View style={styles.avatarBorder} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>UserName</Text>
              <Text style={styles.userTitle}>Web3 Developer</Text>
              <View style={styles.levelContainer}>
                <FontAwesome5 name="star" size={16} color="#FFD700" />
                <Text style={styles.levelText}>
                  Level {Math.floor(Number(userLevel.value) / 100)}
                </Text>
                <View style={styles.levelBarContainer}>
                  <View 
                    style={[
                      styles.levelBarFill, 
                      { width: `${(Number(userLevel.value) / userLevel.maxValue) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.levelValue}>{userLevel.value} / {userLevel.maxValue}</Text>
              </View>
            </View>
            <View style={styles.tokenContainer}>
              <Text style={styles.totalTokenLabel}>Total System Tokens</Text>
              <Text style={styles.totalTokenValue}>{totalSystemTokens}</Text>
            </View>
          </LinearGradient>

          <View style={styles.divider} />

          <View style={styles.communityTokensContainer}>
            <Text style={styles.sectionTitle}>Community Tokens</Text>
            <View style={styles.tokenGrid}>
              {communityTokens.map((token, index) => (
                <View key={index} style={styles.tokenCard}>
                  <LinearGradient
                    colors={[`${token.color}20`, `${token.color}10`]}
                    style={styles.tokenCardGradient}
                  >
                    <Text style={styles.tokenCommunityName}>{token.name}</Text>
                    <Text style={[styles.tokenValue, { color: token.color }]}>{token.token}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            
            <View style={styles.abilityPolygonContainer}>
              <AbilityPolygon stats={userStats} size={300} />
            </View>

            <View style={styles.statsGrid}>
              {userStats.map((stat, index) => (
                <View key={index} style={[styles.statItem, { backgroundColor: stat.bgColor }]}>
                  <View style={styles.iconContainer}>
                    <stat.Icon style={styles.statIcon} />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(43,36,49)",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardContainer: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  card: {
    width: "100%",
    height: "100%",
  },
  cardHead: {
    flexDirection: "column",
    alignItems: "center",
    padding: 24,
    borderRadius: 12,
  },
  avatarContainer: {
    position: "relative",
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  avatarBorder: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "rgb(255, 136, 0)",
    opacity: 0.5,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
  },
  tokenContainer: {
    alignItems: "center",
    backgroundColor: "rgba(120, 52, 230, 0.1)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(120, 52, 230, 0.3)",
  },
  totalTokenLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  totalTokenValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7834E6",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },
  communityTokensContainer: {
    marginBottom: 20,
  },
  tokenGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tokenCard: {
    width: "48%",
  },
  tokenCardGradient: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tokenCommunityName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  tokenValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statsContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "31%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    color: 'white',
    opacity: 0.9,
  },
  statInfo: {
    alignItems: "center",
  },
  statTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  abilityPolygonContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 8,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  levelText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  levelValue: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: 12,
  },
});
