import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { theme } from "./Main";
import { useCart } from "./context/CartContext";
import { RootStackParamList } from "./helpers/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();
  const { logoutUser } = useCart();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await AsyncStorage.removeItem("euid"); // 🔥 Delete euid from storage
        await AsyncStorage.removeItem("role"); // 🔥 Delete role from storage
        await AsyncStorage.removeItem("formatted"); // 🔥 Delete formatted from storage
        await logoutUser(); // Log the user out
        // Navigate to login or splash screen
        navigation.reset({
          index: 0,
          routes: [{ name: "EnterMobile" }], // Update route name to your login screen
        });
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    performLogout();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#ff6347" />
          <Text style={styles.text}>Logging out...</Text>
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },
});

export default Logout;
