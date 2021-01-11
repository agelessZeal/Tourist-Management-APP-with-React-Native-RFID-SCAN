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


class SchoolInfo extends Component {

    constructor(props) {
        super(props);
        var user = this.props.user.user
        let school = user.select_school

        this.state = {
            fontLoaded: false,
            viewType: true,
            school: school,
            user:user,
            passengers: [
            ],
        };
    }


    async componentDidMount(): void {

        var {user} = this.state;

        if (user.passengers != null && user.passengers.length > 0) {
            this.setState({passengers: user.passengers});
        }else{
            this.getPassengerList();
        }
    }
    goToBack(){
        var {user} = this.state;
        user.passengers = []
        var setLogin = this.props.actions.UserActions.setLogin;
        setLogin(user);
        this.props.navigation.goBack()
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
                NFCUtil.log(5, "-- SchoolInfo getPassengerList e : ", e);
                return null;
            })

        this.setState({loading: false})

        if (NFCUtil.checkValid(ret.pasajeros)) {
            NFCUtil.log(5, "-- SchoolInfo getPassengerList ret : ", ret.pasajeros);

            user.passengers = ret.pasajeros
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


    updateCheck(item) {
        var {school, passengers} = this.state;
        this.goToTagView(item)

        // if (index < passengers.length) {
        //     let value = passengers[index].checked;
        //     if (!value) {
        //
        //         this.props.navigation.navigate('NFCTag', {item: passengers[index]});
        //     }
        // }
    }
    goToTagView(item){
        let {user} = this.state

        user.select_passenger =  item
        var setLogin = this.props.actions.UserActions.setLogin;
        setLogin(user);
        this.props.navigation.navigate('NFCTag',{token:global.token,passenger:item})
        // if(item.token == null){
        //
        // }
    }

    render() {

        var {school, passengers} = this.state;
        var loading = <Text> </Text>;
        if (this.state.loading) {
            loading = <Loading type="full"/>;
        }

        return (
            <View style={{width: LW, height: LH, flex: 1}}>
                <View style={styles.headerTitleContainer}>
                    <View style={{flexDirection:'row',width:'90%',paddingTop:15,justifyContent:'center',alignItems:'center'}}>
                        <ListItem
                            containerStyle={{backgroundColor: 'transparent',width:'90%'}}
                            leftElement={
                                <Icon   containerStyle={{marginLeft:15}} name={'ios-arrow-back'} type={'ionicon'} size={LW/10} iconStyle={{color:Colors.whiteColor}}  Component={TouchableOpacity} onPress={()=>{this.goToBack()}}/>
                            }
                            rightElement={
                                <Text style={[styles.mainText, { width:'95%',fontSize: Layout.font.btn_size,}]}>{school.nro }  {school.colegio}</Text>
                            }
                        ></ListItem>
                    </View>
                </View>

                <View style={{justifyContent: 'center', flex: Layout.topViewRating, margin: 15}}>
                    <ScrollView contentContainerStyle={styles.midContentView}>
                        {
                            passengers.map((item, index) => (
                                <ListItem
                                    Component={TouchableOpacity}
                                    onPress={()=>{this.goToTagView(item)}}
                                    bottomDivider={true}
                                    containerStyle={styles.borderBottomLine}
                                    leftElement={
                                        <TouchableOpacity style={[styles.subContentContainer,{width:'80%'}]}
                                                          onPress={() => {  this.goToTagView(item) }}>
                                            <Text style={styles.mainText}>{item.nombre} {item.apellido}</Text>

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
                                            checked={item.token == null ? false:true}
                                            onPress={()=>{this.updateCheck(item)}}
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
export default connect(mapStateToProps, mapDispatchToProps)(SchoolInfo);

