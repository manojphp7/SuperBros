import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RootStackParamList } from "./helpers/navigation";
import { BaseUrl, formatCurrency, formatDate } from "./helpers/helpers";
import DispatchView from "./DispatchView";
import Header from "./Header";
import { useCart } from "./context/CartContext";
import axios from "axios";

type orderObjType = {
  address: string;
  amount: string;
  deliveryBoy: string;
  deliveryCharges: string;
  deliveryOption: string;
  description: string;
  euid: string;
  id: string;
  movement: string;
  status: string;
};

const OrderDetails = () => {
  const route = useRoute();
  const { orderID } = route.params as { orderID: string };
  const [orderObj, setOrderObj] = useState<orderObjType | null>(null);
  const [loading, setLoading] = useState(true);
  const { getRemainingTime, euid, orderOnProcess, setOrderOnProcessFn } =
    useCart();

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${BaseUrl}user/getOrderDetail`, {
        params: {
          euid,
          orderID,
        },
      });


      if (response.data["id"] !== "") {
        setOrderObj(response.data);

        if (response.data["status"] === "Awaiting") {
          if (orderOnProcess) {
            const exists = orderOnProcess.some((order) => order.id === orderID);
            if (!exists) {
              setOrderOnProcessFn([response.data]);
            } else {
              setOrderOnProcessFn([...orderOnProcess, response.data]);
            }
          }
        }
      } else {
        Alert.alert("Order not found.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || // Axios-style error
        err?.message || // Generic JS error
        JSON.stringify(err); // Fallback to full error object
      console.error("catch error " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderOnProcess) {
      const foundOrder = orderOnProcess.find((order) => order.id === orderID);
      if (foundOrder) {
        setOrderObj(foundOrder);
        setLoading(false);
      } else {
        fetchOrder();
      }
    }
  }, [orderOnProcess, orderID]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header isBack={true} bgColor="#FC8019" />
      {loading || !orderObj ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FC8019" />
          <Text style={{ marginTop: 10, color: "#555" }}>
            Loading order details...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.orderCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.orderId}>Order #{orderObj.id}</Text>
              <View style={styles.statusContainer}>
                <Text
                  style={[
                    styles.statusText,
                    orderObj.status === "Cancelled" && styles.statusCancelled,
                  ]}
                >
                  {orderObj.status}
                </Text>
              </View>
            </View>

            <Text style={styles.dateText}>{formatDate(orderObj.movement)}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Paid:</Text>
              <Text style={styles.priceValue}>
                {formatCurrency(parseFloat(orderObj.amount))}
              </Text>
            </View>

            <View style={styles.dashedDivider} />

            <Text style={styles.itemsTitle}>Items Ordered:</Text>

            {Array.isArray(JSON.parse(orderObj.description)) ? (
              JSON.parse(orderObj.description).map((prod: any, idx: number) => (
                <View key={idx} style={styles.itemRowCustom}>
                  {prod.isVeg ? (
                    <View style={styles.vegSymbol}>
                      <View style={styles.greenDot} />
                    </View>
                  ) : (
                    <View style={styles.nonVegSymbol}>
                      <View style={styles.redDot} />
                    </View>
                  )}

                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.itemName}>{prod.name}</Text>
                    {prod.adOnsNames?.length > 0 && (
                      <Text style={styles.addonText}>
                        Add-ons: {prod.adOnsNames.join(", ")}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.itemPrice}>
                    {formatCurrency(prod.productFinalPrice)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "red" }}>Invalid order item format</Text>
            )}
            {orderObj.deliveryOption === "delivery" && (
              <View style={styles.itemRowCustom}>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.itemName}>Delivery Charge</Text>
                </View>

                <Text style={styles.itemPrice}>
                  {formatCurrency(orderObj.deliveryCharges)}
                </Text>
              </View>
            )}
          </View>

          <View>
            <View style={styles.etaContainer}>
              {orderObj.status === "Awaiting" && (
                <View style={styles.preparingCard}>
                  <Image
                    source={require("./assets/awaiting.gif")}
                    style={styles.preparingGif}
                  />
                  <Text style={styles.preparingText}>
                    Pinning your address... Almost there!
                  </Text>
                </View>
              )}
              {orderObj.status === "Preparing" && (
                <View style={styles.preparingCard}>
                  <Image
                    source={require("./assets/cooking-boiling.gif")}
                    style={styles.preparingGif}
                  />
                  <Text style={styles.preparingText}>
                    Your food is being freshly prepared!
                  </Text>
                  <Text style={styles.preparingSubtext}>
                    Hang tight, we're cooking it with love.
                  </Text>
                </View>
              )}
              {orderObj.status === "Dispatched" && (
                <DispatchView orderOnProcess={orderOnProcess} />
              )}

              <Text style={styles.etaText}>
                Arriving Soon...
              </Text>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  etaContainer: {
    backgroundColor: "#FFF5ED",
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  preparingCard: {
    alignItems: "center",
    marginBottom: 12,
  },
  preparingGif: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  preparingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FC8019",
    marginTop: 8,
  },
  preparingSubtext: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  etaText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0c864f",
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  orderCard: {
    marginBottom: 25,
    padding: 16,
    borderRadius: 12,
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
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: "#666",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FC8019",
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    marginVertical: 12,
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  itemRowCustom: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },
  addonText: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  vegSymbol: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
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
    marginTop: 4,
  },
  redDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "red",
  },
});
