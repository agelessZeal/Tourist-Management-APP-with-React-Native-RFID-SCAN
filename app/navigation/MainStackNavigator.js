import React from 'react';
import { Platform } from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';

import LoginPage from '../screens/LoginPage';
import GroupView from '../screens/assign/GroupView';
import SchoolsView from '../screens/assign/SchoolsView';
import SchoolInfo from '../screens/assign/SchoolInfo';
import NFCTag from '../screens/assign/NFCTag';
import VisualScan from '../screens/visual/VisualScan';
import VisualGroups from '../screens/visual/VisualGroups';
import VisualSchools from '../screens/visual/VisualSchools';
import VisualSchoolInfo from '../screens/visual/VisualSchoolInfo';
import PassengerInfo from '../screens/visual/PassengerInfo';
import MedicalInfo from '../screens/visual/MedicalInfo';


const MainStackNavigator = createStackNavigator({
  LoginPage: LoginPage,
  GroupView: GroupView,
  SchoolsView: SchoolsView,
  SchoolInfo: SchoolInfo,
  NFCTag: NFCTag,
  VisualScan:VisualScan,
  VisualGroups:VisualGroups,
  VisualSchools:VisualSchools,
  VisualSchoolInfo:VisualSchoolInfo,
  PassengerInfo:PassengerInfo,
  MedicalInfo:MedicalInfo,
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0
    },
    headerTintColor: 'transparent',
    headerTitleStyle:{
      textAlign: 'center',
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      flexGrow:1,
      alignSelf:'center',
      marginRight: Platform.select({
        ios: 18,
        android:76
      })
    },
    headerTransparent: true,
  }
});


export default MainStackNavigator
