import {
  AsyncStorage,
  Alert
} from 'react-native';
import config from '../constants/config';

const LOG_LEVEL = 2  // 5: error, 4: important, 3: start-end, 2: medium, 1: low


/**
 * @class Utils
 * @description util class
 */
class NFCUtil {

  /**
   * @method constructor
   * @description This is constructor function
   */
  constructor() {

  }


  /**
   * @method copyObject
   * @description this function is to copy each key and value to new object.
   * @param obj
   */
  copyObject( newObj, oldObj ) {
    for (var prop in oldObj) {
      if (oldObj.hasOwnProperty(prop)) {
        newObj[prop] = oldObj[prop];
      }
    }
  }


  /**
   * @method littleToBigEndian
   * @description this function is to convert little-endian hex string to big-endian.
   * @param leHexStr
   */
  littleToBigEndian( leHexStr ) {
    var beHexStr = ''
    for( var i=0; i<leHexStr.length; i=i+2){
      var str = leHexStr.slice(i,i+2);
      beHexStr = str + beHexStr
    }
    return beHexStr;
  }


  /**
   * @method textEllipsis
   * @description This function is to get coin from symbol string.
   * @param text
   * @param length
   * @return ellipsis
   */
  textEllipsis (text, length) {
    var ret = text;
    if( text.length > length ){
      ret = text.slice(0,length) + '...';
    }

    return ret;
  }


  /**
   * @method textEllipsis
   * @description This function is to get coin from symbol string.
   * @param text
   * @param length
   * @return ellipsis
   */
  floatLimitText (fVal, length) {
    var ret = '' + fVal;
    if( ret.length > length ){
      ret = ret.slice(0,length);
    }

    return ret;
  }


  /**
   * @method getFormattedDate
   * @description to get formatted date string.
   * @param - date: javascript date object
   * @returns formatted date string
   *          (ex: '21-05-2019')
   */
  getFormattedDate(timestamp) {
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    if( month<10 ) month = '0' + month
    var day = date .getDate();
    if( day<10 ) day = '0' + day
    var year = date .getFullYear();

    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var mins = date.getMinutes()+1 < 10 ? '0' + date.getMinutes() : date.getMinutes();

    return month + "/" + day + '/' + year + ' ' + hours + ':' + mins;
  }


  /**
   * @method checkValid
   * @description check value is valid or not.
   */
  checkValid( val ){
    try{
      if( val != undefined && val != null && val != '' && val != false && val != 'null' ) return true;
      return false;
    } catch(e) {
      return false;
    }
  }


  /**
   * @method defaultStorage
   * @description return default storage object.
   */
  defaultStorage() {
    return {
      rememberMe: false,
      email: '',
      password: ''
    }
  }


  /**
   * @method getStorage
   * @description return storage object.
   */
  async getStorage() {
    var storage = await AsyncStorage.getItem('@nfcrms');
    storage = JSON.parse(storage);
    if( !this.checkValid( storage ) ){
      return null
    }
    return storage;
  }


  /**
   * @method setStorage
   * @description set storage.
   */
  async setStorage(storage) {
    await AsyncStorage.setItem('@nfcrms', JSON.stringify( storage ));
  }


  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


  log(){
    var level = arguments[0]
    if( level < LOG_LEVEL ) return;

    var args = [];
    for( var i=1; i<arguments.length; i++ ){
      args.push( arguments[i] );
    }
    console.log("----------------------------------------------------" );
    console.log( args );
  }


  alert( title, desc, okTxt="OK", okCallback=()=>{} ){

    Alert.alert(
      title, desc,
      [{text: okTxt, onPress: okCallback}],
      { cancelable: false }
    )
  }

  likeCountEmptyAlert(){
    this.alert();
  }


  getMediaType( url ){
    var ext = url.split('.').pop();
    var images = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'gif'];
    var videos = ['mp4', 'mpeg', 'mov', 'avi'];
    if( images.includes( ext ) ) return 'photo';
    else if( videos.includes( ext ) ) return 'video';

    return '';
  }


  strCapitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }


  parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };


  getPresentEmail(email){
    if(email && email !== ''){
      const textData = email.toLowerCase();
      var splits = textData.split('@')
      if(splits.length === 2){

        var suffix   =  splits[splits.length-1]
        var prefix   =  textData.slice(0,1)

        var reapeat =  splits[0].length - 1
        for(i=0;i<reapeat;i++){
          prefix  += '*';
        }
        var present_email  =  prefix + "@" + suffix

        return present_email
      }
    }
    return ""
  }

  getPresentPhone(phone){
    if(phone && phone !== ''){
      const textData = phone.toLowerCase();
      var len = textData.length
      if(len>7){
        var suffix = textData.slice(len-3-1,3)
        var prefix = textData.slice(0,len-7)
        var word = '';
        for(i=0;i<4;i++){
          word  += '*';
        }
        var present_phone  =  prefix + word + suffix
        return present_phone;
      }
      return '';
    }
    return '';
  }


}

export default new NFCUtil()
