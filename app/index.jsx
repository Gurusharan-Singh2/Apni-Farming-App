import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../assets/Colors";
import logo from "../assets/images/logo-final.png";
import useAuthStore from "../Store/AuthStore";
import useCartStore from "../Store/CartStore";
import useSubscriptionStore from "../Store/SubscriptionStore";
import useAddressStore from "../Store/useAddressStore"
import useWishlistStore from "../Store/WishlistStore"
import WelcomeAnimation from "../components/WelcomeAnimation";
import LoadingScreen from "../components/LoadingScreen";

export default function App() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const { width, height } = Dimensions.get("window");
  const logoSize = width * 0.5; // 45% of screen width
  const buttonWidth = width * 0.70; // 75% of screen width
  const baseFont = width * 0.04; // scale font size with screen width

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      if (result) {
        router.replace("/home");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <LoadingScreen/>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="light-content" backgroundColor={Colors.SECONDARY} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex flex-col  items-center px-4 pt-2">
          {/* Logo */}
          <Image
            source={logo}
            style={{
              width: logoSize,
              height: logoSize,
              resizeMode: "contain",
            }}
          />

          {/* Tagline */}
          <Text
            style={{
              fontSize: baseFont,
              marginTop: height * 0.01,
              marginBottom: height * -0.05
            }}
            className="text-primary font-bold text-center"
          >
            शुद्धता और ताज़गी – हर एक डिलीवरी में
          </Text>

          {/* Animation */}
          <WelcomeAnimation />

          {/* Buttons */}
          <View style={{ width: buttonWidth }}>
            <TouchableOpacity
              onPress={() => router.replace("./signup")}
              style={{
                paddingVertical: height * 0.02,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 10,
                marginBottom: height * 0.02,
              }}
            >
              <Text
                style={{ fontSize: baseFont * 1.1 }}
                className="text-white text-center"
              >
                Sign Up
              </Text>
            </TouchableOpacity>

           <TouchableOpacity
  onPress={async () => {
    try {
       useAuthStore.getState().logout();
       useCartStore.getState().clearCart();
       useSubscriptionStore.getState().clearCart();
       useAddressStore.getState().clearAll();
       useWishlistStore.getState().clearWishlist();
      await AsyncStorage.clear(); // Clears all stored data
      router.push("/home");       // Then navigate
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  }}
  style={{
    paddingVertical: height * 0.02,
    backgroundColor: "black",
    borderRadius: 10,
  }}
>
  <Text
    style={{ fontSize: baseFont * 1.1 }}
    className="text-white text-center"
  >
    Guest User
  </Text>
</TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="w-full mt-6">
            <View className="flex-row items-center justify-center my-4">
              <View
                style={{
                  borderBottomWidth: 2,
                  borderColor: Colors.PRIMARY,
                  width: width * 0.2,
                }}
              />
              <Text
                style={{ fontSize: baseFont * 1.1 }}
                className="font-semibold text-gray-700 mx-2"
              >
                or
              </Text>
              <View
                style={{
                  borderBottomWidth: 2,
                  borderColor: Colors.PRIMARY,
                  width: width * 0.2,
                }}
              />
            </View>

            {/* Sign In link */}
            <TouchableOpacity
              onPress={() => router.replace("/signin")}
              className="flex flex-row gap-3 px-4 justify-center items-center"
            >
              <Text
                style={{ fontSize: baseFont }}
                className="text-gray-700 font-semibold"
              >
                Already a User?
              </Text>
              <Text
                style={{ fontSize: baseFont }}
                className="text-primary font-bold text-center underline"
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
