import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DT_Utils from '../../utils/NFCUtil'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;

export default class Header extends React.Component {

  /**
   * @method render
   * @description This is renderfunction
   */
  render() {
    var { title, leftBtn, rightBtn } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.leftBtn}>
          {leftBtn}
        </View>
        <View style={styles.titleSec}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <View style={styles.rightBtn}>
          {rightBtn}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: LW,
    height: Platform.OS === 'ios' ? Layout.statusHeight + Layout.headerHeight : Layout.headerHeight,
    paddingTop: Platform.OS === 'ios' ? Layout.statusHeight : 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor
  },
  leftBtn: {
    width: 50,
    height: Platform.OS === 'ios' ? Layout.statusHeight + Layout.headerHeight : Layout.headerHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightBtn: {
    width: 50,
    height: Platform.OS === 'ios' ? Layout.statusHeight + Layout.headerHeight : Layout.headerHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleSec: {
    width: LW-100,
    height: Platform.OS === 'ios' ? Layout.statusHeight + Layout.headerHeight : Layout.headerHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textBlueColor,
    textAlign: 'center'
  }
});
