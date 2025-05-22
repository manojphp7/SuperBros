import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { theme } from "./Main";
import ShowProducts from "./ShowProducts";
import LightDivider from "./LightDivider";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "./helpers/helpers";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FloatingCartButton from "./FloatingCartButton";

type Item = {
  id: string;
  name: string;
  price: number;
  extraPrice: number;
  image: string;
  isVeg: number;
  isWithAdons: number;
};

export default function Category() {
  const route = useRoute();
  const navigation = useNavigation();
  const { catId } = route.params as { catId: string };
  const { catName } = route.params as { catName: string };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showSearch, setShowSearch] = useState(false); // Toggle search input

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}user/category`, {
          params: { catId, search: searchQuery },
        });
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    // Debounce API request: Wait for 3 seconds after typing
    const timer = setTimeout(() => {
      fetchProducts();
    }, 3000);

    return () => clearTimeout(timer); // Clear timeout on re-render
  }, [searchQuery]); // Fetch when searchQuery changes

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={[]} // optional vertical list data
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <>{item}</>}
              ListHeaderComponent={
                <>
                  <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>

                    {/* Show Search Input When Search Icon is Clicked */}
                    {showSearch ? (
                      <View style={styles.searchContainer}>
                        <Ionicons
                          name="search"
                          size={20}
                          color="gray"
                          style={styles.searchIcon}
                        />
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Search products..."
                          value={searchQuery}
                          onChangeText={(text) => setSearchQuery(text)}
                          autoFocus
                        />
                      </View>
                    ) : (
                      <Text style={styles.headerTitle}>{catName}</Text>
                    )}

                    {/* Show Search Icon When Not in Search Mode */}
                    {!showSearch && (
                      <TouchableOpacity onPress={() => setShowSearch(true)}>
                        <Ionicons name="search" size={24} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <LightDivider />
                  <ShowProducts products={products} loading={loading} />
                </>
              }
            />
            <FloatingCartButton />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
});
