import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCart } from "./context/CartContext";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import { useNavigation } from "@react-navigation/native";

type HeaderProps = {
  isBack?: boolean;
  title?:string;
  bgColor?: string;
  isHome?: boolean
};

const Header = ({ title, bgColor, isBack,isHome }: HeaderProps) => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  const { userName } = useCart();

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: bgColor || "transparent" },
      ]}
    >
      {navigation.canGoBack() && isBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={28} color={bgColor ? '#fff' : '#333'} />
        </TouchableOpacity>
      ) : (
        <Text style={styles.name}>Hi {userName}</Text>
      )}

      {title && (<Text style={styles.headerTitle}>{title}</Text>)}
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => navigation.navigate("Profile")}
      >
        <Icon name="person-circle-outline" size={28} color={ bgColor || isHome ? "#fff" : "#333"} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16, // Optional: remove if no spacing needed
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  profileContainer: {
    padding: 4,
  },
  backButton: {
    padding: 4,
    paddingRight: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
