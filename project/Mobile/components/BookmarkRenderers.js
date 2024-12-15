import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import PostCard from "./PostCard";
import GameCard from "./GameCard";
import { Feather } from "@expo/vector-icons";
import { Platform } from "react-native";

export const BookmarkedPosts = ({
  bookmarks,
  bookmarkedPosts,
  isLoading,
  navigation,
}) => {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return bookmarks.map((bookmark) => {
    const postData = bookmarkedPosts[bookmark.post__id];
    if (!postData) {
      return (
        <View key={bookmark.post__id} style={styles.loadingBookmarkContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }
    return <PostCard key={bookmark.post__id} post={postData} />;
  });
};

export const BookmarkedGames = ({ bookmarks, isLoading, navigation }) => {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return bookmarks.map((bookmark, index) => {
    const game = {
      event: bookmark.game__event || "Bookmarked Game",
      year: bookmark.game__year,
      white: bookmark.game__white,
      black: bookmark.game__black,
      site: bookmark.game__site || "Unknown Site",
      result: bookmark.game__result || "?",
      id: bookmark.game__id,
    };

    return (
      <GameCard
        key={`${bookmark.game__id}-${index}`}
        game={game}
        onPress={(game) => {
          navigation.navigate("Analysis", {
            gameId: game.id,
            entryMode: "archive",
          });
        }}
      />
    );
  });
};

export const BookmarkedMoves = ({ bookmarks, isLoading, navigation }) => {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return bookmarks.map((bookmark, index) => (
    <TouchableOpacity
      key={`${bookmark.game__id}-${bookmark.fen}-${index}`}
      style={styles.moveCard}
      onPress={() => {
        navigation.navigate("Analysis", {
          gameId: bookmark.game__id,
          entryMode: "archive",
          initialFen: bookmark.fen,
        });
      }}
    >
      <View style={styles.moveHeader}>
        <Text style={styles.moveTitle}>Game ID: {bookmark.game__id}</Text>
        <Feather name="chevron-right" size={20} color="#666" />
      </View>
      <Text style={styles.fenText}>{bookmark.fen}</Text>
    </TouchableOpacity>
  ));
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    padding: 20,
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
  moveCard: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  moveTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  fenText: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
    }),
    fontSize: 12,
    color: "#666",
  },
});
