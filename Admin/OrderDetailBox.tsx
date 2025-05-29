// components/OrderDetailBox.tsx
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
import {
  AdminEuid,
  BaseUrl,
  formatCurrency,
  orderStatus,
} from "../helpers/helpers";
import axios from "axios";
import * as Print from "expo-print";
import { PrintPreviewModal } from "./PrintPreviewModal";

import { useCart } from "../context/CartContext";
import { Picker } from "@react-native-picker/picker";

interface OrderDetailBoxProps {
  visible: boolean;
  order: any;
  onClose: () => void;
  onStatusUpdate: (orderId: number, newStatus: string) => void;
}

export const OrderDetailBox: React.FC<OrderDetailBoxProps> = ({
  visible,
  order,
  onClose,
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(order?.status);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [deliveryBoysLoading, setDeliveryBoysLoading] = useState(false);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDBoy, setSelectedDBoy] = useState(null);

  const { euid, savedSocket } = useCart();

  useEffect(() => {
    if (visible) {
      setLoading(false);
      setUpdatedStatus(order?.status);
      setPreviewVisible(false);
      setPreviewContent("");
    }
  }, [visible, order?.id]);

  useEffect(() => {
    if (order?.status === orderStatus.PREPARING) {
      fetchDeliveryBoys();
    }
  }, [order?.id]);

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

  const updateStatus = async (oid: number, euid: string, status: string) => {
    setLoading(true);
    try {
      const payload = {
        oid,
        euid,
        status,
        ...(selectedDBoy && status === orderStatus.DISPATCHED
          ? { deliveryBoy: selectedDBoy }
          : {}),
      };

      const response = await axios.post(
        `${BaseUrl}user/updateOrderStatus`,
        payload
      );

      setUpdatedStatus(status);
      onStatusUpdate(oid, status);
      sendNotification(euid, {
        for: "User",
        orderID: oid.toString(),
        status: status,
      });
      if (selectedDBoy && status === orderStatus.DISPATCHED) {
        sendNotification(selectedDBoy, {
          for: "DeliveryBoy",
          orderID: oid.toString(),
          status: status,
        });
      }

      if (status === orderStatus.PREPARING) {
        fetchDeliveryBoys();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update status.");
    }
    setLoading(false);
  };

  const shareLocationToWhatsApp = () => {
    let whatsappUrl = "";
    if (order.latlong) {
      const parsedLatLong = JSON.parse(order.latlong);
      const googleMapsUrl = `https://www.google.com/maps?q=${parsedLatLong.latitude},${parsedLatLong.longitude}`;
      const message = `Check out this location for Order # ${order.id}: ${googleMapsUrl}`;
      whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else if (order.address) {
      const message = `Check out this address for Order # ${order.id}: ${order.address}`;
      whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    }

    Linking.openURL(whatsappUrl).catch(() => {
      alert("Make sure WhatsApp is installed");
    });
  };

  const handlePrint = async () => {
    await Print.printAsync({
      html: `<pre>${previewContent}</pre>`, // Use the variable here
    });
  };

  const fetchDeliveryBoys = async () => {
    setDeliveryBoysLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}user/getUsers`, {
        params: {
          euid: AdminEuid,
          role: "deliveryBoy",
        },
      });
      setDeliveryBoys(response.data || []);
      setSelectedDBoy(response.data[0]["euid"]);
    } catch (error) {
      console.error("Failed to fetch users", error);
      Alert.alert("Error", "Unable to fetch delivery boys,Try Again");
    }
    setDeliveryBoysLoading(false);
  };

  const handlePrintPress = () => {
    const items = JSON.parse(order.description);

    let totalExtraPrice = 0;

    const itemLines = items
      .map((item: any, index: number) => {
        totalExtraPrice += item.extraPriceTotal || 0;
        const isVeg = item.isVeg ? "Veg" : "Non-Veg";
        const addons = item.adOnsNames?.length
          ? ` [Add-ons: ${item.adOnsNames.join(", ")}]`
          : "";

        return `${index + 1}. ${item.name} x${item.qty} (${isVeg})${addons}`;
      })
      .join("\n");

    const finalAmount = formatCurrency(order.amount || 0);

    const details = `
  Order Details
Customer Mobile: ${order?.mobile ?? "N/A"}
  
Order #${order?.id}
Items:
${itemLines}
  
Billed Amount: ${formatCurrency(totalExtraPrice)}
Discount: ${formatCurrency(totalExtraPrice - order.amount)}
Final Amount: ${finalAmount}
 `.trim();

    setPreviewContent(details);
    setPreviewVisible(true);
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
          <TouchableOpacity onPress={handlePrintPress}>
            <Icon
              name="print-outline"
              size={24}
              color="#FC8019"
              style={styles.printIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareLocationToWhatsApp}>
            <Icon
              name="share-social-outline"
              size={24}
              color="#7011a1"
              style={styles.printIcon}
            />
          </TouchableOpacity>
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
            {updatedStatus === "Awaiting" && (
              <>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: "#4CAF50", opacity: loading ? 0.6 : 1 },
                  ]}
                  disabled={loading}
                  onPress={() =>
                    Alert.alert("Confirm Approve", "Approve this order?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Approve",
                        onPress: () =>
                          updateStatus(order.id, order.euid, "Preparing"),
                      },
                    ])
                  }
                >
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: "#f44336", opacity: loading ? 0.6 : 1 },
                  ]}
                  disabled={loading}
                  onPress={() =>
                    Alert.alert("Confirm Decline", "Decline this order?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Decline",
                        onPress: () =>
                          updateStatus(order.id, order.euid, "Declined"),
                      },
                    ])
                  }
                >
                  <Text style={styles.actionButtonText}>Decline</Text>
                </TouchableOpacity>
              </>
            )}
            {updatedStatus === "Preparing" && (
              <View style={styles.verticalContainer}>
                {deliveryBoysLoading ? (
                  <ActivityIndicator color="#FC8019" size="small" />
                ) : (
                  <View
                    style={{
                      marginVertical: 10,
                      backgroundColor: "#fff",
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ marginBottom: 4 }}>
                      Assign Delivery Boy:
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 4,
                      }}
                    >
                      <Picker
                        selectedValue={selectedDBoy}
                        mode="dropdown"
                        onValueChange={(itemValue, itemIndex) =>
                          setSelectedDBoy(itemValue)
                        }
                        style={{ height: 50, width: "100%" }}
                      >
                        {deliveryBoys.map((obj: any) => (
                          <Picker.Item
                            label={obj.name}
                            value={obj.euid}
                            key={obj.euid}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.actionButtonFull,
                    { backgroundColor: "#4CAF50" },
                  ]}
                  onPress={() =>
                    Alert.alert("Confirm Dispatch", "Dispatch this order?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Dispatch",
                        onPress: () =>
                          updateStatus(order.id, order.euid, "Dispatched"),
                      },
                    ])
                  }
                >
                  <Text style={styles.actionButtonText}>Dispatch</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <PrintPreviewModal
          visible={previewVisible}
          content={previewContent}
          onPrint={handlePrint}
          onClose={() => setPreviewVisible(false)}
        />
      </View>
    </Modal>
  );
};

export default OrderDetailBox;

const styles = StyleSheet.create({
  verticalContainer: {
    width: "100%",
    marginTop: 10,
  },
  actionButtonFull: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  DBoyscontainer: {
    paddingHorizontal: 10,
  },
  DBoyslabel: {
    fontSize: 16,
    marginRight: 10,
    minWidth: 130,
  },
  picker: {
    flex: 1,
    height: 40,
  },

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
