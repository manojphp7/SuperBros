import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { AdminEuid, BaseUrl } from "../helpers/helpers";

type Props = {
  onSelect: (id: string) => void;
};

const Settings: React.FC<Props> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const fetchRestaurantStatus = async () => {
    try {
      const res = await axios.get(`${BaseUrl}user/restaurantStatus`, {
        params: {
          euid: AdminEuid,
        },
      });
      setIsOpen(res.data.status === "Open");
    } catch (error) {
      console.error("Failed to fetch status", error);
    }
  };

  const toggleRestaurantStatus = async () => {
    const newStatus = isOpen ? "Close" : "Open";
    setLoading(true);
    try {
      await axios.post(`${BaseUrl}user/restaurantStatus`, {
        euid: AdminEuid,
        newStatus: newStatus,
      });
      setIsOpen(!isOpen);
      Alert.alert("Success", `Restaurant is now ${newStatus}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurantStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Restaurant Status</Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.statusText}>{isOpen ? "Open" : "Closed"}</Text>
        <Switch
          value={isOpen}
          onValueChange={toggleRestaurantStatus}
          disabled={loading}
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={isOpen ? "#10d431" : "#f4f3f4"}
        />
      </View>

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" color="#FC8019" />
        </View>
      )}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  container: {
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
