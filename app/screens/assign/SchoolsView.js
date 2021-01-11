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
} from 'react-native-elements/src/index';

// import Icon from 'react-native-vector-icons/FontAwesome'


import AssignStyle from './AssignStyle';
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';

import Loading from '../../components/common/Loading';
import NFCUtil from '../../utils/NFCUtil'
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import Geolocation from "react-native-geolocation-service";

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';


const timer = require('react-native-timer');


class SchoolsView extends Component {

    constructor(props) {

        super(props);

        let user = this.props.user.user
        var group = user.select_group

        this.state = {
            fontLoaded: false,
            viewType:true,
            group: group,
            user:user,

            schools: [

            ],

        };
    }

    goToNextView(item){
        let {user} = this.state
        user.select_school =  item
        var setLogin = this.props.actions.UserActions.setLogin;
        setLogin(user);
        this.props.navigation.navigate('SchoolInfo')
    }



    async componentDidMount(): void {
        console.log('schools view componentDidMount ',this.state.user.groups)
        this.getSchoolsList()
        // BackgroundGeolocation.configure({
        //     desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        //     stationaryRadius: 50,
        //     distanceFilter: 50,
        //     notificationTitle: 'Background tracking',
        //     notificationText: 'enabled',
        //     debug: true,
        //     startOnBoot: false,
        //     stopOnTerminate: true,
        //     locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        //     interval: 10000,
        //     fastestInterval: 5000,
        //     activitiesInterval: 10000,
        //     stopOnStillActivity: false,
        //     url: config.api_url + 'gps_position',
        //     httpHeaders: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //         Authorization: 'Bearer ' + global.token
        //     },
        //     // customize post properties
        //     postTemplate: {
        //         lat: 'latitude',
        //         lon: 'longitude',
        //         foo: 'bar' ,
        //         "contingente_id": global.group_id,
        //     }
        // });
        //
        // BackgroundGeolocation.on('location', (location) => {
        //     // handle your locations here
        //     // to perform long running operation on iOS
        //     // you need to create background task
        //     console.log('BackgroundGeolocation location :',location)
        //     BackgroundGeolocation.startTask(taskKey => {
        //         // execute long running task
        //         // eg. ajax post location
        //         // IMPORTANT: task has to be ended by endTask
        //         BackgroundGeolocation.endTask(taskKey);
        //     });
        // });
        //
        // BackgroundGeolocation.on('stationary', (stationaryLocation) => {
        //     // handle stationary locations here
        //     console.log('BackgroundGeolocation stationaryLocation :',stationaryLocation)
        // });
        //
        // BackgroundGeolocation.on('error', (error) => {
        //     console.log('[ERROR] BackgroundGeolocation error:', error);
        // });
        //
        // BackgroundGeolocation.on('start', () => {
        //     console.log('[INFO] BackgroundGeolocation service has been started');
        // });
        //
        // BackgroundGeolocation.on('stop', () => {
        //     console.log('[INFO] BackgroundGeolocation service has been stopped');
        // });
        //
        // BackgroundGeolocation.on('authorization', (status) => {
        //     console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
        //     if (status !== BackgroundGeolocation.AUTHORIZED) {
        //         // we need to set delay or otherwise alert may not be shown
        //         setTimeout(() =>
        //             Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
        //                 { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
        //                 { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
        //             ]), 1000);
        //     }
        // });
        //
        // BackgroundGeolocation.on('background', () => {
        //     console.log('[INFO] App is in background');
        // });
        //
        // BackgroundGeolocation.on('foreground', () => {
        //     console.log('[INFO] App is in foreground');
        // });
        //
        // BackgroundGeolocation.on('abort_requested', () => {
        //     console.log('[INFO] Server responded with 285 Updates Not Required');
        //
        // });
        //
        // BackgroundGeolocation.on('http_authorization', () => {
        //     console.log('[INFO] App needs to authorize the http requests');
        // });
        //
        // BackgroundGeolocation.checkStatus(status => {
        //     console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
        //     console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
        //     console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
        //
        //     // you don't need to check status before start (this is just the example)
        //     if (!status.isRunning) {
        //         // BackgroundGeolocation.start(); //triggers start on start event
        //     }
        // });
        // // BackgroundGeolocation.start(); //triggers start on start event


    }


    componentWillUnmount(): void {
        BackgroundGeolocation.removeAllListeners();
    }
    setActivityStatus(){

        let {user} = this.state
        var status = user.gps_activated
        user.gps_activated = !status

        global.gps_activated = user.gps_activated
        var setLogin = this.props.actions.UserActions.setLogin;
        setLogin(user);
    }

    async getSchoolsList(){

        this.setState({loading: true})

        let {user,group} = this.state

        NFCUtil.log(5,'getSchoolsList the user group:',group)


        // var url = 'https://dev-api.controlpax.com.ar/contratos?contingente_id=6'

        var url = config.api_url + 'contratos'

        var ret = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            body: JSON.stringify({
                "contingente_id": group.id,
            }),

        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "--  getSchoolsList e : ", e);
                return null;
            })
        // NFCUtil.log(5, "-- SchoolsView componentDidMount ret : ", ret);


        if (NFCUtil.checkValid(ret.contratos)) {
            NFCUtil.log(5, "--  getSchoolsList ret : ", ret.contratos);

            user.schools = ret.contratos
            var setLogin = this.props.actions.UserActions.setLogin;
            setLogin(user);
            this.setState({
                schools: ret.contratos,
                loading: false
            })
        }else{
            this.setState({loading: false})
        }

        //
        // {
        //     "id": 65,
        //     "nro": 19065,
        //     "colegio": "PAR CRISTO OBRERO"
        // }
    }
    updateCheck(index){
        // var {group, schools} = this.state;
        // if(index < schools.length){
        //     let value = schools[index].checked
        //     schools[index].checked = !value
        //     this.setState({
        //         schools:schools
        //     })
        // }
    }

    render() {

        var {group, schools,user} = this.state;

        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        return (
            <View style={{width: LW, height: LH, flex: 1}}>

                <View  style={styles.headerTitleContainer}>
                    <View style={{flexDirection:'row',width:'90%',paddingTop:15,justifyContent:'center',alignItems:'center'}}>

                        <ListItem
                            containerStyle={{backgroundColor: 'transparent',width:'90%'}}
                            leftElement={
                                <Icon name={'ios-arrow-back'} type={'ionicon'} size={LW / 10}
                                      iconStyle={{color: Colors.whiteColor}} Component={TouchableOpacity}
                                      onPress={() => {
                                          this.props.navigation.goBack();
                                      }}/>
                            }
                            rightElement={
                                <View style={{width:'95%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    <Text style={[styles.mainText,{marginHorizontal:15,fontSize:Layout.font.btn_size}]}>{group.nombre}</Text>
                                </View>

                            }
                        ></ListItem>

                    </View>
                </View>


                <View style={{justifyContent: 'center', flex: Layout.topViewRating, margin: 15}}>
                    <ScrollView contentContainerStyle={styles.midContentView}>
                        {
                            schools.map((item, index) => (
                                <ListItem
                                    bottomDivider={true}
                                    containerStyle={styles.borderBottomLine}
                                    leftElement={
                                        <TouchableOpacity style={[styles.subContentContainer,styles.row,{width:'80%'}]}
                                                          onPress={() => {
                                                              this.goToNextView(item)
                                                          }}>
                                            <Text style={styles.mainText}>{item.nro} {item.colegio}</Text>

                                        </TouchableOpacity>}
                                    rightElement={
                                        <CheckBox
                                            center
                                            size={40}
                                            iconRight
                                            iconType='material'
                                            containerStyle={{flex: 1}}
                                            checkedIcon= 'check-circle'
                                            uncheckedIcon='check-circle'
                                            checkedColor={Colors.mainGreenColor}
                                            uncheckedColor={Colors.bkBlackColor}
                                            checked={item.checked}
                                            onPress={()=>{this.updateCheck(index)}}
                                        />

                                    }>
                                </ListItem>

                            ))
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
export default connect(mapStateToProps, mapDispatchToProps)(SchoolsView);
