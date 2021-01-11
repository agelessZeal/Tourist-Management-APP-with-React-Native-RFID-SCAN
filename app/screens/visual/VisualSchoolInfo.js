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

import VisualStyle from './VisualStyle';
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';

import Loading from '../../components/common/Loading';
import NFCUtil from '../../utils/NFCUtil'


class VisualSchoolInfo extends Component {

    constructor(props) {
        super(props);
        var user = this.props.user.user
        let school = user.select_school
        let group = user.select_group
        this.state = {
            fontLoaded: false,
            viewType: false,
            school: school,
            user:user,
            group:group,
            passengers: [],
            medicalPassengers:[],
            alertList:[],
        };
    }

    goToPassengerView(item){
        // let {user} = this.state
        // user.select_passenger =  item
        // var setLogin = this.props.actions.UserActions.setLogin;
        // setLogin(user);
        // this.props.navigation.navigate('PassengerInfo')

        this.props.navigation.navigate('PassengerInfo', {passenger:item});
    }

    async componentDidMount(): void {
        this.getPassengerList()
        this.getPassengerMedicals()
    }

    getAlertList(){
        var{medicalPassengers,passengers,alertList} =  this.state
        passengers.map((item,index)=>{


        })

    }


    async getPassengerList(){
        this.setState({loading: true})
        let {user,school} = this.state


        var ret = await fetch(config.api_url + 'pasajeros', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            body: JSON.stringify({
                "contrato_id": school.id,
            }),
        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "-- VisualSchoolInfo componentDidMount e : ", e);
                return null;
            })

        if (NFCUtil.checkValid(ret.pasajeros)) {
            NFCUtil.log(5, "-- VisualSchoolInfo componentDidMount ret : ", ret.pasajeros);

            user.passengers =  ret.pasajeros
            var setLogin = this.props.actions.UserActions.setLogin;
            setLogin(user);

            this.setState({
                passengers: ret.pasajeros,
                loading: false
            })
        }else{
            this.setState({loading: false})
        }
    }

    async getPassengerMedicals(){

        let {user,passenger,school} = this.state


        var ret = await fetch(config.api_url + 'ficha_medica', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            body: JSON.stringify({
                "contrato_id": school.id,
            }),
        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "-- MedicalInfo componentDidMount e : ", e);
                return null;
            })



        if (NFCUtil.checkValid(ret.fichas_medicas)) {
            NFCUtil.log(5, "-- MedicalInfo componentDidMount ret : ", ret.fichas_medicas);

            user.passengersMedicalInfos =  ret.fichas_medicas
            var setLogin = this.props.actions.UserActions.setLogin;
            setLogin(user);
            this.setState({
                medicalPassengers:ret.fichas_medicas,
                loading: false})
        }else{
            this.setState({loading: false})
        }

    }



    render() {

        var {school, passengers,medicalPassengers} = this.state;
        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        return (
            <View style={{width: LW, height: LH, flex: 1}}>
                <View style={styles.headerTitleContainer}>
                    <View style={{flexDirection:'row',width:'90%',paddingHorizontal:15,paddingTop:15,justifyContent:'center',alignItems:'center'}}>
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

                                <TouchableOpacity style={{paddingHorizontal:15}}>
                                    <Text
                                        style={[styles.mainText, {fontSize: Layout.font.btn_size}]}>{school.nro} {school.colegio}</Text>
                                </TouchableOpacity>

                            }
                            rightContentContainerStyle={{marginLeft:5,width:'80%'}}
                        ></ListItem>
                    </View>
                </View>

                <View style={{justifyContent: 'center', flex: Layout.topViewRating, margin: 15}}>
                    <ScrollView contentContainerStyle={styles.midContentView}>
                        {
                            passengers.map((item, index) => (
                                <ListItem
                                    bottomDivider={true}
                                    containerStyle={styles.borderBottomLine}
                                    leftElement={
                                        <TouchableOpacity style={[styles.subContentContainer,{width:'70%'}]}
                                                          onPress={() => { this.goToPassengerView(item)  }}>
                                            <Text style={styles.mainText}>{item.alerta&& '⚠  '}{item.nombre} {item.apellido}</Text>

                                        </TouchableOpacity>}
                                    rightElement={
                                        <Icon name={'vcard-o'} type={'font-awesome'} Component={TouchableOpacity} containerStyle={{marginHorizontal:5}} size={LW/10} onPress={()=>{}}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(VisualSchoolInfo);

