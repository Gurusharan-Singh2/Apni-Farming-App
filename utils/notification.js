import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'
import {Platform} from 'react-native'


export async function getPushTokenAsync() {
  try {
    if(!Device.isDevice){
      alert('Must use physical device');
      return null;
    }
    const {status}=await Notifications.getPermissionAsync();

    let finalStatus=status;

    if(status !=='granted'){
const {status}=await Notifications.requestPermissionAync();
finalStatus=status;
    }

    if(finalStatus !== 'granted'){
      alert('Failed to get push token permission !');
      return null;
    }

    const {token}=await Notifications.getExpoPushTokenAsync();
    return token;
  } catch (error) {
    console.error('Push token error :',error);
    return null;
  }
  
}