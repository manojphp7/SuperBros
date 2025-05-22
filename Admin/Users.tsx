import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Users: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <Text>Manage your users here!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Users;
