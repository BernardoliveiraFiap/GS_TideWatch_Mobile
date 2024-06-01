import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Coleta() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [boats, setBoats] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadBoats = async () => {
      try {
        const storedBoats = await AsyncStorage.getItem('boats');
        if (storedBoats) {
          setBoats(JSON.parse(storedBoats));
        }
      } catch (error) {
        console.error('Failed to load boats from storage', error);
      }
    };

    const loadMarkers = async () => {
      try {
        const storedMarkers = await AsyncStorage.getItem('markers');
        if (storedMarkers) {
          setMarkers(JSON.parse(storedMarkers));
        }
      } catch (error) {
        console.error('Failed to load markers from storage', error);
      }
    };

    if (isFocused) {
      loadBoats();
      loadMarkers();
    }
  }, [isFocused]);

  const countByType = (type) => {
    return markers.filter(marker => marker.type === type).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Coleta♻️</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Barcos em Operação: {boats.length}</Text>
        <Text style={styles.statsText}>Pontos de Lixo: {countByType('bottle')}</Text>
        <Text style={styles.statsText}>Helicópteros Monitorando: {countByType('helicopter')}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
          <Text style={styles.footerText}>Home🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Coleta')} style={styles.footerButton}>
          <Text style={styles.footerText}>Coleta♻️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Barcos')} style={styles.footerButton}>
          <Text style={styles.footerText}>Barcos⛵</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011633',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#1c4e80',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  statsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10,
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
