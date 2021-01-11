import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity,ScrollView} from 'react-native';

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

import Geolocation from 'react-native-geolocation-service';


// import Icon from 'react-native-vector-icons/FontAwesome'
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';

import Loading from '../../components/common/Loading';
import NFCUtil from '../../utils/NFCUtil'


import AssignStyle from './AssignStyle';
const timer = require('react-native-timer');
import AsyncStorage from '@react-native-community/async-storage';

import BackgroundTimer from 'react-native-background-timer';

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import Permissions, {PERMISSIONS} from 'react-native-permissions';


class GroupView extends Component {

    constructor(props) {
        super(props);
        var user  =  this.props.user.user
        this.state = {
            fontLoaded: false,
            loading:false,
            viewType:true,
            user:user,
            hasLocationPermission:false,
            timer: null,
            posLat:'',
            posLong:'',
            counter: 0,
            groups:[],
        };
    }


    async componentDidMount(): void {

        global.gps_activated = false

        Permissions.request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, { type: 'always' }).then(response => {
            console.log('-- permission location : ', response);
            if (response != 'denied') {
                this.setState({
                    hasLocationPermission:true
                })
            }
        })

        this.getGroupList()

        if(this.state.hasLocationPermission){

        }


        BackgroundTimer.runBackgroundTimer(() => {
                var refresh_token = global.refresh_token;
                if (refresh_token == null || refresh_token == undefined) {
                    return;
                }

                // console.log('***************************\n refresh token user :')
                fetch(config.api_url + 'token/refresh', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + refresh_token,
                    },
                })
                    .then(data => {
                        return data.json();
                    })
                    .then((responseJson) => {
                        // console.log('***************************\n refresh token response :',responseJson)
                        if (NFCUtil.checkValid(responseJson.access_token)) {
                            global.token = responseJson.access_token;
                        }
                    })
                    .catch(e => {
                        NFCUtil.log(5, '-- GroupView componentDidMount e : ', e);
                        return null;
                    });

                if (global.gps_activated) {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            // console.log('-- position : ', position);
                            fetch(config.api_url + 'gps_position', {
                                method: 'PUT',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + global.token,
                                },
                                body: JSON.stringify({
                                    'contingente_id': global.group_id,
                                    'latitude': position.coords.latitude,
                                    'longitude': position.coords.longitude,
                                }),
                            })
                                .then(data => {
                                    return data.json();
                                })
                                .then((responseJson) => {
                                    // console.log('***************************\n position response :',responseJson)
                                })
                                .catch(e => {
                                    console.log(5, '-- send location componentDidMount e : ', e);
                                    return null;
                                });

                        },
                        (error) => {
                            // See error code charts below.
                            console.log(error.code, error.message);
                            // this.setState({
                            //     loading: false
                            // });
                        },
                        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
                    );
                }


            },
            60000);

    }
    componentWillUnmount(): void {
        BackgroundTimer.stopBackgroundTimer();


    }

    async getGroupList(){
        this.setState({loading: true})
        let {user} = this.state
        // NFCUtil.log(5,"----------------------\n the user token in groupview:",user.token)
        user.groups = []
        var ret = await fetch(config.api_url + 'contingentes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "-- GroupView getGroupList e : ", e);
                return null;
            })


        // NFCUtil.log(5, "-- GroupView componentDidMount ret : ", ret);
        if (NFCUtil.checkValid(ret.contingentes)) {
            NFCUtil.log(5, "-- GroupView getGroupList 1 ret : ", ret.contingentes);

            var groups =  ret.contingentes

            for(var i = 0;i<groups.length;i++){
                var item = groups[i]
                var newItem = {
                    id:item.id,
                    index:i,
                    nombre:item.nombre,
                    activated:false,
                    synchronized:false,
                    schools:[],
                    school_data:[],
                }
                user.groups.push(newItem)
            }

            var setLogin = this.props.actions.UserActions.setLogin;
            setLogin(user);

            this.setState({
                user:user,
                groups: user.groups,
                loading: false,
            })

        }else{

            if(NFCUtil.checkValid(ret.message)){
                var tokenret = await fetch(config.api_url + 'token/refresh', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + global.refresh_token
                    },
                })
                    .then(data => {
                        return data.json()
                    })
                    .catch(e => {
                        NFCUtil.log(5, "-- GroupView getGroupList token e : ", e);
                        return null;
                    })
                if (NFCUtil.checkValid(tokenret.access_token)) {
                    global.token  = tokenret.access_token

                      user.groups = []
                    var reret = await fetch(config.api_url + 'contingentes', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + global.token
                        },
                    })
                        .then(data => {
                            return data.json()
                        })
                        .catch(e => {
                            NFCUtil.log(5, "-- GroupView getGroupList 2 e : ", e);
                            return null;
                        })


                    // NFCUtil.log(5, "-- GroupView componentDidMount ret : ", ret);
                    if (NFCUtil.checkValid(reret.contingentes)) {
                        NFCUtil.log(5, "-- GroupView getGroupList 2 ret : ", reret.contingentes);

                        var groups =  reret.contingentes

                        for(var i = 0;i<groups.length;i++){
                            var item = groups[i]
                            var newItem = {
                                id:item.id,
                                index:i,
                                nombre:item.nombre,
                                activated:false,
                                synchronized:false,
                                schools:[],
                                school_data:[],
                            }
                            user.groups.push(newItem)
                        }

                        var setLogin = this.props.actions.UserActions.setLogin;
                        setLogin(user);

                        this.setState({
                            user:user,
                            groups: user.groups,
                            loading: false,
                        })
                    }
                }
                this.setState({loading: false})
            }
            this.setState({loading: false})
        }
    }

    goToNextView(item){
        let {user} = this.state
        user.select_group =  item

        global.group_id =  item.id
        global.token  = user.token
        var setLogin = this.props.actions.UserActions.setLogin;
        setLogin(user);
        global.gps_activated = user.gps_activated
        this.props.navigation.navigate('SchoolsView',{group:item});
    }


    setActivityStatus(){
        let {user} = this.state
        var status = user.gps_activated

        user.gps_activated = !status
        global.gps_activated = user.gps_activated
        var setLogin = this.props.actions.UserActions.setLogin;
        setLogin(user);
    }
    async setActivate(item){

        var {user} = this.state;
        var groups = user.groups;
        var value = groups[item.index].activated
        groups[item.index].activated =  !value
        if(!value){
            global.group_id = item.id
        }
        user.groups = groups

        var gpsactivated =  global.gps_activated
        global.gps_activated = !gpsactivated

        this.setState({groups:groups})
    }

    async setSynchronize(item){

        var {user} = this.state;
        var groups = user.groups;

        this.setState({loading: true});

        console.log('setSynchronize item:',item)
        var url = config.api_url + 'contratos'
        var ret = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token,
            },
            body: JSON.stringify({
                'contingente_id': item.id,
            }),

        })
            .then(data => {
                return data.json();
            })
            .catch(e => {
                return null;
            });
        // NFCUtil.log(5, "-- SchoolsView componentDidMount ret : ", ret);


        if (NFCUtil.checkValid(ret.contratos)) {
            NFCUtil.log(5, '-- setSynchronize getschool ret : ', ret.contratos);

            var schools = ret.contratos;
            // user.schools = schools;

            for (var j = 0; j < schools.length; j++) {
                var school = schools[j];

                var school_data_item = {
                    school: school,
                    passengers: [],
                    medicals: [],
                };

                var ret = await fetch(config.api_url + 'pasajeros', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + global.token,
                    },
                    body: JSON.stringify({
                        'contrato_id': school.id,
                    }),
                })
                    .then(data => {
                        return data.json();
                    })
                    .catch(e => {
                        NFCUtil.log(5, '-- SchoolInfo componentDidMount e : ', e);
                        return null;
                    });


                if (NFCUtil.checkValid(ret.pasajeros)) {
                    NFCUtil.log(5, '-- setSynchronize passengers ret : ', ret.pasajeros);

                    // user.passengers = ret.pasajeros;

                    school_data_item.passengers = ret.pasajeros;

                }

                var ret = await fetch(config.api_url + 'ficha_medica', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + global.token,
                    },
                    body: JSON.stringify({
                        'contrato_id': school.id,
                    }),
                })
                    .then(data => {
                        return data.json();
                    })
                    .catch(e => {
                        NFCUtil.log(5, '-- MedicalInfo componentDidMount e : ', e);
                        return null;
                    });

                if (NFCUtil.checkValid(ret.fichas_medicas)) {
                    NFCUtil.log(5, '-- setSynchronize medicals ret : ', ret.fichas_medicas);

                    // user.passengersMedicalInfos = ret.fichas_medicas;
                    school_data_item.medicals = ret.fichas_medicas;
                }

                // console.log('setSynchronize  new school data:')
                if (item.index < user.groups.length) {
                    groups[item.index].synchronized = true;
                    groups[item.index].school_data.push(school_data_item);
                }
            }

            user.groups = groups
            var setLogin = this.props.actions.UserActions.setLogin;
            setLogin(user);
            this.setState({
                user:user,
                groups:groups
            })
            global.groupString = groupString

            var groupString = JSON.stringify(user.groups)
            console.log('setSynchronize ' +
                ' groupString :',groupString)
            const value = await AsyncStorage.setItem('@groups',groupString)

        }
        this.setState({loading:false})

    }

    render() {

        var {groups,user} = this.state

        // console.log('in the render function',groups)

        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        return (
            <View style={{width: LW, height: LH, flex: 1}}>

                <View  style={styles.headerTitleContainer}>
                    <View style={{flexDirection:'row',paddingTop:15,justifyContent:'center',alignItems:'center'}}>
                        <Icon name={'bus'} type={'font-awesome'} size={LW/8} Component={TouchableOpacity} color={Colors.whiteColor}/>
                        <Text style={[styles.mainText,{marginHorizontal:15,fontSize:Layout.font.btn_size}]}>CONTINGENTES</Text>

                        {/*<Icon name={'location-on'}  type={ 'material'}  Component={TouchableOpacity}  containerStyle={{marginLeft:25}} color={ user.gps_activated? Colors.mainGreenColor: Colors.mainGrayColor} size={ LW/10} onPress={()=>{this.setActivityStatus()}}/>*/}

                    </View>
                </View>

                <View style={{justifyContent: 'center',flex:Layout.topViewRating, margin: 15}}>

                    <ScrollView contentContainerStyle={styles.midContentView}>
                        {
                            groups.map((item,index)=>
                                (
                                    <ListItem
                                        bottomDivider={true}
                                        containerStyle={styles.borderBottomLine}
                                        leftElement={
                                            <TouchableOpacity style={[styles.subContentContainer,{width:'60%'}]}  onPress={()=>{
                                                this.goToNextView(item)
                                            }}>
                                                <Text style={styles.mainText}>{item.nombre}</Text>
                                            </TouchableOpacity>}
                                        rightElement={
                                            <View style={{flexDirection:'row'}}>
                                                <Icon name={'refresh'}  type={ 'font-awesome'} Component={TouchableOpacity}  containerStyle={{marginHorizontal:10}} color={ item.synchronized? Colors.mainGreenColor: Colors.mainGrayColor} size={ LW/12} onPress={()=>{this.setSynchronize(item)}}/>
                                                <Icon name={'location-on'}  type={ 'material'} containerStyle={{marginHorizontal:5}} color={ item.activated? Colors.mainGreenColor: Colors.mainGrayColor} size={ LW/10} onPress={()=>{this.setActivate(item)}}/>
                                            </View>
                                        }
                                    >
                                    </ListItem>
                                )

                            )
                        }
                    </ScrollView>
                </View>

                <View style={styles.bottomTabContainer}>
                    <TouchableOpacity style={[{width:LW/2,borderRightWidth:2,borderRightColor:Colors.whiteColor},styles.middle]}>
                        <Text style={[styles.btnText,{ color:this.state.viewType?Colors.whiteColor:Colors.tabInactiveColor}]}>ASIGNAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[{width:LW/2,},styles.middle]} onPress={()=>{this.props.navigation.navigate('VisualScan')}}>
                        <Text style={[styles.btnText,{color:this.state.viewType?Colors.tabInactiveColor:Colors.whiteColor}]}>VISUALIZAR</Text>
                    </TouchableOpacity>
                </View>

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
export default connect(mapStateToProps, mapDispatchToProps)(GroupView);

