import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCart } from "./context/CartContext";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import { useNavigation } from "@react-navigation/native";

type HeaderProps = {
  bgColor: string;
};

const Header = ({ bgColor }: HeaderProps) => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  const { userName } = useCart();

  return (
    <View style={[styles.headerContainer, { backgroundColor: bgColor || "transparent" }]}>
      <Text style={styles.name}>Hi {userName}</Text>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => navigation.navigate("Profile")}
      >
        <Icon name="person-circle-outline" size={28} color="#fff" />
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
    marginBottom:10
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  profileContainer: {
    padding: 4,
  },
});
