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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../assets/Colors";
import logo from "../assets/images/logo-final.png";
import useAuthStore from "../Store/AuthStore";
import '../utils/firebaseConfig';



export default function App() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      

      // ⬇️ Step 1: Check auth
      const result = await isAuthenticated();
      if (result) {
        router.replace("/home");
        return;
      }


      setLoading(false);

      // ⬇️ Step 5: Cleanup listener on unmount
      return () => unsubscribe();
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#f0d699a3]">
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-[#f0d699a3]">
      <StatusBar barStyle="light-content" backgroundColor={Colors.SECONDARY} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex flex-col justify-between gap-5 pt-14 items-center px-4">
          <Image
            source={logo}
            style={{
              width: 250,
              height: 250,
              paddingTop: 10,
              marginBottom: 10,
              resizeMode: "contain",
            }}
          />

          <Text className="mb-[60px] text-primary font-semibold text-sm">
            शुद्धता और ताज़गी – हर एक डिलीवरी में
          </Text>

          <View className="w-3/4">
            <TouchableOpacity
              onPress={() => router.push("./signup")}
              className="px-2 py-3 my-2 bg-primary rounded-lg"
            >
              <Text className="text-base text-white text-center">Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/home")}
              className="px-2 py-3 my-2 bg-black rounded-lg"
            >
              <Text className="text-base text-white text-center">Guest User</Text>
            </TouchableOpacity>
          </View>

          <View className="w-full">
            <View className="w-full flex-row items-center justify-center my-4 gap-2">
              <View className="border-b-2 border-primary w-20" />
              <Text className="text-base font-semibold text-gray-700 mx-2">or</Text>
              <View className="border-b-2 border-primary w-20" />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/signin")}
              className="flex flex-row gap-5 px-4 justify-center items-center"
            >
              <Text className="text-gray-700 font-semibold">Already a User?</Text>
              <Text className="text-base text-primary font-bold text-center underline">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
