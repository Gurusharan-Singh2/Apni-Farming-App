import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import Back from './Back';
import { useRouter } from 'expo-router';

function GuestProfile() {
  const router = useRouter();

  const onLoginPress = useCallback(() => {
    router.replace('/signin');
  }, [router]);

  const onSignUpPress = useCallback(() => {
    router.replace('/signup');
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: StatusBar.currentHeight || 0 }}>
      <View className="px-4 py-3">
        <Back />
      </View>

      <View className="flex-1 justify-center items-center px-8">
        <LottieView
          source={require('../assets/animations/Tractor.json')}
          autoPlay
          loop
          style={{ width: 192, height: 192 }}
        />

        <Text className="text-3xl font-bold mt-8 mb-6 text-gray-900 text-center">
          Welcome, Guest!
        </Text>

        <Text className="text-center text-gray-600 mb-10 px-4 leading-relaxed">
          Please login or sign up to access your personalized dashboard, track orders, and enjoy exclusive features.
        </Text>

        <View className="flex-row gap-4 space-x-6">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-green-500 px-10 py-3 rounded-full shadow-lg"
            onPress={onLoginPress}
          >
            <Text className="text-white font-semibold text-lg">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-black px-10 py-3 rounded-full shadow-lg"
            onPress={onSignUpPress}
          >
            <Text className="text-white font-semibold text-lg">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(GuestProfile);
