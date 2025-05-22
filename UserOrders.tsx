import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BaseUrl, formatCurrency, formatDate } from "./helpers/helpers";
import { useCart } from "./context/CartContext";
import { theme } from "./Main";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import NotificationHandler from "./NotificationHandler";





const UserOrders = () => {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Profile"
  >;
  const navigation = useNavigation<NavigationProp>();

  const { euid,userOrderStatusUpdate,userOrderStatusUpdateHandling } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);




  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BaseUrl}user/orders`, {
          params: { euid },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  useEffect(() => {
    if (userOrderStatusUpdate['orderID'] !== '') {

      const { orderID, newStatus } = userOrderStatusUpdate; // assuming you have id and newStatus inside
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderID ? { ...order, status: newStatus } : order
        )
      );
    }
  }, [userOrderStatusUpdate]);

  

  const renderOrder = ({ item }: { item: any }) => {
    let parsedItems: any[] = [];

    try {
      parsedItems = JSON.parse(item.description);
    } catch (error) {
      console.warn("Failed to parse description:", error);
    }

    return (
      <View style={styles.orderCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusText,
                item.status === "Cancelled" && styles.statusCancelled,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.dateText}>{formatDate(item.movement)}</Text>

        <View style={styles.rowBetween}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {formatCurrency(parseFloat(item.amount))}
            </Text>
          </View>
        </View>

        <View style={styles.dashedDivider} />

        {parsedItems.map((prod, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            {prod.isVeg ? (
              <View style={styles.vegSymbol}>
                <View style={styles.greenDot} />
              </View>
            ) : (
              <View style={styles.nonVegSymbol}>
                <View style={styles.redDot} />
              </View>
            )}
            <Text style={styles.itemsText}>
              {"  "}
              {prod.name}
              {prod.adOnsNames?.length
                ? ` (Add-ons: ${prod.adOnsNames.join(", ")})`
                : ""}
            </Text>
          </View>
        ))}
        
      </View>


    );
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <PaperProvider theme={theme}>
        <View style={styles.screen}>
          {/* Header */}
          <View style={styles.header}>
            {navigation.canGoBack() ? (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Icon name="chevron-back" size={28} color="#333" />
              </TouchableOpacity>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}
  
            <Text style={styles.headerTitle}>Your Orders</Text>
  
            <TouchableOpacity
              style={styles.profileContainer}
              onPress={() => navigation.navigate("Profile")}
            >
              <Icon name="person-circle-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
  
          {/* Content */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#FC8019"
              style={{ marginTop: 50 }}
            />
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={renderOrder}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No orders found.
                </Text>
              }
            />
          )}
          <NotificationHandler />
        </View>
      </PaperProvider>
    </SafeAreaView>
  </SafeAreaProvider>)}

export default UserOrders;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
    backgroundColor: "#fff",
  },

  backButton: {
    padding: 4,
  },

  backButtonPlaceholder: {
    width: 32, // same width as back button/icon to keep title centered
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  profileContainer: {
    padding: 4,
  },

  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerRightSpacer: {
    width: 40, // balances the back button
  },
  listContent: {
    padding: 20,
  },
  orderCard: {
    marginBottom: 25,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    color: "green",
    marginLeft: 5,
    fontWeight: "500",
  },
  statusCancelled: {
    color: "#D32F2F",
  },
  dateText: {
    color: "#666",
    fontSize: 13,
    marginVertical: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    color: "#FC8019",
    fontWeight: "bold",
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  itemsText: {
    fontSize: 14,
    color: "#555",
  },
  vegSymbol: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  greenDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "green",
  },
  nonVegSymbol: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  redDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "red",
  },
});
