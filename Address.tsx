import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useCart } from "./context/CartContext";
import { BaseUrl } from "./helpers/helpers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { theme } from "./Main";

const Address = () => {
  const { euid } = useCart();
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Profile"
  >;
  const navigation = useNavigation<NavigationProp>();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${BaseUrl}user/addresses`, {
        params: { euid },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteAddress(id),
          style: "destructive",
        },
      ]
    );
  };

  const deleteAddress = async (id: number) => {
    try {
      await axios.delete(`${BaseUrl}user/delete-address`, {
        params: { id, euid },
      });

      // Update state after deletion
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (error) {
      console.error("Failed to delete address:", error);
      Alert.alert("Error", "Unable to delete address. Please try again.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.addressText}>{item.formatted}</Text>
        <TouchableOpacity onPress={() => confirmDelete(item.id)}>
          <Icon name="trash-outline" size={22} color="#FC8019" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
             <Icon name="chevron-back" size={22}color="#333" />
            </TouchableOpacity>
            <Text style={styles.heading}>Your Saved Addresses</Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#FC8019"
                style={{ marginTop: 20 }}
              />
            ) : addresses.length > 0 ? (
              <FlatList
                data={addresses}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <Text style={styles.emptyText}>No Address Found.</Text>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddressForm")}
            >
              <Text style={styles.addButtonText}>+ Add New Address</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    elevation: 2,
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressText: {
    fontSize: 15,
    color: "#444",
    flex: 1,
    paddingRight: 10,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: "#777",
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FC8019",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
