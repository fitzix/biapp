/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import { createStackNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import LoginPage from './src/views/login/login'
import MainPage from './src/views/main/main'

export default createStackNavigator(
  {
    Login: LoginPage,
    Main: {
      screen: MainPage,
      navigationOptions: {
        header: null, //去头部
        headerLeft: null
      }
    }
  },
  {
    initialRouteName: 'Login',
    headerMode: 'screen'
  }
)


