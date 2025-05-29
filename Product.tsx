import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useCart } from "./context/CartContext";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { BaseUrl } from "./helpers/helpers";
import axios from "axios";

type ProductItem = {
  id: string;
  name: string;
  price: number;
  extraPrice: number;
  image: string;
  isVeg: number;
  isWithAdons: number;
  adOns?: any;
};

type AdOnsType = {
  id: number;
  name: string;
  price: number;
  isVeg: boolean;
};

type Props = {
  visible: boolean;
  product: ProductItem;
  onClose: () => void;
};

const Product = ({ visible, product, onClose }: Props) => {
  const [selectedAdOnsIds, setSelectedAdOnsIds] = useState<number[]>([]);
  const [selectedAdOnsName, setSelectedAdOnsName] = useState<string[]>([]);
  const { cartItems, addItem, removeItem, clearCart } = useCart();
  const [priceWithAdons, setPriceWithAdons] = useState(product.price);
  const [extraPriceTotal, setExtraPriceTotal] = useState(product.extraPrice);
  const [qty, setQty] = useState(1);
  const [adOnsTotalPrice, setAdOnsTotalPrice] = useState(0);
  const { euid } = useCart();
  const [itemAdOns, setItemAdOns] = useState<AdOnsType[]>([]);
  const [adOnsLoading, setAdOnsLoading] = useState(true);

  useEffect(() => {
    setPriceWithAdons(product.price);
    setExtraPriceTotal(product.extraPrice);
    setSelectedAdOnsIds([]);
    setSelectedAdOnsName([]);
    setQty(1);
    setItemAdOns([]);
    setAdOnsLoading(true);
  }, [product.id]);

   const fetchAdons = async () => {
      try {
        const response = await axios.get(`${BaseUrl}user/addons`, {
          params: { euid, pid: product.id },
        });
        setItemAdOns(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
       setAdOnsLoading(false);
      }
    };

  useEffect(() => {
    fetchAdons();
  }, [product.id]);

  const calculatePrice = (selectedItemVar?: number[], quantity?: number) => {
    const qtyVar = quantity ?? qty;
    selectedItemVar = selectedItemVar ?? selectedAdOnsIds;

    let adOnsPrice =
      itemAdOns
        .filter((item) => selectedItemVar.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0) ?? 0;

    setAdOnsTotalPrice(adOnsPrice);

    setPriceWithAdons(
      (parseFloat(product.price.toString()) +
        parseFloat(adOnsPrice.toString())) *
        qtyVar
    );

    let adOnsExtraPrice =
      itemAdOns
        .filter((item) => selectedItemVar.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0) ?? 0;
    setExtraPriceTotal((parseFloat(product.extraPrice.toString()) +  parseFloat(adOnsExtraPrice.toString())) * qtyVar);
  };

  const toggleSelection = (id: number) => {
    let selectedItemVar: number[] = [];
    setSelectedAdOnsIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        selectedItemVar = prevSelected.filter((itemId) => itemId !== id); // Uncheck
        return selectedItemVar;
      } else {
        selectedItemVar = [...prevSelected, id];
        return selectedItemVar; // Check
      }
    });

    setSelectedAdOnsName(
      itemAdOns
        .filter((item) => selectedItemVar.includes(item.id))
        .map((item) => item.name)
    );

    calculatePrice(selectedItemVar);
  };

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      isVeg: product.isVeg,
      isWithAdons: product.isWithAdons,
      adOnsIDs: selectedAdOnsIds,
      adOnsNames: selectedAdOnsName,
      adOnsTotalPrice: adOnsTotalPrice,
      productFinalPrice: priceWithAdons,
      extraPriceTotal: extraPriceTotal,
      qty: qty,
    });
    onClose();
  };

  const handleAddItem = () => {
    const newQty = qty + 1;
    setQty(newQty);
    calculatePrice(undefined, newQty);
  };

  const handleMinusItem = () => {
    let newQty = qty > 1 ? qty - 1 : 1;
    setQty(newQty);
    calculatePrice(undefined, newQty);
  };

  const renderAdOns = ({ item }: { item: AdOnsType }) => {
    if (adOnsLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#FC8019"
          style={{ marginTop: 20 }}
        />
      );
    }

    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => toggleSelection(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.symbolAndName}>
          {item.isVeg ? (
            <View style={styles.vegSymbol}>
              <View style={styles.greenDot} />
            </View>
          ) : (
            <View style={styles.nonVegSymbol}>
              <View style={styles.redDot} />
            </View>
          )}
          <Text style={styles.itemText}>{item.name}</Text>
        </View>

        <View style={styles.rightContent}>
          <View style={styles.priceWrapper}>
            <Text style={styles.plus}>+</Text>
            <Text style={styles.superscript}>£</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>

          <View style={styles.checkbox}>
            {selectedAdOnsIds.includes(item.id) && (
              <Icon name="checkmark" size={16} color="green" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          {product?.image && (
            <Image source={{ uri: `${BaseUrl}assets/images/products/${product.image}` }} style={styles.itemImage} />
          )} 
          <Text style={styles.headerText}>
            {product?.name ?? "Product Details"}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {adOnsLoading ? (  
            <ActivityIndicator size="large" color="#FC8019" style={{ marginTop: 100 }} />
          ) : (
            <FlatList
              data={itemAdOns}
              renderItem={renderAdOns}
              keyExtractor={(item) => item.id.toString()}
              numColumns={1}
            />
          )}

 { !adOnsLoading && (
        <View
          style={[
            styles.bottomActionRow,
            adOnsLoading && { opacity: 0.5, pointerEvents: "none" }, // Disable interaction and reduce opacity when loading
          ]}
        >
          <View style={styles.quantityWrapper}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleMinusItem}
              disabled={adOnsLoading} // Disable the button if loading
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{qty}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleAddItem}
              disabled={adOnsLoading} // Disable the button if loading
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={addToCart}
            disabled={adOnsLoading} // Disable the button if loading
          >
            <Text style={styles.addToCartText}>
              Add Item | £{priceWithAdons}{" "}
              <Text style={styles.strikethrough}>£{extraPriceTotal}</Text>
            </Text>
          </TouchableOpacity>
        </View>
 )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  adOnItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 400,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  priceAndCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // or use marginLeft on checkbox if using older RN versions
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12, // for circular checkbox
    justifyContent: "center",
    alignItems: "center",
  },
  vegSymbol: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "green",
    borderRadius: 2, // Slight rounding (keep 0 for sharp box)
    justifyContent: "center",
    alignItems: "center",
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "green",
  },
  nonVegSymbol: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  symbolAndName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // if you're using React Native 0.71+, otherwise use margin
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  plus: {
    fontSize: 16,
    color: "#333",
    marginRight: 2,
  },
  superscript: {
    fontSize: 10,
    color: "#333",
    marginTop: 2, // Raise it above baseline
    marginRight: 1,
  },
  price: {
    fontSize: 16,
    color: "#333",
  },
  green: {
    color: "green",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // or use marginLeft if RN < 0.71
  },

  bottomActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  quantityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // if RN < 0.71 use marginHorizontal
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1ca672",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
    color: "#333",
  },
  addToCartBtn: {
    backgroundColor: "#1ca672",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#86dcbb",
    textDecorationStyle: "double", // or "double" for a more pronounced look
    fontWeight: "bold", // optional: makes the text stand out more
  },
});

export default Product;
