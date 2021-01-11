import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView,SectionList} from 'react-native';

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
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';

import Loading from '../../components/common/Loading';
import NFCUtil from '../../utils/NFCUtil'


import VisualStyle from './VisualStyle';
import SchoolsView from '../assign/SchoolsView';


class PassengerInfo extends Component {

    constructor(props) {
        super(props);
        var user = this.props.user.user
        const {params} = this.props.navigation.state;
        var passenger = params.passenger?params.passenger:user.select_passenger;

        // let passenger = user.select_passenger
        let school =  user.select_school
        this.state = {
            fontLoaded: false,
            loading:false,
            viewType:false,
            user:user,
            school:school,
            passenger: passenger,
            medicalInfo:undefined,
            medicalpassengers:user.passengersMedicalInfos,
        };
    }



    renderItem = ({item}) => {
        var view = []
        Object.keys(item).map(function (s) {
            view.push(<View style={{ flexDirection:'row'}}>
                <Text style={styles.passInfoItemText}>{s}</Text>
                <Text style={styles.passInfoItemText}>{item[s]}</Text>
            </View>)
        })
        return (
            <View style={styles.passengerInfoView}>
                {
                    view
                }
            </View>
        )
    }

    renderSectionHeader = ({section}) => {
        console.log('section',section)
        return (
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
        )
    }

    async componentDidMount(): void {

    }


    searchMedicalInfo(){
        var {passenger,user,medicalpassengers} = this.state
        if(medicalpassengers != null && medicalpassengers.length >0){
            for(var i=0;i<medicalpassengers.length;i++){
                if(medicalpassengers[i].dni == passenger.dni){
                    this.setState({medicalInfo:medicalpassengers[i]})
                     return true;
                }
            }
        }


        this.getMedicalInfoWithdni()
    }

    goToMedical(){

        var {passenger,user,medicalpassengers} = this.state

        if(!NFCUtil.checkValid(passenger)){
            return
        }
        if(medicalpassengers != null && medicalpassengers.length >0){
            for(var i=0;i<medicalpassengers.length;i++){
                if(medicalpassengers[i].dni == passenger.dni){
                    this.props.navigation.navigate('MedicalInfo',{passenger:passenger,medicalInfo:medicalpassengers[i]})
                    return true;
                }
            }
        }

        this.searchInUserGroups()
    }


    searchInUserGroups(){
        var {user,passenger} = this.state

        if(!NFCUtil.checkValid(passenger)){
            return
        }
        if(!NFCUtil.checkValid(user)){
            return;
        }
        var groups = user.groups


        groups.map((item, index) => {
            if(NFCUtil.checkValid(item.school_data)){

                let schools = item.school_data
                schools.map((school,index) =>{
                    console.log('searchUserGroup school:',school)
                    if(NFCUtil.checkValid(school.medicals)){
                        for(var i=0;i<school.medicals.length;i++){
                            if(school.medicals[i].dni == passenger.dni){
                                this.props.navigation.navigate('MedicalInfo',{passenger:passenger,medicalInfo:school.medicals[i]})
                                return true;
                            }
                        }
                    }
                })
            }
        })
    }

    async getMedicalInfoWithdni(){
        let {user,passenger} = this.state

        this.setState({loading: true})

        var ret = await fetch(config.api_url + 'ficha_medica', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            body: JSON.stringify({
                "pasajero_dni": passenger.dni,
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
            var medicals = ret.fichas_medicas
            if(NFCUtil.checkValid(medicals)){
                if(medicals.length > 0){
                    this.setState({medicalInfo:medicals[0]})
                    if(medicals[0].obs_medica != null&& medicals[0].obs_medica != undefined){
                        this.setState({
                            obs_medica:medicals[0].obs_medica,
                            loading: false
                        })
                    }
                }
            }
        }else{
            this.setState({loading: false})
        }

    }






    render() {
        var {passenger,user} = this.state

        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        var sectionData = [
            {
                title:'DATOS PERSONALES',
                data:[
                    passenger,
                ],
            }
        ]


        return (
            <View style={{width: LW, height: LH, flex: 1}}>
                <View  style={styles.headerTitleContainer}>
                    <View style={{flexDirection:'row',width:'90%',paddingTop:15,paddingHorizontal:15,justifyContent:'center',alignItems:'center'}}>

                        <ListItem
                            containerStyle={{backgroundColor: 'transparent',width:'85%'}}
                            leftElement={
                                <Icon name={'ios-arrow-back'} type={'ionicon'} size={LW / 10}
                                      iconStyle={{color: Colors.whiteColor}} Component={TouchableOpacity}
                                      onPress={() => {
                                          this.props.navigation.goBack();
                                      }}/>
                            }
                            rightElement={
                                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                    <Icon name={'vcard-o'}  type={ 'font-awesome'} color ={Colors.whiteColor}containerStyle={{marginLeft:15}}  size={ LW/10} onPress={()=>{}}/>
                                    <Text style={[styles.mainText,{marginRight:15}]}>{passenger.nombre} {passenger.apellido}</Text>
                                </View>

                            }
                        ></ListItem>


                    </View>
                </View>

                <View style={{justifyContent: 'center',flex:Layout.topViewRating, margin: 25}}>
                    <ScrollView contentStyle={styles.middle}>
                        {/*<SectionList*/}
                        {/*    style={{width:LW*0.8,height:'100%',}}*/}
                        {/*    sections={sectionData}*/}
                        {/*    keyExtractor={(item, index) => item + index}*/}
                        {/*    renderItem={this.renderItem}*/}
                        {/*    renderSectionHeader={this.renderSectionHeader}*/}
                        {/*/>*/}
                        <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>DATOS PERSONALES</Text></View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Nombre y apellido:</Text>
                            <Text style={styles.passInfoItemText}>{passenger.nombre} {passenger.apellido}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>DNI:</Text>
                            <Text style={styles.passInfoItemText}>{passenger.dni}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Fecha de nacimiento:</Text>
                            <Text style={styles.passInfoItemText}>{passenger.fecha_nac}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Edad</Text>
                            <Text style={styles.passInfoItemText}>{passenger.edad}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Pais:</Text>
                            <Text style={styles.passInfoItemText}>{passenger.pais}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Provincia</Text>
                            <Text style={styles.passInfoItemText}>{passenger.provincia}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Localidad</Text>
                            <Text style={styles.passInfoItemText}>{passenger.localidad}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Codigo postal</Text>
                            <Text style={styles.passInfoItemText}>{passenger.codigo_postal}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Domicilio</Text>
                            <Text style={styles.passInfoItemText}>{passenger.domicilio}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Telefono</Text>
                            <Text style={styles.passInfoItemText}>{passenger.telefono}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Celular</Text>
                            <Text style={styles.passInfoItemText}>{passenger.celular}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>E-mail</Text>
                            <Text style={[styles.passInfoItemText,{color:Colors.mainGreenColor}]}>{passenger.email}</Text>
                        </View>
                    </ScrollView>

                </View>

                <View style={{justifyContent: 'center',flex:1.5, margin: 10}}>
                    <Button title={'FICHA MEDICA'}

                            icon={{
                                name: "plus-circle-outline",
                                type :'material-community',
                                size: 40,
                                color: "white"
                            }}
                            onPress={()=>{this.goToMedical()}}
                            titleStyle={{color:Colors.whiteColor,fontSize:Layout.font.btn_size}}
                            raised={true}
                            buttonStyle={{backgroundColor:Colors.mainDarkRedColor}}
                            containerStyle={{marginTop:10,width:'100%',borderRadius:7,backgroundColor:Colors.mainRedColor}}>

                    </Button>
                </View>
                <View style={styles.bottomTabContainer}>
                    <TouchableOpacity style={[{width:LW/2,borderRightWidth:2,borderRightColor:Colors.whiteColor},styles.middle]} onPress={()=>{this.props.navigation.navigate('GroupView')}}>
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
export default connect(mapStateToProps, mapDispatchToProps)(PassengerInfo);

