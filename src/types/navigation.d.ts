// src/types/navigation.d.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Barcos: undefined;
  Coleta: undefined; // Adicionando a tela Coleta
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type BarcosScreenProps = NativeStackScreenProps<RootStackParamList, 'Barcos'>;
export type ColetaScreenProps = NativeStackScreenProps<RootStackParamList, 'Coleta'>;
