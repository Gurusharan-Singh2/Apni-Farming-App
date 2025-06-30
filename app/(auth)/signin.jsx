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
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { SigninSchema } from "../../utils/AuthSchema";

const Signin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignin = async (values, { resetForm }) => {
    // try {
    //   const response = await axios.post("https://your-api.com/api/signin", {
    //     email: values.email,
    //     password: values.password,
    //   });
    //   if (response.status === 200) {
    //     alert("Login successful!");
    //     resetForm();
    //     router.push("/home"); // or your target screen
    //   } else {
    //     alert("Login failed.");
    //   }
    // } catch (error) {
    //   console.error("Signin error:", error.response?.data || error.message);
    //   alert(error.response?.data?.message || "Signin failed. Try again.");
    // }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <StatusBar barStyle="light-content" backgroundColor={Colors.SECONDARY} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-16 pb-10 items-center">
          <Image
            source={logo}
            style={{ width: 180, height: 180, resizeMode: "contain" }}
          />


          <View className="w-full max-w-md">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SigninSchema}
              onSubmit={handleSignin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View className="space-y-4">
                  {/* Email */}
                  <View className="mb-4">
                    <Text className="text-base font-semibold text-black mb-1">
                      Email
                    </Text>
                    <TextInput
                      className="h-14 px-4 rounded-lg shadow-2xl bg-white text-gray-900"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                      placeholder="you@example.com"
                      placeholderTextColor="#9ca3af"
                    />
                    {errors.email && touched.email && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </Text>
                    )}
                  </View>

                  {/* Password */}
                  <View className="mb-4">
                    <Text className="text-base font-semibold text-black mb-2">
                      Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        className="h-14 px-4 pr-12 rounded-lg shadow-2xl  bg-white text-gray-900"
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry={!showPassword}
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                      />
                      <TouchableOpacity
                        className="absolute right-4 top-4"
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off" : "eye"}
                          size={22}
                          color="#6b7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && touched.password && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </Text>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-primary rounded-lg py-2 mt-8 mb-4"
                  >
                    <Text className="text-base text-white  text-center">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            {/* Redirect to Signup */}
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              className="mt-2 flex flex-row gap-5 px-4 justify-center items-center"
            >
              <Text className="text-gray-700 font-semibold">
                New here?
              </Text>
              <Text className="text-base text-primary font-bold text-center underline">
                Sign Up
              </Text>
            </TouchableOpacity>
              <Text className=" w-full text-center text-base font-semibold my-4 text-gray-700 flex gap-4 justify-center">
                          <View className=" border-b-2 border-primary mb-1 w-20" />{"  "}or{"  "}
                          <View className=" border-b-2 border-primary mb-1 w-20" />
                        </Text>
                         <TouchableOpacity onPress={()=>router.push('/home')} className="flex flex-row gap-5  justify-center items-center">
                          <Text className="text-gray-700 font-semibold -mr-2">
                            Be a
                          </Text>
                          <Text className="text-base text-primary font-bold text-center underline">Guest User</Text>
                        </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
