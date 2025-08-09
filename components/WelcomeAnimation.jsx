import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

export default function WelcomeAnimation() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center mb-4 bg-[#f0d699a3]">
      <LottieView
        source={require("../assets/animations/Man and Woman say Hi ! (1).json")}
        autoPlay
        loop={true}
        style={{ width: 385, height: 385 }}
       
      />
    </SafeAreaView>
  );
}
