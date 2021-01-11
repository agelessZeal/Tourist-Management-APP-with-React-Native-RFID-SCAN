import React, { Component } from 'react';
import { Image } from 'react-native';

import { createSwitchNavigator } from 'react-navigation';
import  TabNavigator from './TabNavigator'



import MainStackNavigator from './MainStackNavigator';


export default AppNavigator = createSwitchNavigator({
  Auth: MainStackNavigator,
});
