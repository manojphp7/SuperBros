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
import { AdminEuid, BaseUrl } from "./helpers/helpers";
import { useCart } from "./context/CartContext";
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const EnterMobile = () => {
  const [mobile, setMobile] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { loginUser } = useCart();


  
  

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();
  const countryCode = "+44";
  const countryFlag = "🇬🇧";
  
  
  const createPusherConnection = async (userId: string) => {
    const pusher = Pusher.getInstance();
  
    await pusher.init({
      apiKey: 'f6a5c679b19514b87892',
      cluster: 'us3',
      authEndpoint: '', // optional: for private channel auth
    });
  
    await pusher.connect();
  
    const channelName = `private-user-${userId}`; // personalize the channel
  
    await pusher.subscribe({
      channelName,
      onEvent: (event: PusherEvent) => {
        console.log('🔔 Event received:');
        console.log('Event name:', event.eventName);
        console.log('Data:', event.data);
      },
    });
  
    console.log(`✅ Subscribed to ${channelName}`);
  };
  




  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const euid = await AsyncStorage.getItem("euid");
        if (euid) {
          await loginUser(euid);

          if (euid === AdminEuid) {
            navigation.reset({
              index: 0,
              routes: [{ name: "AdminScreen" as never }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" as never }],
            });
          }
        }
      } catch (err) {
        console.error("Auto-login failed", err);
      }
    };

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
