import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { AdminEuid, BaseUrl, formatCurrency } from "../helpers/helpers";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../helpers/navigation";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../context/CartContext";
import ASidebar from "./ASidebar";
import { SafeAreaView } from "react-native-safe-area-context";

// Type
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const Dashboard = () => {
  const { euid, savedSocket, logoutUser } = useCart();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>();
  const [recentOrders, setRecentOrders] = useState([]);

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const summaryDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}user/summaryDashboard`, {
        params: { euid: AdminEuid },
      });
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}user/admin_orders`, {
        params: { euid: AdminEuid, limit: 5, offset: 0 },
      });
      setRecentOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const checkExpoToken = async () => {
    // await AsyncStorage.setItem("euid","");
    // logoutUser()
    // await AsyncStorage.setItem("expoToken", "");
    // Token logic (optional debug cleanup)
  };

  useEffect(() => {
    summaryDashboard();
    fetchOrders();
    checkExpoToken();
  }, []);

  const sendMessage = (to: string, message: string) => {
    if (euid && savedSocket) {
      savedSocket.emit("send_message", {
        to,
        from: euid,
        message,
      });
      console.log(`📤 Message sent from ${euid} to ${to}: ${message}`);
    }
  };

  const renderOrderItem = ({ item }: any) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfoContainer}>
        <View style={styles.orderTextContainer}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderAmount}>
            Total: {formatCurrency(item.amount)}
          </Text>
          <Text style={styles.orderInfo}>Status: {item.status}</Text>
          <Text style={styles.orderInfo}>Date: {item.movement}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <ASidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          title="Dashboard"
        />
        <FlatList
          data={recentOrders}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponent={
            <>
              <Text style={styles.header}>{currentMonthName}</Text>

              {/* Summary Cards */}
              <View style={styles.summaryContainer}>
                <View style={styles.card}>
                  <Ionicons name="cash-outline" size={28} color="#FF7043" />
                  <Text style={styles.cardValue}>{summaryData?.Revenue}</Text>
                  <Text style={styles.cardLabel}>Revenue</Text>
                </View>
                <View style={styles.card}>
                  <Ionicons name="receipt" size={28} color="#FF7043" />
                  <Text style={styles.cardValue}>{summaryData?.Orders}</Text>
                  <Text style={styles.cardLabel}>Orders</Text>
                </View>
                <View style={styles.card}>
                  <Ionicons name="people-outline" size={28} color="#FF7043" />
                  <Text style={styles.cardValue}>{summaryData?.Users}</Text>
                  <Text style={styles.cardLabel}>Users</Text>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    navigation.navigate("Settings");
                  }}
                >
                  <MaterialIcons name="add-business" size={20} color="#fff" />
                  <Text style={styles.actionText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    navigation.navigate("Orders");
                  }}
                >
                  <FontAwesome5 name="clipboard-list" size={18} color="#fff" />
                  <Text style={styles.actionText}>View Orders</Text>
                </TouchableOpacity>
              </View>

              {/* Recent Orders Title */}
              <Text style={styles.sectionTitle}>Recent Orders</Text>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: "#555",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#FF7043",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  orderInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTextContainer: {
    flex: 1,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderInfo: {
    fontSize: 12,
    color: "#555",
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
});
