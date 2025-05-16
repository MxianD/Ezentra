import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

export default function JoinSenateScreen() {
  const [application, setApplication] = useState({
    experience: '',
    motivation: '',
    skills: ''
  });

  const handleSubmit = () => {
    // 这里应该添加表单验证
    if (!application.experience || !application.motivation || !application.skills) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    // 这里应该发送申请到后端
    Alert.alert(
      'Application Submitted',
      'Your application to join the Senate has been submitted. We will review it and get back to you soon.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Navigator />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Join the Senate</Text>
          <Text style={styles.subtitle}>Apply to become a Senate member and help maintain quality standards</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review Experience</Text>
            <Text style={styles.sectionDescription}>
              Tell us about your experience in reviewing documents and maintaining quality standards.
            </Text>
            <TextInput
              style={styles.textArea}
              value={application.experience}
              onChangeText={(text) => setApplication({ ...application, experience: text })}
              placeholder="Describe your experience..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Motivation</Text>
            <Text style={styles.sectionDescription}>
              Why do you want to join the Senate? What do you hope to contribute?
            </Text>
            <TextInput
              style={styles.textArea}
              value={application.motivation}
              onChangeText={(text) => setApplication({ ...application, motivation: text })}
              placeholder="Share your motivation..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <Text style={styles.sectionDescription}>
              What skills and expertise do you bring to the Senate?
            </Text>
            <TextInput
              style={styles.textArea}
              value={application.skills}
              onChangeText={(text) => setApplication({ ...application, skills: text })}
              placeholder="List your relevant skills..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>Requirements</Text>
            <View style={styles.requirementItem}>
              <FontAwesome5 name="check-circle" size={16} color="#2ecc71" />
              <Text style={styles.requirementText}>Minimum 100 community contributions</Text>
            </View>
            <View style={styles.requirementItem}>
              <FontAwesome5 name="check-circle" size={16} color="#2ecc71" />
              <Text style={styles.requirementText}>Active community participation</Text>
            </View>
            <View style={styles.requirementItem}>
              <FontAwesome5 name="check-circle" size={16} color="#2ecc71" />
              <Text style={styles.requirementText}>Good standing in the community</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  form: {
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  requirements: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  submitButton: {
    backgroundColor: '#7834E6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 