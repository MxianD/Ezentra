import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Navigator from "@/components/Navigator/Navigator";
import Schedule from "@/components/Schedule";
import Layout from '@/constants/Layout';
import { Stack } from 'expo-router';

export default function ScheduleScreen() {
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
        <Schedule />
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
    padding: 20,
    paddingTop: 80, // 让所有屏幕宽度下都不被Navigator遮挡
  },
  scrollContentMobile: {
    paddingBottom: 80, // Add padding at bottom for tab bar
  },
}); 