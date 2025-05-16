import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions, SafeAreaView } from "react-native";
import { router, usePathname } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";
import Layout from '@/constants/Layout';

type RoutePath = "/" | "/ranking" | "/schedule" | "/senate" | "/community" | "/profile";

function Navigator() {
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Check if current screen is mobile
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setIsSmallScreen(width < Layout.breakpoints.tablet);
    };
    
    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);
    
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  // Function to check if route is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, children }: { to: RoutePath; children: React.ReactNode }) => {
    return (
      <TouchableOpacity 
        onPress={() => router.push(to)}
        style={[
          styles.navLink,
          isActive(to) && styles.activeNavLink
        ]}
      >
        <Text style={[
          styles.navLinkText,
          isActive(to) && styles.activeNavLinkText
        ]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  };

  // Mobile bottom tab navigation
  const MobileTabBar = () => {
    if (Platform.OS === 'web') return null;
    return (
      <SafeAreaView style={styles.mobileTabBarContainer}>
        <View style={styles.mobileTabBar}>
          <TouchableOpacity 
            style={styles.tabBarItem} 
            onPress={() => router.push("/")}
          >
            <Ionicons 
              name="home" 
              size={24} 
              color={isActive("/") ? "#7834E6" : "#9ca3af"} 
            />
            <Text style={[
              styles.tabBarText,
              isActive("/") && styles.activeTabBarText
            ]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem} 
            onPress={() => router.push("/ranking")}
          >
            <Ionicons 
              name="trophy" 
              size={24} 
              color={isActive("/ranking") ? "#7834E6" : "#9ca3af"} 
            />
            <Text style={[
              styles.tabBarText,
              isActive("/ranking") && styles.activeTabBarText
            ]}>Ranking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem} 
            onPress={() => router.push("/schedule")}
          >
            <Ionicons 
              name="calendar" 
              size={24} 
              color={isActive("/schedule") ? "#7834E6" : "#9ca3af"} 
            />
            <Text style={[
              styles.tabBarText,
              isActive("/schedule") && styles.activeTabBarText
            ]}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem} 
            onPress={() => router.push("/community")}
          >
            <Ionicons 
              name="people" 
              size={24} 
              color={isActive("/community") ? "#7834E6" : "#9ca3af"} 
            />
            <Text style={[
              styles.tabBarText,
              isActive("/community") && styles.activeTabBarText
            ]}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabBarItem} 
            onPress={() => router.push("/profile")}
          >
            <Ionicons 
              name="person" 
              size={24} 
              color={isActive("/profile") ? "#7834E6" : "#9ca3af"} 
            />
            <Text style={[
              styles.tabBarText,
              isActive("/profile") && styles.activeTabBarText
            ]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  // Traditional web navigation for larger screens
  const WebNavigation = () => (
    <View style={styles.father}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.logo}>
        <Image source={require("@/assets/images/logo.jpg")} style={styles.logoImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")} style={styles.DAO_name}>
        <Text style={styles.DAO_name_text}>MetaBuilder DAO</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/ranking">Ranking</NavLink>
        <NavLink to="/schedule">Schedule</NavLink>
        <NavLink to="/senate">Senate</NavLink>
        <NavLink to="/community">Community</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </View>
    </View>
  );

  // Return different components based on screen size
  if (Platform.OS === 'web') {
    return <WebNavigation />;
  } else {
    return isSmallScreen ? <MobileTabBar /> : <WebNavigation />;
  }
}

export default Navigator;
