import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Animated,
  Easing
} from 'react-native';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH/LW;

export default class Loading extends React.Component {

  loadingAnimation () {
    this.state.loadingAnim.setValue(0)
    Animated.timing(
      this.state.loadingAnim,
      {
        toValue: 360,
        duration: 2000,
        easing: Easing.linear
      }
    ).start(() => {
      this.loadingAnimation()
    })
  }


  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor(props) {
    super(props);

    this.state = {
      loadingAnim: new Animated.Value(0)
    }

  }


  /**
   * @method componentDidMount
   * @description This function is called component is loaded.
   */
  async componentDidMount() {
    this.loadingAnimation();
  }


  /**
   * @method render
   * @description This is renderfunction
   */
  render() {
    var { type } = this.props;
    var { loadingAnim } = this.state;

    return (
      <View style={styles.loadinglStyle}>
        <Animated.View style={{ width: 30, height: 30, transform: [{rotate: loadingAnim.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"]
        }) }] }}>
          <Image
            source={require('../../assets/image/loading.png')}
            style={{width: 30, height: 30 }} />
        </Animated.View>
      </View>

    );
  }

}

const styles = StyleSheet.create({
  loadinglStyle: {
    flex: 1,
    width:LW,
    height:LH,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
