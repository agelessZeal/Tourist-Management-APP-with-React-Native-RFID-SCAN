import {Dimensions, Platform, StatusBar} from 'react-native';

// constant
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import GlobalStyle from '../../constants/GlobalStyle';

const LW = Layout.window.width;
const LH = Layout.window.height;
const CW = LW;
const CH = Platform.OS === 'ios' ? LH - (Layout.statusHeight + Layout.menuHeight) : LH - (Layout.menuHeight)

export default {

    ...GlobalStyle,

    mainContent: {
        position: 'absolute',
        left: 0,
        top: Platform.OS === 'ios' ? Layout.statusHeight : 0,
        width: CW,
        height: CH,
        paddingHorizontal: 10,
        paddingTop: 10
    },
    mainHeader: {
        flexDirection: 'row',
        width: LW - 20,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },

    container: {
        flex: 1,
        backgroundColor: '#eee'
    },

    continueBtnText: {
        textAlign: 'right',
        color: Colors.whiteColor,
        fontSize: Layout.font.btn_size,
        fontWeight: 'normal'
    },
    secondContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },

    image: {
        marginBottom: 20,
        height: 100,
        width: 100,
    },

    middle: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    logoContainer: {
        marginTop: LH / 35,
        marginBottom: LH / 35,
    },

    logoImageView: {
        resizeMode: 'cover',
        width: LW / 2,
        height: LW / 2,
        borderRadius:LW/4,
        backgroundColor: Colors.lightGrayColor,
    },

    logInbox: {
        width: '100%',
        paddingHorizontal:LW/8,
        justifyContent:'center',
        alignItems:'center',
    },

    labelInput: {
        color: Colors.textLightGreyColor,
    },
    formInput: {
        borderBottomWidth: 1.5,
        margin: 5,
        borderColor: Colors.whiteColor,
    },
    input: {
        borderWidth: 0
    },


    passengerInfoTitleContainer:{
        height:LH/10,
        paddingHorizontal:10,
        borderRadius:LH/24,
        width:'60%',
        borderWidth:3,
        justifyContent:'center',
        alignItems:'center',
    },

    yellowBorder:{
        borderColor: Colors.yellowBorder,
        backgroundColor:Colors.yellowBkColor,
    },
    greenBorder:{
        borderColor: Colors.greenBorder,
        backgroundColor:Colors.greenBkColor,
    },
    pinkBorder:{
        borderColor: Colors.mainColor,
        backgroundColor:Colors.mainComponentBkColor,
    },
    bottomTabBtnContainer:{
        padding: 10,
        width: LW / 2 - 30,
        borderWidth:3,
        borderRadius: 20,
    },

    sectionHeaderContainer:{
        padding:7,
        backgroundColor:Colors.mainRedColor,
        width:'100%',
    },
    sectionHeaderText:{
       color:Colors.whiteColor,
        fontWeight: 'bold'
    },
    passengerInfoView:{
        flex:1,

        borderWidth:1,
        borderColor:Colors.borderdarkGreyColor,
        justifyContent:'center',
        alignItems:'center',
    },
    passInfoItemText:{
        flex:1,
        borderWidth:1,
        borderColor:Colors.borderdarkGreyColor,
        textAlign: 'left',
        paddingHorizontal:15,
        paddingVertical:5,
        textAlignVertical:'center',
    }



}
