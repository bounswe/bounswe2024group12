import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import profilePicPlaceholder from "./assets/images/react-logo.png";
import AnalysisScreen from "./AnalysisScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import axios from "axios";
// import * as SslPinning from 'expo-ssl-pinning';
import CreatePostScreen from "./CreatePostScreen";

import * as Network from 'expo-network';

const Stack = createStackNavigator();

const api = axios.create({
  baseURL: __DEV__ ? 'http://167.99.133.190/api/v1' : 'https://167.99.133.190/api/v1',
  timeout: 10000,
});

// if (__DEV__) {
//   import('react-native-ssl-pinning').then(module => {
//     module.default.setSslPinning(false);
//   });
// }

// Disable SSL pinning for development
// if (__DEV__) {
//   SslPinning.setIsEnabled(false);
// }

const PROFILE_PIC_SIZE = 50;
const ZOOMED_PIC_SIZE = Dimensions.get("window").width * 0.8;

const MainScreen = () => {
  const { username } = useContext(UserContext);
  const navigation = useNavigation();

  const [posts, setPosts] = useState([
    { id: "1", title: "Opening strategies", author: "Ozan" },
    { id: "2", title: "Endgame techniques", author: "Orhan" },
    { id: "3", title: "Famous chess matches", author: "Firat" },
  ]);

  const [newPostTitle, setNewPostTitle] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileZoomed, setIsProfileZoomed] = useState(false);
  const sidebarPosition = useRef(new Animated.Value(-250)).current;
  const zoomAnimation = useRef(new Animated.Value(0)).current;

  const addPost = () => {
    if (newPostTitle) {
      setPosts([
        ...posts,
        {
          id: Date.now().toString(),
          title: newPostTitle,
          author: "Anonymous",
        },
      ]);
      setNewPostTitle("");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>by {item.author}</Text>
    </View>
  );

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -250 : 0;
    Animated.timing(sidebarPosition, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileZoom = () => {
    setIsProfileZoomed(!isProfileZoomed);
    Animated.timing(zoomAnimation, {
      toValue: isProfileZoomed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderSidebar = () => (
    <>
      <TouchableWithoutFeedback onPress={toggleSidebar}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: sidebarPosition.interpolate({
                inputRange: [-250, 0],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.sidebar, { left: sidebarPosition }]}>
        <View style={styles.sidebarContent}>
          <View style={styles.userProfileContainer}>
            <TouchableOpacity onPress={toggleProfileZoom}>
              <Image
                source={profilePicPlaceholder}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
            <Text style={styles.username}>{username || "Guest"}</Text>
          </View>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => console.log("Puzzles")}
          >
            <Text style={styles.sidebarText}>Puzzles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => console.log("Community")}
          >
            <Text style={styles.sidebarText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => console.log("Archive")}
          >
            <Text style={styles.sidebarText}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate("Analysis");
            }}
          >
            <Text style={styles.sidebarText}>Analysis</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );

  const renderZoomedProfile = () => (
    <Modal
      transparent={true}
      visible={isProfileZoomed}
      onRequestClose={toggleProfileZoom}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill}>
        <TouchableWithoutFeedback onPress={toggleProfileZoom}>
          <View style={styles.zoomedProfileContainer}>
            <Animated.Image
              source={profilePicPlaceholder}
              style={[
                styles.zoomedProfilePicture,
                {
                  width: zoomAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [PROFILE_PIC_SIZE, ZOOMED_PIC_SIZE],
                  }),
                  height: zoomAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [PROFILE_PIC_SIZE, ZOOMED_PIC_SIZE],
                  }),
                },
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );

  const renderCreatePostButton = () => (
    <TouchableOpacity
      style={styles.createPostButton}
      onPress={() => navigation.navigate("CreatePost")}
    >
      <Feather name="edit-2" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chess Forum</Text>
      </View>

      {isSidebarOpen && renderSidebar()}

      {renderZoomedProfile()}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      {renderCreatePostButton()}
    </SafeAreaView>
  );
};

// const CreatePostScreen = () => {
//   const [postContent, setPostContent] = useState("");
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.createPostHeader}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Feather name="x" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.createPostTitle}>Create Post</Text>
//         <TouchableOpacity onPress={() => {
//           // TODO: Implement post creation logic
//           navigation.goBack();
//         }}>
//           <Text style={styles.postButton}>Post</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.createPostContent}>
//         <TextInput
//           style={styles.postInput}
//           multiline
//           placeholder="What's on your mind?"
//           value={postContent}
//           onChangeText={setPostContent}
//         />
//         <TouchableOpacity style={styles.addAttachmentButton}>
//           <Feather name="paperclip" size={20} color="black" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

export default function App() {
  // useEffect(() => {
  //   const bypassSSLPinning = async () => {
  //     if (__DEV__) {
  //       try {
  //         if (Platform.OS === 'android') {
  //           await Network.setNetworkStateAsync({
  //             urlRewrite: {
  //               'https://167.99.133.190': 'http://167.99.133.190'
  //             }
  //           });
  //           console.log('SSL pinning bypassed for development on Android');
  //         } else if (Platform.OS === 'ios') {
  //           // iOS doesn't require explicit SSL bypass in Expo development builds
  //           console.log('iOS development build: SSL pinning is already bypassed');
  //         }
  //       } catch (error) {
  //         console.error('Failed to bypass SSL pinning:', error);
  //       }
  //     }
  //   };

  //   bypassSSLPinning();
  // }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post("/accounts/login/", {
        mail: username,
        password: password,
      });

      console.log("Login successful:", response.data);
      setIsLoggedIn(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Login failed:", error.response?.data);

      if (error.response?.status === 400) {
        setErrorMessage("User not registered. Please sign up.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const renderLoginPage = () => (
    <KeyboardAvoidingView behavior="height" style={styles.loginContainer}>
      <View style={styles.loginForm}>
        <Text style={styles.loginHeader}>Chess Forum</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {/* Log In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setIsSignUp(true)}
        >
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Continue as Guest Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            setIsLoggedIn(true);
            setUsername("");
          }}
        >
          <Text style={styles.loginButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  // const renderSignUpPage = () => (
  //   <KeyboardAvoidingView behavior="height" style={styles.loginContainer}>
  //     <View style={styles.loginForm}>
  //       <Text style={styles.loginHeader}>Sign Up for Chess Forum</Text>
  //       <TextInput
  //         style={styles.loginInput}
  //         placeholder="Email"
  //         value={username}
  //         onChangeText={setUsername}
  //         autoCapitalize="none"
  //       />
  //       <TextInput
  //         style={styles.loginInput}
  //         placeholder="Username"
  //         value={username}
  //         onChangeText={setUsername}
  //         autoCapitalize="none"
  //       />
  //       <TextInput
  //         style={styles.loginInput}
  //         placeholder="Password"
  //         value={password}
  //         onChangeText={setPassword}
  //         secureTextEntry
  //       />
  //       {errorMessage ? (
  //         <Text style={styles.errorMessage}>{errorMessage}</Text>
  //       ) : null}

  //       {/* Sign Up Button */}
  //       <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
  //         <Text style={styles.loginButtonText}>Sign Up</Text>
  //       </TouchableOpacity>

  //       {/* Go Back to Log In Button */}
  //       <TouchableOpacity
  //         style={styles.loginButton}
  //         onPress={() => setIsSignUp(false)}
  //       >
  //         <Text style={styles.loginButtonText}>Back to Log In</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </KeyboardAvoidingView>
  // );

  const handleSignUp = async () => {
    try {
      console.log("Attempting to sign up...");
      console.log("Email:", email);
      console.log("Username:", username);
      // Don't log passwords in production!
      console.log("Password length:", password.length);

      const response = await api.post(
        "/accounts/signup/",
        {
          mail: email,
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Sign up response:", response.data);

      if (response.status === 201) {
        console.log("Sign up successful");
        Alert.alert("Success", "Account created successfully. Please log in.");
        setIsSignUp(false);
      } else {
        console.log("Unexpected response status:", response.status);
        setErrorMessage("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        setErrorMessage(JSON.stringify(error.response.data));
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setErrorMessage(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        setErrorMessage(error.message);
      }
    }
  };

  const renderSignUpPage = () => (
    <KeyboardAvoidingView behavior="padding" style={styles.loginContainer}>
      <View style={styles.loginForm}>
        <Text style={styles.loginHeader}>Sign Up for Chess Forum</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setIsSignUp(false)}
        >
          <Text style={styles.loginButtonText}>Back to Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  if (!isLoggedIn) {
    if (isSignUp) {
      return renderSignUpPage();
    }
    return renderLoginPage();
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserContext.Provider value={{ username, setUsername }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={MainScreen} />
            <Stack.Screen name="Analysis" component={AnalysisScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  menuButton: {
    padding: 8,
  },
  chessBoardWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  list: {
    flex: 1,
  },
  postItem: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 4,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    zIndex: 2,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 16,
  },
  userProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profilePicture: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: PROFILE_PIC_SIZE / 2,
  },
  username: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  sidebarItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sidebarText: {
    fontSize: 16,
  },
  zoomedProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomedProfilePicture: {
    borderRadius: ZOOMED_PIC_SIZE / 2,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loginForm: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loginInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  createPostButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createPostHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createPostContent: {
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
});
