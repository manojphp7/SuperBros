import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "./helpers/navigation";

type Props = {
  visible: boolean;
  prevLocation: string;
  onClose: () => void;
};

const LocationBox = ({ visible, prevLocation, onClose }: Props) => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<NavigationProp>();
  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}></Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <Icon
                name="location-outline"
                size={30}
                color="#FC8019"
                style={styles.locationIcon}
              />
              <Text style={styles.locationLabel}>{prevLocation}</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("AddressForm")}
              style={styles.addAddressRow}
            >
              <Icon
                name="add-circle-outline"
                size={30}
                color="#FC8019"
                style={styles.locationIcon}
              />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  locationText: {
    fontSize: 14,
    color: "#ddd",
  },
  addAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  addAddressText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 250,
  },
});
export default LocationBox;
