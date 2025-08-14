import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Dimensions } from "react-native";

export default function WelcomeAnimation() {
  const { width ,height } = Dimensions.get("window");
  const animationSize = width * 0.85; // 80% of screen width

  return (
    
      <LottieView
        source={require("../assets/animations/Man and Woman say Hi ! (2).json")}
        autoPlay
        loop
        style={{
          width: animationSize,
          height: animationSize,
          alignSelf: "center",
          marginTop: height * 0.04, 
          marginBottom: height * -0.05, 
        }}
      />
    
  );
}
