import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import Back from "../components/Back";

// Get device width & height
const { width, height } = Dimensions.get("window");

const ContactUsScreen = () => {
  const handleEmail = () => {
    Linking.openURL("mailto:apnifarmingt20@gmail.com");
  };

  const handlePhone = () => {
    Linking.openURL("tel:+916306371889");
  };

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/916306371889");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Back />
      </View>

      {/* Lottie Animation */}
      <View className="items-center justify-center mt-4">
        <LottieView
          source={require("../assets/animations/Call Center Support Lottie Animation (1).json")} // <-- place a Lottie JSON here
          autoPlay
          loop
          style={{
            width: width * 0.7,
            height: height * 0.3,
          }}
        />
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6">
        <Text className="mb-6 text-center text-xl font-bold text-gray-900">
          Contact Us
        </Text>

        <Text className="text-lg text-gray-700 mb-6 text-center">
          We'd love to hear from you! {"\n"}
          Reach out through any of the options below:
        </Text>

        {/* Email */}
        <TouchableOpacity
          onPress={handleEmail}
          className="bg-white flex-row items-center gap-4 px-6 py-5 rounded-xl w-full shadow-md mb-5"
          style={{ minHeight: height * 0.08 }}
        >
          <Feather name="mail" size={26} color="black" />
          <Text className="text-[18px] font-semibold flex-1">
            apnifarmingt20@gmail.com
          </Text>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity
          onPress={handlePhone}
          className="bg-white flex-row items-center gap-4 px-6 py-5 rounded-xl w-full shadow-md mb-5"
          style={{ minHeight: height * 0.08 }}
        >
          <Feather name="phone" size={26} color="black" />
          <Text className="text-[18px] font-semibold flex-1">
            +91-6306371889
          </Text>
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity
          onPress={handleWhatsApp}
          className="bg-white flex-row items-center gap-4 px-6 py-5 rounded-xl w-full shadow-md mb-5"
          style={{ minHeight: height * 0.08 }}
        >
          <FontAwesome name="whatsapp" size={24} color="green" />
          <Text className="text-[18px] font-semibold text-green-700 flex-1">
            Chat on WhatsApp
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
