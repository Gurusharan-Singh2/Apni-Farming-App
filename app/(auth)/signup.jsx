import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import logo from "../../assets/images/logo-final.png";
import { Colors } from "../../assets/Colors";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { BackendUrl } from "../../utils/Constants";
import OtpSignupScreen from "../../components/OtpSignupScreen";

const Signup = () => {
  const router = useRouter();
  const [userData, setuserData] = useState("");
  const [showOtp, setshowOtp] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const SignupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${BackendUrl}/api/signup`, data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      setshowOtp(true);
    },
  });

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      phone: data.phone,
    };
    setuserData(payload);
    SignupMutation.mutate(payload);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor={Colors.SECONDARY} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-16 pb-10 items-center">
          <Image
            source={logo}
            style={{ width: 180, height: 180, resizeMode: "contain" }}
          />

          {showOtp ? (
            <OtpSignupScreen userData={userData} />
          ) : (
            <View className="w-full max-w-md space-y-4">
          
              <View>
                <Text className="text-base font-semibold text-black mb-2">Full Name</Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="h-14 px-4 rounded-lg shadow-2xl bg-white text-gray-900"
                      placeholder="John Doe"
                      placeholderTextColor="#9ca3af"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>
                )}
              </View>

       
              <View>
                <Text className="text-base font-semibold text-black mb-2">Phone Number</Text>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit phone number",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="h-14 px-4 rounded-lg shadow-2xl bg-white text-gray-900"
                      placeholder="1234567890"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.phone && (
                  <Text className="text-red-500 text-xs mt-1">{errors.phone.message}</Text>
                )}
              </View>

        
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className="bg-primary rounded-lg py-3 mt-2"
              >
                <Text className="text-base text-white text-center">
                  {SignupMutation.isPending ? "Signing Up ..." : "Signup"}
                </Text>
              </TouchableOpacity>

              {SignupMutation.isError && (
                <Text className="text-red-500 text-xs mt-1">
                  {SignupMutation.error.message}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => router.push("/signin")}
                className="mt-4 flex-row justify-center items-center"
              >
                <Text className="text-gray-700 font-semibold">Already a User? </Text>
                <Text className="text-base text-primary font-bold underline">Sign In</Text>
              </TouchableOpacity>

              {/* OR Divider */}
              <View className="w-full flex-row items-center justify-center my-4 gap-2">
                <View className="border-b-2 border-primary w-20" />
                <Text className="text-base font-semibold text-gray-700 mx-2">OR</Text>
                <View className="border-b-2 border-primary w-20" />
              </View>

              {/* Guest User */}
              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="flex-row justify-center items-center"
              >
                <Text className="text-gray-700 font-semibold ">Be a </Text>
                <Text className="text-base text-primary font-bold underline">Guest User</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
