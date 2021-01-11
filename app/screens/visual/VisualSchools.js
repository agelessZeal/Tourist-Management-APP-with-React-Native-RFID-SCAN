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


class VisualSchools extends Component {

    constructor(props) {

        super(props);

        let user = this.props.user.user
        var group = user.select_group

        this.state = {
            fontLoaded: false,
            viewType:false,
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
        this.props.navigation.navigate('VisualSchoolInfo')
    }


    async componentDidMount(): void {
        this.getSchoolsList()
    }


    async getSchoolsList(){
        this.setState({loading: true})
        let {user,group} = this.state

        NFCUtil.log(5,'the user group',group)


        // var url = 'https://dev-api.controlpax.com.ar/contratos?contingente_id=6'

        var url = config.api_url + 'contratos'

        NFCUtil.log('the get schools request url:',url)

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
                NFCUtil.log(5, "-- VisualSchools componentDidMount e : ", e);
                return null;
            })
        // NFCUtil.log(5, "-- VisualSchools componentDidMount ret : ", ret);
        this.setState({loading: false})

        if (NFCUtil.checkValid(ret.contratos)) {
            NFCUtil.log(5, "-- VisualSchools componentDidMount ret : ", ret.contratos);
            this.setState({
                schools: ret.contratos,
            })
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

        var {group, schools} = this.state;

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
                                <Text style={[styles.mainText,{width:'90%',fontSize:Layout.font.btn_size}]}>{group.nombre}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(VisualSchools);
