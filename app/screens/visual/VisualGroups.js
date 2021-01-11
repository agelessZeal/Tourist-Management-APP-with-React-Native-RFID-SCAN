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

// import Icon from 'react-native-vector-icons/FontAwesome'
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UserActions from '../../actions/user';

import config from '../../constants/config';

import Loading from '../../components/common/Loading';
import NFCUtil from '../../utils/NFCUtil'


import VisualStyle from './VisualStyle';


import AsyncStorage from '@react-native-community/async-storage';

class VisualGroups extends Component {

    constructor(props) {
        super(props);
        var user  =  this.props.user.user
        this.state = {
            fontLoaded: false,
            loading:false,
            viewType:false,
            user:user,
            groups:[

            ],

        };
    }

    async componentDidMount(): void {
        this.getGroupList()
    }




    async getGroupList(){
        this.setState({loading: true})
        let {user} = this.state


        var ret = await fetch(config.api_url + 'contingentes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + global.token
            },
            // body: JSON.stringify({
            //     "dist": filter_distance,
            // }),
        })
            .then(data => {
                return data.json()
            })
            .catch(e => {
                NFCUtil.log(5, "-- VisualGroups componentDidMount e : ", e);
                return null;
            })

        this.setState({loading: false})
        NFCUtil.log(5, "-- GroupView componentDidMount ret : ", ret);
        if (NFCUtil.checkValid(ret.contingentes)) {
            NFCUtil.log(5, "-- VisualGroups componentDidMount ret : ", ret.contingentes);
            this.setState({
                groups: ret.contingentes,
            })
        }
    }

    goToNextView(item){
        let {user} = this.state
        user.select_group =  item
        var setLogin = this.props.actions.UserActions.setLogin;
        setLogin(user);
        this.props.navigation.navigate('VisualSchools');
    }

    render() {

        var {groups,user} = this.state

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
                    </View>
                </View>

                <View style={{justifyContent: 'center',flex:Layout.topViewRating, margin: 15}}>

                    <ScrollView contentContainerStyle={styles.midContentView}>
                        {
                            groups.map((item,index)=>(
                                <ListItem
                                    bottomDivider={true}
                                    containerStyle={styles.borderBottomLine}
                                    leftElement={
                                        <TouchableOpacity style={[styles.subContentContainer,{width:'90%'}]}  onPress={()=>{
                                            this.goToNextView(item)
                                        }}>
                                            <Text style={styles.mainText}>{item.nombre}</Text>
                                        </TouchableOpacity>}
                                    // rightElement={
                                    //     <View style={{flexDirection:'row'}}>
                                    //         <Icon name={'refresh'}  type={ 'font-awesome'}  containerStyle={{marginHorizontal:5}} color={ item.activated? Colors.mainGreenColor: Colors.mainGrayColor} size={ LW/10} onPress={()=>{}}/>
                                    //         <Icon name={'location-on'}  type={ 'material'} containerStyle={{marginHorizontal:5}} color={ item.synchronized? Colors.mainGreenColor: Colors.mainGrayColor} size={ LW/10} onPress={()=>{}}/>
                                    //     </View>
                                    // }
                                >
                                </ListItem>

                            ))
                        }
                    </ScrollView>
                </View>

                <View style={styles.bottomTabContainer}>
                    <TouchableOpacity style={[{width:LW/2,borderRightWidth:2,borderRightColor:Colors.whiteColor},styles.middle]} onPress={()=>{
                        this.props.navigation.navigate('GroupView')
                    }}>
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
export default connect(mapStateToProps, mapDispatchToProps)(VisualGroups);

