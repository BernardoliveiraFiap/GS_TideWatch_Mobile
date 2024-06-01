import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialRegion = {
  latitude: -24.059582   ,
  longitude: -46.374337,
  latitudeDelta: 0.2,
  longitudeDelta: 0.0,
};

const helicopterInitialCoordinates = {
  latitude: -24.056687,
  longitude: -46.423978,
};

const recyclingCoordinates = {
  latitude: -24.057130,
  longitude: -46.400308,
};

const boatInitialCoordinates = [
  { latitude: -24.093037, longitude: -46.404071 },
  { latitude: -24.100129, longitude: -46.374939 },
  { latitude: -24.119629, longitude: -46.346778 },
];

export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const helicopterAngle = useRef(0);
  const boatAngles = useRef([0, Math.PI / 2, Math.PI]);

  const loadBoats = async () => {
    try {
      const storedBoats = await AsyncStorage.getItem('boats');
      if (storedBoats) {
        const boats = JSON.parse(storedBoats);
        const boatMarkers = boats.map((boat, index) => ({
          coordinate: boatInitialCoordinates[index] || recyclingCoordinates,
          key: boat.id,
          type: 'boat',
          task: boat.task,
          boatId: boat.boatId,
          date: boat.date,
        }));
        setMarkers(prevMarkers => [
          ...prevMarkers.filter(marker => marker.type !== 'boat'),
          ...boatMarkers,
        ]);
        boatAngles.current = boatMarkers.map((_, index) => boatAngles.current[index] || 0);
      }
    } catch (error) {
      console.error('Failed to load boats from storage', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadBoats();
    }
  }, [isFocused]);

  useEffect(() => {
    const moveVehicles = () => {
      helicopterAngle.current += Math.PI / 180;
      const helicopterRadius = 0.01;
      const newHelicopterLatitude = recyclingCoordinates.latitude + helicopterRadius * Math.cos(helicopterAngle.current);
      const newHelicopterLongitude = recyclingCoordinates.longitude + helicopterRadius * Math.sin(helicopterAngle.current);

      const updatedMarkers = markers.map((marker, index) => {
        if (marker.type === 'helicopter') {
          return {
            ...marker,
            coordinate: {
              latitude: isNaN(newHelicopterLatitude) ? marker.coordinate.latitude : newHelicopterLatitude,
              longitude: isNaN(newHelicopterLongitude) ? marker.coordinate.longitude : newHelicopterLongitude,
            }
          };
        } else if (marker.type === 'boat') {
          boatAngles.current[index % boatInitialCoordinates.length] += Math.PI / 180 * (index + 1);
          const boatRadius = 0.01;
          const initialCoord = boatInitialCoordinates[index % boatInitialCoordinates.length];
          const newBoatLatitude = initialCoord.latitude + boatRadius * Math.cos(boatAngles.current[index % boatInitialCoordinates.length]);
          const newBoatLongitude = initialCoord.longitude + boatRadius * Math.sin(boatAngles.current[index % boatInitialCoordinates.length]);

          return {
            ...marker,
            coordinate: {
              latitude: isNaN(newBoatLatitude) ? marker.coordinate.latitude : newBoatLatitude,
              longitude: isNaN(newBoatLongitude) ? marker.coordinate.longitude : newBoatLongitude,
            }
          };
        }
        return marker;
      });

      setMarkers(updatedMarkers);
    };

    const intervalId = setInterval(moveVehicles, 100);

    return () => clearInterval(intervalId);
  }, [markers]);

  useEffect(() => {
    // Initial setup of markers
    const initialMarkers = [
      {
        coordinate: recyclingCoordinates,
        key: 1,
        type: 'bottle'  // O marcador inicial é sempre o ícone de reciclagem
      },
      {
        coordinate: helicopterInitialCoordinates,
        key: 2,
        type: 'helicopter'  // Adicionar o helicóptero
      }
    ];
    setMarkers(initialMarkers);
  }, []);

  const handleLogout = () => {
    Alert.alert("Logged out", "You have been logged out.");
    setModalVisible(false);
    navigation.navigate('Login');
  };

  const renderMarkerEmoji = (type) => {
    if (type === 'bottle') {
      return '♻️';  // Emoji de reciclagem
    } else if (type === 'boat') {
      return '⛵';
    } else if (type === 'helicopter') {
      return '🚁';
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>🔍</Text>
        </TouchableOpacity>
        <View style={styles.realTimeContainer}>
          <Text style={styles.realTimeText}>Tempo Real</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapCard}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
            >
              <Text style={styles.markerEmoji}>{renderMarkerEmoji(marker.type)}</Text>
            </Marker>
          ))}
        </MapView>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
          <Text style={styles.footerText}>Home🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Coleta', { markers })} style={styles.footerButton}>
          <Text style={styles.footerText}>Coleta♻️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Barcos')} style={styles.footerButton}>
          <Text style={styles.footerText}>Barco⛵</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Você quer sair?</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={handleLogout}
            >
              <Text style={styles.textStyle}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011633',
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1c4e80',
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  realTimeText: {
    fontSize: 16,
    color: '#ffffff',
  },
  mapCard: {
    flex: 1,
    margin: 0,
    backgroundColor: '#88c3fd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    marginBottom: 70,
    marginTop: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerEmoji: {
    fontSize: 40,
  },
  helicopterEmoji: {
    fontSize: 38,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: '#011633',
  },
  footerButton: {
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
