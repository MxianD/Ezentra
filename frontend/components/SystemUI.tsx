import React, { useEffect } from 'react';
import { Platform, NativeModules, StatusBar, UIManager, Dimensions, findNodeHandle } from 'react-native';

// This component is intended to modify native UI elements
// For example, Android navigation bar color and visibility
const SystemUI = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set status bar color
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#000000');
      
      // Try to hide navigation bar
      try {
        // Try to directly call our NavigationBarModule
        if (NativeModules.NavigationBarModule) {
          console.log('NavigationBarModule found, calling hideNavigationBar');
          NativeModules.NavigationBarModule.hideNavigationBar();
          NativeModules.NavigationBarModule.setNavigationBarColor('#000000');
        } else {
          console.log('NavigationBarModule not found');
        }
        
        // Attempt to override system UI with UI flags
        const NativeUIManager = NativeModules.UIManager;
        if (NativeUIManager) {
          if (NativeUIManager.setLayoutAnimationEnabledExperimental) {
            NativeUIManager.setLayoutAnimationEnabledExperimental(true);
          }
          
          // Try to access Android-specific modules if available
          if (NativeModules.AndroidSystemUI) {
            NativeModules.AndroidSystemUI.hideNavigationBar();
          }
        }
      } catch (error) {
        console.error('Failed to set UI flags:', error);
      }

      // Additional attempt to override navigation visibility
      try {
        if (NativeModules.RNSystemSettings) {
          NativeModules.RNSystemSettings.setNavigationBarColor('#000000');
          NativeModules.RNSystemSettings.setNavigationBarVisible(false);
        }
      } catch (error) {
        console.error('Failed to use RNSystemSettings:', error);
      }
    }
  }, []);

  // This component doesn't render anything visually
  return null;
};

export default SystemUI; 