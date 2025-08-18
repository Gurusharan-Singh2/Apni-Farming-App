import React from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <LottieView
        source={require('../assets/animations/Rocket loader.json')} // your animation file
        autoPlay
        loop
        style={{ width: width * 0.4, height: width * 0.4 }}
      />
    </SafeAreaView>
  );
}
