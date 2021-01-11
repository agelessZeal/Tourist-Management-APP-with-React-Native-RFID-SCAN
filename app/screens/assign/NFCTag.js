import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView,Alert} from 'react-native';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view/index';

const LW = Layout.window.width;
const LH = Layout.window.height;
const RateWH = LH / LW;
import {
    Avatar,
    Input,
    ListItem,
    Overlay,
    Card,
    CheckBox,
    Icon,

    SearchBar,
    Button,
    Slider,
    Rating,
} from 'react-native-elements/src/index';



// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';

import Loading from '../../components/common/Loading';
import NFCUtil from '../../utils/NFCUtil'

// import NfcManager, {NfcTech} from 'react-native-nfc-manager';

import NfcManager, {Ndef, NfcTech, ByteParser} from 'react-native-nfc-manager'

import AssignStyle from './AssignStyle';




class NFCTag extends Component {

    constructor(props) {
        super(props);
        const{params}=this.props.navigation.state;
        var token = params.token;
        var passenger = params.passenger;

        this.state = {
            loading:false,
            viewType:true,
            token:token,
            fontLoaded: false,
            tagUID:'',
            passenger: passenger,
            isScanning:false,
            showSetTokenError:false,
            statusMessage:'Scanning the nfc tag...',
        };
    }

    componentDidMount() {
        NfcManager.start();
    }

    componentWillUnmount() {
        this._cleanUp();
    }

    _cleanUp = () => {
        this.setState({loading: false})
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    }

    _test = async () => {

        try {
            this.setState({tagUID:'',statusMessage:'Escaneando la etiqueta nfc ...'})

            let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
            let resp = await NfcManager.requestTechnology(tech, {
                alertMessage: 'Ready to do some custom Mifare cmd!'
            });


            console.warn('try:',resp);

            // the NFC uid can be found in tag.id
            let tag = await NfcManager.getTag();
            console.warn('gettag',tag);


            let sucMessage = '¡Éxito!  la etiqueta UID:' + tag.id
            this.setState({tagUID:tag.id,statusMessage:sucMessage})
            this.setToken()

            if (Platform.OS === 'ios') {
                resp = await NfcManager.sendMifareCommandIOS([0x30, 0x00]);
            } else {
                resp = await NfcManager.transceive([0x30, 0x00]);
            }
            console.warn('resp:',resp);
            this._cleanUp();
            // this.setToken()
        } catch (ex) {
            console.warn('ex', ex);
            this.setState({isScanning:false})
            this._cleanUp();
        }
    }



    nfcScan(){

        this.setState({isScanning:true})
        this._test()

    }
    async setToken(){

        let {token,passenger,tagUID} = this.state
        if(tagUID == null || tagUID == ''){
            return
        }

        let sucMessage = 'la etiqueta UID:' + tagUID  +  '  dni:' + passenger.dni
        this.setState({loading: true,statusMessage:sucMessage})

        var ret = await fetch(config.api_url + 'set_token', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            body: JSON.stringify({
                "token": tagUID,
                "dni":passenger.dni,
            }),
        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "-- NFCTag setToken e : ", e);
                return null;
            })


        if (NFCUtil.checkValid(ret.message)) {
            NFCUtil.log(5, "-- NFCTag setToken ret : ", ret);
            if(ret.message == "Token updated"){
                this.setTokenLocal()
            }else{
                    Alert.alert('Fail to set token:', ret.message, [
                        { text: 'Yes', onPress: () => {} },
                        ])

            }
            this.setState({loading: false,tagUID:''})
        }else{
            this.setState({loading: false,tagUID:''})
        }
    }

    setTokenLocal() {

        let {passenger, tagUID} = this.state;
        if(tagUID == ''){
            return
        }
        var user = this.props.user.user;
        var passengers = user.passengers;
        if (NFCUtil.checkValid(passengers)) {
            for (var i = 0; i < passengers.length; i++) {
                var item = passengers[i];
                if (item.dni == passenger.dni) {
                   user.passengers[i].token = tagUID
                    break
                }
            }

            var setLogin = this.props.actions.UserActions.setLogin;
            setLogin(user);

        }
    }

    goToSchoolBack(){

        global.backFlag = true
        this.props.navigation.navigate('SchoolInfo')

    }

    render() {


        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        return (

            <View style={{width: LW, height: LH, flex: 1}}>

                <View  style={styles.headerTitleContainer}>
                    <View style={{flexDirection:'row',width:'95%',paddingTop:15,justifyContent:'center',alignItems:'center'}}>
                        {/*<Icon   name={'ios-arrow-back'} type={'ionicon'} size={LW/10} iconStyle={{color:Colors.whiteColor}}  Component={TouchableOpacity} onPress={()=>{this.props.navigation.goBack()}}/>*/}
                        {/*<View style={{width:'10%'}}></View>*/}
                        {/*<Text style={[styles.mainText,{marginHorizontal:15}]}>ASIGNAR PULSERA</Text>*/}
                        {/*<View style={{width:'15%'}}></View>*/}

                        <ListItem
                            containerStyle={{backgroundColor:'transparent'}}
                            leftElement={
                                <Icon   containerStyle={{marginLeft:15}} name={'ios-arrow-back'} type={'ionicon'} size={LW/10} iconStyle={{color:Colors.whiteColor}}  Component={TouchableOpacity} onPress={()=>{this.goToSchoolBack()}}/>
                            }
                            rightElement={
                                <Text style={[styles.mainText,{width:'80%'}]}>ASIGNAR PULSERA</Text>
                            }
                            rightContentContainerStyle={{justifyContent:'center'}}
                        ></ListItem>
                    </View>

                </View>

                <View style={{justifyContent: 'center', flex: Layout.topViewRating, margin: 15}}>
                    <View style={[styles.middle, styles.logoContainer]}>
                         <Image style={{width:LW*0.7,height:LW*0.7}} source={require('../../assets/image/brazaletrfid.png')}/>
                    </View>
                    <Button title={'ASIGNAR PULSERA al PAX'}  onPress={()=>{this.nfcScan()}} titleStyle={{color:Colors.whiteColor}} raised={true} style={{height:80}} buttonStyle={{backgroundColor:Colors.mainDarkRedColor}} containerStyle={{marginTop:10,width:'100%',borderRadius:7,backgroundColor:Colors.mainRedColor}}></Button>
                </View>
                <View style={styles.bottomTabContainer}>
                    <TouchableOpacity style={[{width:LW/2,borderRightWidth:2,borderRightColor:Colors.whiteColor},styles.middle]}>
                        <Text style={[styles.btnText,{ color:this.state.viewType?Colors.whiteColor:Colors.tabInactiveColor}]}>ASIGNAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[{width:LW/2,},styles.middle]} onPress={()=>{this.props.navigation.navigate('VisualScan')}}>
                        <Text style={[styles.btnText,{color:this.state.viewType?Colors.tabInactiveColor:Colors.whiteColor}]}>VISUALIZAR</Text>
                    </TouchableOpacity>
                </View>

                <Overlay
                    isVisible={this.state.isScanning}
                    // onBackdropPress={() => this.setState({isScanning: false})}
                    borderRadius={5}
                    containerStyle={{marginBottom: 10}}
                    overlayBackgroundColor={Colors.whiteColor}
                    width={LW - 50}
                    height={150}>
                        <View style={{width:'100%',height:'100%',backgroundColor:Colors.mainRedColor,borderRadius:10,justifyContent:'center',alignItems:'center'}}>


                            <Icon  containerStyle={{position:'absolute',right:10,top:10}} raised={true} name="close" size={12} color={Colors.textBlackColor}
                                  onPress={() => {
                                      this.setState({
                                          isScanning: false,
                                      })
                                      this._cleanUp()
                                  }}/>

                            <Text style={{color:Colors.whiteColor,fontSize:Layout.font.normal_size}}>{this.state.statusMessage}</Text>
                        </View>

                </Overlay>


                <Overlay
                    isVisible={this.state.showSetTokenError}
                    onBackdropPress={() => this.setState({showSetTokenError: false})}
                    borderRadius={5}
                    containerStyle={{marginBottom: 10}}
                    overlayBackgroundColor={Colors.whiteColor}
                    width={LW - 50}
                    height={150}>
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: Colors.mainRedColor,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                        <Icon containerStyle={{position: 'absolute', right: 10, top: 10}} raised={true} name="close"
                              size={12} color={Colors.textBlackColor}
                              onPress={() => {
                                  this.setState({
                                      isScanning: false,
                                  });
                                  this._cleanUp();
                              }}/>
                        <Text style={{color: Colors.whiteColor,fontSize:Layout.font.normal_size}}>Esta etiqueta no está asignada.</Text>
                    </View>

                </Overlay>

                <View style={[styles.loading, {
                    display: this.state.loading ? 'flex' : 'none',
                    zIndex: this.state.loading ? 10000 : -1
                }]}>
                    {loading}
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create(AssignStyle);

function mapStateToProps(state) {
    return {
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            UserActions: bindActionCreators(UserActions, dispatch),
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(NFCTag);

