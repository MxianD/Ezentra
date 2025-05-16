import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions, Platform } from "react-native";
import { useRouter, Link, Stack } from "expo-router";
import Particles from "react-native-particles";
import Navigator from "@/components/Navigator/Navigator";
import UserInfoCard from "@/components/UserInfoCard";
import Schedule from "@/components/Schedule";
import Position from "@/components/Position";
import { FontAwesome5 } from '@expo/vector-icons';
import Layout from '@/constants/Layout';

function Home() {
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Add window resize handler
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsSmallScreen(width < 768);
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
  
  return (
    <>
    <Stack.Screen
      options={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    />
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={[
            isSmallScreen && styles.scrollContentMobile
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, isSmallScreen && styles.contentColumn]}>
            <View style={[styles.userinfo, isSmallScreen && styles.userinfoSmall]}>
              <View style={styles.userinfocard}>
                <UserInfoCard></UserInfoCard>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.publicProfileButton}
                  onPress={() => router.push({
                    pathname: '/profile/[id]',
                    params: { id: 'current-user' }
                  })}
                >
                  <FontAwesome5 name="globe" size={16} color="#7834E6" />
                  <Text style={styles.publicProfileButtonText}>View Public Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={() => router.push({
                    pathname: "/profile/[id]",
                    params: { id: "settings" }
                  })}
                >
                  <FontAwesome5 name="cog" size={16} color="#7834E6" />
                  <Text style={styles.settingsButtonText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.management, isSmallScreen && styles.managementSmall]}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="calendar-alt" size={20} color="#7834E6" />
                  <Text style={styles.sectionTitle}>Schedule</Text>
                </View>
                <View style={styles.schedule}>
                  <Schedule></Schedule>
                </View>
              </View>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesome5 name="chart-line" size={20} color="#7834E6" />
                  <Text style={styles.sectionTitle}>Position</Text>
                </View>
                <View style={styles.position}>
                  <Position></Position>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Navigator />
    </View>
    </>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "black",
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentMobile: {
    paddingBottom: 80, // Add padding at bottom for tab bar
    paddingTop: 80, // 防止被顶部Navigator遮挡
  },
  content: {
    flexDirection: "row",
    padding: 20,
    gap: 20,
  },
  contentColumn: {
    flexDirection: "column",
  },
  userinfo: {
    flex: 3,
    minHeight: 700,
  },
  userinfoSmall: {
    flex: 0,
    minHeight: 700,
    marginBottom: 20,
  },
  userinfocard: {
    height: "100%",
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtons: {
    gap: 12,
    marginTop: 16,
  },
  publicProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  publicProfileButtonText: {
    color: '#7834E6',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButtonText: {
    color: '#7834E6',
    fontSize: 16,
    fontWeight: '600',
  },
  management: {
    flex: 7,
    flexDirection: "column",
    gap: 24,
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#7834E6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  managementSmall: {
    flex: 0,
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  schedule: {
    flex: 1,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  position: {
    flex: 1,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
});
