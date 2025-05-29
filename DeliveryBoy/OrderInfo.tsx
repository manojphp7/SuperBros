// components/OrderInfo.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { AdminEuid, BaseUrl, formatCurrency } from "../helpers/helpers";
import axios from "axios";
import * as Print from "expo-print";
import { useCart } from "../context/CartContext";

interface OrderInfoProps {
  visible: boolean;
  order: any;
  onClose: () => void;
  onStatusUpdate: (orderID: string) => void;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({
  visible,
  order,
  onClose,
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(order?.status);
  const [hasUpdatedStatus, setHasUpdatedStatus] = useState(false)

  const { euid, savedSocket } = useCart();

  useEffect(() => {
    if (visible) {
      setLoading(false);
      setUpdatedStatus(order?.status);
      setHasUpdatedStatus(false)
    }
  }, [visible, order?.id]);

  const sendNotification = async (to: string, message: any) => {

    if (AdminEuid && savedSocket) {
      savedSocket.emit("send_message", {
        to,
        from: AdminEuid,
        message,
      });
      console.log(`📤 Message sent from ${AdminEuid} to ${to}:`, message);
    }
  };

  const updateStatus = async (oid: string, euid: string, status: string) => {
    setLoading(true);
    try {
      await axios.post(`${BaseUrl}user/updateOrderStatus`, {
        oid,
        euid,
        status,
      });
      setUpdatedStatus(status);
      onStatusUpdate(oid);
      sendNotification(euid, {
        for: "User",
        orderID: oid.toString(),
        status: status,
      });
      setHasUpdatedStatus(true)
    } catch (err) {
      Alert.alert("Error", "Failed to update status.");
    }
    setLoading(false);
  };


  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={5}
      useNativeDriver
    >
      <View style={styles.modalContent}>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Text style={styles.closeIconText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.orderHeader}>
          <Text style={styles.modalTitle}>Order #{order?.id}</Text>
        </View>
        <Text style={styles.modalText}>
          Total: {formatCurrency(order?.amount)}
        </Text>
        <Text style={styles.modalText}>Status: {updatedStatus}</Text>
        <Text style={styles.modalText}>Date: {order?.movement}</Text>

        <Text style={[styles.modalTitle, { marginTop: 10 }]}>Items:</Text>

        {order?.description &&
          JSON.parse(order.description).map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.isVeg ? "🟢" : "🔴"} {item.name}
              </Text>
              <Text style={styles.itemText}>Qty: {item.qty}</Text>
              <Text style={styles.itemText}>
                Add-ons:{" "}
                {item.adOnsNames?.length ? item.adOnsNames.join(", ") : "None"}
              </Text>
              <Text style={styles.itemText}>
                Price: {formatCurrency(item.productFinalPrice)}
              </Text>
            </View>
          ))}

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color="#FC8019" size="large" />
          </View>
        ) : (
          <View style={styles.actionButtonsContainer}>
            {updatedStatus === "Dispatched" && (
              <>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: "#4CAF50", opacity: loading ? 0.6 : 1 },
                  ]}
                  disabled={loading}
                  onPress={() =>
                    Alert.alert("Confirm Delivered", "Delivered this order?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delivered",
                        onPress: () =>
                          updateStatus(order.id, order.euid, "Delivered"),
                      },
                    ])
                  }
                >
                  <Text style={styles.actionButtonText}>Delivered</Text>
                </TouchableOpacity>
              </>
            )}
            {hasUpdatedStatus && <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{color:"green"}}>Order Mark as Delivered Successfully</Text></View>}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default OrderInfo;

const styles = StyleSheet.create({
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  printIcon: {
    marginLeft: 8,
    marginTop: -5, // fine-tunes vertical alignment
    paddingLeft: 5,
    paddingRight: 5,
  },
  loaderContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  closeIconText: {
    fontSize: 18,
    color: "#333",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemRow: {
    marginTop: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 13,
    color: "#333",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 6,
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: "#FC8019",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "stretch",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
