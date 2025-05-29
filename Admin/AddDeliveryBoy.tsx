import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { AdminEuid, BaseUrl } from "../helpers/helpers";
import Modal from "react-native-modal";

interface DeliveryBoxType {
  visible: boolean;
  onClose: () => void;
  afterAdd : (record:any)=>void
}

export const AddDeliveryBoy: React.FC<DeliveryBoxType> = ({
  visible,
  onClose,
  afterAdd
}) => {
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("deliveryBoy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      setSuccessMsg("");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${BaseUrl}user/setRole`, {
        euid: AdminEuid,
        mobile,
        role,
      });

      if (res.data?.message === "Role updated successfully") {
        setSuccessMsg(res.data.message);
        setMobile("");
        setRole("deliveryBoy");
        afterAdd(res.data?.record); // notify parent to refresh list
      } else {
        setError(res.data?.message || "Failed to update role");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to update user role");
    }

    setLoading(false);
  };

  const resetModal = () =>{
    setError("");
    setSuccessMsg("");
    onClose()
  }

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={resetModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver
    >
      <View style={styles.modalContent}>
        <TouchableOpacity onPress={resetModal} style={styles.closeIcon}>
          <Text style={styles.closeIconText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Add Delivery Boy</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
            if (error) setError("");
          }}
          placeholder="Enter mobile number"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Select Role</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Customer" value="customer" />
            <Picker.Item label="Delivery Boy" value="deliveryBoy" />
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FC8019" />
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: "#4CAF50", opacity: loading ? 0.6 : 1 },
            ]}
            disabled={loading}
            onPress={handleSubmit}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        )}

        {successMsg ? (
          <Text style={styles.successText}>{successMsg}</Text>
        ) : null}
      </View>
    </Modal>
  );
};

export default AddDeliveryBoy;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeIconText: {
    fontSize: 20,
    color: "#888",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
  },
  successText: {
    color: "green",
    fontSize: 13,
    marginTop: 15,
    textAlign: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 20,
    overflow: "hidden",
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
