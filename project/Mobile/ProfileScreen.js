import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useAuth } from "./contexts/AuthContext";
import { api } from "./services/AuthService";
import PostCard from "./components/PostCard";
import { likeService } from "./services/LikeService";
import { ScrollView } from "react-native-gesture-handler";
import {
  BookmarkedPosts,
  BookmarkedGames,
  BookmarkedMoves,
} from "./components/BookmarkRenderers";
import { bookmarkService } from "./services/BookmarkService";

const TABS = ["Posts", "Likes", "Bookmarks"];

const BOOKMARK_TYPES = [
  { id: "posts", label: "Posts" },
  { id: "games", label: "Games" },
  { id: "game_moves", label: "Game Moves" },
];

const BookmarkFilters = ({ selectedTypes, onToggleType }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        <Feather name="filter" size={20} color="#007AFF" />
        <Text style={styles.filterButtonText}>Filter</Text>
        <Feather
          name={isDropdownVisible ? "chevron-up" : "chevron-down"}
          size={16}
          color="#007AFF"
        />
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          {BOOKMARK_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={styles.checkboxItem}
              onPress={() => onToggleType(type.id)}
            >
              <View style={styles.checkbox}>
                {selectedTypes.includes(type.id) && (
                  <Feather name="check" size={16} color="#007AFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("Posts");
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [following, setFollowing] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState({
    posts: [],
    games: [],
    game_moves: [],
  });
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [isLoadingBookmarkedPosts, setIsLoadingBookmarkedPosts] =
    useState(false);
  const [selectedBookmarkTypes, setSelectedBookmarkTypes] = useState(
    BOOKMARK_TYPES.map((type) => type.id)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    likeService.addLikeChangeListener(fetchUserData);
    bookmarkService.addBookmarkChangeListener(fetchUserData);
    return () => {
      likeService.removeLikeChangeListener(fetchUserData);
      bookmarkService.removeBookmarkChangeListener(fetchUserData);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "Bookmarks" && bookmarks.posts) {
      setIsLoadingBookmarkedPosts(true);
      Promise.all(
        bookmarks.posts.map((bookmark) =>
          fetchBookmarkedPostDetails(bookmark.post__id)
        )
      ).finally(() => {
        setIsLoadingBookmarkedPosts(false);
      });
    }
  }, [activeTab, bookmarks.posts]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/accounts/me/");
      if (response.data) {
        setUserData(response.data);
        setFollowing(response.data.following || []);
        setFollowers(response.data.followers || []);
        setUserPosts(response.data.posts || []);
        setLikedPosts(response.data.post_likes || []);
        setBookmarks({
          posts: response.data.post_bookmarks || [],
          games: response.data.game_bookmarks || [],
          game_moves: response.data.game_move_bookmarks || [],
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert(
        "Error",
        "Failed to load profile data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarkedPostDetails = async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/`);
      if (response.data) {
        setBookmarkedPosts((prev) => ({
          ...prev,
          [postId]: response.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching post ${postId} details:`, error);
    }
  };

  const toggleBookmarkType = (typeId) => {
    setSelectedBookmarkTypes((prev) => {
      if (prev.includes(typeId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== typeId);
      }
      return [...prev, typeId];
    });
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Profile</Text>
      <View style={styles.headerButton} />
    </View>
  );

  const ProfileInfo = () => (
    <View style={styles.profileInfo}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.username}>
          {userData?.username || user?.username || "User"}{" "}
          <Text style={styles.userEmail}>({userData?.email || ""})</Text>
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.followingButton}
          onPress={() => setShowFollowingModal(true)}
        >
          <Text style={styles.followingCount}>{following.length}</Text>
          <Text style={styles.followingLabel}>Following</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.followingButton}
          onPress={() => setShowFollowersModal(true)}
        >
          <Text style={styles.followingCount}>{followers.length}</Text>
          <Text style={styles.followingLabel}>Followers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const TabStrip = () => (
    <View style={styles.tabStrip}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const FollowingModal = () => (
    <Modal
      visible={showFollowingModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFollowingModal(false)}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Following</Text>
              <TouchableOpacity
                onPress={() => setShowFollowingModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {following.length > 0 ? (
              <FlatList
                data={following}
                keyExtractor={(item) => item.following__id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.followingItem}>
                    <Text style={styles.followingUsername}>
                      {item.following__username}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>Not following anyone yet</Text>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );

  const FollowersModal = () => (
    <Modal
      visible={showFollowersModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFollowersModal(false)}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Followers</Text>
              <TouchableOpacity
                onPress={() => setShowFollowersModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {followers.length > 0 ? (
              <FlatList
                data={followers}
                keyExtractor={(item) => item.follower__id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.followingItem}>
                    <Text style={styles.followingUsername}>
                      {item.follower__username}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>No followers yet</Text>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );

  const TabContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    switch (activeTab) {
      case "Posts":
        return (
          <FlatList
            data={userPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostCard post={item} />}
            contentContainerStyle={styles.postsContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No posts yet</Text>
            }
          />
        );
      case "Likes":
        return (
          <FlatList
            data={likedPosts}
            keyExtractor={(item) => item.post__id.toString()}
            renderItem={({ item }) => (
              <PostCard
                post={{
                  id: item.post__id,
                  title: item.post__title,
                  ...item,
                }}
              />
            )}
            contentContainerStyle={styles.postsContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No liked posts yet</Text>
            }
          />
        );
      case "Bookmarks":
        return (
          <View style={styles.bookmarksContainer}>
            <BookmarkFilters
              selectedTypes={selectedBookmarkTypes}
              onToggleType={toggleBookmarkType}
            />
            <ScrollView style={styles.bookmarksList}>
              {!bookmarks.posts.length &&
              !bookmarks.games.length &&
              !bookmarks.game_moves.length ? (
                <Text style={styles.emptyText}>No bookmarks yet</Text>
              ) : (
                <>
                  {selectedBookmarkTypes.includes("posts") && (
                    <BookmarkedPosts
                      bookmarks={bookmarks.posts}
                      bookmarkedPosts={bookmarkedPosts}
                      isLoading={isLoadingBookmarkedPosts}
                      navigation={navigation}
                    />
                  )}
                  {selectedBookmarkTypes.includes("games") && (
                    <BookmarkedGames
                      bookmarks={bookmarks.games}
                      isLoading={isLoading}
                      navigation={navigation}
                    />
                  )}
                  {selectedBookmarkTypes.includes("game_moves") && (
                    <BookmarkedMoves
                      bookmarks={bookmarks.game_moves}
                      isLoading={isLoading}
                      navigation={navigation}
                    />
                  )}
                </>
              )}
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ProfileInfo />
      <TabStrip />
      <TabContent />
      <FollowingModal />
      <FollowersModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    width: 40,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileInfo: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  followingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 16,
    gap: 4,
  },
  followingCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  followingLabel: {
    fontSize: 16,
    color: "#666",
  },
  tabStrip: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  bookmarksContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    position: "relative",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  bookmarksList: {
    flexGrow: 1,
    padding: 16,
  },
  bookmarkItem: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  bookmarkSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  bookmarkId: {
    fontSize: 12,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  followingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  followingUsername: {
    fontSize: 16,
  },
  postsContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    padding: 20,
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    fontWeight: "normal",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  loadingBookmarkContainer: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default ProfileScreen;
