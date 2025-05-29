import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Expo version
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../helpers/navigation";
import { useCart } from "../context/CartContext";

type Props = {
  show: boolean;
};

const BlinkingNewOrderIcon: React.FC<Props> = ({ show }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  const {setNewAdminOrdersFn} = useCart();

  useEffect(() => {
    if (show) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      return () => animation.stop(); // Cleanup on unmount
    }
  }, [show]);

  if (!show) return null;

  return (
    <TouchableOpacity onPress={() =>{
      setNewAdminOrdersFn("");
      navigation.navigate("Orders")
    } }>
      <Animated.View style={{ opacity, marginRight: 15 }}>
        <FontAwesome name="bell" size={24} color="#ffffff" />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default BlinkingNewOrderIcon;
