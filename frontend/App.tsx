import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Platform, StatusBar, View, StyleSheet } from 'react-native';
import SystemUI from './components/SystemUI';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {Platform.OS === 'android' && (
        <View style={styles.androidSafeArea} />
      )}
      <SystemUI />
      <Stack />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    height: StatusBar.currentHeight,
    backgroundColor: '#000000',
  }
}); 