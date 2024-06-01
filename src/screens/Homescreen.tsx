import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from './../services/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LoginScreenProps } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Homescreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberEmail(true);
        }
      } catch (error) {
        console.error('Failed to load email from storage', error);
      }
    };
    loadEmail();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberEmail) {
        await AsyncStorage.setItem('savedEmail', email);
      } else {
        await AsyncStorage.removeItem('savedEmail');
      }
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

  const toggleRememberEmail = () => {
    setRememberEmail(!rememberEmail);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Inicie Sessão</Text>
      <View style={styles.rememberEmailContainer}>
        <TouchableOpacity onPress={toggleRememberEmail} style={[styles.switch, rememberEmail && styles.switchActive]}>
          {rememberEmail && <View style={styles.switchInner} />}
        </TouchableOpacity>
        <Text style={styles.rememberEmailText}>Guardar Email</Text>
      </View>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011633',
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
  rememberEmailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5, // Adiciona padding
  },
  switch: {
    width: 30,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchActive: {
    backgroundColor: '#ffffff',
  },
  switchInner: {
    width: 16,
    height: 16,
    backgroundColor: '#1c4e80',
    borderRadius: 8,
  },
  rememberEmailText: {
    color: '#ffffff',
    marginLeft: 10,
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
  link: {
    color: '#ffffff',
    marginTop: 20,
  },
});
