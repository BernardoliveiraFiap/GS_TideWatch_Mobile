import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Homescreen from './src/screens/Homescreen';
import Registerscreen from './src/screens/Registerscreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Homescreen} />
        <Stack.Screen name="Register" component={Registerscreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
