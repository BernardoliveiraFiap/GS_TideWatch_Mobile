import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Animated, Easing } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { db, auth } from './../services/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

const initialRegion = {
  latitude: -24.059582,
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

const BoatInfoCard = ({ boat, onClose }) => (
  <View style={styles.boatInfoCard}>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Text style={styles.closeButtonText}>X</Text>
    </TouchableOpacity>
    <Text style={styles.boatInfoText}>ID do Barco: {boat.boatId}</Text>
    <Text style={styles.boatInfoText}>Tarefa: {boat.task}</Text>
    <Text style={styles.boatInfoText}>Operando desde: {boat.date}</Text>
  </View>
);

export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [legendVisible, setLegendVisible] = useState(false);
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [boatInfoVisible, setBoatInfoVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const popupAnimation = useRef(new Animated.Value(500)).current; // Initial value for Y-axis translation
  const legendAnimation = useRef(new Animated.Value(0)).current; // Initial value for X-axis translation
  const helicopterAngle = useRef(0);
  const boatAngles = useRef([0, Math.PI / 2, Math.PI]);

  useEffect(() => {
    if (isFocused) {
      const unsubscribe = onSnapshot(collection(db, 'boats'), (snapshot) => {
        const boats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      });
      return () => unsubscribe();
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

      if (selectedBoat) {
        const updatedSelectedBoat = updatedMarkers.find(marker => marker.key === selectedBoat.key);
        if (updatedSelectedBoat) {
          setSelectedBoat(updatedSelectedBoat);
        }
      }
    };

    const intervalId = setInterval(moveVehicles, 100);

    return () => clearInterval(intervalId);
  }, [markers, selectedBoat]);

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
    Alert.alert("Logged out", "Você saiu! faça login novamente quando quiser.");
    setModalVisible(false);
    navigation.navigate('Login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você realmente deseja excluir sua conta?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: () => {
            const user = auth.currentUser;
            if (user) {
              deleteUser(user).then(() => {
                Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");
                setModalVisible(false);
                navigation.navigate('Login');
              }).catch(error => {
                console.error('Failed to delete user account', error);
                Alert.alert("Erro", "Não foi possível excluir a conta.");
              });
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleOpenPopup = () => {
    setPopupVisible(true);
    Animated.timing(popupAnimation, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleClosePopup = () => {
    Animated.timing(popupAnimation, {
      toValue: -500,
      duration: 500,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setPopupVisible(false);
      popupAnimation.setValue(500); // Reset the animation value for the next time the popup opens
    });
  };

  const toggleLegend = () => {
    setLegendVisible(!legendVisible);
    Animated.timing(legendAnimation, {
      toValue: legendVisible ? 0 : -150,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
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

  const handleBoatPress = (boat) => {
    setSelectedBoat(boat);
    setBoatInfoVisible(true);
  };

  const closeBoatInfo = () => {
    setBoatInfoVisible(false);
    setSelectedBoat(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleOpenPopup}>
          <Text style={styles.icon}>🗺️</Text>
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
              onPress={() => marker.type === 'boat' && handleBoatPress(marker)}
            >
              <Text style={styles.markerEmoji}>{renderMarkerEmoji(marker.type)}</Text>
            </Marker>
          ))}
        </MapView>
        {selectedBoat && boatInfoVisible && (
          <BoatInfoCard boat={selectedBoat} onClose={closeBoatInfo} />
        )}
        <Animated.View style={[styles.legendContainer, { transform: [{ translateX: legendAnimation }] }]}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleLegend}>
            <Text style={styles.toggleButtonText}>{legendVisible ? '>' : '<'}</Text>
          </TouchableOpacity>
          {legendVisible && (
            <View style={styles.legendContent}>
              <Text style={styles.legendText}>♻️ Lixo marinho</Text>
              <Text style={styles.legendText}>⛵ Barco automatizado que coleta o lixo</Text>
              <Text style={styles.legendText}>🚁 Drone que identifica o lixo e reporta para os barcos</Text>
            </View>
          )}
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
          <Text style={styles.footerText}>Home🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Coleta', { markers })} style={styles.footerButton}>
          <Text style={styles.footerText}>Coleta♻️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Barcos')} style={styles.footerButton}>
          <Text style={styles.footerText}>Barcos⛵</Text>
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
              onPress={handleDeleteAccount}
            >
              <Text style={styles.textStyle}>Excluir Conta e Sair</Text>
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
      {popupVisible && (
        <Animated.View style={[styles.popupView, { transform: [{ translateY: popupAnimation }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClosePopup}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.popupText}>📍🗺️ Projeto de limpeza na praia grande (Atlantic Ocean)</Text>
        </Animated.View>
      )}
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
    backgroundColor: '#f32121',
    marginTop: 20,
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
  popupView: {
    position: 'absolute',
    bottom: '50%',
    left: '10%',
    right: '10%',
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
  popupText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  legendContainer: {
    position: 'absolute',
    top: '30%',
    right: -150, // Start hidden
    width: 150,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    position: 'absolute',
    top: 10,
    left: -30,
    padding: 5,
    backgroundColor: 'blue',
    borderRadius: 15,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  legendContent: {
    marginTop: 20,
  },
  legendText: {
    fontSize: 16,
    marginBottom: 10,
  },
  boatInfoCard: {
    position: 'absolute',
    bottom: 100, // Posiciona o card acima do barco
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
    alignItems: 'center',
    width: 200,
  },
  boatInfoText: {
    color: '#000',
    fontSize: 14,
  },
});
