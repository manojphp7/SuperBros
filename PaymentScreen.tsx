import React from 'react';
import { View, Button, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

export default function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    const response = await fetch('https://restaurants.atozassignment.com/payment-sheet', {
      method: 'POST',
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    console.log("Hello initializePaymentSheet")
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'My Awesome Store', // ✅ required field
    });

    if (!error) {
      openPaymentSheet();
    } else {
      Alert.alert('Error', error.message);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error`, error.message);
    } else {
      Alert.alert('Success', 'Your payment is confirmed!');
    }
  };

  return (
    <View>
      <Button title="Checkout" onPress={initializePaymentSheet} />
    </View>
  );
}
