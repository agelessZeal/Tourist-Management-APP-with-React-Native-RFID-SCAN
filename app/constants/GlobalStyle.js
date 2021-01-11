import { Platform } from 'react-native';

// constant
import Colors from './Colors';
import Layout from './Layout';

const LW = Layout.window.width;
const LH = Layout.window.height;
const CW = LW;
const CH = Platform.OS === 'ios' ? LH-(Layout.statusHeight+Layout.headerHeight) : LH-(Layout.headerHeight)

export default {
    loading: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: LW,
      height: LH,
    },
    container: {
      width: LW,
      height: LH,
      backgroundColor: Colors.mainBkColor,
      marginTop: 0
    },
    pageWrap: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: LW,
      height: LH,
      flexDirection: 'column',
      backgroundColor: Colors.greyBkColor,
      paddingTop: Platform.OS === 'ios' ? Layout.statusHeight + Layout.headerHeight : Layout.headerHeight
    },
    hideDrawMenuBtn: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: LW,
      height: LH
    },
    modalWrapStyle: {
      flex: 1,
      width: LW,
      backgroundColor: 'rgba(0,0,0,0.9)'
    },
    modalStyle: {
      marginTop: 0,
      width: LW,
      height: LH,
    },
    modalClose: {
      position: 'absolute',
      top: 10,
      left: 10,
      width: 30,
      height: 30,
      backgroundColor: Colors.greyBkColor,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
      borderBottomLeftRadius: 15,
      paddingTop: 5,
      paddingLeft: 7,
      zIndex: 1000
    },
    modalTitle: {
      position: 'absolute',
      top: 15,
      left: 0,
      width: LW,
      alignItems: 'center',
      zIndex: 1
    },
    modalTitleTxt: {
      textAlign: 'center',
      color: Colors.whiteColor,
      fontSize: Layout.font.medium_size
    },
    continueBtn: {
        height: LH / 12,
        width: '100%',
        backgroundColor: Colors.blueColor,
        marginTop: 20,
        borderRadius: LW/50,
    },
    continueBtnText: {
        textAlign: 'right',
        color: Colors.whiteColor,
        fontSize: Layout.font.btn_size,
        fontWeight: 'normal'
    },
    loginButton:{
        height:LW/10,
        width:LW/2,
        borderRadius:LW/20,
        borderWidth:3,
        backgroundColor:Colors.mainComponentBkColor,
        borderColor:Colors.mainColor
    },
    loginStick:{
        height:LW/10,
        width:3,
        backgroundColor:Colors.mainColor
    },
    btnText:{
        textAlign:'center',
        fontSize:Layout.font.btn_size,
        fontWeight: 'bold',
        color:Colors.textBlackColor,
    },
    mainText:{
        textAlign:'center',
        fontSize:Layout.font.medium_size,
        fontWeight: 'bold',
        color:Colors.whiteColor,
        marginHorizontal:5,
    },
    headerTitleContainer:{
        flex:2,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.mainDarkRedColor
    },

    bottomTabContainer:{
        flex:1,
        backgroundColor:Colors.mainDarkRedColor,
        paddingVertical:8,
        flexDirection:'row',
        justifyContent:'space-around'
    },
    borderBottomLine:{
        width:'100%',
        borderBottomWidth:2,
        borderBottomColor:Colors.mainDarkRedColor,
    },
    subContentContainer:{
        height:LH/10,
        paddingHorizontal:15,
        borderRadius:5,
        backgroundColor:Colors.mainDarkRedColor,
        justifyContent:'center',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    }


  }
