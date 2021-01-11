import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, Alert, Animated} from 'react-native';

import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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

import { TextInput } from 'react-native-paper';

import LoginPageStyle from './LoginPageStyle';

var CryptoJS = require("crypto-js");
var jwtDecode = require('jwt-decode');
import NFCUtil from '../utils/NFCUtil'

import AsyncStorage from '@react-native-community/async-storage';

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../actions/user';

import config from '../constants/config';

import Loading from '../components/common/Loading';




class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            fontLoaded: false,
            email: '',
            password: '',
            // email: 'dqasbkG6Rx',
            // password: 'FWGXdBA8TEn3wQhqpKNSH7VLyY3Ks2',
        };
    }

    async componentDidMount(): void {
        this.setState({loading:true})
        var storage = await NFCUtil.getStorage()
        if (!NFCUtil.checkValid(storage)) {
            storage = NFCUtil.defaultStorage();
            await NFCUtil.setStorage(storage)
            this.setState({loading:false})
        } else {

            var password = ( NFCUtil.checkValid(storage.password)) ? CryptoJS.AES.decrypt(storage.password, 'nfc').toString(CryptoJS.enc.Utf8) : '';

            var refresh_token = ( NFCUtil.checkValid(storage.refresh_token)) ? CryptoJS.AES.decrypt(storage.refresh_token, 'nfc').toString(CryptoJS.enc.Utf8) : '';

            if(password != '' && storage.email != ''){
                this.setState({
                    email:  storage.email,
                    password: password,
                })
            }


            if(refresh_token != ''){

                global.refresh_token = refresh_token
                var ret = await fetch(config.api_url + 'token/refresh', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + refresh_token
                    },
                })
                    .then(data => {
                        return data.json()
                    })
                    .catch(e => {
                        NFCUtil.log(5, "-- GroupView componentDidMount e : ", e);
                        return null;
                    })
                if (NFCUtil.checkValid(ret.access_token)) {
                    NFCUtil.log(5, "-- GroupView componentDidMount ret access_token : ", ret.access_token);
                    global.token  = ret.access_token


                    var user = {
                        'username': storage.email,
                        'password': password,
                        'token':ret.access_token,
                        'refresh_token':refresh_token,
                        'select_group':{},
                        'select_school':{},
                        'select_passenger':{},
                        passengersMedicalInfos:[],
                        passengers:[],
                        groups:[],
                        schools:[],
                    }

                    var setLogin = this.props.actions.UserActions.setLogin;
                    setLogin(user);

                    this.setState({loading:false})
                    this.goToNext()
                }
                this.setState({loading:false})
            }

            this.setState({loading:false})
        }
    }


    onBlur() {
        console.log('#####: onBlur');
    }

    goToNext(){
        this.props.navigation.navigate('GroupView')
    }

    checkValidation() {
        var {email, password} = this.state;
        if (email == '' || password == '' ) {
            Alert.alert(
                '',
                `Email or password is not valid`,
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            )
            return false;
        }

        return true;
    }

    async onSignin() {

        var {email, password} = this.state;

        if (!this.checkValidation()) {
            return;
        }

        this.setState({loading: true});

        var signinInfo = {
            'username': email,
            'password': password,
        };

        console.log('-- SigninPage onSignin signinInfo  : ', signinInfo);
        var userInfo = await fetch(config.api_url + 'login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signinInfo),
        })
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch(e => {
                this.setState({loading: false});
                NFCUtil.log(5, '-- SigninPage onSignin e : ', e);
                return null;

            });

        NFCUtil.log(5, '-- SigninPage onSignin userInfo : ', userInfo);

        if (userInfo) {

            var message = userInfo.message
            if(userInfo.access_token != null  && userInfo.refresh_token != null){
                var user = {
                    'username': email,
                    'password': password,
                    'token':userInfo.access_token,
                    'refresh_token':userInfo.refresh_token,
                    'select_group':{},
                    'select_school':{},
                    'select_passenger':{},
                    gps_activated:true,
                    synchronized:false,
                    passengersMedicalInfos:[],
                    passengers:[],
                    groups:[],
                    schools:[],
                }

                // var user = DT_UTILS.parseJwt(userInfo.data);
                var userjwt = jwtDecode(userInfo.access_token);
                console.log('jwt',userjwt)
                NFCUtil.log(5,'the user token:\n',user.token)
                var setLogin = this.props.actions.UserActions.setLogin;
                setLogin(user);

                global.token  = user.token
                global.refresh_token = user.refresh_token

                let storage = await NFCUtil.getStorage()
                if (!NFCUtil.checkValid(storage)) {
                    storage = NFCUtil.defaultStorage();
                }
                storage.email = email;
                storage.refresh_token = CryptoJS.AES.encrypt(global.refresh_token, 'nfc').toString();
                storage.password = CryptoJS.AES.encrypt(password, 'nfc').toString();
                NFCUtil.log(5, "-- SigninPage onSignin setStorage : ", storage);
                NFCUtil.setStorage(storage);

                this.setState({loading: false});
                this.goToNext();

            }else if(message == 'Wrong credentials'){
                this.setState({loading: false});
                Alert.alert(
                    '',
                    `El crédito de la cuenta no es correcto. Por favor intente nuevamente.`,
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );

            }else{
                this.setState({loading: false});
                Alert.alert(
                    '',
                    `El inicio de sesión ha fallado. Por favor intente nuevamente.`,
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
            }
        }
        this.setState({loading: false});
    }


    render() {
        var {email, password} = this.state;

        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        var loadingAnim = new Animated.Value(0)

        return (
            <KeyboardAwareScrollView style={{width: LW, height: LH, flex: 1}}>
                <View style={{justifyContent: 'center', margin: 15}}>
                    <View style={[styles.middle, styles.logoContainer,{flex:2}]}>
                        <Image source={require('../assets/image/logo_login.png')} style={{width:LW*0.5,height:LW*0.5/945*756,resizeMode:'contain'}}/>
                    </View>

                    <View style={[styles.middle,{marginTop:LH/15,flex:1}]}>
                        <Image source={require('../assets/image/user.png')} style={{width:LW/4,height:LW/4}}/>
                        {/*<Icon name={'user-circle'} color = {Colors.mainRedColor} size={LW/4} iconStyle={{color:Colors.redColor}} type={'font-awesome'}/>*/}
                    </View>

                    <View style={[styles.logInbox,{flex:7}]}>

                        <Input
                            labelStyle={styles.labelInput}
                            style={styles.formInput}
                            placeholder={'Usuario'}
                            value={this.state.email}
                            inputContainerStyle={{borderBottomWidth:0}}
                            containerStyle={{width: '100%', marginVertical: 10,backgroundColor:Colors.lightGrayColor,borderRadius:7}}
                            onChangeText={(text) => {
                                this.setState({
                                    email: text,
                                });
                            }}
                            onBlur={this.onBlur}
                        />

                        <Input
                            labelStyle={styles.labelInput}
                            inputStyle={styles.input}
                            style={styles.formInput}
                            secureTextEntry={true}
                            placeholder={'Contraseña'}
                            value={this.state.password}
                            inputContainerStyle={{borderBottomWidth:0}}
                            containerStyle={{width: '100%', marginVertical: 10,backgroundColor:Colors.lightGrayColor,borderRadius:7}}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text,
                                });
                            }}
                            onBlur={this.onBlur}
                        />

                        <Button title={'LOGIN'}  onPress={()=>{this.onSignin()}} titleStyle={{color:Colors.whiteColor}} raised={true} style={{height:80}} buttonStyle={{backgroundColor:Colors.mainDarkRedColor}} containerStyle={{marginTop:10,width:'100%',borderRadius:7,backgroundColor:Colors.mainRedColor}}></Button>

                    </View>
                </View>


                <Overlay
                    isVisible={this.state.loading}
                    // onBackdropPress={() => this.setState({isScanning: false})}
                    borderRadius={5}
                    containerStyle={{marginBottom: 10}}
                    overlayBackgroundColor={'transparent'}
                    width={50}
                    height={50}>

                    <Animated.View style={{ width: 30, height: 30, transform: [{rotate: loadingAnim.interpolate({
                                inputRange: [0, 360],
                                outputRange: ["0deg", "360deg"]
                            }) }] }}>
                        <Image
                            source={require('../assets/image/loading.png')}
                            style={{width: 30, height: 30 }} />
                    </Animated.View>

                </Overlay>


                {/*<View style={[styles.loading, {*/}
                {/*    display: this.state.loading ? 'flex' : 'none',*/}
                {/*    zIndex: this.state.loading ? 10000 : -1*/}
                {/*}]}>*/}
                {/*    {loading}*/}
                {/*</View>*/}

            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create(LoginPageStyle);

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

