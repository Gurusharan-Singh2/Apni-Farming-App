import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather, Octicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../Store/AuthStore";
import useAddressStore from "../Store/useAddressStore";
import useSubscriptionStore from "../Store/SubscriptionStore"
import useCartStore  from '../Store/CartStore'
import AccountAddress from "../components/Account_Address";
import useWishlistStore from '../Store/WishlistStore'
import Back from "../components/Back";
import GuestProfile from "../components/isAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Fake API call for deleting account
const deleteAccountAPI = async (data) => {
  try {
    const res = await axios.post(
      "https://api.apnifarming.com/user/authentication/auth/deactiveuser.php",
      data
    );

    console.log("Delete account response:", res.data);

    // Check how API indicates success
    if (res?.data?.success === true || res?.data?.status === "success") {
      return res.data;
    } else {
      throw new Error(res?.data?.message || "Failed to delete account");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete account"
    );
  }
};



const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
 
  
  const py={
    "phone":user?.phone
  }

  // Mutation for deleting account
  const { mutate: deleteAccount, isLoading } = useMutation({
    mutationFn:()=> deleteAccountAPI(py),
    onSuccess: async() => {
      Alert.alert("Deleted", "Your account has been deleted.");
     
    try {
       useAuthStore.getState().logout();
       useCartStore.getState().clearCart();
       useSubscriptionStore.getState().clearCart();
       useAddressStore.getState().clearAll();
       useWishlistStore.getState().clearWishlist();
      await AsyncStorage.clear(); 
      router.replace("/");      
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
      
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to delete account");
    },
  });

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

  const handleDeleteAccount = () => {
    if (confirmationText.trim().toLowerCase() === "yes") {
      deleteAccount();
      setModalVisible(false);
    } else {
      Alert.alert("Type YES", "Please type YES to confirm account deletion.");
    }
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
      <View className="flex flex-col justify-center gap-6 pt-2 items-center">
        <View className="w-full px-6 flex-row gap-4 items-center">
          <View className="bg-green-200 h-[80px] w-[80px] rounded-full flex items-center justify-center">
            <Text className="text-[38px]">{user?.name?.slice(0, 1)}</Text>
          </View>
          <Text className="text-[25px] font-bold">{user?.name}</Text>
        </View>

        {/* Orders */}
        <TouchableOpacity
          onPress={() => router.push("/orders")}
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
        >
          <Feather name="bookmark" size={28} color="black" />
          <Text className="text-[20px] font-semibold">My Orders</Text>
        </TouchableOpacity>

        {/* Subscription */}
        <TouchableOpacity
          onPress={() => router.push("/subscription")}
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
        >
          <Ionicons name="book-outline" size={28} color="black" />
          <Text className="text-[20px] font-semibold">Manage Subscription</Text>
        </TouchableOpacity>

        {/* Terms */}
        <TouchableOpacity
          onPress={() => router.push("/terms")}
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
        >
          <Octicons name="law" size={28} color="black" />
          <Text className="text-[20px] font-semibold">Terms and Conditions</Text>
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

        {/* Logout */}
        <TouchableOpacity
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
          onPress={handleLogout}
        >
          <AntDesign name="logout" size={30} color="black" />
          <Text className="text-[20px] font-semibold">Log Out</Text>
        </TouchableOpacity>

        {/* Delete My Account */}
        <TouchableOpacity
          className="bg-white flex-row gap-6 px-6 py-5 rounded-xl w-full max-w-[90%] shadow-md"
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="delete" size={30} color="red" />
          <Text className="text-[20px] font-semibold text-red-600">Delete My Account</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-[90%] p-6 rounded-2xl shadow-lg">
            <Text className="text-lg font-bold mb-4">Delete Account</Text>
            <Text className="mb-2">
              Are you sure you want to delete your account? This action is irreversible.
            </Text>
            <Text className="mb-2">Type "YES" to confirm:</Text>
            <TextInput
              value={confirmationText}
              onChangeText={setConfirmationText}
              placeholder="Type YES"
              className="border border-gray-400 rounded-lg px-3 py-2 mb-4"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                onPress={handleDeleteAccount}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">{isLoading ? "Deleting..." : "Delete"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
