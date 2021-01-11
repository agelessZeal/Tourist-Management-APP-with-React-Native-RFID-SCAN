import React from 'react';
import {Platform} from 'react-native';

import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import  GroupView from  '../screens/assign/GroupView'
import  NFCTag from  '../screens/assign/NFCTag'
import  SchoolInfo from  '../screens/assign/SchoolInfo'
import  SchoolsView from  '../screens/assign/SchoolsView'

import  VisualScan from  '../screens/visual/VisualScan'
import  VisualGroups from  '../screens/visual/VisualGroups'
import  VisualSchoolInfo from  '../screens/visual/VisualSchoolInfo'
import  VisualSchools from  '../screens/visual/VisualSchools'
import  MedicalInfo from  '../screens/visual/MedicalInfo'
import  PassengerInfo from  '../screens/visual/PassengerInfo'

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH / LW;



const VisualStack = createStackNavigator(
    {
        VisualScan:VisualScan,
        VisualGroups:VisualGroups,
        PassengerInfo: PassengerInfo,
        MedicalInfo:MedicalInfo,
        VisualSchoolInfo:VisualSchoolInfo,
        VisualSchools:VisualSchools,

    }, {
        headerMode: 'none'
    }
);


VisualStack.navigationOptions = ({navigation}) => {
    return {
        tabBarLabel: 'Visual',
        tabBarVisible: true,
        tabBarColor:'Button'
    };
};


VisualStack.path = '';


const AssignStack = createStackNavigator(
    {
        GroupView:GroupView,
        NFCTag:NFCTag,
        SchoolInfo:SchoolInfo,
        SchoolsView:SchoolsView,
    }, {
        headerMode: 'none'
    }
);


AssignStack.navigationOptions = ({navigation}) => {
    return {
        tabBarLabel: 'Store',
        tabBarVisible: true
    };
};


AssignStack.path = '';

const tabNavigator = createMaterialBottomTabNavigator({
        AssignStack:AssignStack,
        VisualStack:VisualStack,
},{
        initialRouteName: 'AssignStack',
        activeColor: '#E30514',
        inactiveColor: '#A30514',
        barStyle: { backgroundColor: '#694fad' },
}
);
tabNavigator.path = '';

export default tabNavigator
