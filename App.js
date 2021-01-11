/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';


import  store from './app/store/index'

import { Provider, connect } from 'react-redux';

import { createReduxContainer } from 'react-navigation-redux-helpers';

import AppNavigator from './app/navigation/AppNavigator';

import FlashMessage from "react-native-flash-message";

console.disableYellowBox = true;


const App = createReduxContainer(AppNavigator);
const mapStateToProps = (state) => ({
  state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(App);


export default class Root extends Component<{}> {
  constructor(properties) {
    super(properties);
  }

  componentWillUnmount() {

  }

  componentDidMount() {
    // SplashScreen.hide();
  }

  render() {
    return (
        <Provider store={store}>
          <AppWithNavigationState />

          <FlashMessage
              position="top"
              type = 'success'
              ref="fmLocalInstance"
          />

          {/* <FlashMessage position="top"
        //  renderCustomContent={()=> {return (<View style={{justifyContent: 'center', width: "100%"}}>
        //     <Text style={{color: "#fff", fontSize: 16}}>This is notification sample</Text>
        //     <TouchableOpacity style={{width: 200, height: 40, justifyContent: 'center', alignItems: 'center'}}>
        //     <Text style={{color: "#fff", fontSize: 16}}>Hide Notification</Text>
        //     </TouchableOpacity>
        //   </View>)}}
        renderFlashMessageIcon= {()=>{return (<Image source={require('./app/assets/images/default-woman.png')} style={{width: 30, height: 30}}/>)}}/> */}
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
