import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface Child {
  id: string;
  name: string;
  age: number;
}

interface Memory {
  id: string;
  childId: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  timestamp: string;
}

export default function App() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    // Mock data
    setChildren([
      { id: '1', name: 'Emma', age: 5 },
      { id: '2', name: 'Leo', age: 2 },
    ]);
    setSelectedChild({ id: '1', name: 'Emma', age: 5 });

    // Request permissions
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const capturePhoto = async () => {
    if (!selectedChild) {
      Alert.alert('Error', 'Please select a child first');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const newMemory: Memory = {
          id: Date.now().toString(),
          childId: selectedChild.id,
          type: 'photo',
          url: result.assets[0].uri,
          timestamp: new Date().toISOString(),
        };

        setMemories(prev => [newMemory, ...prev]);
        Alert.alert('Success', 'Memory captured!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const pickFromGallery = async () => {
    if (!selectedChild) {
      Alert.alert('Error', 'Please select a child first');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const newMemory: Memory = {
          id: Date.now().toString(),
          childId: selectedChild.id,
          type: result.assets[0].type === 'video' ? 'video' : 'photo',
          url: result.assets[0].uri,
          timestamp: new Date().toISOString(),
        };

        setMemories(prev => [newMemory, ...prev]);
        Alert.alert('Success', 'Memory added!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick from gallery');
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>StoryNest</Text>
        <View style={styles.childSelector}>
          <Text style={styles.childLabel}>Capturing for:</Text>
          <TouchableOpacity
            style={styles.childButton}
            onPress={() => {
              const currentIndex = children.findIndex(c => c.id === selectedChild?.id);
              const nextIndex = (currentIndex + 1) % children.length;
              setSelectedChild(children[nextIndex]);
            }}
          >
            <Text style={styles.childName}>{selectedChild?.name}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Capture Controls */}
        <View style={styles.captureSection}>
          <Text style={styles.sectionTitle}>Capture Memories</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
              <Text style={styles.buttonText}>📸 Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={pickFromGallery}>
              <Text style={styles.buttonText}>🖼️ Choose Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Memories */}
        <View style={styles.memoriesSection}>
          <Text style={styles.sectionTitle}>Recent Memories</Text>
          
          {memories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No memories yet</Text>
              <Text style={styles.emptySubtext}>Start capturing precious moments!</Text>
            </View>
          ) : (
            <View style={styles.memoriesGrid}>
              {memories.slice(0, 6).map((memory) => (
                <View key={memory.id} style={styles.memoryItem}>
                  <Image source={{ uri: memory.url }} style={styles.memoryImage} />
                  <View style={styles.memoryInfo}>
                    <Text style={styles.memoryType}>{memory.type}</Text>
                    <Text style={styles.memoryDate}>
                      {new Date(memory.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View Timeline</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🎬</Text>
              <Text style={styles.actionText}>Create Story</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 10,
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childLabel: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 10,
  },
  childButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  childName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  captureSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captureButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  memoriesSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  memoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memoryItem: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  memoryImage: {
    width: '100%',
    height: 120,
  },
  memoryInfo: {
    padding: 10,
  },
  memoryType: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  memoryDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  actionsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
