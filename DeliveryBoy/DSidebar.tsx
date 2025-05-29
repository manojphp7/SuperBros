import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const DSidebar: React.FC<Props> = ({ isOpen, toggleSidebar }) => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.7)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -screenWidth * 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleNavigation = (screen: string) => {
    toggleSidebar();
    navigation.navigate(screen as never);
  };

  return (
    <Animated.View
      style={[
        styles.sidebar,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>SUPER BROS</Text>
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.link} onPress={() => handleNavigation('MyDeliveries')}>
        <Text style={styles.linkText}>Pending Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => handleNavigation('Delivered')}>
        <Text style={styles.linkText}>Delivered Order</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: '#1e293b',
    zIndex: 100,
    paddingHorizontal: 16,
    paddingTop: 60,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default DSidebar;
