import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { useCart } from "./context/CartContext";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { AdminExpoToken, BaseUrl } from "./helpers/helpers";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import { useNavigation } from "@react-navigation/native";
import { sendPushNotification } from "./helpers/PushNotification";
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
const BACKEND_URL = `${BaseUrl}payment-sheet`;


const ProceedToPay = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    cartItems,
    euid,
    deliveryAddress,
    setDeliveryAddressfn,
    clearCart,
    flat,
    latLong,
    handleFlat,
    handleLatLong,
  } = useCart();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [extraPrice, setExtraPrice] = useState<number>(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isPaymentSheetReady, setIsPaymentSheetReady] = useState(false);

  useEffect(() => {
    const sum = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.productFinalPrice.toString()),
      0
    );
    const extraPricesum = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.extraPriceTotal.toString()),
      0
    );
    setTotalPrice(sum);
    setExtraPrice(extraPricesum);
  }, [cartItems]);


  const fetchPaymentSheetParams = async () => {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1299, // amount in cents ($12.99)
        description: 'Order #1234 - Chicken Pizza + Coke',
      }),
    });
    return await response.json();
  };

  const postCartData = async () => {

    if (isPlacingOrder) return;
    if (deliveryAddress === "" || deliveryAddress === null) {
      if (latLong === "" || latLong === null) {
        Alert.alert("Kindly Choose the Delivery Address OR current Location");
        return false;
      } else {
        if (flat.trim() === "") {
          Alert.alert("Kindly Enter flat/building number");
          return false;
        }
      }
    }

    if (deliveryAddress === "" && latLong != "" && flat === "") {
      Alert.alert("Kindly Enter Flat/Building Number for your location");
      return false;
    }
    
    

    

        try {
          setIsPlacingOrder(true);
          const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
    
          const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            merchantDisplayName: 'My Restaurant',
          });
    
          if (!error) {
            setIsPaymentSheetReady(true);

            const { error } = await presentPaymentSheet();
      
            if (error) {
              console.log(error.message)
              Alert.alert('Payment Failed', error.message);
            } else {
              //Save Order in DB
              try {
                console.log("saving order in DB")
                const payload = {
                  euid: euid,
                  description: cartItems,
                  address: deliveryAddress,
                  latlong: latLong,
                  flat: flat,
                };
                const response = await axios.post(`${BaseUrl}user/saveOrder`, payload, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                if (response.data["result"] === "success") {
                  await sendPushNotification(AdminExpoToken, 
                    {
                    refresh: "AdminOrders",
                    OrderID: response.data["OrderID"],
                    }
                );
          
                  clearCart();
                 // setDeliveryAddressfn("");
                  handleLatLong("");
                  handleFlat("");
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "UserOrders" }],
                  });
                  console.log("Server response:", response.data);
                }
              } catch (error) {
                console.error("Error sending cart data:", error);
                Alert.alert("Error", "Failed to send order. Please try again.");
              } finally {
                setIsPlacingOrder(false);
              }


             
            }
          }
          else {
            Alert.alert('Init Error', error.message);
          }
        } catch (err: any) {
          Alert.alert('Error', err.message);
        } finally {
          setIsPlacingOrder(false);
        }
  
  };

  if (cartItems.length === 0) return null;

  return (
    <SafeAreaView>
    <StripeProvider publishableKey="pk_test_51RJTF8FYrOp9R5qcj8swJXT03wt9WDKVYESMKCJ6B8ecqbeACd5HAio639fIXYJCVGdYv66TKoqTXLVNnb8hdWkM00hCdOGTyc"
    {...(Platform.OS === 'ios' ? { merchantIdentifier: 'merchant.com.superbrostop.uk' } : undefined)}
    >
    <View style={styles.container}>
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.pricelabel}>Total:</Text>
          <Text style={styles.priceText}>
            £{totalPrice > 0 ? totalPrice.toFixed(2) : "0.00"}
          </Text>
        </View>

        <View style={styles.extraPriceRow}>
          <Text style={styles.extraPriceLabel}>
            You saved £
            {extraPrice - totalPrice > 0
              ? (extraPrice - totalPrice).toFixed(2)
              : "0.00"}{" "}
            on it
          </Text>
          <Text style={styles.extraPrice}>
            £{extraPrice ? extraPrice.toFixed(2) : "0.00"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isPlacingOrder && { opacity: 0.6 }]}
        onPress={postCartData}
        activeOpacity={0.8}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? (
          <Text style={styles.buttonText}>Processing...</Text>
        ) : (
          <>
            <Text style={styles.buttonText}>Proceed</Text>
            <Icon
              name="chevron-forward-outline"
              size={18}
              color="#fff"
              style={styles.icon}
            />
          </>
        )}
      </TouchableOpacity>
    </View>
    </StripeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 4,
  },
  priceSection: {
    flexDirection: "column",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  pricelabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 6,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1ca672",
  },
  extraPriceLabel: {
    fontSize: 13,
    color: "#1ca672",
    marginRight: 8,
  },
  extraPrice: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#1ca672",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginRight: 8,
  },
  icon: {
    marginLeft: 0,
  },
});

export default ProceedToPay;
