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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { api } from "./services/AuthService";
import * as ImageManipulator from "expo-image-manipulator";
import { StatusBar } from "react-native";

const formatFENPosition = (fen) => {
  if (!fen) return "";

  let cleanFen = fen.trim().replace(/\s+/g, " ");

  if (cleanFen.includes(" ")) return cleanFen;

  cleanFen = cleanFen.replace(/\/+/g, "/").replace(/\/$/, "");

  const ranks = cleanFen.split("/");
  if (ranks.length < 8) {
    while (ranks.length < 8) {
      ranks.push("8");
    }
  }

  const validRanks = ranks.slice(0, 8);
  return `${validRanks.join("/")} w KQkq - 0 1`;
};

const validateFEN = (fen) => {
  if (!fen) return true;
  const trimmedFen = fen.trim();

  const parts = trimmedFen.split(" ");
  const position = parts[0];

  const ranks = position.split("/");
  if (ranks.length !== 8) return false;

  for (const rank of ranks) {
    let squares = 0;
    for (let i = 0; i < rank.length; i++) {
      const char = rank[i];
      if ("12345678".includes(char)) {
        squares += parseInt(char);
      } else if ("prnbqkPRNBQK".includes(char)) {
        squares += 1;
      } else {
        return false;
      }
    }
    if (squares !== 8) return false;
  }

  if (parts.length === 1) return true;

  if (parts.length === 6) {
    const [_, turn, castling, enPassant, halfmove, fullmove] = parts;
    return (
      /^[wb]$/.test(turn) &&
      /^(-|K?Q?k?q?)$/.test(castling) &&
      /^(-|[a-h][36])$/.test(enPassant) &&
      /^\d+$/.test(halfmove) &&
      /^\d+$/.test(fullmove)
    );
  }

  return false;
};

const compressImage = async (uri) => {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }],
      {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );
    return {
      uri: manipulatedImage.uri,
      base64: manipulatedImage.base64,
    };
  } catch (error) {
    console.error("Image compression failed:", error);
    throw error;
  }
};

const CreatePostScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [fenString, setFenString] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageMenuVisible, setImageMenuVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const boardSize = (screenWidth - 40) * 0.75;

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    } else if (tags.length >= 10) {
      Alert.alert("Error", "Maximum 10 tags allowed");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const getAuthToken = async () => {
    try {
      return await AsyncStorage.getItem("userToken");
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const createPost = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your post.");
      return;
    }

    const formattedFEN = formatFENPosition(fenString);
    if (fenString && !validateFEN(formattedFEN)) {
      Alert.alert("Error", "Invalid FEN notation format.");
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      Alert.alert("Error", "Please log in to create a post.");
      return;
    }

    try {
      const postData = {
        title: title.trim(),
        post_text: postContent.trim(),
        tags: tags,
      };

      if (fenString) {
        postData.fen = fenString.trim();
      }

      if (selectedImage?.base64) {
        postData.post_image = `data:image/jpeg;base64,${selectedImage.base64}`;
      }

      const response = await api.post("/posts/create/", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Post created successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please log in again.", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.removeItem("userToken");
              navigation.navigate("Login");
            },
          },
        ]);
      } else {
        const errorMessage =
          error.response?.data || "Failed to create post. Please try again.";
        Alert.alert(
          "Error",
          typeof errorMessage === "object"
            ? Object.values(errorMessage).flat().join("\n")
            : errorMessage
        );
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos"
      );
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
        setImageMenuVisible(false);
      }
    } catch (error) {
      console.error("Error picking/processing image:", error);
      Alert.alert(
        "Error",
        "Failed to process the image. Please try again with a different image."
      );
    }
  };

  const handleBackPress = () => {
    if (title || postContent || fenString || selectedImage || tags.length > 0) {
      Alert.alert(
        "Discard Post",
        "Are you sure you want to discard this post?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            onPress: () => navigation.goBack(),
            style: "destructive",
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Feather name="x" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity onPress={createPost}>
            <Text style={styles.postButton}>Post</Text>
          </TouchableOpacity>
        </View>

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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chess Position (FEN)</Text>
            <TextInput
              style={[
                styles.fenInput,
                !validateFEN(formatFENPosition(fenString)) &&
                  fenString &&
                  styles.fenInputError,
              ]}
              multiline
              placeholder="Enter position or full FEN notation"
              value={fenString}
              onChangeText={setFenString}
              placeholderTextColor="#999"
            />
            {!validateFEN(formatFENPosition(fenString)) && fenString && (
              <Text style={styles.errorText}>
                Invalid FEN format. Enter either:
                {"\n"}• Position only (e.g.,
                rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR)
                {"\n"}• Full FEN (e.g., above + "w KQkq - 0 1")
              </Text>
            )}
            {validateFEN(formatFENPosition(fenString)) && fenString && (
              <View style={styles.chessboardContainer}>
                <Chessboard
                  fen={formatFENPosition(fenString)}
                  boardSize={boardSize}
                  gestureEnabled={false}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setFenString("")}
                >
                  <Feather name="x" size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag..."
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={handleAddTag}
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                  <TouchableOpacity
                    onPress={() => removeTag(tag)}
                    style={styles.removeTagButton}
                  >
                    <Feather name="x" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.addImageButton}
            onPress={() => setImageMenuVisible(true)}
          >
            <Feather name="image" size={24} color="#666" />
            <Text style={styles.addImageText}>Add Image</Text>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.selectedImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Feather name="x" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <Modal
          visible={isImageMenuVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setImageMenuVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setImageMenuVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.imageMenuContainer}>
                <TouchableOpacity
                  style={styles.imageMenuItem}
                  onPress={pickImage}
                >
                  <Feather name="image" size={24} color="#000" />
                  <Text style={styles.imageMenuText}>Choose from Library</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setImageMenuVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  backgroundColor: 'white',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight / 2 : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight - 24 : 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  postButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  postInput: {
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  fenInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
  fenInputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  chessboardContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  tagInputContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  addImageText: {
    marginLeft: 8,
  },
  imageContainer: {
    marginBottom: 16,
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageMenuContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 16,
  },
  imageMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  imageMenuText: {
    marginLeft: 16,
    fontSize: 16,
  },
  cancelButton: {
    alignItems: "center",
    padding: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButtonText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "600",
  },
  chessboardContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  fenInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
  fenInputError: {
    borderColor: "#ff4444",
  },
});

export default CreatePostScreen;
