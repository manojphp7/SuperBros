import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "./context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import axios from "axios";
import { BaseUrl } from "./helpers/helpers";
import Icon from "react-native-vector-icons/Ionicons";

const FloatingOrderBox = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();
  const { euid, orderOnProcess } = useCart();

  const [orderObj, setOrderObj] = useState<any>(null);

  const [isMultipleOrder, setisMultipleOrder] = useState(false);

  useEffect(() => {
    if (orderOnProcess) {
      if (orderOnProcess.length > 1) {
        setisMultipleOrder(true);
      } else {
        setOrderObj(orderOnProcess[orderOnProcess.length - 1]);
      }
    }
  }, [orderOnProcess]);

  if (orderObj || orderOnProcess?.length === 0) {
    return null;
  }
  

  return (
    <SafeAreaView>
      <View style={styles.floatingBar}>
        {Array.isArray(orderOnProcess) && orderOnProcess?.length > 1 ? (
          <TouchableOpacity
            style={styles.summaryBar}
            onPress={() => navigation.navigate("UserOrders")}
          >
            <Text style={styles.summaryText}>
              You have {orderOnProcess?.length} active orders - Tap to view
              status →
            </Text>
          </TouchableOpacity>
        ) : (
          (orderObj &&
          <TouchableOpacity
            style={styles.floatingBarContent}
            onPress={() =>
              navigation.navigate("OrderDetails", { orderID: orderObj?.id })
            }
          >
            {/* Left Column - Icon */}
            <View style={styles.container}>
              <Image
                source={require("./assets/cooking-boiling.gif")}
                style={styles.gif}
              />
            </View>

            {/* Middle Column - Order Info */}
            <View style={styles.orderInfo}>
              <Text style={styles.orderIdText}>Order ID: #{orderObj?.id}</Text>
              <Text style={styles.itemText} numberOfLines={1}>
                {orderObj?.items?.[0]?.name || "View your order"}
              </Text>
            </View>

            {/* Right Column - ETA Box */}
            <View style={styles.etaBox}>
              <Text style={styles.etaText}>Arriving in 22 mins</Text>
            </View>
          </TouchableOpacity>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  summaryBar: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: "#1ca672",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  summaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: 40,
    height: 40,
  },
  floatingBar: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 80,
    backgroundColor: "#1ca672",
    justifyContent: "center",
    borderRadius: 20,
    zIndex: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  floatingBarContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  orderInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  orderIdText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemText: {
    color: "#e0f6ed",
    fontSize: 14,
    marginTop: 4,
  },
  etaBox: {
    backgroundColor: "#0c864f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  etaText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default FloatingOrderBox;
