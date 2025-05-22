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

const TermAndCondition = () => {
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
            <Text style={styles.header}>Terms and Conditions</Text>

            {/* Content */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
              <Text style={styles.paragraph}>
                Welcome to our application. By accessing or using the app, you agree to be bound
                by these Terms and Conditions. Please read them carefully.
              </Text>

              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.paragraph}>
                By using this application, you agree to comply with and be legally bound by the
                terms of these Terms and Conditions, whether or not you become a registered user.
              </Text>

              <Text style={styles.sectionTitle}>2. Changes to Terms</Text>
              <Text style={styles.paragraph}>
                We reserve the right to update these terms at any time without prior notice. Your
                continued use of the app constitutes your acceptance of the new terms.
              </Text>

              <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
              <Text style={styles.paragraph}>
                You are responsible for maintaining the confidentiality of your account and
                password. You agree to accept responsibility for all activities that occur under
                your account.
              </Text>

              <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
              <Text style={styles.paragraph}>
                In no event shall we be liable for any direct, indirect, incidental, special, or
                consequential damages arising out of or in connection with the use of our services.
              </Text>

              <Text style={styles.sectionTitle}>5. Governing Law</Text>
              <Text style={styles.paragraph}>
                These Terms shall be governed and construed in accordance with the laws of your
                jurisdiction, without regard to its conflict of law provisions.
              </Text>

              <Text style={styles.paragraph}>
                If you have any questions about these Terms, please contact us.
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

export default TermAndCondition;
