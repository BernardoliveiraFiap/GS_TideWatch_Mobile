import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>🔍</Text>
        </TouchableOpacity>
        <View style={styles.realTimeContainer}>
          <Text style={styles.realTimeText}>Real Time</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapCard}>
        <Text style={styles.mapText}>Mapa API</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Coleta')} style={styles.footerButton}>
          <Text style={styles.footerText}>Coleta</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Barcos')} style={styles.footerButton}>
          <Text style={styles.footerText}>Barcos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2748',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 30,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#1c4e80',
    borderRadius: 25,
  },
  icon: {
    fontSize: 20,
    color: '#ffffff',
  },
  realTimeContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#1c4e80',
    borderRadius: 25,
  },
  realTimeText: {
    fontSize: 20,
    color: '#ffffff',
  },
  mapCard: {
    flex: 1,
    margin: 20,
    backgroundColor: '#88c3fd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 70,
  },
  mapText: {
    fontSize: 20,
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: '#0a2748',
  },
  footerButton: {
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
