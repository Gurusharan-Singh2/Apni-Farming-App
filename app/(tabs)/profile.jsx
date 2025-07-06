import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "../../Store/AuthStore";
import { useRouter } from "expo-router";
import { Colors } from "../../assets/Colors";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();              // Clear auth store
    router.replace("/");   // Redirect to landing screen
  };

  return (
    <SafeAreaView className="bg-[#f0d699a3] flex-1">
      <StatusBar barStyle="light-content" backgroundColor={Colors.SECONDARY} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex flex-col justify-center gap-6 pt-14 items-center px-4">
          <Text className="text-3xl font-bold text-primary mb-6">👤 Profile</Text>

          <View className="bg-white p-6 rounded-xl w-full max-w-[90%] shadow-md">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Name: <Text className="font-normal">{user?.name}</Text>
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              Email: <Text className="font-normal">{user?.email}</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="px-6 py-3 my-6 bg-red-500 rounded-lg"
          >
            <Text className="text-base text-white text-center font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
