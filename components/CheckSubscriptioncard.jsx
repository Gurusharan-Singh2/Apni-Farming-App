import { View, Text, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { memo, useMemo } from 'react';

const { width: screenWidth } = Dimensions.get('window');

// Simple scale function (you can also use react-native-size-matters if you prefer)
const scaleFont = (size) => Math.round((size * screenWidth) / 375); // 375 is iPhone X base width

function SubscriptionCard() {
  const router = useRouter();

  const titleFont = useMemo(() => scaleFont(18), []);
  const subtitleFont = useMemo(() => scaleFont(14), []);

  return (
    <Pressable
      onPress={() => router.push('/subscription')}
      className="h-[100px] flex-row bg-yellow-50 rounded-2xl mx-2 my-3 shadow-xl items-center justify-center"
    >
      <LottieView
        source={require('../assets/animations/o.json')} 
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
      />
      <View style={{ width: '60%' }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: titleFont,
            fontWeight: 'bold',
            color: '#1f2937', // gray-800
          }}
        >
          Manage Your Subscriptions
        </Text>
        <Text
          style={{
            fontSize: subtitleFont,
            color: '#6b7280', // gray-500
            paddingHorizontal: 16,
            textAlign: 'center',
          }}
        >
          Tap to explore your daily milk, eggs, fruits, and more!
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(SubscriptionCard);
