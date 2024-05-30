import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from './../services/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LoginScreenProps } from '../types/navigation';

export default function Homescreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Inicie Sessão</Text>
      <TextInput
        style={styles.input}
        placeholder="e-mail"
        placeholderTextColor="#ffffff"
        value={email}
        onChangeText={handleEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="senha"
        placeholderTextColor="#ffffff"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
        <Text style={styles.buttonText}>Registre-se</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Esqueceu a senha?</Text>
      </TouchableOpacity>
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
    paddingTop: 30, // Adiciona espaço no topo para mover os itens para cima
  },
  logo: {
    width: 150, // Aumenta a largura em 30%
    height: 130, // Aumenta a altura em 30%
    marginBottom: 20,
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
    marginBottom: 10,
  },
  button: {
    width: '80%',
    backgroundColor: '#5eacff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  link: {
    color: '#ffffff',
    marginTop: 10,
  },
});
