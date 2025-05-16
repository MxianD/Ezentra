import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Position() {
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const positions = [
    { 
      community: "English Community", 
      role: "Moderator", 
      icon: "language",
      color: "#4CAF50",
      members: 1200,
      activeUsers: 450
    },
    { 
      community: "Tech Community", 
      role: "Member", 
      icon: "microchip",
      color: "#2196F3",
      members: 3500,
      activeUsers: 890
    },
    { 
      community: "Art Community", 
      role: "Contributor", 
      icon: "palette",
      color: "#9C27B0",
      members: 2800,
      activeUsers: 670
    },
    { 
      community: "Gaming Community", 
      role: "Admin", 
      icon: "gamepad",
      color: "#FF9800",
      members: 5000,
      activeUsers: 1200
    }
  ];

  const handlePositionPress = (community: string, index: number) => {
    setSelectedPosition(index);
    const communitySlug = community.toLowerCase().replace(/\s+/g, '-');
    router.push(`/community/${communitySlug}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          {positions.map((position, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.positionItem,
                selectedPosition === index && styles.selectedItem
              ]}
              onPress={() => handlePositionPress(position.community, index)}
            >
              <LinearGradient
                colors={[`${position.color}20`, `${position.color}10`]}
                style={styles.communityBadge}
              >
                <View style={[styles.iconContainer, { borderColor: position.color }]}>
                  <FontAwesome5 name={position.icon} size={24} color={position.color} />
                </View>
                <Text style={styles.communityText}>{position.community}</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <FontAwesome5 name="users" size={12} color={position.color} />
                    <Text style={[styles.statText, { color: position.color }]}>
                      {position.members.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <FontAwesome5 name="user-clock" size={12} color={position.color} />
                    <Text style={[styles.statText, { color: position.color }]}>
                      {position.activeUsers.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={[styles.roleContainer, { backgroundColor: `${position.color}20`, borderColor: position.color }]}>
                  <FontAwesome5 
                    name={position.role === "Admin" ? "crown" : 
                          position.role === "Moderator" ? "shield-alt" : 
                          position.role === "Contributor" ? "star" : "user"} 
                    size={12} 
                    color={position.color}
                  />
                  <Text style={[styles.roleText, { color: position.color }]}>{position.role}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  positionItem: {
    width: '48%',
    transform: [{ scale: 1 }],
  },
  selectedItem: {
    transform: [{ scale: 0.98 }],
  },
  communityBadge: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
  },
  communityText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
