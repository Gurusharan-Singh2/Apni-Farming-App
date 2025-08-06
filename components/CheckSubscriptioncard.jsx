import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function SubscriptionCard() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/subscription')}
      className="h-[100px] flex-row bg-orange-100 rounded-2xl mx-2 my-3 shadow-lg items-center justify-center"
    >
      <LottieView
        source={require('../assets/animations/Buy Button.json')} // Replace with your file
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
      />
      <View className="w-[60%]">
        <Text className="text-xl font-bold text-gray-800 ">
        Manage Your Subscriptions
      </Text>
      <Text className="text-sm text-gray-500 px-4 text-center">
        Tap to explore your daily milk, eggs, fruits, and more!
      </Text>
      </View>
    </Pressable>
  );
}
