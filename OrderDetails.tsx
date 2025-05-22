import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "./helpers/navigation";
import { formatCurrency, formatDate } from "./helpers/helpers";
import DispatchView from "./DispatchView";
import Header from "./Header";

type OrderDetailRouteProp = RouteProp<RootStackParamList, "OrderDetails">;

const OrderDetails = () => {
  const route = useRoute<OrderDetailRouteProp>();
  const { orderObj } = route.params;
  const [remainingTime, setRemainingTime] = useState<number>(22); 



  
  
  return (
    <SafeAreaView>
      <Header bgColor="#FC8019" />
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

        {JSON.parse(orderObj.description).map((prod: any, idx: number) => (
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
              ₹{prod.price ? parseFloat(prod.price).toFixed(2) : "0.00"}
            </Text>
          </View>
        ))}
      </View>
      <View>
        <View style={styles.etaContainer}>
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
                Hang tight, we’re cooking it with love.
              </Text>
            </View>
          )}

          {/* {orderObj.status === "Dispatch" && ( */}
          <DispatchView orderObj={orderObj} />
          {/* )} */}
          <Text style={styles.etaText}>Arriving in 22 mins</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  etaContainer: {
    backgroundColor: "#FFF5ED", // light orange tint
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
    color: "#0c864f", // a strong green for contrast
    marginTop: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  dispatchContainer: {
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  dispatchHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1976D2",
    marginBottom: 4,
  },
  dispatchAddressLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555",
    marginTop: 6,
  },
  dispatchAddress: {
    fontSize: 14,
    textAlign: "center",
    color: "#222",
    marginTop: 2,
  },

  deliveryGif: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  cookingGif: {
    width: 100,
    height: 100,
    marginBottom: 10,
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
