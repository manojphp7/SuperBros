// SearchScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BaseUrl } from "./helpers/helpers";
import ShowProducts from "./ShowProducts";

const Search = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}user/search`, {
        params: { query: query },
      });
      setResults(response.data || []);
    } catch (err) {
      console.error("Search error", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <TextInput
          placeholder="Search for products..."
          placeholderTextColor="#ccc"
          style={styles.input}
          autoComplete="off" // Android
          textContentType="none" // iOS
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus
          onChangeText={(val) => setQuery(val)}
          value={query}
        />
      </View>

      <ShowProducts products={results} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    borderBottomWidth: 0,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  resultText: {
    fontSize: 16,
  },
  noResult: {
    marginTop: 20,
    textAlign: "center",
    color: "#999",
  },
});

export default Search;
