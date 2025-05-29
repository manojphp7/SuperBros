import React, { useCallback, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Card, Text } from "react-native-paper";
import Product from "./Product";
import { BaseUrl } from "./helpers/helpers";
import { useCart } from "./context/CartContext";
import { useFocusEffect } from "@react-navigation/native";

type Item = {
  id: string;
  name: string;
  price: number;
  extraPrice: number;
  image: string;
  isVeg: number;
  isWithAdons: number;
};

const ShowProducts = ({
  products,
  loading,
}: {
  products: Item[];
  loading: boolean;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<undefined | Item>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { cartItems, addItem, removeItem, clearCart } = useCart();

  useFocusEffect(
  useCallback(() => {
    const updatedQuantities: { [key: string]: number } = {};
    cartItems.forEach((item) => {
      updatedQuantities[item.id] = item.qty;
    });
    setQuantities(updatedQuantities);
  }, [cartItems])
);

  const handleAddPress = (item: Item) => {
    if (item.isWithAdons === 1) {
      setSelectedItem(item);
      setIsModalVisible(true);
    } else {
      addToCart(item, 1);
    }
  };

  const addToCart = (product: any, change: number) => {
    let updated = { ...quantities };
    const newQty = (quantities[product.id] || 0) + change;
    if (newQty <= 0) {
      delete updated[product.id];
      removeItem(product.id);
    } else {
      updated = { ...quantities, [product.id]: newQty };
      addItem({
        id: product.id,
        name: product.name,
        image: product.image,
        isVeg: product.isVeg,
        isWithAdons: product.isWithAdons,
        productFinalPrice: product.price * updated[product.id],
        extraPriceTotal: product.extraPrice * updated[product.id],
        qty: updated[product.id],
      });
    }
    setQuantities({ ...updated });
  };

  const renderItem = ({ item }: { item: Item }) => {
   // const quantity = quantities[item.id] || 0;
const quantity = cartItems.find(ci => ci.id === item.id)?.qty || 0;
    return (
      <Card style={styles.card} key={item.id}>
        <View style={styles.row}>
          {/* Image */}
          <Card.Cover
            source={{ uri: `${BaseUrl}assets/images/products/${item.image}` }}
            style={styles.image}
          />

          {/* Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.priceTag}>£ {item.price}</Text>

            {/* Conditional Controls */}
            {quantity > 0 && item.isWithAdons === 0 ? (
              <View style={styles.quantityControls}>
                <Pressable
                  onPress={() => addToCart(item, -1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyText}>-</Text>
                </Pressable>
                <Text style={[styles.qtyText, { color: "#000" }]}>
                  {quantity}
                </Text>
                <Pressable
                  onPress={() => addToCart(item, 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                android_ripple={{ color: "#ffb27e" }}
                style={styles.plusButton}
                onPress={() => handleAddPress(item)}
              >
                <Text style={styles.plusButtonLabel}>+ ADD</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <>
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FC8019" />
        ) : error ? (
          <Text style={{ textAlign: "center", color: "red", padding: 10 }}>
            {error}
          </Text>
        ) : (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={1}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      {selectedItem && (
        <Product
          visible={isModalVisible}
          product={selectedItem}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 80,
  },
  list: {
    padding: 10,
  },
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "flex-start",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  priceTag: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  plusButton: {
    width: 100,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FC8019",
  },
  plusButtonLabel: {
    fontSize: 16,
    lineHeight: 20,
    color: "#fff",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    backgroundColor: "#FC8019",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  qtyText: {
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 8,
  },
});

export default ShowProducts;
