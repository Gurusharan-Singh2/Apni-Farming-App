import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  
} from "react-native";
import {  useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/logo-final.png";
import {Colors} from "../assets/Colors"
import { getPushTokenAsync } from '../utils/notification';
import axios from 'axios';
import { useEffect, useState } from "react";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});



export default function Home() {
 const router=useRouter();

   const [token , setToken]=useState(' ');
  useEffect(()=>{
    const fetchToken=async()=>{
      const pushToken=await getPushTokenAsync();
      if(pushToken){
        setToken(pushToken);
        try {
          await axios.post('https://apni-farming-backend.onrender.com',{
            userId:'user123',
            token:pushToken
          });
          console.log('Token registered successfully');
        } catch (error) {
          console.error('Failed to register token:',error.message);
        }
      }

    };

    fetchToken();

  },[])

  return (
    <SafeAreaView className="bg-[#f0d699a3]">
      <StatusBar barStyle="light-content" backgroundColor={Colors.SECONDARY} />
      <ScrollView contentContainerStyle={{ height:"100%" }}>
        <View className=" m-2 flex flex-col justify-between gap-5 pt-14 items-center px-4">
          <p>{token}</p>
          <Image
            source={logo}
            
            style={{
              width: 250, 
              height: 250,
              paddingTop:10,
              marginBottom:10, 
              resizeMode: "contain",
            }}
          />
           <Text className="mb-[60px] text-primary font-semibold text-sm">
            शुद्धता और ताज़गी – हर एक डिलीवरी में
          </Text>
          <View className="w-3/4 ">
         
          <TouchableOpacity onPress={()=>router.push("./signup")} className=" px-2 py-3 my-2 bg-primary  rounded-lg" >
            <Text className="text-base text-white  text-center">Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push("/home")} className=" px-2 py-3 my-2  bg-black  rounded-lg" >
            <Text className="text-base text-white  text-center">Guest User</Text>
          </TouchableOpacity>
          </View>
          <View className="w-full">
            <Text className=" w-full text-center text-base font-semibold my-4 text-gray-700 flex gap-4 justify-center">
              <View className=" border-b-2 border-primary mb-1 w-20" />{""}or{"   "}
              <View className=" border-b-2 border-primary mb-1 w-20" />
            </Text>
            <TouchableOpacity onPress={()=>router.push('/signin')} className="flex flex-row gap-5 px-4 justify-center items-center">
              <Text className="text-gray-700 font-semibold ">
                Already a User? 
              </Text>
              <Text className="text-base text-primary font-bold text-center underline">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
