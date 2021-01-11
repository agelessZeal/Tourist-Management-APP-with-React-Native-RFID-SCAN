import { Dimensions, Platform, StatusBar  } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const statusHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const headerHeight = 50;

export default {
  window: {
    width,
    height: Platform.OS === 'ios' ? height : height - statusHeight,
  },
  statusHeight: statusHeight,
  headerHeight: headerHeight,
  menuHeight: 80,
  isSmallDevice: width < 375,
  topViewRating:10,
  font: {
    small_size: 14,
    normal_size: 16,
    medium_size: 18,
    h1_size: 30,
    h2_size: 24,
    h3_size: 20,
    h4_size: 16,
    btn_size: 20
  }
};
