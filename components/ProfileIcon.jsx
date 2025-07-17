import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const ProfileIcon = () => {
  const router=useRouter();
  return (
     <View className="w-8 h-8 rounded-full border items-center justify-center">
      <TouchableOpacity onPress={()=> router.push("/profile")}>
<Ionicons name="person-outline" size={18} color="black" />
      </TouchableOpacity>
          
        </View>
  )
}

export default ProfileIcon