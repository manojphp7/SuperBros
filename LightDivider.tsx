import React from 'react';
import { View, StyleSheet } from 'react-native';

const LightDivider = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: '#E6E6E6', // Very light gray
    width: '100%',
  },
});

export default LightDivider;