import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

const DispatchView = ({orderObj} :any ) => (
  <View style={styles.mapCard}>
    <ImageBackground
      source={require('./assets/dummyMap.png')}
      style={styles.mapBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('./assets/deliveryBoy.gif')}
          style={styles.deliveryGif}
        />
        <Text style={styles.dispatchHeading}>Your order is on the way!</Text>
        <Text style={styles.dispatchAddressLabel}>Delivering to:</Text>
        <Text style={styles.dispatchAddress}>{orderObj?.address}</Text>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  mapCard: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#ccc',
  },
  mapBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 12,
  },
  deliveryGif: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  dispatchHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  dispatchAddressLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },
  dispatchAddress: {
    fontSize: 14,
    textAlign: 'center',
    color: '#222',
    marginTop: 2,
  },
});

export default DispatchView;
