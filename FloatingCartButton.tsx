import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "./context/CartContext";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "./helpers/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const FloatingCartButton = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();

  const { cartItems, addItem, removeItem, clearCart } = useCart();

  const [savedAmount, setSavedAmount] = useState<undefined | string>();

  useEffect(() => {
    const totalExtraPrice = cartItems.reduce(
      (sum, item) => sum + (item.extraPriceTotal || 0),
      0
    );
    const totalFinalPrice = cartItems.reduce(
      (sum, item) => sum + (item.productFinalPrice || 0),
      0
    );
    const result = parseFloat(
      (totalExtraPrice - totalFinalPrice).toString()
    ).toFixed(2);
    setSavedAmount(result);
  }, [cartItems]);
  
  if (cartItems.length === 0) return null; 

  return (
    <SafeAreaView>
      {cartItems.length > 0 && (
        <View style={styles.floatingWrapper}>
          <View style={styles.floatingHeader}>
            <Text style={styles.floatingHeaderText}>
              You Saved £ {savedAmount}
            </Text>
          </View>
          <View style={styles.floatingBar}>
            <View style={styles.floatingBarContent}>
              <Text
                style={styles.floatingBarText}
              >{`${cartItems.length} Items added`}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Cart");
                }}
                activeOpacity={0.8}
              >
                <View style={styles.cartAction}>
                  <Text style={styles.floatingBarText}>View Cart</Text>
                  <Icon
                    name="chevron-forward-outline"
                    size={18}
                    color="#fff"
                    style={styles.icon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  floatingHeader: {
    backgroundColor: "#105e44",
    height: 30,
    position: "absolute",
    bottom: 70, // Moves up from the bottom (adjust as needed)
    left: 16, // Add margin from left side
    right: 16, // Add margin from right side
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  floatingHeaderText: {
    color: "#fff",
    fontSize: 15,
  },
  floatingBar: {
    position: "absolute",
    bottom: 0,
    left: 16, // Add margin from left side
    right: 16, // Add margin from right side
    height: 70,
    backgroundColor: "#1ca672",
    justifyContent: "center",
    zIndex: 10,
    borderBottomLeftRadius: 20, // Round the bottom left corner
    borderBottomRightRadius: 20, // Round the bottom right corner
  },

  floatingBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottomLeftRadius: 20, // Ensure it matches the bottom part's rounding
    borderBottomRightRadius: 20, // Ensure it matches the bottom part's rounding
    paddingLeft:15,
    paddingRight:15
  },

  floatingBarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  cartAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // Use spacing between text and icon
  },

  icon: {
    marginLeft: 6, // Fallback if 'gap' not supported
  },
});

export default FloatingCartButton;
