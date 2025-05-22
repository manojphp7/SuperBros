import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
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
  } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      const euid = await AsyncStorage.getItem("euid");
      try {
        const response = await axios.get(`${BaseUrl}user/addresses`, {
          params: { euid },
        });
        let addressesData = response.data;
        if (Array.isArray(addressesData)) {
          if (userLocation?.formattedAddress) {
            addressesData = [
              ...addressesData,
              { formatted: userLocation.formattedAddress },
            ];
          }
          setAddresses(addressesData);
        }
        setIsLoadingAddresses(false);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

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
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.cartText}>Cart</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Icon name="person-circle-outline" size={32} color="#FC8019" />
            </TouchableOpacity>
          </View>

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

            {/* Address List with Add Button */}
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

              {/* <TouchableOpacity
                  onPress={() => navigation.navigate("AddressForm")}
                  style={styles.addressActionBtn}
                >
                  
                </TouchableOpacity> */}
              {/* OR Separator 
              <View style={styles.orWrapper}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.addressButtonsWrapper}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LocationPicker")}
                  style={styles.addressActionBtn}
                >
                  <Icon name="navigate-outline" size={18} color="#1ca672" />
                  <Text style={styles.addressActionText}>
                    Use Current Location
                  </Text>
                </TouchableOpacity>
              </View>

              {latLong && (
                <View>
                  <TextInput
                    style={[styles.flat]}
                    placeholder="Enter Flat/Building Number for your location"
                    value={flat}
                    onChangeText={(text) => handleFlat(text.trim())}
                  />
                </View>
              )}*/}
            </View>
          </ScrollView>

          {/* Proceed To Pay */}
          {!isLoadingAddresses && (
            <View style={styles.footer}>
              <ProceedToPay />
            </View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1ca672",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 5
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
