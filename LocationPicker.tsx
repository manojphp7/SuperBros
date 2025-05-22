import React, { useEffect, useState } from "react";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "./context/CartContext";

export default function LocationPicker() {
  const [pin, setPin] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { handleLatLong } = useCart();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setPin({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onMapPress = (e: MapPressEvent) => {
    setPin(e.nativeEvent.coordinate);
  };

  const handleConfirmLocation = () => {
    handleLatLong(pin);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={onMapPress}
      >
        <Marker coordinate={pin} draggable />
      </MapView>

      <View style={styles.confirmWrapper}>
        <TouchableOpacity onPress={handleConfirmLocation} style={styles.confirmBtn}>
          <Text style={styles.confirmText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: "#555",
    },
    confirmWrapper: {
      position: "absolute",
      bottom: 30,
      left: 20,
      right: 20,
    },
    confirmBtn: {
      backgroundColor: "#1ca672",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      elevation: 3,
    },
    confirmText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });
  