import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
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
  const { euid } = useCart();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${BaseUrl}user/userPendingOrder`, {
        params: { euid },
      });
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (!order || loading) return null;

  return (
    <SafeAreaView>
      <View style={styles.floatingBar}>
        <TouchableOpacity
          style={styles.floatingBarContent}
          onPress={()=>navigation.navigate("OrderDetails",{orderObj:order})}
        >
          {/* Left Column - Icon */}
        <View style={styles.container}>
              <Image
                source={require('./assets/cooking-boiling.gif')}
                style={styles.gif}
              />
            </View>

          {/* Middle Column - Order Info */}
          <View style={styles.orderInfo}>
            <Text style={styles.orderIdText}>Order ID: #{order.id}</Text>
            <Text style={styles.itemText} numberOfLines={1}>
              {order.items?.[0]?.name || "View your order"}
            </Text>
          </View>

          {/* Right Column - ETA Box */}
          <View style={styles.etaBox}>
            <Text style={styles.etaText}>Arriving in 22 mins</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
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
