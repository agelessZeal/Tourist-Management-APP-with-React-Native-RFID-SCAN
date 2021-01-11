import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';

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
} from 'react-native-elements';

// import Icon from 'react-native-vector-icons/FontAwesome'


import VisualStyle from './VisualStyle';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';
import Loading from '../../components/common/Loading';
import NFCUtil from '../../utils/NFCUtil'
import AsyncStorage from '@react-native-community/async-storage';

class VisualScan extends Component {

    constructor(props) {
        super(props);
        var user  =  this.props.user.user

        this.state = {
            viewType:false,
            fontLoaded: false,
            tagUID:"",
            user:user,
            isScanning:false,
            statusMessage:'',
            showEmptyPassenger:false,
        };
    }
    async componentDidMount(): void {
        var {user} = this.state

        console.log('visualscan view did mount user.groups:',user.groups)


        // user.groups.map((item)=>{
        //     if(item.synchronized){
        //         console.log('synchronized:',item)
        //     }
        // })
        // this.getLocalStorage()

        if(user.groups == null || user.groups.length == 0){
            this.getLocalStorage()
        }

        NfcManager.start();

    }

    async getLocalStorage() {

        this.setState({loading: true});

        var {user} = this.state;

        const value = await AsyncStorage.getItem('@groups');
        console.log('getLocalStoratge user.groups value:',value)
        if (NFCUtil.checkValid(value)) {
            console.log('getLocalStoratge user.groups value:',value)
            user.groups = JSON.parse(value);
            console.log('getLocalStoratge user.groups array value:',user.groups)

            var setLogin = this.props.actions.UserActions.setLogin;
            setLogin(user);
            this.setState({
                user:user,
            })

        }


        this.setState({loading: false});
    }

    NfcScan(){
        // this.goToPassengerInfo()
        this.setState({isScanning:true})
        this._test()
    }


    goToPassengerInfo() {

        var {user,tagUID} = this.state
        if(tagUID == ''){
            return
        }
        var passengers = user.passengers

        if(passengers != null && passengers.length > 0 ){
            for(var i=0;i<passengers.length;i++){
                if(passengers[i].token == tagUID){
                    this.setState({isScanning: false})
                    this.props.navigation.navigate('PassengerInfo', {passenger: passengers[i]});
                    return true;
                }
            }
        }

        this.searchInUserGroups()
        // this.setState({showEmptyPassenger:true})
    }

    async getPassengerInformationWithToken(){

        let {user,school,tagUID} = this.state

        if(tagUID == ''){
            return
        }
        this.setState({loading: true})
        var ret = await fetch(config.api_url + 'pasajeros', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            body: JSON.stringify({
                "pasajero_token": tagUID,
            }),
        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "-- VisualSchoolInfo componentDidMount e : ", e);
                return null;
            })


        this.setState({loading: false})
        if (NFCUtil.checkValid(ret.pasajeros)) {
            NFCUtil.log(5, "-- VisualScan with token ret : ", ret.pasajeros);

            var passengers = ret.pasajeros
            if(passengers != null && passengers.length>0){
                this.props.navigation.navigate('PassengerInfo', {passenger: passengers[0]});
            }
        }


    }

    searchInUserGroups(){
        var {user,tagUID} = this.state

        if(!NFCUtil.checkValid(tagUID)){
            return
        }
        if(!NFCUtil.checkValid(user)){
            return;
        }
        var groups = user.groups

        console.log('searchUserGroup:',groups,tagUID)

        groups.map((item, index) => {
            if(NFCUtil.checkValid(item.school_data)){

                let schools = item.school_data
                schools.map((school,index) =>{
                    console.log('searchUserGroup school:',school)
                    if(NFCUtil.checkValid(school.passengers)){
                        for(var i=0;i<school.passengers.length;i++){
                            if(school.passengers[i].token == tagUID){
                                this.setState({isScanning: false})
                                this.props.navigation.navigate('PassengerInfo', {passenger: school.passengers[i]});
                                return true;
                            }
                        }
                    }
                })
            }
        })
    }


    goToVisual(){
        this.props.navigation.navigate('VisualGroups')
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
            this.goToPassengerInfo()

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
            this._cleanUp();
        }
    }




    render() {

        return (
            <View style={{width: LW, height: LH, flex: 1}}>
                <View  style={styles.headerTitleContainer}>
                    <Text style={[styles.mainText,{marginHorizontal:15}]}>VISUALIZAR PULSERA</Text>
                </View>

                <View style={{justifyContent: 'center', flex: Layout.topViewRating, margin: 15}}>

                    <Button title={'ESCANEAR PULSEAR'}  onPress={()=>{this.NfcScan()}} titleStyle={{color:Colors.whiteColor}} raised={true} style={{height:80}} buttonStyle={{backgroundColor:Colors.mainDarkRedColor}} containerStyle={{marginTop:10,width:'100%',borderRadius:7,backgroundColor:Colors.mainRedColor}}></Button>
                    <View style={[styles.middle, styles.logoContainer]}>
                        <Image style={{width:LW*0.7,height:LW*0.7}} source={require('../../assets/image/brazaletrfid.png')}/>
                    </View>
                    <Button title={'BUSCAR PASAJERO'}  onPress={()=>{this.goToVisual()}} titleStyle={{color:Colors.whiteColor}} raised={true} style={{height:80}} buttonStyle={{backgroundColor:Colors.mainDarkRedColor}} containerStyle={{marginTop:10,width:'100%',borderRadius:7,backgroundColor:Colors.mainRedColor}}></Button>
                </View>
                <View style={styles.bottomTabContainer}>
                    <TouchableOpacity style={[{width:LW/2,borderRightWidth:2,borderRightColor:Colors.whiteColor},styles.middle]} onPress={()=>{this.props.navigation.navigate('GroupView')}}>
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

                        <Text style={{color: Colors.whiteColor,fontSize:Layout.font.normal_size}}>{this.state.statusMessage}</Text>
                    </View>

                </Overlay>


                <Overlay
                    isVisible={this.state.showEmptyPassenger}
                    onBackdropPress={() => this.setState({showEmptyPassenger: false})}
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

            </View>


        );
    }
}

const styles = StyleSheet.create(VisualStyle);
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
export default connect(mapStateToProps, mapDispatchToProps)(VisualScan);

