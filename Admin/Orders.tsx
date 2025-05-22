// Orders.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  AdminEuid,
  adminMenuItems,
  BaseUrl,
  formatCurrency,
} from "../helpers/helpers";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../helpers/navigation";
import OrderDetailBox from "./OrderDetailBox";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const { width } = Dimensions.get("window");


interface OrdersProps {
  newOrderID?: string|null;
  afterAdded?:() => void
}

const Orders: React.FC<OrdersProps> = ({ newOrderID ,afterAdded }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  

  const navigation = useNavigation<NavigationProp>();
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);




  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}user/admin_orders`, {
        params: {
          euid: AdminEuid,
          limit,
          offset,
        },
      });
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [offset]);

  

  const handleNextPage = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const handlePreviousPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const addNewOrderToTop = async (newOrderID: string) => {
    setOrders((prevOrders) => {
      // Prevent duplicate
      if (prevOrders.some((order) => order.id === newOrderID)) {
        return prevOrders;
      }
      return prevOrders; // Temporary return — actual fetch is outside
    });
  
    try {
      const response = await axios.get(`${BaseUrl}user/admin_order_detail`, {
        params: {
          euid: AdminEuid,
          orderID: newOrderID,
        },
      });
  
      const newOrder = response.data;
  
      if (newOrder) {
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
        setTotal((prevTotal) => prevTotal + 1);
      }

      if(afterAdded){
        afterAdded()
      }
      
    } catch (error) {
      console.error("Failed to fetch new order:", error);
    }
  };


  useEffect(() => {
    if (newOrderID) {
      addNewOrderToTop(newOrderID);
    }
  }, [newOrderID]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#FC8019" />
      ) : (
        <>

          <FlatList
            data={orders}
            keyExtractor={(item: any) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => {
              const isAwaiting = item.status?.toLowerCase() === "awaiting";
              const CardWrapper = isAwaiting ? Animated.View : View;

              return (
                <CardWrapper
                  style={[
                    styles.orderCard,
                    isAwaiting && { opacity: blinkAnim },
                  ]}
                >
                  <View style={styles.orderInfoContainer}>
                    <View style={styles.orderTextContainer}>
                      <Text style={styles.orderId}>Order #{item.id}</Text>
                      <Text style={styles.orderAmount}>
                        Total: {formatCurrency(item.amount)}
                      </Text>
                      <Text style={styles.orderInfo}>
                        Status: {item.status}
                      </Text>
                      <Text style={styles.orderInfo}>
                        Date: {item.movement}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleViewDetails(item)}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </CardWrapper>
              );
            }}
          />

          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={handlePreviousPage}
              disabled={offset === 0}
              style={[styles.pageButton, offset === 0 && styles.disabledButton]}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>
              Showing {offset + 1} to {Math.min(offset + limit, total)} of{" "}
              {total}
            </Text>
            <TouchableOpacity
              onPress={handleNextPage}
              disabled={offset + limit >= total}
              style={[
                styles.pageButton,
                offset + limit >= total && styles.disabledButton,
              ]}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <OrderDetailBox
            visible={!!selectedOrder}
            order={selectedOrder}
            onClose={closeModal}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
      )}
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },

  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemRow: {
    marginTop: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 13,
    color: "#333",
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
  viewButton: {
    backgroundColor: "#FC8019",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  pageButton: {
    backgroundColor: "#FC8019",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageInfo: {
    fontSize: 16,
    color: "#333",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 6,
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: "#FC8019",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "stretch",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
