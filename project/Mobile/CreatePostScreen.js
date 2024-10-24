import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Popover from "react-native-popover-view";
import Chessboard from "react-native-chessboard";
import axios from "axios";
import { UserContext } from "./UserContext";

const RemoveButton = ({ onPress }) => (
  <TouchableOpacity style={styles.removeButton} onPress={onPress}>
    <Feather name="x" size={16} color="white" />
  </TouchableOpacity>
);

const CreatePostScreen = ({ navigation }) => {
  const [postContent, setPostContent] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isFenModalVisible, setFenModalVisible] = useState(false);
  const [fenString, setFenString] = useState("");
  const [chessboardFen, setChessboardFen] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const boardSize = (screenWidth - 40) * 0.75;

  const createPost = async () => {
    if (!postContent && !chessboardFen) {
      Alert.alert(
        "Error",
        "Please enter some content or add a chess position."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://167.99.133.190/api/v1/posts/create/",
        {
          post_text: postContent,
          fen: chessboardFen,
          // Note: We're not handling image upload in this version
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if required
            // 'Authorization': `Bearer ${userToken}`
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Post created successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    }
  };

  const renderDropdown = () => (
    <Popover
      isVisible={isDropdownVisible}
      onRequestClose={() => setDropdownVisible(false)}
      from={
        <TouchableOpacity
          style={styles.addAttachmentButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Feather name="paperclip" size={20} color="black" />
        </TouchableOpacity>
      }
      popoverStyle={styles.dropdown}
    >
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          setDropdownVisible(false);
          setFenModalVisible(true);
        }}
      >
        <Text>FEN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownItem}>
        <Text>Image</Text>
      </TouchableOpacity>
    </Popover>
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
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add FEN string</Text>
              <TextInput
                style={styles.fenInput}
                value={fenString}
                onChangeText={setFenString}
                placeholder="Enter FEN notation"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (fenString.trim() !== "") {
                    setChessboardFen(fenString);
                    setFenModalVisible(false);
                    setFenString("");
                  }
                }}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const removeChessboard = () => {
    setChessboardFen("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Post</Text>
          <TouchableOpacity onPress={createPost}>
            <Text style={styles.postButton}>Post</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TextInput
            style={styles.postInput}
            multiline
            placeholder="What's on your mind?"
            value={postContent}
            onChangeText={setPostContent}
          />
          {chessboardFen && (
            <View style={styles.chessboardContainer}>
              <Chessboard
                fen={chessboardFen}
                boardSize={boardSize}
                gestureEnabled={false}
              />
              <RemoveButton onPress={removeChessboard} />
            </View>
          )}
          {renderDropdown()}
        </View>
        {renderFenModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white", // or any color that matches your design
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  postInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
  },
  addAttachmentButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    padding: 8,
  },
  dropdownItem: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fenInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chessboardContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20,
    position: "relative", // This allows absolute positioning of children
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensures the button is above the chessboard
  },
});

export default CreatePostScreen;
