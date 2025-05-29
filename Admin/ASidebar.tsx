import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { Audio } from "expo-av";
import BlinkingNewOrderIcon from "./BlinkingNewOrderIcon";

interface Props {
  isOpen: boolean;
  toggleSidebar: () => void;
  title: string;
}

const ASidebar: React.FC<Props> = ({ isOpen, toggleSidebar, title }) => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.7)).current;
  const { newAdminOrders, setNewAdminOrdersFn } = useCart();
  const [showNotification, setShowNotification] = useState(false);

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

  const playNewOrderSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/adminNotification.mp3") // Replace with your sound file
    );
    await sound.playAsync();
  };

  useEffect(() => {
    if (newAdminOrders.length > 0) {
      playNewOrderSound();

      if (title !== "Orders") {
        setShowNotification(true);
      }
    }
  }, [newAdminOrders]);

  useEffect(() => {
    if (title === "Orders") {
      setShowNotification(false);
    }
  }, [title]);

  return (
    <>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.menuButtonPlaceholder} />
        <BlinkingNewOrderIcon show={showNotification} />
      </View>

      {/* Sidebar */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>SUPER BROS</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {["Dashboard", "Orders", "DeliveryBoys", "Settings"].map((screen) => (
          <TouchableOpacity
            key={screen}
            style={styles.link}
            onPress={() => handleNavigation(screen)}
          >
            <Text style={styles.linkText}>{screen}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FC8019",
    zIndex: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 8,
  },
  menuButtonPlaceholder: {
    width: 24,
  },
  menuIcon: {
    fontSize: 24,
    color: "#fff",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "#fff",
    zIndex: 100,
    paddingHorizontal: 16,
    paddingTop: 30,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 20,
    color: "#444",
    fontWeight: "bold",
  },
  link: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#444",
  },
});

export default ASidebar;
