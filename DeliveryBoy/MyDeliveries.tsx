import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import DSidebar from "./DSidebar";
import axios from "axios";
import { BaseUrl, formatCurrency } from "../helpers/helpers";
import { useCart } from "../context/CartContext";
import OrderInfo from "./OrderInfo";
import { ActivityIndicator } from "react-native-paper";

type orderType = {
  id: string;
  euid: string;
  description: string;
  amount: string;
  address: string;
  latlong: null;
  flat: null;
  movement: string;
  status: string;
  deliveryBoy: string;
  deliveryCharges: string;
};

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState<orderType[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { euid } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<orderType | null>(null);

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const getMyDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BaseUrl}user/myDeliveries`, {
        params: { euid },
      });
      setDeliveries(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (orderID: string) => {
    setDeliveries((orders) => orders.filter((order) => order.id !== orderID));
  };

  useEffect(() => {
    getMyDeliveries();
  }, []);

  const renderItem = ({ item }: { item: orderType }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.customer}>#{item.id}</Text>
        <Text style={styles.deliveryCharge}>
          {formatCurrency(item.deliveryCharges)}
        </Text>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSelectedOrder(item);
        }}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSidebarOpen(true)}
            style={styles.menuButton}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Pending Deliveries</Text>
          <View style={styles.menuButtonPlaceholder} />
          <Text></Text>
        </View>
        {/* Deliveries List */}
        { (!isLoading) ? deliveries && deliveries.length > 0 ?
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        :
        <Text style={{textAlign:'center',fontSize:18,marginTop:80}}>No Pending Deliveries</Text>
        :
        <ActivityIndicator size="small" color="#fc8019" style={{ marginVertical: 8 }} />
        }

        {/* Sidebar */}
        <DSidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(false)}
        />

        <OrderInfo
          visible={!!selectedOrder}
          order={selectedOrder}
          onClose={closeModal}
          onStatusUpdate={handleStatusUpdate}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4, // optional spacing
  },
  deliveryCharge: {
    fontWeight: "bold",
    color: "gray", // or any color you like
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  menuButton: {
    padding: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
  },
  menuButtonPlaceholder: {
    width: 36, // same as menuButton width to balance layout
  },
  menuIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    width: 32, // adjust to match menuButton size for centering
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  customer: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    color: "#475569",
    marginBottom: 6,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default MyDeliveries;
