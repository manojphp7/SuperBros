import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';


interface headingProps {
    title: string;
  }

const SectionHeading = ({ title }: headingProps) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
      { title }
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 10,
      paddingBottom: 8
    },
    heading: {
      fontWeight: 'semibold',
      color: '#555',
      fontFamily: 'sans-serif-light',
      fontSize:20,
      paddingLeft:5
    },
  });

export default SectionHeading