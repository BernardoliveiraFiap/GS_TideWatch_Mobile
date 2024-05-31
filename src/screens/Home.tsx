import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

export default function Home() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerType, setSelectedMarkerType] = useState(null);
  const [iconsVisible, setIconsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleLogout = () => {
    Alert.alert("Logged out", "You have been logged out.");
    setModalVisible(false);
    navigation.navigate('Login');
  };

  const handleMapPress = (e) => {
    if (selectedMarkerType) {
      const newMarker = {
        coordinate: e.nativeEvent.coordinate,
        key: markers.length ? markers[markers.length - 1].key + 1 : 1,
        type: selectedMarkerType,
      };
      setMarkers([...markers, newMarker]);
    } else {
      Alert.alert("No Marker Selected", "Please select a marker type before adding to the map.");
    }
  };

  const handleMarkerPress = (key) => {
    Alert.alert(
      "Remove Marker",
      "Do you want to remove this marker?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            setMarkers(markers.filter(marker => marker.key !== key));
          }
        }
      ]
    );
  };

  const toggleIcons = () => {
    if (iconsVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setIconsVisible(false));
      setSelectedMarkerType(null);
    } else {
      setIconsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderMarkerEmoji = (type) => {
    if (type === 'bottle') {
      return '🍾';
    } else if (type === 'boat') {
      return '⛵';
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
          initialRegion={{
            latitude: -24.00583,
            longitude: -46.40278,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          {markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
              onPress={() => handleMarkerPress(marker.key)}
            >
              <Text style={styles.markerEmoji}>{renderMarkerEmoji(marker.type)}</Text>
            </Marker>
          ))}
        </MapView>
        <Animated.View
          style={[
            styles.markerSelector,
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [200, 0]
                })
              }]
            }
          ]}
        >
          <TouchableOpacity onPress={() => setSelectedMarkerType('bottle')}>
            <Text style={styles.markerThumbnail}>🍾</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedMarkerType('boat')}>
            <Text style={styles.markerThumbnail}>⛵</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity onPress={toggleIcons} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{iconsVisible ? '>' : '<'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerButton}>
          <Text style={styles.footerText}>Home🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Coleta')} style={styles.footerButton}>
          <Text style={styles.footerText}>Coleta</Text>
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
    overflow: 'hidden', // Adicionado para garantir que o mapa respeite as bordas do card
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerSelector: {
    position: 'absolute',
    right: 10,
    top: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#011633', // Fundo azul escuro
    padding: 10,
    borderRadius: 10,
  },
  markerThumbnail: {
    fontSize: 54, // Reduzido em 20% de 68
    margin: 10,
  },
  markerEmoji: {
    fontSize: 32, // Reduzido em 20% de 40
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    backgroundColor: '#1c4e80',
    borderRadius: 25,
    padding: 10,
  },
  toggleButtonText: {
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
