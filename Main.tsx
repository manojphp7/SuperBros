import React, { useEffect, useRef, useState } from "react";
import { View, Image, Text, Button } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Home from "./Home";
import Category from "./Category";
import Cart from "./Cart";
import AddressForm from "./AddressForm";
import Address from "./Address";
import EnterMobile from "./EnterMobile";
import OtpVerification from "./OtpVerification";
import { useCart } from "./context/CartContext";
import { RootStackParamList } from "./helpers/navigation";
import { AdminEuid, BaseUrl } from "./helpers/helpers";
import Profile from "./Profile";
import UserOrders from "./UserOrders";
import TermAndCondition from "./TermAndCondition";
import PrivacyPolicy from "./PrivacyPolicy";
import Logout from "./Logout";
import Dashboard from "./Admin/Dashboard";
import Orders from "./Admin/Orders";
import OrderDetails from "./OrderDetails";
import axios from "axios";
import MyDeliveries from "./DeliveryBoy/MyDeliveries";
import Delivered from "./DeliveryBoy/Delivered";

import Search from "./Search";
import DeliveryBoys from "./Admin/DeliveryBoys";
import Settings from "./Admin/Settings";

// Create a typed stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

type orderOnProcessType = {
  id: string;
  euid: string;
  description: string;
  amount: string;
  address: string;
  latlong: null;
  flat: string;
  movement: string;
  status: string;
};

const CustomHeaderLeft = () => (
  <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
    <Image
      source={{ uri: `${BaseUrl}assets/images/smallLogo1.png` }}
      style={{ width: 35, height: 35 }}
      resizeMode="contain"
    />
    <Text
      style={{
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
      }}
    >
      Welcome
    </Text>
  </View>
);

export default function Main() {
  const {
    euid,
    savedSocket,
    logoutUser,
    setNewAdminOrdersFn,
    orderOnProcess,
    setOrderOnProcessFn,
    orderOnProcessUpdateFn,
  } = useCart();

  const [updateContext, setUpdateContext] = useState<any>();

  // ✅ Socket hook
  useEffect(() => {
    if (!savedSocket) return;
    const handleReceiveMessage = ({
      from,
      message,
    }: {
      from: string;
      message: any;
    }) => {
      if (message.for === "User") {
        let obj = { orderID: message.orderID, status: message.status };
        if (message.orderID) {
          orderOnProcessUpdateFn({
            orderID: message.orderID,
            status: message.status,
          });
        }
      }
      else if (message.for === "Admin" && message.newOrderID) {
        setNewAdminOrdersFn(message.newOrderID);
      }


      console.log("📩 Message received:", from, message);
    };

    savedSocket.on("receive_message", handleReceiveMessage);

    return () => {
      savedSocket.off("receive_message", handleReceiveMessage);
    };
  }, [savedSocket, orderOnProcess]);

  const SignoutUser = async () => {
    await AsyncStorage.setItem("euid", "");
    logoutUser();
  };

  const fetchPendingUserOrder = async () => {
    if (euid && euid !== AdminEuid) {
      if (orderOnProcess === null) {
        try {
          const response = await axios.get(`${BaseUrl}user/userPendingOrder`, {
            params: { euid },
          });
          setOrderOnProcessFn(response.data);
        } catch (err: any) {
          console.error("Failed to fetch products:", err.message);
          if (err.response) {
            console.error("Server responded with status:", err.response.status);
            console.error("Response data:", err.response.data);
          } else if (err.request) {
            console.error("No response received:", err.request);
          } else {
            console.error("Error setting up request:", err.message);
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchPendingUserOrder();
  }, [euid]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="EnterMobile"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="EnterMobile"
            component={EnterMobile}
            options={{
              headerShown: true,
              headerTitle: "",
              headerLeft: () => <CustomHeaderLeft />,
            }}
          />
          <Stack.Screen
            name="OtpVerification"
            component={OtpVerification}
            options={{
              headerShown: true,
              headerTitle: "",
              headerLeft: () => <CustomHeaderLeft />,
            }}
          />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Category" component={Category} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Address" component={Address} />
          <Stack.Screen name="AddressForm" component={AddressForm} />
          <Stack.Screen name="UserOrders" component={UserOrders} />
          <Stack.Screen name="TermAndCondition" component={TermAndCondition} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="Logout" component={Logout} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="DeliveryBoys" component={DeliveryBoys} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="MyDeliveries" component={MyDeliveries} />
          <Stack.Screen name="Delivered" component={Delivered} />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Custom theme (if needed in future)
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

// Navigation Props Typing
export type NavigationProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
