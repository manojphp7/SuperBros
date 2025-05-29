import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { BaseUrl, AdminEuid } from "../helpers/helpers";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../helpers/navigation";
import AddDeliveryBoy from "./AddDeliveryBoy";
import { SafeAreaView } from "react-native-safe-area-context";
import ASidebar from "./ASidebar";

interface User {
  euid: string;
  name: string;
  mobile: string;
  role: string;
}

const DeliveryBoys = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const [deliveryBoys, setDeliveryBoys] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isShowAddUserMoal, setIsShowAddUserMoal] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsShowAddUserMoal(false);
  };

  const fetchDeliveryBoys = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}user/getUsers`, {
        params: {
          euid: AdminEuid,
          role: "deliveryBoy",
        },
      });
      setDeliveryBoys(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      Alert.alert("Error", "Unable to fetch delivery boys,Try Again");
    }
    setLoading(false);
  };

  const handleRemove = async (mobile: string) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this delivery boy?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const res = await axios.post(`${BaseUrl}user/setRole`, {
                euid: AdminEuid,
                mobile,
                role: "customer",
              });

              if (res.data?.message === "Role updated successfully") {
                setDeliveryBoys((prev) =>
                  prev.filter((item) => item.mobile !== mobile)
                );
              }
            } catch (error) {
              console.error(error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.mobile}>{item.mobile}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemove(item.mobile)}
        disabled={removingId === item.mobile}
      >
        <Text style={styles.removeBtnText}>
          {removingId === item.mobile ? "Removing..." : "Remove"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <ASidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          title="Delivery Boys"
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Delivery Boys</Text>
            <TouchableOpacity
              onPress={() => {
                setIsShowAddUserMoal(true);
              }}
            >
              <FontAwesome5 name="user-plus" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#FC8019" />
          ) : deliveryBoys.length === 0 ? (
            <Text>No delivery boys found</Text>
          ) : (
            <FlatList
              data={deliveryBoys}
              keyExtractor={(item) => item.euid}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

          <AddDeliveryBoy
            visible={isShowAddUserMoal}
            onClose={closeModal}
            afterAdd={(record) => {
              if (record) {
                setDeliveryBoys((prev) => {
                  const exists = prev.some((item) => item.euid === record.euid);
                  if (!exists) {
                    return [...prev, record];
                  }
                  return prev; // no change if already exists
                });
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryBoys;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  mobile: {
    fontSize: 14,
    color: "#555",
  },
  removeBtn: {
    backgroundColor: "#f44336",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
