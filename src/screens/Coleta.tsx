import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Coleta() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [boats, setBoats] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [infoVisible, setInfoVisible] = useState(false);
  const infoAnimation = useRef(new Animated.Value(-500)).current; // Initial value for Y-axis translation

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

  const toggleInfoCard = () => {
    setInfoVisible(!infoVisible);
    Animated.timing(infoAnimation, {
      toValue: infoVisible ? -500 : 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Coleta♻️</Text>
      </View>
      <ImageBackground source={require('../../assets/marinha1.png')} style={styles.background}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Barcos em Operação: {boats.length}</Text>
          <Text style={styles.statsText}>Pontos de Lixo: {countByType('bottle')}</Text>
          <Text style={styles.statsText}>Helicópteros Monitorando: {countByType('helicopter')}</Text>
        </View>
      </ImageBackground>
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
      <TouchableOpacity onPress={toggleInfoCard} style={styles.infoButton}>
        <Text style={styles.infoButtonText}>ℹ️</Text>
      </TouchableOpacity>
      {infoVisible && (
        <Animated.View style={[styles.infoCard, { transform: [{ translateY: infoAnimation }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleInfoCard}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.infoTitle}>ℹ️ Informação</Text>
          <Text style={styles.infoText}>
            🌊 **Por que não devemos poluir o mar?** 🌊
          </Text>
          <Text style={styles.infoText}>
            A poluição marinha afeta a vida aquática, prejudica a saúde humana e destrói os ecossistemas. Além disso, os plásticos e outros detritos podem matar peixes e aves marinhas.
          </Text>
          <Text style={styles.infoText}>
            ⚠️ Evite despejar lixo, petróleo ou produtos químicos no oceano. Juntos, podemos proteger nosso planeta! 🌍
          </Text>
          <Text style={styles.infoText}>
            🙏 Obrigado por sua atenção e tempo!
          </Text>
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
    marginTop: 20,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  background: {
    flex: 1,
    width:1050,
    backgroundColor: '#88c3fd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    marginBottom: 52,
    marginTop: 0,
    overflow: 'hidden',
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
  infoButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#5eacff',
    borderRadius: 25,
    padding: 10,
  },
  infoButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  infoCard: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
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
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#011633',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#011633',
    marginBottom: 10,
    textAlign: 'center',
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
});
