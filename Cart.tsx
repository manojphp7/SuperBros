import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useCart } from "./context/CartContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./helpers/navigation";
import { theme } from "./Main";
import Icon from "react-native-vector-icons/Ionicons";
import ProductsSlider from "./ProductsSlider";
import ProceedToPay from "./ProceedToPay";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { BaseUrl } from "./helpers/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, StatusBar } from "react-native";
import Header from "./Header";
import { SafeAreaView } from "react-native-safe-area-context";

type PostsCodeChargeType = {
  name: string;
  price: string;
};

const Cart = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();
  const {
    userLocation,
    addItem,
    removeItem,
    cartItems,
    setDeliveryAddressfn,
    latLong,
    handleFlat,
    flat,
    deliveryAddress,
    euid,
  } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    deliveryAddress
  );
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [loadingPostCodeCharges, setLoadingPostCodeCharges] =
    useState<any>(null);
  const [postsCodeCharges, setPostsCodeCharges] = useState<any>(null);
  const [postCode, setPostCode] = useState<string | null>(null);
  const [postCodeCharge, setPostCodeCharge] = useState(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [extraPrice, setExtraPrice] = useState<number>(0);
  const [billedAmount, setBilledAmount] = useState<number | null>(null)
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('delivery');

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${BaseUrl}user/addresses`, {
        params: { euid },
      });
      let addressesData = response.data;
      if (Array.isArray(addressesData)) {
        // if (userLocation?.formattedAddress) {
        //   addressesData = [
        //     ...addressesData,
        //     { formatted: userLocation.formattedAddress },
        //   ];
        // }
        setAddresses(addressesData);
      }
      setIsLoadingAddresses(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const getPostCodeCharge = async () => {
    setLoadingPostCodeCharges(true);
    try {
      const response = await axios.get(`${BaseUrl}user/postCodeCharge`, {
        params: { euid },
      });
      setPostsCodeCharges(response.data);
    } catch (err) {
      console.error("FetchPostCode error");
    } finally {
      setLoadingPostCodeCharges(false);
    }
  };

  const extractPostCode = (address: string) => {
    const city = "London";

    const parts = address.split(",");
    const cityIndex = parts.findIndex(
      (part) => part.trim().toLowerCase() === city.toLowerCase()
    );

    let postCode = "";
    if (cityIndex > 0) {
      postCode = parts[cityIndex - 1].trim();
    }
    setPostCode(postCode);

    const match = postsCodeCharges.find(
      (item: PostsCodeChargeType) =>
        item.name.toUpperCase() === postCode.toUpperCase()
    );

    const price = match ? match.price : 0;

    setPostCodeCharge(Number(price));
  };



  const handleItem = (itemId: string, updatedQty: number) => {
    if (updatedQty < 1) {
      removeItem(itemId);
      return;
    }

    const cartItem = cartItems.find((item) => item.id === itemId);
    if (!cartItem) return;

    const unitPrice = cartItem.productFinalPrice / cartItem.qty;
    const newFinalPrice = unitPrice * updatedQty;

    const unitExtraPrice = cartItem.extraPriceTotal / cartItem.qty;
    const newExtraPrice = unitExtraPrice * updatedQty;

    const updatedItem = {
      ...cartItem,
      qty: updatedQty,
      extraPriceTotal: newExtraPrice,
      productFinalPrice: newFinalPrice,
    };

    addItem(updatedItem);
  };

  useEffect(() => {
    getPostCodeCharge();
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (postsCodeCharges) {
      extractPostCode(deliveryAddress);
    }
  }, [postsCodeCharges]);

  useEffect(() => {
    if(cartItems.length === 0) {
        setPostCodeCharge(0)
    }
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
    if(deliveryOption ==='pickup'){
      setBilledAmount(sum)
    }
    else{
      setBilledAmount(sum + postCodeCharge)
    }
   
   
  }, [cartItems, postCodeCharge,deliveryOption]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItemRow}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.rightSection}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => handleItem(item.id, item.qty - 1)}
            style={styles.qtyButton}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity
            onPress={() => handleItem(item.id, item.qty + 1)}
            style={styles.qtyButton}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceInfo}>
          {item.extraPriceTotal != null &&
            !isNaN(Number(item.extraPriceTotal)) && (
              <Text style={styles.extraPrice}>
                £{Number(item.extraPriceTotal).toFixed(2)}
              </Text>
            )}
          {item.productFinalPrice != null &&
            !isNaN(Number(item.productFinalPrice)) && (
              <Text style={styles.finalPrice}>
                £{Number(item.productFinalPrice).toFixed(2)}
              </Text>
            )}
        </View>
      </View>
    </View>
  );

  return (
    
      <SafeAreaProvider>
        <SafeAreaView  style={styles.safeArea} edges={['top']}>
          <PaperProvider theme={theme}>
          <Header title="Cart" isBack={true}/>

          {/* Scrollable Content */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Cart Items */}
            <View style={styles.cardContainer}>
              {cartItems.length > 0 ? (
                <FlatList
                  data={cartItems}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              ) : (
                <Text style={styles.emptyText}>Cart is empty</Text>
              )}
            </View>

            {/* Product Suggestions */}
            <View style={styles.cardContainer}>
              <ProductsSlider />
            </View>


            <View style={styles.cardContainer}>
              <View style={styles.deliveryOptionWrapper}>
               {['delivery', 'pickup'].map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.optionContainer}
          onPress={() => setDeliveryOption(option as 'pickup' | 'delivery')}
        >
          <View style={styles.radioCircle}>
            {deliveryOption === option && <View style={styles.selectedDot} />}
          </View>
          <Text style={styles.optionText}>
            {option === 'pickup' ? 'Pickup' : 'Delivery'}
          </Text>
        </TouchableOpacity>
      ))}
      </View>
            </View>
            {/* Address List with Add Button */}
            {deliveryOption ==='delivery' &&
            <View style={styles.cardContainer}>
              <Text style={styles.addressTitle}>Select Delivery Address</Text>
              {isLoadingAddresses ? (
                <View style={{ height: 100, paddingTop: 20 }}>
                  <ActivityIndicator size="small" color="#FC8019" />
                </View>
              ) : (
                addresses.map((addr) => (
                  <TouchableOpacity
                    key={addr.id || addr.formatted}
                    onPress={() => {
                      setDeliveryAddressfn(addr.formatted);
                      setSelectedAddress(addr.formatted);

                      const match = postsCodeCharges.find(
                        (item: PostsCodeChargeType) =>
                          item.name.toUpperCase() ===
                          addr.postcode.toUpperCase()
                      );

                      const price = match ? match.price : 0;

                      setPostCodeCharge(Number(price));
                    }}
                    style={styles.addressRow}
                  >
                    <View style={styles.radioCircle}>
                      {selectedAddress === addr.formatted && (
                        <View style={styles.selectedRb} />
                      )}
                    </View>
                    <View>
                      <Text
                        style={styles.addressDetails}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {addr.formatted}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
              <TouchableOpacity
                key={"enternewaddress"}
                onPress={() => navigation.navigate("AddressForm")}
                style={styles.addressRow}
              >
                <Icon name="add-circle-outline" size={18} color="#1ca672" />
                <View>
                  {/* <Icon name="add-circle-outline" size={18} color="#1ca672" /> */}
                  <Text style={styles.addressActionText}>
                    Add Another Address
                  </Text>
                </View>
              </TouchableOpacity>

             
            </View>
}
            <View style={styles.cardContainer}>
              <View style={styles.row}>
                <Text style={styles.label}>Gross Total:</Text>
                <Text style={styles.value}>
                  £{Number(extraPrice).toFixed(2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Discount:</Text>
                <Text style={styles.value}>
                  - £{(Number(extraPrice) - Number(totalPrice)).toFixed(2)}
                </Text>
              </View>
              {deliveryOption ==='delivery' &&
              <View style={styles.row}>
                <Text style={styles.label}>Delivery:</Text>
                <Text style={styles.value}>
                  £{Number(postCodeCharge).toFixed(2)}
                </Text>
              </View>
}
              <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalLabel}>Billed Amount:</Text>
                <Text style={styles.totalValue}>
                  £{billedAmount && (billedAmount).toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Proceed To Pay */}
          {!isLoadingAddresses && (cartItems.length > 0) && (
            <ProceedToPay billedAmount={billedAmount} deliveryOption={deliveryOption} deliveryCharges={postCodeCharge}/>
          )}
          </PaperProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    
  );
};

const styles = StyleSheet.create({
  deliveryOptionWrapper:{
 flexDirection: 'row',
  justifyContent: 'space-between', // or 'center' if you want them close together
  alignItems: 'center',
  padding: 10,
  gap: 20, // opti
  },
   selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
    optionText: {
    fontSize: 16,
    color: '#333',
  },
    optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proceedButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
    color: "#444",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#999",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
  },
  flat: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginTop: 10,
    backgroundColor: "#fff",
    color: "#333",
  },
  addressButtonsWrapper: {
    padding: 16,
  },

  addressActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },

  addressActionText: {
    marginLeft: 10,
    color: "#1ca672",
    fontSize: 16,
  },

  orWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontWeight: "bold",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
    paddingTop: 10,
    backgroundColor: "#fff",
  },

  cartButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  cartText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cartItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 5,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
    color: "#333",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  qtyButton: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1ca672",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
  priceInfo: {
    alignItems: "flex-end",
    width: 60,
  },
  extraPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 50 : 30,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
  },
  addressContainer: {
    flex: 1,
  },
  locationIcon: {
    marginRight: 6,
    marginTop: 15,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  footer: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1ca672",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1ca672",
  },
  addressDetails: {
    fontSize: 13,
    color: "#555",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "90%",
  },
  addAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#1ca672",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  addAddressText: {
    marginLeft: 6,
    color: "#1ca672",
    fontWeight: "600",
    fontSize: 13,
  },
  useLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#1ca672",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
});

export default Cart;
