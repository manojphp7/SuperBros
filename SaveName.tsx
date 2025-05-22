import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BaseUrl } from "./helpers/helpers";
import { useCart } from "./context/CartContext";

type SaveNameProps = {
  onNameSaved?: () => void;
};

const SaveName = ({ onNameSaved }: SaveNameProps) => {
  const [name, setName] = useState("");
 const {handleUserName} = useCart()

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      Alert.alert("Validation", "Please enter your name.");
      return;
    }

    try {
      const euid = await AsyncStorage.getItem("euid");

      if (!euid) {
        Alert.alert("Error", "User ID is missing.");
        return;
      }

      // Save name locally
      await AsyncStorage.setItem("uName", trimmedName);
      handleUserName(trimmedName)

      // Send to server
      const response = await axios.post(
        `${BaseUrl}user/saveName`,
        {
          euid: euid,
          name: trimmedName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data === "success") {
        Alert.alert("Success", "Name saved successfully!");
        onNameSaved?.();
      } else {
        throw new Error("Server returned failure response.");
      }
    } catch (error: any) {
      console.error("Failed to save name:", error);
      Alert.alert("Error", "Failed to save your name. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome!</Text>
        <Text style={styles.label}>Please enter your name to continue:</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SaveName;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FC8019",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
