import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "./Main";

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.header}>Privacy Policy</Text>

            {/* Scrollable Content */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
              <Text style={styles.paragraph}>
                We are committed to protecting your privacy. This Privacy Policy explains how your
                personal information is collected, used, and disclosed by our application.
              </Text>

              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.paragraph}>
                We collect information that you provide directly to us, such as when you create an
                account, update your profile, or communicate with us.
              </Text>

              <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.paragraph}>
                We use your information to provide, maintain, and improve our services. This includes
                processing transactions, sending notifications, and responding to inquiries.
              </Text>

              <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
              <Text style={styles.paragraph}>
                We do not share your personal information with third parties except as required by law
                or with your explicit consent.
              </Text>

              <Text style={styles.sectionTitle}>4. Security</Text>
              <Text style={styles.paragraph}>
                We take reasonable measures to help protect your personal information from loss, theft,
                misuse, and unauthorized access.
              </Text>

              <Text style={styles.sectionTitle}>5. Changes to This Policy</Text>
              <Text style={styles.paragraph}>
                We may change this Privacy Policy from time to time. If we make changes, we will
                notify you by updating the policy in the app and revising the date.
              </Text>

              <Text style={styles.sectionTitle}>6. Contact Us</Text>
              <Text style={styles.paragraph}>
                If you have any questions or concerns about this Privacy Policy, please contact our
                support team.
              </Text>
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  scroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
});

export default PrivacyPolicy;
