import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from './../services/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LoginScreenProps } from '../types/navigation';

export default function Homescreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
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

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Inicie Sessão</Text>
      <TextInput
        style={styles.input}
        placeholder="e-mail"
        placeholderTextColor="#ffffff"
        value={email}
        onChangeText={handleEmailChange}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="senha"
          placeholderTextColor="#ffffff"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.icon}>
          <Text style={styles.iconText}>👁️‍🗨️</Text>
        </TouchableOpacity>
      </View>
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
      <Image source={require('../../assets/agua.png')} style={styles.footerImage} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2748',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    paddingTop: 15,
  },
  logo: {
    width: 150,
    height: 130,
    marginBottom: 30,
    borderRadius: 45,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#1c4e80',
    borderRadius: 5,
    marginBottom: 10,
  },
  icon: {
    padding: 10,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 16,
  },
  button: {
    width: '80%',
    backgroundColor: '#5eacff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 55,
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
    marginTop: 20,
  },
  footerImage: {
    width: '60%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
});
