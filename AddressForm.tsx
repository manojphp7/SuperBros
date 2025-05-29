import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { theme } from "./Main";
import axios from "axios";
import { BaseUrl } from "./helpers/helpers";
import { useCart } from "./context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./helpers/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Postcode = { name: string };

const AddressForm = () => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();

  const { euid, setDeliveryAddressfn, deliveryAddress } = useCart();

  const [address, setAddress] = useState({
    flat: "",
    street: "",
    nearby: "",
    city: "London",
    postcode: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [postcodeError, setPostcodeError] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const [fetchPostCodes, setFetchPostCodes] = useState<Postcode[]>([]);
  const [flagFirstTime, setFlagFirstTime] = useState(false)

  const handleChange = (key: string, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));

    if (key === "postcode" && fetchPostCodes) {
      const isValid = fetchPostCodes.some(
        (p) => p.name.toLowerCase() === value.trim().toLowerCase()
      );
      if (!isValid) {
        setPostcodeError(`Delivery not possible on ${value.trim()} postcode`);
      } else {
        setPostcodeError("");
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors: { [key: string]: string } = {};

    Object.keys(address).forEach((key) => {
      if (!address[key as keyof typeof address].trim()) {
        newErrors[key] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || postcodeError) return;

    try {
      setLoading(true);

      const formatted = `${address.flat}, ${address.street}, ${address.nearby}, ${address.postcode}, ${address.city}`;

      const res = await axios.post(`${BaseUrl}user/address`, {
        euid,
        flat: address.flat,
        street: address.street,
        landmark: address.nearby,
        postcode: address.postcode,
        city: address.city,
        formatted,
      });

      if (res.data.result === "success") {
        await AsyncStorage.setItem("formatted", formatted);
        setIsSuccess("Address Saved Successfully");
        setDeliveryAddressfn(formatted);
        setAddress({
          flat: "",
          street: "",
          nearby: "",
          postcode: "",
          city: "London",
        });

        if(flagFirstTime){
          setFlagFirstTime(false)
           navigation.reset({
                index: 0,
                routes: [{ name: "Home" as never }],
              });
        }
      }
    } catch (err) {
      console.error("Error submitting address", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostCodesFn = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}user/fetchPostCodes`, {
        params: { euid },
      });
      setFetchPostCodes(response.data);
    } catch (err) {
      setErrors({ commonError: "Network Error, try again later" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!deliveryAddress){
      setFlagFirstTime(true)
    }
    fetchPostCodesFn();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={[]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <>{item}</>}
            ListHeaderComponent={
              <View style={styles.container}>
                {/* Back Button */}
                {deliveryAddress && (
                  <View style={styles.headerWrapper}>
                    <TouchableOpacity
                      onPress={() => {
                        if (navigation.canGoBack()) {
                          navigation.goBack();
                        } else {
                          // If there's no back history, navigate to the home screen
                          navigation.navigate('Home');
                        }
                      }}
                      style={styles.backButton}
                    >
                      <Icon name="chevron-back" size={22} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Add Address</Text>
                  </View>
                )}

                {isSuccess !== "" && (
                  <View style={styles.successMessage}>
                    <Text style={styles.successText}>{isSuccess}</Text>
                  </View>
                )}

                <Text style={styles.label}>Flat/Building/House No.</Text>
                <TextInput
                  style={[styles.input, errors.flat && styles.inputError]}
                  placeholder="Enter Flat/Building/House No."
                  value={address.flat}
                  onChangeText={(text) => handleChange("flat", text)}
                />
                {errors.flat && (
                  <Text style={styles.errorText}>{errors.flat}</Text>
                )}

                <Text style={styles.label}>Street</Text>
                <TextInput
                  style={[styles.input, errors.street && styles.inputError]}
                  placeholder="Enter Street"
                  value={address.street}
                  onChangeText={(text) => handleChange("street", text)}
                />
                {errors.street && (
                  <Text style={styles.errorText}>{errors.street}</Text>
                )}

                <Text style={styles.label}>Nearby Landmark</Text>
                <TextInput
                  style={[styles.input, errors.nearby && styles.inputError]}
                  placeholder="Enter Nearby Landmark"
                  value={address.nearby}
                  onChangeText={(text) => handleChange("nearby", text)}
                />
                {errors.nearby && (
                  <Text style={styles.errorText}>{errors.nearby}</Text>
                )}

                <Text style={styles.label}>Post Code</Text>
                <TextInput
                  style={[styles.input, errors.postcode && styles.inputError]}
                  placeholder="Enter Postcode"
                  value={address.postcode}
                  onChangeText={(text) => handleChange("postcode", text)}
                />
                {errors.postcode && (
                  <Text style={styles.errorText}>{errors.postcode}</Text>
                )}
                {postcodeError !== "" && (
                  <Text style={styles.errorText}>{postcodeError}</Text>
                )}

                <Text style={styles.label}>City</Text>
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  value={"London"}
                  editable={false}
                />
                {errors.commonError && (
                  <Text style={styles.errorText}>{errors.commonError}</Text>
                )}

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, loading && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Save</Text>
                        <Icon
                          name="checkmark-circle-outline"
                          size={18}
                          color="#fff"
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 0,
  },
  backButton: {
    marginRight: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  successMessage: {
    backgroundColor: "#1ca672",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  successText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    width: "100%",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff6347",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default AddressForm;
