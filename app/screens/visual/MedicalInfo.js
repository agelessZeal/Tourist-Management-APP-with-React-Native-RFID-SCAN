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

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';


import NFCUtil from '../../utils/NFCUtil'
import VisualStyle from './VisualStyle';
import Loading from '../../components/common/Loading';


class MedicalInfo extends Component {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        var passenger = params.passenger;
        var medicalInfo  = params.medicalInfo

        this.state = {
            fontLoaded: false,
            loading:false,
            viewType:false,
            obs_medica:medicalInfo.obs_medica?medicalInfo.obs_medica:'',
            passenger: passenger,
            medicalInfo:medicalInfo,
            sync:false,
        };
    }


    async checkUpdate(){

        var {passenger,obs_medica,medicalInfo} = this.state


        if(medicalInfo == null || medicalInfo == undefined || medicalInfo.dni == null || obs_medica == ''){
            return
        }

        this.setState({loading: true})

        var ret = await fetch(config.api_url + 'observacion_medica', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            body: JSON.stringify({
                "dni": medicalInfo.dni,
                "obs_medica":obs_medica,
            }),
        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "-- GroupView componentDidMount e : ", e);
                return null;
            })

        if(ret.message != null){
            if(ret.message == 'obs_medica updated'){
                this.setState({sync: false})
            }
        }
        this.setState({loading: false})

    }


    render() {
        var {passenger,medicalInfo} = this.state

        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        var curPassenger = medicalInfo
        // if( medicalpassengers.length>0){
        //     curPassenger = medicalpassengers[0]
        // }

        console.log('the current pass :',curPassenger)

        var informationView = <View></View>
        if(curPassenger != null && curPassenger.tutor != null){
            informationView =                     <ScrollView contentStyle={styles.middle}>

                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>PADRE/TUTOR</Text></View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Nombre y apellido:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.tutor.nombre} {curPassenger.tutor.apellido}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Fecha de nacimiento:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.tutor.fecha_nac}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Direccion</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.tutor.domicilio}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Localidad</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.tutor.localidad}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Codigo postal</Text>
                    <Text style={styles.passInfoItemText}>{passenger.codigo_postal}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Telefono</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.tutor.telefono}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Celular</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.tutor.celular}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>E-mail</Text>
                    <Text style={[styles.passInfoItemText,{color:Colors.mainGreenColor}]}>{curPassenger.tutor.email}</Text>
                </View>


                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>URGENCIAS</Text></View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Nombre y apellido:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.urgencias.nombre} {curPassenger.urgencias.apellido}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Relacion c/pasajero</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.urgencias.relacion_pax}</Text>
                </View>



                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Localidad</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.urgencias.localidad}</Text>
                </View>


                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Domicilio</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.urgencias.domicilio}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Telefono</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.urgencias.telefono}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Fecha de nacimiento:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.urgencias.fecha_nac}</Text>
                </View>



                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>OBRA SOCIAL</Text></View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Nombre</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.obra_social.nombre}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>N de afiliado</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.obra_social.nro_afiliado}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Medico de cabecera</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.obra_social.medico_cabecera}</Text>
                </View>


                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Telefono</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.obra_social.telefono}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Plan</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.obra_social.plan}</Text>
                </View>



                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>ENFERMEDADES</Text></View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Varicela</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.enfermedades.varicela ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Hepatitis</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.enfermedades.hepatitis ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Otras</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.enfermedades.otras}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Aclaraciones:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.enfermedades.aclaraciones}</Text>
                </View>


                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>ALERGIAS</Text></View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Medicamentos</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.alergias.medicamentos ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Elemento causante</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.alergias.elemento_causante}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Otras</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.alergias.otras}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Aclaraciones</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.alergias.aclaraciones}</Text>
                </View>

                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>INTERVENCIONES QUIRURGICAS</Text></View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Apendicitis</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.int_quirurgicas.apendicitis ? 'Si':'No'}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Otras</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.int_quirurgicas.otras}</Text>
                </View>

                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>VACUNAS</Text></View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Antisarampionosa</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.vacunas.antisarampionosa ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Antidifterica</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.vacunas.antidifterica ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Antipoliomielitica</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.vacunas.antipoliomielitica ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Antitetanica</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.vacunas.Antitetanica ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Antituberculosa</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.vacunas.antituberculosa ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Antivariolica</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.vacunas.antivariolica ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Plan de vacunas</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.vacunas.plan ? 'Si':'No'}</Text>
                </View>


                <View style={styles.sectionHeaderContainer}><Text style={styles.sectionHeaderText}>DATOS EXTRA</Text></View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Altura:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.datos_extra.altura}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>peso:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.datos_extra.peso}</Text>
                </View>


                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Utiliza lentes de contacto:</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.datos_extra.lentes_contacto ? 'Si':'No'}</Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={[styles.passInfoItemText,{fontWeight: 'bold'}]}>Discapacidad</Text>
                    <Text style={styles.passInfoItemText}>{curPassenger.datos_extra.discapacidad}</Text>
                </View>


            </ScrollView>
        }
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
                                    <Icon name={'plus-circle-outline'}  type={ 'material-community'} color ={Colors.whiteColor}containerStyle={{marginLeft:20}}  size={ LW/8} onPress={()=>{}}/>
                                    <Text style={[styles.mainText,{marginRight:25}]}>{passenger.nombre} {passenger.apellido}</Text>
                                </View>

                            }
                        ></ListItem>

                    </View>
                </View>

                <View style={{justifyContent: 'center',flex:Layout.topViewRating, margin: 15}}>

                    {informationView}

                </View>

                <View style={{justifyContent: 'center',flex:3, marginHorizontal:15,alignItems:'center'}}>
                    {/*<View style={{marginHorizontal:15}}>*/}
                    {/*    */}
                    {/*</View>*/}
                    <View style={[styles.sectionHeaderContainer,{width:'100%',marginBottom:3}]}><Text style={styles.sectionHeaderText}>OBSERVACION MEDICA</Text></View>
                    <ListItem
                        containerStyle={{borderRadius:5,height:45,borderWidth:1,borderColor:Colors.borderdarkGreyColor,padding:0,width:'98%',marginBottom:10}}
                        leftElement={
                            <Input
                            labelStyle={styles.labelInput}
                            style={styles.formInput}
                            placeholder={'text'}
                            value={this.state.obs_medica}
                            inputContainerStyle={{borderBottomWidth:0}}
                            containerStyle={{width: '80%', marginVertical: 10,backgroundColor:Colors.whiteColor,borderRadius:7}}
                            onChangeText={(text) => {
                                this.setState({
                                    obs_medica: text,
                                    sync:true
                                });
                            }}
                            />}
                        rightElement={
                            <CheckBox
                                center
                                size={30}
                                iconRight
                                iconType='material'
                                containerStyle={{flex: 1}}
                                checkedIcon= 'check-circle'
                                uncheckedIcon='check-circle'
                                checkedColor={Colors.mainRedColor}
                                uncheckedColor={Colors.mainGreenColor}
                                checked={this.state.sync}
                                onPress={()=>{this.checkUpdate()}}
                            />
                        }
                        />
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
export default connect(mapStateToProps, mapDispatchToProps)(MedicalInfo);
