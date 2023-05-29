import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import ContextWrapper from "./context/ContextWrapper";
import MainNavigator from "./navigations/MainNavigator";
import {ThemeProvider} from "styled-components";
import theme from './utils/theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <MainNavigator/>
      </NavigationContainer>
    </ThemeProvider>
  );
}
