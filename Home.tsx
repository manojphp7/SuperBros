import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { theme } from "./Main";

import ShowProducts from "./ShowProducts";
import HomeBanner from "./HomeBanner";
import CategoriesSlider from "./CategoriesSlider";
import SectionHeading from "./SectionHeading";
import LightDivider from "./LightDivider";
import FloatingCartButton from "./FloatingCartButton";
import SaveName from "./SaveName";
import axios from "axios";
import { AdminEuid, BaseUrl } from "./helpers/helpers";
import { useCart } from "./context/CartContext";
import FloatingOrderBox from "./FloatingOrderBox";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./helpers/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Item = {
  id: string;
  name: string;
  price: number;
  extraPrice: number;
  image: string;
  isVeg: number;
  isWithAdons: number;
};


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Item[]>([]);
  const [showNameModal, setShowNameModal] = useState(false);
  

  const { euid, handleUserName, userName, savedSocket,logoutUser,deliveryAddress,orderOnProcess,setSettingsfn } = useCart();



  useEffect(() => {
    const checkUserName = async () => {
      if (userName === "") {
        const name = await AsyncStorage.getItem("uName");
        if (!name || name.trim() === "") {
          setShowNameModal(true);
        } else {
          handleUserName(name);
        }
      }
    };

    // const checkExpoToken = async () => {
    //   const existingToken = await AsyncStorage.getItem("expoToken");
    //   if (!existingToken || existingToken.trim() === "") {
    //     const expoToken = await registerForPushNotificationsAsync();
    //     if (expoToken) {
    //       AsyncStorage.setItem("expoToken", expoToken);
    //       axios.post(`${BaseUrl}user/saveExpoToken`, {
    //         euid: euid,
    //         expo_token: expoToken,
    //       });
    //     }
    //   }
    // };

      
      checkUserName();
      fetchProducts();
    
   
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BaseUrl}user/popularProducts`);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleNameSaved = async () => {
    const name = await AsyncStorage.getItem("uName");
    if (name && name.trim() !== "") {
      setShowNameModal(false);
    }
  };

  

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <>{item}</>}
            ListHeaderComponent={
              <>
                <HomeBanner />
                <CategoriesSlider />
                <SectionHeading title="Popular Products" />
                <LightDivider />
                <ShowProducts products={products} loading={loading} />
              </>
            }
          />
          
          {/* Name Modal */}
          <Modal
            visible={showNameModal}
            transparent
            animationType="slide"
            onRequestClose={() => {}}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <SaveName onNameSaved={handleNameSaved} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <FloatingCartButton />  
          
          <FloatingOrderBox />
      
          
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
});
