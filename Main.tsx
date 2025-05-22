import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
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
import Home from "./Home";
import Category from "./Category";
import Cart from "./Cart";
import AddressForm from "./AddressForm";
import Address from "./Address";
import EnterMobile from "./EnterMobile";
import OtpVerification from "./OtpVerification";
import { useCart } from "./context/CartContext";
import { RootStackParamList } from "./helpers/navigation";
import { BaseUrl } from "./helpers/helpers";
import Profile from "./Profile";
import UserOrders from "./UserOrders";
import TermAndCondition from "./TermAndCondition";
import PrivacyPolicy from "./PrivacyPolicy";
import Logout from "./Logout";
import LocationPicker from "./LocationPicker";
import Dashboard from "./Admin/AdminScreen";
import Orders from "./Admin/Orders";
import AdminScreen from "./Admin/AdminScreen";
import Users from "./Admin/Users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderDetails from "./OrderDetails";


// Create a typed stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomHeaderLeft = () => (
  <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
    <Image
      source={{ uri: `${BaseUrl}assets/images/smallLogo1.png` }}
      style={{ width: 35, height: 35 }}
      resizeMode="contain"
    />
    <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold", color: "#333" }}>
      Welcome
    </Text>
  </View>
);

export default function Main() {
 const { euid, savedSocket,logoutUser } = useCart();
  
    // Socket hook
useEffect(() => {
  
  if (!savedSocket) return;
  console.log("savedSocket updated"+euid)
  const handleReceiveMessage = ({ from, message }: { from: string; message: string }) => {
    console.log("📩 Message received:", from, message);
  };

  savedSocket.on("receive_message", handleReceiveMessage);

  // return () => {
  //   savedSocket.off("receive_message", handleReceiveMessage);
  // };
}, [savedSocket]);


const SignoutUser = async () =>{
  await AsyncStorage.setItem("euid","");
  logoutUser()
}


useEffect(() => {
  SignoutUser();
}, [])



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
            <Stack.Screen name="LocationPicker" component={LocationPicker} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="AdminScreen" component={AdminScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="Users" component={Users} />
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
