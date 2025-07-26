import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const ProfileIcon = () => {
  const router=useRouter();
  return (
     <TouchableOpacity onPress={()=> router.push("/profile")}>
     <View className="w-10 h-10 rounded-full border items-center justify-center">
     
<Ionicons name="person-outline" size={18} color="black" />
      
          
        </View>
        </TouchableOpacity>
  )
}

export default ProfileIcon