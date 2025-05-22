import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


type MenuItem = {
  id: string;
  label: string;
};

type Props = {
  active: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  menuItems: MenuItem[];
};

const { height } = Dimensions.get("window");
const menuWidth = 250;

const LeftMenu: React.FC<Props> = ({ active, onSelect, onClose, menuItems }) => {


  const slideAnim = useRef(new Animated.Value(-menuWidth)).current;

  useEffect(() => {
    // Slide in when mounted
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    // Slide out before unmounting
    Animated.timing(slideAnim, {
      toValue: -menuWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose(); // only call onClose after animation finishes
    });
  };

  return (
    <Animated.View
      style={[
        styles.menu,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {/* Close button */}
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✖</Text>
      </TouchableOpacity>

      {/* Menu items */}
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.menuItem,
            active === item.id && styles.activeMenuItem,
          ]}
          onPress={() =>{
            onSelect(item.id)
            handleClose()
          } }
        >
          <Text
            style={[
              styles.menuItemText,
              active === item.id && styles.activeMenuItemText,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

export default LeftMenu;

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    left: 0,
    top: 0,
    height: height,
    width: menuWidth,
    backgroundColor: "#F8F8F8",
    borderRightWidth: 1,
    borderColor: "#ddd",
    paddingTop: 60,
    zIndex: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 101,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  menuItemText: {
    fontSize: 18,
    color: "#555",
  },
  activeMenuItem: {
    backgroundColor: "#FC8019",
  },
  activeMenuItemText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
