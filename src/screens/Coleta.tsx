import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ColetaScreenProps } from '../types/navigation';

export default function Coleta({ route, navigation }: ColetaScreenProps) {
  const { markers = [] } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Coleta🗑️</Text>
      </View>
      <View style={styles.content}>
        
        <View style={styles.markerList}>
          {markers.map(marker => (
            <View key={marker.key} style={styles.markerItem}>
              <Text style={styles.markerText}>Tipo: {marker.type}</Text>
              <Text style={styles.markerText}>Latitude: {marker.coordinate.latitude}</Text>
              <Text style={styles.markerText}>Longitude: {marker.coordinate.longitude}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
          <Text style={styles.footerText}>Home🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Coleta')} style={styles.footerButton}>
          <Text style={styles.footerText}>Coleta🗑️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Barcos')} style={styles.footerButton}>
          <Text style={styles.footerText}>Barco⛵</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011633',
  },
  headerContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#1c4e80',
    borderRadius: 25,
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingTop: 100, // Espaço adicional para o header
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  markerList: {
    backgroundColor: '#1c4e80',
    borderRadius: 10,
    padding: 10,
    width: '90%',
  },
  markerItem: {
    marginBottom: 10,
  },
  markerText: {
    color: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 9,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  footerButton: {
    padding: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#ffffff',
  },
});
