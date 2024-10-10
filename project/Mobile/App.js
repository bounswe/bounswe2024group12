import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function App() {
  const [posts, setPosts] = useState([
    { id: '1', title: 'Opening strategies', author: 'Ozan' },
    { id: '2', title: 'Endgame techniques', author: 'Orhan' },
    { id: '3', title: 'Famous chess matches', author: 'Firat' },
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addPost = () => {
    if (newPostTitle) {
      setPosts([
        ...posts,
        {
          id: Date.now().toString(),
          title: newPostTitle,
          author: 'Anonymous',
        },
      ]);
      setNewPostTitle('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>by {item.author}</Text>
    </View>
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderSidebar = () => (
    <View style={[styles.sidebar, { left: isSidebarOpen ? 0 : -250 }]}>
      <View style={styles.sidebarContent}>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => console.log('Puzzles')}>
          <Text style={styles.sidebarText}>Puzzles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => console.log('Community')}>
          <Text style={styles.sidebarText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => console.log('Archive')}>
          <Text style={styles.sidebarText}>Archive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => console.log('Analysis')}>
          <Text style={styles.sidebarText}>Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chess Forum</Text>
      </View>
      {renderSidebar()}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPostTitle}
          onChangeText={setNewPostTitle}
          placeholder="Enter new post title"
        />
        <TouchableOpacity style={styles.button} onPress={addPost}>
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  menuButton: {
    padding: 8,
  },
  list: {
    flex: 1,
  },
  postItem: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    zIndex: 1,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 16,
    paddingHorizontal: 20,
  },
  sidebarItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sidebarText: {
    fontSize: 16,
  },
});