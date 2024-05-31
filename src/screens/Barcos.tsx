import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Barcos() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Barcos</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>A ajuda está aqui</Text>
        <Text style={styles.subTitle}>Barco autônomo Coletor de Lixo</Text>
        <Image source={require('../../assets/barco.png')} style={styles.image} />
        <View style={styles.taskContainer}>
          <Text style={styles.taskText}>Tarefas:</Text>
          <Text style={styles.taskText}>ID:</Text>
          <Text style={styles.taskText}>DATA:</Text>
        </View>
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
    justifyContent: 'center', // Centrally aligns the card vertically
    alignItems: 'center', // Centrally aligns the card horizontally
  },
  headerContainer: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#1c4e80',
    borderRadius: 25,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  card: {
    width: '90%', // Makes the card wider
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  image: {
    width: '100%', // Makes the image wider
    height: 200, // Adjust height accordingly
    marginBottom: 20,
  },
  taskContainer: {
    width: '100%',
    backgroundColor: '#1c4e80',
    padding: 12,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
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
