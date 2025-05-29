import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "./context/CartContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./helpers/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
type MySocket = Socket<DefaultEventsMap, DefaultEventsMap>;
import axios from "axios";
import { AdminEuid, BaseUrl, SOCKET_URL, UserRoles } from "./helpers/helpers";

type OtpRouteProp = RouteProp<RootStackParamList, "OtpVerification">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const route = useRoute<OtpRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const { loginUser, handleSocket, setDeliveryAddressfn,setUserRoleFn } = useCart();
  const mobile = route.params.phone;

  const handleVerify = async () => {
    if (otp.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BaseUrl}user/verifyOTP`, {
        mobile: mobile,
        otp: otp,
      });

      const data = response.data;
      const euid = data?.euid;
      const formatted = data?.formatted;
      const role = data?.role;

      if (euid) {
        await AsyncStorage.setItem("euid", euid); // save it permanently
        await AsyncStorage.setItem("role", role); // save it permanently
        
        loginUser(euid);
        setUserRoleFn(role)

        /******SOCKET CODE************ */

        const socket: MySocket = io(SOCKET_URL, {
          transports: ["websocket"], // Required for React Native
        });

        socket.on("connect", () => {
          console.log("✅ Connected to server");
        });

        if (socket) {
          socket.emit("register", euid);
          handleSocket(socket);
          console.log("📤 Registered user:", euid);
        }

        if (role === UserRoles.ADMIN) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" as never }],
          });
        } else {
          if (role === UserRoles.DELIVERY_BOY) {
            navigation.reset({
              index: 0,
              routes: [{ name: "MyDeliveries" as never }],
            });
          } else {
            if (formatted) {
              setDeliveryAddressfn(formatted);
              await AsyncStorage.setItem("formatted", formatted);
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" as never }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: "AddressForm" as never }],
              });
            }
          }
        }
      } else {
        Alert.alert("Incorrect OTP", "Invalid otp was entered.");
      }
    } catch (err) {
      console.error("Incorrect OTP");
      Alert.alert(
        "Verification Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Code sent to {mobile}</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Enter 4-digit OTP"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.6,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonWrapper: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FC8019",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
