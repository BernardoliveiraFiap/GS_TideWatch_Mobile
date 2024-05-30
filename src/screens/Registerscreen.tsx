import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from './../services/firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { RegisterScreenProps } from '../types/navigation';

export default function Registerscreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setErrorMessage('');  // Limpa a mensagem de erro ao digitar
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage('');  // Limpa a mensagem de erro ao digitar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ffffff"
        value={email}
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#ffffff"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2748',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 125, // Adiciona espaço no topo para mover os itens para cima
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
  },
  input: {
    width: '80%',
    backgroundColor: '#1c4e80',
    color: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    width: '80%',
    backgroundColor: '#5eacff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
