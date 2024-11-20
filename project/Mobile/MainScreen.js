import React, { useState, useRef } from 'react';
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
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import profilePicPlaceholder from '@/assets/images/react-logo.png';
import { useAuth } from '@/contexts/AuthContext';

const PROFILE_PIC_SIZE = 50;
const ZOOMED_PIC_SIZE = Dimensions.get('window').width * 0.8;

const MainScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [posts, setPosts] = useState([
    { id: '1', title: 'Opening strategies', author: 'Ozan' },
    { id: '2', title: 'Endgame techniques', author: 'Orhan' },
    { id: '3', title: 'Famous chess matches', author: 'Firat' },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileZoomed, setIsProfileZoomed] = useState(false);
  const sidebarPosition = useRef(new Animated.Value(-250)).current;
  const zoomAnimation = useRef(new Animated.Value(0)).current;

  const handleLogout = async () => {
    try {
      await logout();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>by {item.author}</Text>
    </View>
  );

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
            <Text style={styles.username}>{user?.username || 'Guest'}</Text>
          </View>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.navigate('Analysis');
            }}
          >
            <Text style={styles.sidebarText}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => console.log('Puzzles')}
          >
            <Text style={styles.sidebarText}>Puzzles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => console.log('Community')}
          >
            <Text style={styles.sidebarText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => console.log('Archive')}
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

      <TouchableOpacity
        style={styles.createPostButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Feather name="edit-2" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    zIndex: 2,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 16,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profilePicture: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: PROFILE_PIC_SIZE / 2,
  },
  username: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sidebarItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sidebarText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  zoomedProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedProfilePicture: {
    borderRadius: ZOOMED_PIC_SIZE / 2,
  },
  createPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MainScreen;