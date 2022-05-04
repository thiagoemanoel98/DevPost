/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import {
  StyleSheet,
  StatusBar,
} from 'react-native';
import Routes from './src/routes';

import AuthProvider from './src/contexts/auth';

function App(){
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor='#36393F' barStyle='light' translucent = {false}/>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
      
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
