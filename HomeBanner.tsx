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
import { Card, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
// import * as Location from "expo-location";
import { useCart } from "./context/CartContext";
import LocationBox from "./LocationBox";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import { useNavigation } from "@react-navigation/native";
import { formatAddress } from "./helpers/helpers";
import Header from "./Header";

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
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<NavigationProp>();

  const { handleLocation,userName } = useCart();

  const [showLocationBox, setShowLocationBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<locationType>();
  const [formattedLocation, setFormattedLocation] = useState<null | string>(null)
  

  // useEffect(() => {
    // (async () => {
    //   // 1. Ask for permission
    //   const { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== "granted") {
    //     setErrorMsg("Permission to access location was denied");
    //     return;
    //   }

    //   // 2. Get current location
    //   const loc = await Location.getCurrentPositionAsync({});
    //   const foundAddress = await Location.reverseGeocodeAsync({
    //     latitude: loc.coords.latitude,
    //     longitude: loc.coords.longitude,
    //   });
    //   const locationObj = foundAddress[0]
    //   let formattedObj = ''
      
    //   if(!locationObj.formattedAddress){
    //     formattedObj = formatAddress(locationObj);
    //   } else{
    //     formattedObj = locationObj.formattedAddress
    //   }

    //   handleLocation(formattedObj);
    //   setFormattedLocation(formattedObj);

      
  //   })();
  // }, []);

  return (
    <>
      <ImageBackground
        source={{ uri: "https://atozassignment.com/outsideFiles/banner5.jpg" }}
        style={{
          height: 250,
          position: "relative",
          paddingBottom: 80, // to prevent overlap with scroll content
          width: "100%",
        }}
        resizeMode="cover"
      >
        
{/* --- Row 1: Location & Profile Icon --- */}
        <Header bgColor=""/>

        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="Search for products..."
              placeholderTextColor="#ccc"
              style={styles.searchInput}
            />
            <Icon
              name="search"
              size={25}
              color="#FC8019"
              style={styles.searchIcon}
            />
          </View>
        </View>
      </ImageBackground>

      {/* <LocationBox
        visible={showLocationBox}
        prevLocation={
          userLocation?.formattedAddress ?? "Location couldn't be fetched"
        }
        onClose={() => setShowLocationBox(false)}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  name:{
    fontWeight:'bold',
    fontSize: 16,
    color:'#fff'
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
    flexDirection: "row",
    alignItems: "center",
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
