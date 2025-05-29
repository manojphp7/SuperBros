import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { useCart } from "./context/CartContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import { useNavigation } from "@react-navigation/native";
import { AdminEuid, BaseUrl, formatAddress } from "./helpers/helpers";
import Header from "./Header";
import axios from "axios";

const { width } = Dimensions.get("window");

type locationType = {
  city: string | null;
  country: string | null;
  district: string | null;
  formattedAddress: string | null;
  isoCountryCode: string | null;
  name: string | null;
  postalCode: string | null;
  region: string | null;
  street: string | null;
  streetNumber: string | null;
  subregion: string | null;
  timezone: string | null;
};

const HomeBanner = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();

  const { userName, setSettingsfn } = useCart();

  const [restaurantStatusLoading, setRestaurantStatusLoading] = useState(true);

  const [restaurantStatus, setRestaurantStatus] = useState<string>("");

  const getSettings = async () => {
    try {
      setRestaurantStatusLoading(true);
      const response = await axios.get(`${BaseUrl}user/settings`, {
        params: {
          euid: AdminEuid,
        },
      });

      const restaurantStatus =   response?.data?.restaurant;

      if (restaurantStatus) {
        setRestaurantStatus(restaurantStatus);
      }
      setSettingsfn(response.data);
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setRestaurantStatusLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <>
      {restaurantStatusLoading ? null : restaurantStatus === "Open" ? (
        <ImageBackground
          source={{
            uri: "https://atozassignment.com/outsideFiles/banner5.jpg",
          }}
          style={{
            height: 250,
            position: "relative",
            paddingBottom: 80,
            width: "100%",
          }}
          resizeMode="cover"
        >
          {/* --- Row 1: Location & Profile Icon --- */}
          <Header isHome={true} />

          <View style={styles.searchRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Search")}
              activeOpacity={0.8}
            >
              <View style={styles.searchInputContainer}>
                <Text style={{ color: "#999", fontSize: 15 }}>
                  Search for products...
                </Text>
                <Icon
                  name="search"
                  size={25}
                  color="#FC8019"
                  style={styles.searchIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        <View
          style={{
            height: 250,
            position: "relative",
            paddingBottom: 80,
            width: "100%",
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#d32f2f", fontWeight: "bold", fontSize: 16 }}>
            Restaurant is Closed Now.
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  locationIcon: {
    marginRight: 6, // space between icon and text
  },
  bannerWrapper: {
    position: "relative",
    paddingBottom: 80, // to prevent overlap with the scroll content
    height: 780,
  },

  locationWrapper: {
    flex: 1,
    marginRight: 12, // Added space between location and profile icon
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationLabel: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6, // Keeps "Home" aligned with icon
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 26, // Align with location icon
    marginTop: 2,
    maxWidth: "90%", // Ensures text does not overflow
  },

  searchRow: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
  },

  searchInputContainer: {
    flexDirection: "row", // Horizontal layout
    alignItems: "center",
    justifyContent: "space-between", // Push icon to right
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },

  searchIcon: {
    marginLeft: 8,
    color: "#FC8019",
  },

  container: {
    height: 220,
  },
  imageWrapper: {
    width: width, // Full screen width
  },
  card: {
    flex: 1,
    borderRadius: 0, // Optional: if you want sharp corners
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default HomeBanner;
