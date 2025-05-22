import { useEffect, useState } from "react";
import { View, ActivityIndicator,Text } from "react-native";
// import * as SplashScreen from "expo-splash-screen";
import Main from "./Main";
import { CartProvider } from "./context/CartContext";

export default function App() {
  // const [appReady, setAppReady] = useState(false);

  // useEffect(() => {
  //   async function prepareApp() {
  //     try {
  //       // await SplashScreen.preventAutoHideAsync();
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       setAppReady(true);
  //       // await SplashScreen.hideAsync();
  //     }
  //   }

  //   prepareApp();
  // }, []);
  

  // if (!appReady) {
    // return (
    //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //     <ActivityIndicator size="large" color="#007bff" />
    //   </View>
    // );
  // }

  return  <CartProvider>
            <Main />
          </CartProvider>;
}