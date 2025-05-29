import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import axios from "axios";
import { AdminEuid, BaseUrl, SOCKET_URL, UserRoles } from "./helpers/helpers";
import { useCart } from "./context/CartContext";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

type MySocket = Socket<DefaultEventsMap, DefaultEventsMap>;

const EnterMobile = () => {
  const [mobile, setMobile] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { loginUser, handleSocket, setDeliveryAddressfn, setUserRoleFn } =
    useCart();
  const [initLoading, setInitLoading] = useState(true);

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();
  const countryCode = "+44";
  const countryFlag = "🇬🇧";

  const checkIfLoggedIn = async () => {
    try {
      const euid = await AsyncStorage.getItem("euid");
      const role = await AsyncStorage.getItem("role");
      const formatted = await AsyncStorage.getItem("formatted");
      if (euid && role) {
        loginUser(euid);
        setUserRoleFn(role);
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
        /******END SOCKET CODE************ */

        if (role === UserRoles.ADMIN) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" as never }],
          });
          return;
        }

        if (role === UserRoles.DELIVERY_BOY) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MyDeliveries" as never }],
          });
        } else {
          // const formatted = await AsyncStorage.getItem("formatted");
          if (formatted) {
            setDeliveryAddressfn(formatted);
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
      } else {
        setInitLoading(false);
      }
    } catch (err) {
      console.error("Auto-login failed", err);
    }
  };

  // const logout = async () =>{
  //   await AsyncStorage.setItem("euid","");
  //   await AsyncStorage.setItem("role","");
  //   await AsyncStorage.setItem("formatted","");
  // }
  useEffect(() => {
    // logout()
    checkIfLoggedIn();
    //createPusherConnection('9570dc6958fc6068e6922875da192208');
  }, []);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setIsSending(true);

    try {
      await AsyncStorage.setItem("user_phone_number", mobile);

      await axios.post(`${BaseUrl}user/saveOTP`, {
        mobile: mobile,
      });

      navigation.navigate("OtpVerification", { phone: mobile });
    } catch (error) {
      console.error("Failed to send OTP", error);
      Alert.alert("Error", "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    setMobile(digitsOnly);
  };

  return (
    <>
      {initLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF7043" />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.inputRow}>
              <Text style={styles.countryCode}>
                {countryFlag} {countryCode}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit number"
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={handleTextChange}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.button, isSending && { opacity: 0.5 }]}
                onPress={handleSendOtp}
                disabled={isSending}
              >
                {isSending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default EnterMobile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
