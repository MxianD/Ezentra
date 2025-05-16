import React from 'react';
import { Stack } from 'expo-router';

export default function CommunityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'black' },
        animation: 'none',
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="members"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="audit"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 