import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useCart } from "./context/CartContext";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { AdminEuid, AdminExpoToken, BaseUrl } from "./helpers/helpers";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import { useNavigation } from "@react-navigation/native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
const BACKEND_URL = `${BaseUrl}payment-sheet`;

type Props = {
  billedAmount: number | null;
  deliveryOption: string;
  deliveryCharges: number;
};

const ProceedToPay = ({
  billedAmount,
  deliveryOption,
  deliveryCharges,
}: Props) => {
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
    savedSocket,
    setOrderOnProcessFn,
    settings
  } = useCart();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isPaymentSheetReady, setIsPaymentSheetReady] = useState(false);

  const fetchPaymentSheetParams = async () => {
    if (billedAmount) {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: billedAmount * 100, // amount in cents ($12.99)
          customerID: euid,
        }),
      });
      return await response.json();
    }
  };

  const sendNotification = async (to: string, message: any) => {
    // await AsyncStorage.setItem("euid","");
    // logoutUser()
    if (euid && savedSocket) {
      savedSocket.emit("send_message", {
        to,
        from: euid,
        message,
      });
      console.log(`📤 Message sent from ${euid} to ${to}:`, message);
    }
  };

  const postCartData = async () => {
    if (isPlacingOrder) return;
    if (deliveryOption === "delivery") {
      if (deliveryAddress === "" || deliveryAddress === null) {
        console.error("deliveryAddress address is blank");
        return;
      }
    }

    try {
      setIsPlacingOrder(true);
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: "Super Bros",
      });

      if (!error) {
        setIsPaymentSheetReady(true);

        const { error } = await presentPaymentSheet();

        if (error) {
          console.error(error.message);
          Alert.alert("Payment Failed", error.message);
        } else {
          //Save Order in DB
          try {
            const payload = {
              euid: euid,
              description: cartItems,
              amount: billedAmount,
              address: deliveryAddress,
              deliveryCharges: deliveryCharges,
              deliveryOption: deliveryOption,
            };
            const response = await axios.post(
              `${BaseUrl}user/saveOrder`,
              payload,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.data["result"] === "success") {
              //   await sendPushNotification(AdminExpoToken,
              //     {
              //     refresh: "AdminOrders",
              //     OrderID: response.data["OrderID"],
              //     }
              // );

              clearCart();

              sendNotification(AdminEuid, {
                for: "Admin",
                newOrderID: response.data["OrderID"],
              });

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "OrderDetails",
                    params: { orderID: response.data["OrderID"] }, // Replace with actual orderID
                  },
                ],
              });
            }
          } catch (error) {
            console.error("Error sending cart data:", error);
            Alert.alert("Error", "Failed to send order. Please try again.");
          } finally {
            setIsPlacingOrder(false);
          }
        }
      } else {
        Alert.alert("Init Error", error.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0 && billedAmount === null) return null;

  return (
    <SafeAreaView edges={["bottom"]}>
      <StripeProvider
        publishableKey={settings?.stripe_ClientEnd_publish_key}
        {...(Platform.OS === "ios"
          ? { merchantIdentifier: "merchant.com.superbrostop.uk" }
          : undefined)}
      >

        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={[styles.button, isPlacingOrder && { opacity: 0.6 }]}
            onPress={postCartData}
            activeOpacity={0.8}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              <Text style={styles.buttonText}>Processing...</Text>
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Proceed</Text>
                <Icon
                  name="chevron-forward-outline"
                  size={18}
                  color="#fff"
                  style={styles.icon}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </StripeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1ca672",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 0, // No rounded corners if you want edge-to-edge
    width: "100%",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  icon: {
    marginLeft: 6,
  },
});

export default ProceedToPay;
