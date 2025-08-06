import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { BackendUrl } from "../utils/Constants";
import useAuthStore from "../Store/AuthStore";
import OtpInput from "../components/OtpInput"; // Adjust path if needed

const OtpSignupScreen = ({ userData }) => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const VerifyMutation = useMutation({
    mutationFn: async ({ userData, otp }) => {
      const response = await axios.post(
        `https://api.apnifarming.com/user/authentication/auth/verify.php`,
        {
          ...userData,
          otp,
        }
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().login({
        name: data.name,
        userId: data.userId,
        email: userData.email,
        token: data.token,
        phone: data.phone,
      });
      router.push("/home");
    },
    onError: (error) => {
      console.error("Verification failed:", error);
      showToast("error", "Verification Failed", "Invalid OTP or server error.");
    },
  });

  const ResendMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `https://api.apnifarming.com/user/authentication/auth/resend.php`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      showToast("success", "OTP Resent", "OTP resent successfully.");
      setTimer(60);
      setOtpValue("");
    },
    onError: (error) => {
      console.error("Resend failed:", error?.response?.data?.message);
      showToast("error", "Resend Failed", error?.response?.data?.message);
    },
  });

  const onSubmit = () => {
    Keyboard.dismiss(); // Close the keyboard
    if (otpValue.length < 5) {
      showToast("error", "Invalid OTP", "OTP must be at least 5 digits.");
      return;
    }
    VerifyMutation.mutate({ userData, otp: otpValue });
  };

  const handleResend = () => {
    Keyboard.dismiss(); // Close the keyboard
    ResendMutation.mutate(userData);
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex gap-4 w-full max-w-md space-y-6 p-4">
        <View>
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Enter OTP
          </Text>
          <Text className="text-base text-gray-600 text-center">
            We've sent an OTP to your provided contact
          </Text>
        </View>

        {/* OTP Input Field */}
        <OtpInput value={otpValue} onChange={setOtpValue} />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={onSubmit}
          className="bg-primary rounded-lg py-4 mt-4"
          disabled={VerifyMutation.isPending}
        >
          <Text className="text-white text-center text-[18px] font-semibold">
            {VerifyMutation.isPending ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        {/* Resend Timer */}
        {timer > 0 ? (
          <Text className="text-sm text-gray-500 text-center">
            You can resend the code in{" "}
            <Text className="font-semibold text-gray-800">{timer}s</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-[16px] mt-4 font-semibold text-primary text-center underline">
              {ResendMutation.isPending ? "Resending..." : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OtpSignupScreen;
