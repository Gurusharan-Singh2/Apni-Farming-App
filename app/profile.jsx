import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useRouter } from 'expo-router';
import useAuthStore from "../Store/AuthStore";

const ProfileScreen = () => {

  const router=useRouter();
  const { user, logout } = useAuthStore();
  
  
    const handleLogout = () => {
      logout();              
      router.replace("/");   
    };
  
    

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        
      </View>
    


      {/* Content */}
       <View className="m-2 flex flex-col justify-center gap-6 pt-14 items-center px-4">
          <Text className="text-3xl font-bold text-primary mb-6">👤 Profile</Text>

          <View className="bg-white p-6 rounded-xl w-full max-w-[90%] shadow-md">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Name: <Text className="font-normal">{user?.name}</Text>
            </Text>
            
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="px-6 py-3 my-6 bg-red-500 rounded-lg"
          >
            <Text className="text-base text-white text-center font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

