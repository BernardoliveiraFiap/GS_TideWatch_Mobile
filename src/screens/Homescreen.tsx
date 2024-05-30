// src/screens/Homescreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Homescreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Homescreen;
