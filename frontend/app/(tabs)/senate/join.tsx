import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';

interface ApplicationForm {
  experience: string;
  motivation: string;
  skills: string;
}

export default function JoinSenateScreen() {
  const [form, setForm] = useState<ApplicationForm>({
    experience: '',
    motivation: '',
    skills: ''
  });

  const handleSubmit = () => {
    if (!form.experience.trim() || !form.motivation.trim() || !form.skills.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Success',
      'Your application has been submitted successfully. We will review it and get back to you soon.',
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
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Join the Senate</Text>
          <Text style={styles.subtitle}>Apply to become a member of the Senate review board</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review Experience</Text>
            <Text style={styles.sectionDescription}>
              Please describe your experience in reviewing community documents and content.
            </Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Share your experience..."
              value={form.experience}
              onChangeText={(text) => setForm({ ...form, experience: text })}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Motivation</Text>
            <Text style={styles.sectionDescription}>
              Why do you want to join the Senate? What do you hope to contribute?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Tell us your motivation..."
              value={form.motivation}
              onChangeText={(text) => setForm({ ...form, motivation: text })}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <Text style={styles.sectionDescription}>
              What skills and expertise do you bring to the Senate?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="List your skills..."
              value={form.skills}
              onChangeText={(text) => setForm({ ...form, skills: text })}
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
              <Text style={styles.requirementText}>Active participation in community discussions</Text>
            </View>
            <View style={styles.requirementItem}>
              <FontAwesome5 name="check-circle" size={16} color="#2ecc71" />
              <Text style={styles.requirementText}>Strong understanding of community guidelines</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
    marginBottom: 24,
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
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  requirements: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  requirementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
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
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 