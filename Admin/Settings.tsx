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
import { SafeAreaView } from "react-native-safe-area-context";
import ASidebar from "./ASidebar";

const Settings = () => {
  const [isOpenRestaurant, setIsOpenRestaurant] = useState<boolean>(true);
  const [isOpenCod, setIsOpenCod] = useState<boolean>(true);
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [codLoading, setCodLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const settings = async () => {
    try {
      const res = await axios.get(`${BaseUrl}user/settings`, {
        params: {
          euid: AdminEuid,
        },
      });

        setIsOpenRestaurant(res.data["restaurant"] === "Open");
        setIsOpenCod(res.data["cod"] === "Open");

    } catch (error) {
      console.error("Failed to fetch status", error);
    } finally {
      setRestaurantLoading(false);
      setCodLoading(false);
    }
  };

  const updateSettings = async (ki: string, value: boolean) => {
    const newStatus = value ? "Open" : "Close";

    if (ki === "cod") {
      setCodLoading(true);
    }

    if (ki === "restaurant") {
      setRestaurantLoading(true);
    }

    try {
      const response = await axios.post(`${BaseUrl}user/settings`, {
        euid: AdminEuid,
        ki: ki,
        value: newStatus,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
      console.error(error);
    } finally {
      if (ki === "cod") {
        setCodLoading(false);
        setIsOpenCod(value);
      }
      if (ki === "restaurant") {
        setIsOpenRestaurant(value);
        setRestaurantLoading(false);
      }
    }
  };

  useEffect(() => {
    settings();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <ASidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          title="Settings"
        />
        <View style={styles.container}>
          <View style={styles.toggleContainer}>
            <View style={styles.row}>
              <Text style={styles.statusText}>
                Restaurant is {isOpenRestaurant ? "Opened" : "Closed"}
              </Text>
              {restaurantLoading ? (
                <ActivityIndicator size="small" color="#FC8019" />
              ) : (
                <Switch
                  value={isOpenRestaurant}
                  onValueChange={() =>
                    updateSettings("restaurant", !isOpenRestaurant)
                  }
                  disabled={restaurantLoading}
                  trackColor={{ false: "#767577", true: "#767577" }}
                  thumbColor={isOpenRestaurant ? "#10d431" : "#f4f3f4"}
                />
              )}
            </View>
            <View style={styles.row}>
              <Text style={styles.statusText}>
                COD is {isOpenCod ? "Opened" : "Closed"}
              </Text>
              {codLoading ? (
                <ActivityIndicator size="small" color="#FC8019" />
              ) : (
                <Switch
                  value={isOpenCod}
                  onValueChange={() => updateSettings("cod", !isOpenCod)}
                  disabled={codLoading}
                  trackColor={{ false: "#767577", true: "#767577" }}
                  thumbColor={isOpenCod ? "#10d431" : "#f4f3f4"}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
    flexDirection: "column", // changed from "row"
    gap: 20, // optional spacing between rows
  },
  row: {
    flexDirection: "row", // lays out text and switch side by side
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
