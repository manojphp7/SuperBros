import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "./Main";
import axios from "axios";
import { BaseUrl } from "./helpers/helpers";
import { useCart } from "./context/CartContext";

interface PageItem {
  title: string;
  icon: string;
  onPress: () => void;
}

const { width } = Dimensions.get("window");

const Profile = () => {
  const { euid } = useCart();
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Profile"
  >;
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${BaseUrl}user/profile`, {
          params: { euid },
        });
        const userData = response.data;
        setName(userData.name || "Guest");
        setMobile(userData.mobile || "N/A");
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setName("Guest");
        setMobile("N/A");
      } finally {
       setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const topPages: PageItem[] = [
    {
      title: "Home",
      icon: "home",
      onPress: () => navigation.navigate("Home"),
    },
    {
      title: "My Orders",
      icon: "shopping-bag",
      onPress: () => navigation.navigate("UserOrders"),
    },
    {
      title: "Address",
      icon: "map-pin",
      onPress: () => navigation.navigate("Address"),
    },
  ];

  const bottomPages: PageItem[] = [
    {
      title: "About Us",
      icon: "info",
      onPress: () => console.log("Navigate to About Us"),
    },
    {
      title: "Terms and Condition",
      icon: "file-text",
      onPress: () => navigation.navigate("TermAndCondition"),
    },
    {
      title: "Privacy Policy",
      icon: "shield",
      onPress: () => navigation.navigate("PrivacyPolicy"),
    },
    {
      title: "Logout",
      icon: "log-out",
      onPress: () => {
        Alert.alert(
          "Confirm Logout",
          "Are you sure you want to log out?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Logout",
              style: "destructive",
              onPress: () => navigation.navigate("Logout"),
            },
          ],
          { cancelable: true }
        );
      },
    },
  ];

  const renderItem = ({ item }: { item: PageItem }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={item.onPress}>
        <View style={styles.itemRow}>
          <Icon
            name={item.icon}
            size={20}
            color="#FC8019"
            style={styles.itemIcon}
          />
          <Text style={styles.itemText}>{item.title}</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#888" />
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );

  return (
    <>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            <View style={styles.header}>
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Icon name="chevron-left" size={28} color="#333" />
              </TouchableOpacity>

              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarAlt}>
                  <Text style={styles.avatarText}>
                    {loading ? "..." : name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {loading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#FC8019"
                      style={{ marginTop: 10 }}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.greeting}>Hi {name},</Text>
                    <Text style={styles.phone}>+44-{mobile}</Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.container}>
              <FlatList
                data={topPages}
                renderItem={renderItem}
                keyExtractor={(item) => item.title}
                scrollEnabled={false}
              />

              <View style={styles.sectionSpacing} />

              <FlatList
                data={bottomPages}
                renderItem={renderItem}
                keyExtractor={(item) => item.title}
                scrollEnabled={false}
              />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    width: width,
    height: 180,
    padding: 20,
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 10,
    zIndex: 10,
  },
  avatarContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  avatarAlt: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FC8019",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FC8019",
    marginTop: 10,
  },
  phone: {
    color: "#555",
    fontSize: 14,
    marginTop: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  item: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 35,
  },
  sectionSpacing: {
    height: 30,
  },
});
