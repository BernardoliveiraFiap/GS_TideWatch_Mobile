import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ImageBackground, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { db } from './../services/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Coleta() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [boats, setBoats] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [infoVisible, setInfoVisible] = useState(false);
  const infoAnimation = useRef(new Animated.Value(-500)).current; // Initial value for Y-axis translation

  useEffect(() => {
    if (isFocused) {
      const unsubscribeBoats = onSnapshot(collection(db, 'boats'), (snapshot) => {
        const boatsData = [];
        snapshot.forEach((doc) => {
          boatsData.push({ id: doc.id, ...doc.data() });
        });
        setBoats(boatsData);
      });

      const unsubscribeMarkers = onSnapshot(collection(db, 'markers'), (snapshot) => {
        const markersData = [];
        snapshot.forEach((doc) => {
          markersData.push({ id: doc.id, ...doc.data() });
        });
        setMarkers(markersData);
      });

      return () => {
        unsubscribeBoats();
        unsubscribeMarkers();
      };
    }
  }, [isFocused]);

  const toggleInfoCard = () => {
    if (infoVisible) {
      Animated.timing(infoAnimation, {
        toValue: 1000,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setInfoVisible(false);
        infoAnimation.setValue(-500); // Reset the animation value for the next time the popup opens
      });
    } else {
      setInfoVisible(true);
      Animated.timing(infoAnimation, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Coleta♻️</Text>
      </View>
      <ImageBackground source={require('../../assets/marinha1.png')} style={styles.background}>
        <View style={styles.statsContainer}>
          <View style={styles.statsBackground}>
            <Text style={styles.statsText}><Text style={styles.boldText}>Barcos em Operação:</Text> {boats.length}</Text>
          </View>
          <View style={styles.statsBackground}>
            <Text style={styles.statsText}><Text style={styles.boldText}>Pontos de Lixo:</Text> 1</Text>
          </View>
          <View style={styles.statsBackground}>
            <Text style={styles.statsText}><Text style={styles.boldText}>Drones Monitorando:</Text> 1</Text>
          </View>
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
          <Text style={styles.infoText}>
            🌊 Por que não devemos poluir o mar?
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
          <Image source={require('../../assets/clean.png')} style={styles.image}/>
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
    width: '120%',
    backgroundColor: '#88c3fd',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 1,
    marginBottom: 52,
    marginTop: 0,
    overflow: 'hidden',
  },
  statsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: -160,
    paddingTop: 20,
  },
  statsBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Fundo branco semitransparente
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '90%',
  },
  statsText: {
    color: '#010101',
    fontSize: 18,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
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
    top: '5%',
    left: 0,
    right: 0,
    backgroundColor: '#1c4e80', // Azul escuro
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#ffffff',
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
  image: {
    width: 410,
    height: 410,
    marginTop: 15,
  },
});
