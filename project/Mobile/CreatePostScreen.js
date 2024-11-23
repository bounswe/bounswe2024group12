import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Chessboard from "react-native-chessboard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { api } from './services/AuthService';
import * as ImageManipulator from 'expo-image-manipulator';

const compressImage = async (uri) => {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }], // Resize to a reasonable width while maintaining aspect ratio
      {
        compress: 0.7, // Compress the image to 70% quality
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true
      }
    );
    
    return {
      uri: manipulatedImage.uri,
      base64: manipulatedImage.base64
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
};

const RemoveButton = ({ onPress }) => (
  <TouchableOpacity style={styles.removeButton} onPress={onPress}>
    <Feather name="x" size={16} color="white" />
  </TouchableOpacity>
);

const ActionButton = ({ onPress, text, icon }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Feather name={icon} size={20} color="#555" style={styles.actionIcon} />
    <Text style={styles.actionButtonText}>{text}</Text>
  </TouchableOpacity>
);

const CreatePostScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isAttachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const [isFenModalVisible, setFenModalVisible] = useState(false);
  const [isTagModalVisible, setTagModalVisible] = useState(false);
  const [fenString, setFenString] = useState("");
  const [chessboardFen, setChessboardFen] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const screenWidth = Dimensions.get("window").width;
  const boardSize = (screenWidth - 40) * 0.75;

  const handleError = (error) => {
    console.error('Error details:', error);
    const errorMessage = error.response?.data || 'Failed to create post. Please try again.';
    const message = typeof errorMessage === 'object' 
      ? Object.entries(errorMessage)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n')
      : errorMessage;
    Alert.alert("Error", message);
  };

  const getAuthToken = async () => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const createPost = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your post.");
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      Alert.alert("Error", "Please log in to create a post.");
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const postData = {
        title: title.trim(),
        post_text: postContent.trim(),
        tags: tags,
        ...(chessboardFen && { fen: chessboardFen }),
        ...(selectedImage?.base64 && { post_image: `data:image/jpeg;base64,${selectedImage.base64}` })
      };

      const response = await api.post('/posts/create/', postData, { headers });

      if (response.status === 201) {
        Alert.alert("Success", "Post created successfully!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please log in again.", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.removeItem('userToken');
              navigation.navigate('Login');
            }
          }
        ]);
      } else {
        handleError(error);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const compressedImage = await compressImage(result.assets[0].uri);
        setSelectedImage(compressedImage);
        setAttachmentMenuVisible(false);
      }
    } catch (error) {
      console.error('Error picking/processing image:', error);
      Alert.alert(
        'Error',
        'Failed to process the image. Please try again with a different image.'
      );
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleBackPress = () => {
    if (title || postContent || chessboardFen || selectedImage || tags.length > 0) {
      Alert.alert(
        "Discard Post",
        "Are you sure you want to discard this post?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", onPress: () => navigation.goBack(), style: "destructive" }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
        <Feather name="x" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Create Post</Text>
      <TouchableOpacity style={styles.headerButton} onPress={createPost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => (
    <ScrollView style={styles.content}>
      <TextInput
        style={styles.titleInput}
        placeholder="Add a title..."
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.postInput}
        multiline
        placeholder="What's on your mind?"
        value={postContent}
        onChangeText={setPostContent}
        placeholderTextColor="#999"
        textAlignVertical="top"
      />
      
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.selectedImage}
            resizeMode="cover"
          />
          <RemoveButton onPress={() => setSelectedImage(null)} />
        </View>
      )}

      {chessboardFen && (
        <View style={styles.chessboardContainer}>
          <Chessboard
            fen={chessboardFen}
            boardSize={boardSize}
            gestureEnabled={false}
          />
          <RemoveButton onPress={() => setChessboardFen("")} />
        </View>
      )}

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderAttachmentButton = () => (
    <TouchableOpacity 
      style={styles.attachButton}
      onPress={() => setAttachmentMenuVisible(true)}
    >
      <Feather name="plus" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderAttachmentMenu = () => (
    <Modal
      visible={isAttachmentMenuVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setAttachmentMenuVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setAttachmentMenuVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Add to post</Text>
            <ActionButton
              text="Add Chess Position (FEN)"
              icon="layout"
              onPress={() => {
                setAttachmentMenuVisible(false);
                setFenModalVisible(true);
              }}
            />
            <ActionButton
              text="Add Image"
              icon="image"
              onPress={pickImage}
            />
            <ActionButton
              text="Add Tags"
              icon="hash"
              onPress={() => {
                setAttachmentMenuVisible(false);
                setTagModalVisible(true);
              }}
            />
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setAttachmentMenuVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderFenModal = () => (
    <Modal
      visible={isFenModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setFenModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setFenModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Chess Position</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setFenModalVisible(false)}
              >
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.fenInput}
              value={fenString}
              onChangeText={setFenString}
              placeholder="Enter FEN notation"
              placeholderTextColor="#999"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setFenModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, !fenString.trim() && styles.primaryButtonDisabled]}
                onPress={() => {
                  if (fenString.trim()) {
                    setChessboardFen(fenString);
                    setFenModalVisible(false);
                    setFenString("");
                  }
                }}
                disabled={!fenString.trim()}
              >
                <Text style={styles.primaryButtonText}>Add Position</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderTagModal = () => (
    <Modal
      visible={isTagModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setTagModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setTagModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Tags</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setTagModalVisible(false)}
              >
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="Enter tag"
                placeholderTextColor="#999"
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
              />
              <TouchableOpacity 
                style={styles.tagAddButton}
                onPress={handleAddTag}
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.tagList}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagItem}>
                  <Text style={styles.tagItemText}>#{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Feather name="x" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setTagModalVisible(false)}
            >
              <Text style={styles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {renderHeader()}
        {renderContent()}
        {renderAttachmentButton()}
        {renderAttachmentMenu()}
        {renderFenModal()}
        {renderTagModal()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1,
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  postButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 12,
    color: '#000000',
    minHeight: 60,
  },
  postInput: {
    fontSize: 17,
    padding: 16,
    paddingTop: 8,
    color: '#000000',
    minHeight: 120,
  },
  imageContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedImage: {
    width: '100%',
    height: 200,
  },
  chessboardContainer: {
    alignItems: 'center',
    margin: 16,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 4,
  },
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  attachButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  actionIcon: {
    marginRight: 16,
    width: 24,
    height: 24,
    textAlign: 'center',
  },
  actionButtonText: {
    fontSize: 17,
    color: '#000000',
  },
  cancelButton: {
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 17,
    color: '#FF3B30',
    fontWeight: '600',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  modalCloseButton: {
    padding: 4,
  },
  fenInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    minWidth: 100,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    minWidth: 100,
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  tagAddButton: {
    backgroundColor: '#007AFF',
    width: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tagItemText: {
    fontSize: 16,
    color: '#000000',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default CreatePostScreen;