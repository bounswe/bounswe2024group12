import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./services/AuthService";
import PostCard from "./components/PostCard";
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH / 2;

const MainScreen = ({ navigation }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarPosition = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    next: null,
    count: 0,
    previous: null,
  });
  const initialLoadRef = useRef(true);

  const fetchPosts = async (refresh = false) => {
    if (authLoading || !user) return;

    try {
      if (!refresh && !initialLoadRef.current) return;

      setIsLoading(!refresh);
      setRefreshing(refresh);

      const response = await api.get("/posts/list_posts/");
      if (response.data) {
        setPosts(response.data.results);
        setPagination({
          next: response.data.next,
          count: response.data.count,
          previous: response.data.previous,
        });
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      if (error?.response?.status === 401) {
        console.log(
          "Authentication required. Please ensure you are logged in."
        );
      } else {
        Alert.alert("Error", "Failed to load posts. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      initialLoadRef.current = false;
    }
  };

  const loadMorePosts = async () => {
    if (!pagination.next || isLoading || refreshing || authLoading || !user)
      return;

    try {
      setIsLoading(true);
      const response = await api.get(pagination.next);
      if (response.data) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
        setPagination({
          next: response.data.next,
          count: response.data.count,
          previous: response.data.previous,
        });
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => fetchPosts(true);

  useEffect(() => {
    if (!authLoading && user && initialLoadRef.current) {
      fetchPosts();
    }
  }, [authLoading, user]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -SIDEBAR_WIDTH : 0;
    Animated.timing(sidebarPosition, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderSidebar = () => (
    <>
      <TouchableWithoutFeedback onPress={toggleSidebar}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: sidebarPosition.interpolate({
                inputRange: [-SIDEBAR_WIDTH, 0],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.sidebar, { left: sidebarPosition }]}>
        <View style={styles.sidebarContent}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.username}>{user?.username || "Guest"}</Text>
          </View>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate("Profile");
            }}
          >
            <Text style={styles.sidebarText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate("Playground");
            }}
          >
            <Text style={styles.sidebarText}>Playground</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate("Analysis", { pgn: null });
            }}
          >
            <Text style={styles.sidebarText}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate("Puzzles");
            }}
          >
            <Text style={styles.sidebarText}>Puzzles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate("Archive");
            }}
          >
            <Text style={styles.sidebarText}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sidebarItem, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chess Social</Text>
      </View>

      {isSidebarOpen && renderSidebar()}

      {isLoading && posts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            pagination.next &&
            !refreshing && <ActivityIndicator style={{ padding: 16 }} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.createPostButton}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Feather name="edit-2" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  list: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: SIDEBAR_WIDTH,
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    zIndex: 2,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 16,
  },
  userInfoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "flex-start",
  },
  username: {
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
  logoutButton: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 16,
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
});

export default MainScreen;