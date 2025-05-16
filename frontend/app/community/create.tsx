import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import Navigator from '@/components/Navigator/Navigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

interface CommunityForm {
  name: string;
  description: string;
  image: string | null;
  tags: string[];
  type: string;
  memberLimit?: number;
  isPrivate: boolean;
  startTime: Date;
  endTime: Date;
}

interface CreateCommunityRequest {
  communityName: string;
  communityDescription: string;
  communityLabelId: number;
  createBy: number;
  createTime: string;
  expireTime: string;
  userId: number;
}

const COMMUNITY_TYPES = [
  'Development',
  'DeFi',
  'NFT',
  'Gaming',
  'Trading',
  'Education',
  'Art',
  'Music',
  'Sports',
  'Other'
];

const AVAILABLE_TAGS = [
  'Web3', 'Blockchain', 'Smart Contracts', 'DApp',
  'DeFi', 'NFT', 'Gaming', 'Trading', 'Security',
  'Development', 'Art', 'Music', 'Sports', 'Education',
  'Community', 'DAO', 'Governance', 'Technical'
];

export default function CreateCommunityScreen() {
  const [form, setForm] = useState<CommunityForm>({
    name: '',
    description: '',
    image: null,
    tags: [],
    type: '',
    memberLimit: undefined,
    isPrivate: false,
    startTime: new Date(),
    endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month from now
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      setForm(prev => ({ ...prev, startTime: selectedDate }));
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      setForm(prev => ({ ...prev, endTime: selectedDate }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreate = async () => {
    // Validate form
    if (!form.name || !form.description || !form.type || form.tags.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const requestData: CreateCommunityRequest = {
        communityName: form.name,
        communityDescription: form.description,
        communityLabelId: COMMUNITY_TYPES.indexOf(form.type) + 1, // Assuming type index + 1 is the label ID
        createBy: 1, // TODO: Replace with actual user ID
        createTime: form.startTime.toISOString(),
        expireTime: form.endTime.toISOString(),
        userId: 1, // TODO: Replace with actual user ID
      };

      console.log("Sending request:", requestData);
      const response = await axios.post('http://localhost:8080/api/user-community', requestData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Response:", response.data);
      
      if (response.data.code === 200) {  // 使用 code === 200 作为成功标志
        Alert.alert(
          'Success', 
          'Community created successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                // 使用 Expo Router 的导航方法
                router.navigate('/(tabs)/community');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create community');
      }
    } catch (error) {
      console.error('Error creating community:', error);
      Alert.alert('Error', 'Failed to create community. Please try again.');
    }
  };

  const renderDatePicker = (type: 'start' | 'end') => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="datetime-local"
          value={type === 'start' ? form.startTime.toISOString().slice(0, 16) : form.endTime.toISOString().slice(0, 16)}
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (type === 'start') {
              setForm(prev => ({ ...prev, startTime: date }));
            } else {
              setForm(prev => ({ ...prev, endTime: date }));
            }
          }}
          style={{
            backgroundColor: 'rgba(35, 35, 40, 0.95)',
            color: 'white',
            border: '1px solid rgba(120, 52, 230, 0.5)',
            borderRadius: '8px',
            padding: '12px',
            width: '100%',
            fontSize: '16px',
          }}
        />
      );
    }

    return (
      <DateTimePicker
        value={type === 'start' ? form.startTime : form.endTime}
        mode="datetime"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedDate) => {
          if (Platform.OS === 'android') {
            type === 'start' ? setShowStartPicker(false) : setShowEndPicker(false);
          }
          if (selectedDate) {
            setForm(prev => ({
              ...prev,
              [type === 'start' ? 'startTime' : 'endTime']: selectedDate
            }));
          }
        }}
        minimumDate={type === 'end' ? form.startTime : new Date()}
        style={Platform.OS === 'ios' ? { width: '100%', backgroundColor: 'rgba(35, 35, 40, 0.95)' } : undefined}
        textColor={Platform.OS === 'ios' ? 'white' : undefined}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Navigator />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableOpacity 
          style={[styles.imageUpload, { pointerEvents: 'auto' }]} 
          onPress={pickImage}
        >
          {form.image ? (
            <Image 
              source={{ uri: form.image }} 
              style={styles.previewImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <FontAwesome5 name="image" size={40} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.uploadText}>Upload Cover Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Text style={styles.label}>Community Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              placeholder="Enter community name"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              selectionColor="#7834E6"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              placeholder="Describe your community"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              numberOfLines={4}
              selectionColor="#7834E6"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Community Type</Text>
            <View style={styles.typeContainer}>
              {COMMUNITY_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    form.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, type }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    form.type === type && styles.typeButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {AVAILABLE_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    form.tags.includes(tag) && styles.tagButtonActive
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagButtonText,
                    form.tags.includes(tag) && styles.tagButtonTextActive
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Time Settings</Text>
            
            <View style={styles.timeSettingRow}>
              <Text style={styles.label}>Start Time</Text>
              {Platform.OS === 'web' ? (
                renderDatePicker('start')
              ) : (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formatDate(form.startTime)}
                  </Text>
                  <FontAwesome5 name="calendar-alt" size={16} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.timeSettingRow}>
              <Text style={styles.label}>End Time</Text>
              {Platform.OS === 'web' ? (
                renderDatePicker('end')
              ) : (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formatDate(form.endTime)}
                  </Text>
                  <FontAwesome5 name="calendar-alt" size={16} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              )}
            </View>

            {Platform.OS !== 'web' && showStartPicker && renderDatePicker('start')}
            {Platform.OS !== 'web' && showEndPicker && renderDatePicker('end')}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Settings</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.label}>Member Limit</Text>
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={form.memberLimit?.toString()}
                onChangeText={(text) => setForm(prev => ({ 
                  ...prev, 
                  memberLimit: text ? parseInt(text) : undefined 
                }))}
                placeholder="Optional"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="numeric"
                selectionColor="#7834E6"
              />
            </View>

            <TouchableOpacity
              style={styles.switchRow}
              onPress={() => setForm(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
            >
              <Text style={styles.label}>Private Community</Text>
              <View style={[
                styles.switch,
                form.isPrivate && styles.switchActive
              ]}>
                <View style={[
                  styles.switchThumb,
                  form.isPrivate && styles.switchThumbActive
                ]} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              (!form.name || !form.description || !form.type || form.tags.length === 0) && styles.disabledButton,
            ]}
            onPress={handleCreate}
            
          >
            <Text style={styles.createButtonText}>Create Community</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 52, 230, 0.5)',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  uploadText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    padding: 20,
    gap: 24,
  },
  formSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    color: 'white',
  },
  numberInput: {
    width: 120,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(120, 52, 230, 0.2)',
    borderColor: '#7834E6',
  },
  typeButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  tagButtonActive: {
    backgroundColor: 'rgba(120, 52, 230, 0.2)',
    borderColor: '#7834E6',
  },
  tagButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  tagButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#7834E6',
    borderColor: '#7834E6',
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  switchThumbActive: {
    backgroundColor: '#fff',
    transform: [{ translateX: 24 }],
  },
  createButton: {
    backgroundColor: '#7834E6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(120, 52, 230, 0.3)',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(35, 35, 40, 0.95)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 52, 230, 0.5)',
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
  },
}); 