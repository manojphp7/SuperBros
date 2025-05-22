import React from "react";
import { Modal, View, ScrollView, Text, Button, StyleSheet } from "react-native";

export const PrintPreviewModal = ({ visible, onClose, content, onPrint }: any) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <ScrollView>
          <Text style={styles.printText}>{content}</Text>
        </ScrollView>
        <View style={styles.buttonContainer}>
         
          <View style={styles.buttonWrapper}>
            <Button title="Print" onPress={onPrint} color="#4CAF50" />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Close" onPress={onClose} color="#f44336" />
          </View>
        </View>
      </View>
    </View>
  </Modal>
);


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 20,
      },
      modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        maxHeight: "80%",
      },
      printText: {
        fontFamily: "monospace",
        fontSize: 14,
        color: "#333",
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      },
      buttonWrapper: {
        flex: 1,
        marginHorizontal: 5,
      },
});
