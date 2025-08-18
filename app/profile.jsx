import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather, Octicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAuthStore from "../Store/AuthStore";
import AccountAddress from "../components/Account_Address";
import Back from "../components/Back";
import GuestProfile from "../components/isAuth";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuthenticated(result);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!authenticated) {
    return <GuestProfile />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Back />
      </View>

      {/* Content */}
      <View className="flex flex-col justify-center gap-6 pt-14 items-center">
        <View className="w-full px-6 flex-row gap-4 items-center">
          <View className="bg-green-200 h-[80px] w-[80px] rounded-full flex items-center justify-center">
            <Text className="text-[38px]">{user?.name?.slice(0, 1)}</Text>
          </View>
          <Text className="text-[25px] font-bold">{user?.name}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/orders")}
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
        >
          <Feather name="bookmark" size={28} color="black" />
          <Text className="text-[20px] font-semibold">My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/subscription")}
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
        >
          <Ionicons name="book-outline" size={28} color="black" />
          <Text className="text-[20px] font-semibold">Manage Subscription</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/terms")}
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
        >
          <Octicons name="law" size={28} color="black" />
          <Text className="text-[20px] font-semibold">
            Terms and Conditions
          </Text>
        </TouchableOpacity>

        {/* Contact Us */}
        <TouchableOpacity
          onPress={() => router.push("/contactUs")}
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
        >
          <MaterialIcons name="support-agent" size={28} color="black" />
          <Text className="text-[20px] font-semibold">Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md">
          <AccountAddress />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
          onPress={handleLogout}
        >
          <AntDesign name="logout" size={30} color="black" />
          <Text className="text-[20px] font-semibold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
