import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Homescreen from './src/screens/Homescreen';
import Registerscreen from './src/screens/Registerscreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import Home from './src/screens/Home';
import Barcos from './src/screens/Barcos';
import Coleta from './src/screens/Coleta';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#011633" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#011633' },
          headerTintColor: '#fff',
          headerTitle: '', // Remove o título
          headerShadowVisible: false, // Remove a linha
          headerBackVisible: false, // Esconde a seta de voltar globalmente
        }}
      >
        <Stack.Screen name="Login" component={Homescreen} />
        <Stack.Screen name="Register" component={Registerscreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Barcos" component={Barcos} options={{ headerShown: false }} />
        <Stack.Screen name="Coleta" component={Coleta} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
